// // Estado de la app
// let contador = Number(localStorage.getItem('contadorExtrañar') || 0);
// let fotosDisponibles = [];
// let modalTimeout;
// const TOTAL_FOTOS_ESPERADAS = 15; // Cambia si tienes más fotos
// let fotosActualesGaleria = [];

// // Elementos del DOM
// const screenInicio = document.getElementById('screen-inicio');
// const screenGaleria = document.getElementById('screen-galeria');
// const btnVolver = document.getElementById('btn-volver');
// const btnExtrañar = document.getElementById('btn-extranar');
// const contadorNumero = document.getElementById('contador-numero');
// const modal = document.getElementById('modal-extranar');
// const modalFoto = document.getElementById('modal-foto');

// // Inicializar fotos disponibles (solo .JPG mayúsculas)
// function inicializarFotos() {
//   fotosDisponibles = [];
//   for (let i = 1; i <= TOTAL_FOTOS_ESPERADAS; i++) {
//     fotosDisponibles.push(`fotos/foto${i}.JPG`);
//   }
//   console.log(`Fotos inicializadas: ${fotosDisponibles.length} fotos encontradas`);
//   console.log(fotosDisponibles);
// }

// // Función para seleccionar foto aleatoria
// function fotoAleatoria() {
//   if (fotosDisponibles.length === 0) {
//     console.warn('fotosDisponibles está vacío');
//     return 'fotos/foto1.JPG';
//   }
//   const indice = Math.floor(Math.random() * fotosDisponibles.length);
//   const fotoSeleccionada = fotosDisponibles[indice];
//   console.log(`Foto seleccionada: ${fotoSeleccionada} de ${fotosDisponibles.length} disponibles`);
//   return fotoSeleccionada;
// }

// // Función para seleccionar N fotos aleatorias sin repetir (Fisher-Yates)
// function fotosAleatorias(cantidad) {
//   if (fotosDisponibles.length === 0) return [];
//   const copia = [...fotosDisponibles];
//   for (let i = copia.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copia[i], copia[j]] = [copia[j], copia[i]];
//   }
//   return copia.slice(0, cantidad);
// }

// // Mostrar pantalla de galería
// function mostrarGaleria() {
//   screenInicio.classList.remove('active');
//   screenGaleria.classList.add('active');
// //   // Seleccionar 4 fotos aleatorias cada vez
// //   fotosActualesGaleria = fotosAleatorias(4);
// //   for (let i = 0; i < 4; i++) {
// //     const fotoElement = document.getElementById(`foto${i + 1}`);
// //     fotoElement.src = fotosActualesGaleria[i] || `fotos/foto${(i % 2) + 1}.jpg`;
// //     // Permitir que al hacer click en la foto también muestre el modal con esa foto
// //     fotoElement.onclick = function(e) {
// //       e.stopPropagation();
// //       mostrarModalConFoto(fotoElement.src);
// //     };
// //   }
// }

// // Volver a inicio
// function volver() {
//   screenGaleria.classList.remove('active');
//   screenInicio.classList.add('active');
// }

// // Mostrar modal con foto específica
// function mostrarModalConFoto(fotoUrl) {
//   // contador++; // Removed to prevent double increment
//   contadorNumero.textContent = contador; // Display the current count
//   modalFoto.src = fotoUrl;
//   modal.classList.add('active');
//   modalFoto.classList.add('active');

//   if (modalTimeout) clearTimeout(modalTimeout);
//   modalTimeout = setTimeout(() => {
//     cerrarModal();
//   }, 5000);
// }

// // Mostrar modal con foto aleatoria (para el botón)
// function mostrarModal(e) {
//   if (e) e.stopPropagation();
//   contador = Number(localStorage.getItem('contadorExtrañar') || 0) + 1; // Increment and store in localStorage
//   localStorage.setItem('contadorExtrañar', contador);
//   contadorNumero.textContent = contador;
//   // Usar foto aleatoria de TODAS las disponibles (foto1 a foto15)
//   let foto = fotoAleatoria();
//   mostrarModalConFoto(foto);
// }

// // Cerrar modal
// function cerrarModal() {
//   modal.classList.remove('active');
//   if (modalTimeout) {
//     clearTimeout(modalTimeout);
//   }
// }

// // Event Listeners
// if (screenInicio) screenInicio.addEventListener('click', mostrarGaleria);
// if (btnVolver) btnVolver.addEventListener('click', volver);
// if (btnExtrañar) btnExtrañar.addEventListener('click', mostrarModal);

// // Cerrar modal al hacer click en el fondo (fuera del contenido)
// modal.addEventListener('click', (e) => {
//   if (e.target === modal) {
//     cerrarModal();
//   }
// });

// // Prevenir que clicks en el contenido del modal lo cierren
// const modalContent = document.querySelector('.modal-content');
// if (modalContent) {
//   modalContent.addEventListener('click', (e) => {
//     e.stopPropagation();
//   });
// }

// // Inicializar
// inicializarFotos();
// // Cargar contador persistente
// contador = Number(localStorage.getItem('contadorExtrañar') || 0);
// contadorNumero.textContent = contador;
