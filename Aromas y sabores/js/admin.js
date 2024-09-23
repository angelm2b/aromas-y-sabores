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
const DEFAULT_IMAGE = './imagenes/Plato vacio.jpg';

// Función para obtener la fecha del próximo día de la semana
function getNextDayOfWeek(dayName) {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const today = new Date();
    const targetDay = days.indexOf(dayName.toLowerCase());
    const daysUntilTarget = (targetDay + 7 - today.getDay()) % 7;
    const targetDate = new Date(today.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000);
    return targetDate;
}

// Función para formatear la fecha
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para cargar el menú desde Firebase
function cargarMenu() {
    return database.ref('menuSemanal').once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                const menuDefault = {
                    lunes: { fecha: formatDate(getNextDayOfWeek('lunes')), plato: "Arroz con pollo", descripcion: "Arroz blanco con pollo guisado", precio: 150.00, imagen: DEFAULT_IMAGE },
                    martes: { fecha: formatDate(getNextDayOfWeek('martes')), plato: "Lasaña de carne", descripcion: "Lasaña casera con carne molida y salsa bechamel", precio: 150.00, imagen: DEFAULT_IMAGE },
                    miercoles: { fecha: formatDate(getNextDayOfWeek('miércoles')), plato: "Pescado a la plancha", descripcion: "Filete de pescado a la plancha con puré de papas", precio: 150.00, imagen: DEFAULT_IMAGE },
                    jueves: { fecha: formatDate(getNextDayOfWeek('jueves')), plato: "Lomo saltado", descripcion: "Tiras de lomo fino salteadas con verduras y papas fritas", precio: 150.00, imagen: DEFAULT_IMAGE },
                    viernes: { fecha: formatDate(getNextDayOfWeek('viernes')), plato: "Paella mixta", descripcion: "Paella con mariscos, pollo y verduras", precio: 150.00, imagen: DEFAULT_IMAGE }
                };
                guardarMenu(menuDefault);
                return menuDefault;
            }
        });
}

// Función para guardar el menú en Firebase
function guardarMenu(menuSemanal) {
    return database.ref('menuSemanal').set(menuSemanal);
}

// Función para mostrar el menú actual
function mostrarMenuActual() {
    cargarMenu().then((menuSemanal) => {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = '';

        // Definimos el orden de los días de la semana
        const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

        // Iteramos sobre el orden de los días
        for (const dia of ordenDias) {
            if (menuSemanal[dia]) {
                const menu = menuSemanal[dia];
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <h4>${dia.charAt(0).toUpperCase() + dia.slice(1)} ${menu.fecha}</h4>
                    <img src="${menu.imagen || DEFAULT_IMAGE}" alt="${menu.plato}" class="menu-image">
                    <p><strong>Plato:</strong> ${menu.plato}</p>
                    <p><strong>Descripción:</strong> ${menu.descripcion}</p>
                    <p><strong>Precio:</strong> $${menu.precio.toFixed(2)}</p>
                    <button onclick="editarMenu('${dia}')">Editar</button>
                `;
                menuList.appendChild(menuItem);
            }
        }
    });
}


// Función para editar un menú existente
function editarMenu(dia) {
    cargarMenu().then((menuSemanal) => {
        const menu = menuSemanal[dia];
        document.getElementById('dia').value = dia;
        document.getElementById('fecha').value = menu.fecha;
        document.getElementById('plato').value = menu.plato;
        document.getElementById('descripcion').value = menu.descripcion;
        document.getElementById('precio').value = menu.precio;
        document.getElementById('image-preview').src = menu.imagen || DEFAULT_IMAGE;
    });
}

// Función para manejar el envío del formulario
function handleSubmit(event) {
    event.preventDefault();
    cargarMenu().then((menuSemanal) => {
        const dia = document.getElementById('dia').value;
        const fecha = document.getElementById('fecha').value;
        const plato = document.getElementById('plato').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const imagen = document.getElementById('image-preview').src;

        menuSemanal[dia] = {
            fecha,
            plato,
            descripcion,
            precio,
            imagen: imagen !== DEFAULT_IMAGE ? imagen : ''
        };
        guardarMenu(menuSemanal).then(() => {
            mostrarMenuActual();
            event.target.reset();
            document.getElementById('image-preview').src = DEFAULT_IMAGE;
        });
    });
}

// Función para manejar la vista previa de la imagen
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('image-preview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('image-preview').src = DEFAULT_IMAGE;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    mostrarMenuActual();
    const menuForm = document.getElementById('menu-form');
    const imagenInput = document.getElementById('imagen');
    const imagePreview = document.getElementById('image-preview');

    if (menuForm) {
        menuForm.addEventListener('submit', handleSubmit);
    }
    if (imagenInput) {
        imagenInput.addEventListener('change', handleImagePreview);
    }
    if (imagePreview) {
        // Establecer la imagen por defecto al cargar la página
        imagePreview.src = DEFAULT_IMAGE;
    }
});
