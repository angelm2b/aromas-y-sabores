// Configuración de Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const database = firebase.database();


// Definimos la ruta de la imagen por defecto
const DEFAULT_IMAGE = '/imagenes/Plato vacio.jpg';

// Función para cargar el menú desde Firebase
function cargarMenu() {
    return database.ref('menuSemanal').once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.error('No menu data available');
                return {};
            }
        });
}

// Función para mostrar el menú en la página
function mostrarMenu() {
    cargarMenu().then((menuSemanal) => {
        const menuContainer = document.querySelector('.menu-container');
        if (!menuContainer) {
            console.error('Menu container element not found');
            return;
        }
        menuContainer.innerHTML = '';

        if (!menuSemanal || Object.keys(menuSemanal).length === 0) {
            console.error('No menu data available');
            return;
        }

        // Definimos el orden de los días de la semana
        const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

        // Iteramos sobre el orden de los días
        for (const dia of ordenDias) {
            if (menuSemanal[dia]) {
                const menu = menuSemanal[dia];
                const menuDia = document.createElement('div');
                menuDia.classList.add('menu-dia');
                menuDia.innerHTML = `
                    <h3>${dia.charAt(0).toUpperCase() + dia.slice(1)} ${menu.fecha}</h3>
                    <img src="${menu.imagen || DEFAULT_IMAGE}" alt="${menu.plato}" class="menu-image">
                    <p><strong>Plato:</strong> ${menu.plato}</p>
                    <p><strong>Descripción:</strong> ${menu.descripcion}</p>
                    <p><strong>Precio:</strong> $${menu.precio.toFixed(2)}</p>
                `;
                menuContainer.appendChild(menuDia);
            }
        }
    });
}

// Cargar el menú cuando la página se carga
document.addEventListener('DOMContentLoaded', mostrarMenu);
