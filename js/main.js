// js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
// --- CONFIG: Reemplaza con tus valores de Firebase ---
const firebaseConfig = {
apiKey: "AIzaSyCk5Yh-qbpjQlCf_9y2fTomYton-675PHE",
    authDomain: "angelesytoto.firebaseapp.com",
    projectId: "angelesytoto",
    storageBucket: "angelesytoto.firebasestorage.app",
    messagingSenderId: "832938823584",
    appId: "1:832938823584:web:bbff7d5c125a1d7b319ec5"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// --- UI / Navegación SPA ---
const SCREENS = Array.from(document.querySelectorAll('.screen'));
function showScreen(id) {
SCREENS.forEach(s => s.classList.remove('active'));
const el = document.getElementById(id);
if (el) el.classList.add('active');
}
// Login
const SECRET = '111225'; // la fecha secreta
const loginInput = document.getElementById('login-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
loginBtn.addEventListener('click', () => {
const v = (loginInput.value || '').trim();
if (v === SECRET) {
loginError.textContent = '';
showScreen('screen-menu');
} else {
loginError.textContent = 'Fecha incorrecta ';
}
});
// Logout
// document.getElementById('logout-btn').addEventListener('click', () => {
// loginInput.value = '';
// showScreen('screen-login');
// });
// Menu buttons
document.getElementById('btn-mes-anterior').addEventListener('click', () =>
showScreen('screen-galeria'));
document.getElementById('btn-diario').addEventListener('click', () => {
showScreen('screen-diario'); loadDiary(); });
document.getElementById('btn-mostrar').addEventListener('click', () =>
showScreen('screen-mostrar'));
// Back buttons
document.querySelectorAll('.btn-volver').forEach(btn => {
btn.addEventListener('click', (e) => {
const target = 'screen-menu';
showScreen(target);
});
});
// --- Contador romántico (Firestore + fallback localStorage) ---
const contadorSpan = document.getElementById('contador-numero');
async function loadCounter() {
try {
const docRef = doc(db, 'estado', 'contador');
const snap = await getDoc(docRef);
if (snap.exists()) {
contadorSpan.textContent = snap.data().value || 0;
} else {
await setDoc(docRef, { value: 0 });
contadorSpan.textContent = '0';
}
} catch (e) {
// fallback
const local = Number(localStorage.getItem('contadorExtrañar') || 0);
contadorSpan.textContent = local;
}
}
async function incrementCounter() {
try {
const docRef = doc(db, 'estado', 'contador');
await updateDoc(docRef, { value: increment(1) });
await loadCounter();
} catch (e) {
// fallback
const local = Number(localStorage.getItem('contadorExtrañar') || 0) + 1;
localStorage.setItem('contadorExtrañar', local);
contadorSpan.textContent = local;
}
}
// conectar boton contar
const btnExtra = document.getElementById('btn-extranar');
btnExtra.addEventListener('click', async (e) => {
e.stopPropagation();
await incrementCounter();
// mostrar modal con imagen aleatoria local (igual que antes)
mostrarModal();
});
// --- Modal y galería local (conserva tu lógica) ---
let fotosDisponibles = [];
const TOTAL_FOTOS_ESPERADAS = 15;
const modal = document.getElementById('modal-extranar');
const modalFoto = document.getElementById('modal-foto');
function inicializarFotos() {
fotosDisponibles = [];
for (let i = 1; i <= TOTAL_FOTOS_ESPERADAS; i++) {
fotosDisponibles.push(`fotos/foto${i}.JPG`);
}
}
function fotoAleatoria() {
if (fotosDisponibles.length === 0) return 'fotos/foto1.JPG';
const idx = Math.floor(Math.random() * fotosDisponibles.length);
return fotosDisponibles[idx];
}
function mostrarModalConFoto(url) {
modalFoto.src = url;
modal.classList.add('active');
setTimeout(() => cerrarModal(), 5000);
}
function mostrarModal() {
const foto = fotoAleatoria();
mostrarModalConFoto(foto);
}
function cerrarModal() { modal.classList.remove('active'); }
modal.addEventListener('click', (e) => { if (e.target === modal)
cerrarModal(); });
// galeria inicial: si quieres actualizar srcs al abrir galería
function populateGallery() {
  const ids = ['foto1','foto2','foto3','foto4'];
const chosen = fotosAleatorias(4);
ids.forEach((id, i) => {
const el = document.getElementById(id);
if (el) el.src = chosen[i] || `fotos/foto${(i%2)+1}.JPG`;
if (el) el.onclick = () => mostrarModalConFoto(el.src);
});
}
function fotosAleatorias(cantidad) {
if (fotosDisponibles.length === 0) return [];
const copia = [...fotosDisponibles];
for (let i = copia.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[copia[i], copia[j]] = [copia[j], copia[i]];
}
return copia.slice(0, cantidad);
}
// Volver
document.getElementById('btn-volver').addEventListener('click', () =>
showScreen('screen-menu'));
// --- FIRESTORE: Diario y Storage: imágenes ---
const diaryList = document.getElementById('diary-list');
const saveDiaryBtn = document.getElementById('save-diary');
const loadDiaryBtn = document.getElementById('load-diary');
const diaryText = document.getElementById('diary-text');
async function saveDiaryEntry(text) {
if (!text || text.trim().length === 0) return alert('Escribe algo ');
try {
await addDoc(collection(db, 'diario'), { contenido: text.trim(), fecha:
new Date() });
diaryText.value = '';
alert('Guardado ');
loadDiary();
} catch (e) {
alert('Error al guardar. Intenta de nuevo.');
console.error(e);
}
}
async function loadDiary() {
diaryList.innerHTML = '';
try {
const q = query(collection(db, 'diario'), orderBy('fecha', 'desc'));
const snap = await getDocs(q);
snap.forEach(docSnap => {
const d = docSnap.data();
const p = document.createElement('p');
const fecha = d.fecha && d.fecha.toDate ?
d.fecha.toDate().toLocaleString() : new Date(d.fecha).toLocaleString();
p.innerHTML = `<strong>${fecha}</strong><br>${escapeHtml(d.contenido)}
`;
diaryList.appendChild(p);
});
} catch (e) {
console.error(e);
diaryList.innerHTML = '<p>No hay entradas o hubo un error.</p>';
}
}
saveDiaryBtn.addEventListener('click', () =>
saveDiaryEntry(diaryText.value));
loadDiaryBtn.addEventListener('click', loadDiary);
// --- Upload images to Storage and list them ---
const imageInput = document.getElementById('image-input');
const uploadBtn = document.getElementById('upload-btn');
const imagesGrid = document.getElementById('images-grid');
const loadImagesBtn = document.getElementById('load-images-btn');
async function uploadImageFile(file) {
if (!file) return alert('Selecciona una imagen');
try {
const name = `${Date.now()}_${file.name}`;
const storageRef = ref(storage, `imagenes/${name}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
await addDoc(collection(db, 'imagenes'), { url, fecha: new Date() });
alert('Imagen guardada ');
loadImages();
} catch (e) {
console.error(e);
alert('Error subiendo imagen');
}
}
async function loadImages() {
imagesGrid.innerHTML = '';
try {
const snap = await getDocs(query(collection(db, 'imagenes'),
orderBy('fecha', 'desc')));
snap.forEach(docSnap => {
const data = docSnap.data();
const img = document.createElement('img');
img.src = data.url;
img.alt = 'Imagen guardada';
img.onclick = () => mostrarModalConFoto(data.url);
imagesGrid.appendChild(img);
});
} catch (e) {
console.error(e);
imagesGrid.innerHTML = '<p>No hay imágenes o hubo un error.</p>';
}
}
uploadBtn.addEventListener('click', () =>
uploadImageFile(imageInput.files[0]));
loadImagesBtn.addEventListener('click', loadImages);
// --- Utilidades ---
function escapeHtml(str) {
return String(str).replace(/[&<>\"']/g, s =>
({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
}
// inicializar cosas
inicializarFotos();
populateGallery();
loadCounter();
// Exponer para debugging (opcional)
window._app = { loadDiary, loadImages, incrementCounter };