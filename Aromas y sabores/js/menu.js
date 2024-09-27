// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgw9EPC0LGCMe-aYtYxLg0qBGhYhI_ynI",
    authDomain: "aromas-b712c.firebaseapp.com",
    databaseURL: "https://aromas-b712c-default-rtdb.firebaseio.com",
    projectId: "aromas-b712c",
    storageBucket: "aromas-b712c.appspot.com",
    messagingSenderId: "219362246807",
    appId: "1:219362246807:web:563e505e242ea83246a9d2",
    measurementId: "G-FFQMVSWWX2"
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
