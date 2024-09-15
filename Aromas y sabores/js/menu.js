// Definimos la ruta de la imagen por defecto
const DEFAULT_IMAGE = '/imagenes/Plato vacio.jpg';

// Función para cargar el menú desde el almacenamiento local
function cargarMenu() {
    const menuGuardado = typeof localStorage !== 'undefined' ? localStorage.getItem('menuSemanal') : null;
    return menuGuardado ? JSON.parse(menuGuardado) : {
        lunes: { fecha: "01", plato: "Arroz con pollo", descripcion: "Arroz blanco con pollo guisado", precio: 150.00, imagen: DEFAULT_IMAGE },
        martes: { fecha: "02", plato: "Lasaña de carne", descripcion: "Lasaña casera con carne molida y salsa bechamel", precio: 150.00, imagen: DEFAULT_IMAGE },
        miercoles: { fecha: "03", plato: "Pescado a la plancha", descripcion: "Filete de pescado a la plancha con puré de papas", precio: 150.00, imagen: DEFAULT_IMAGE },
        jueves: { fecha: "04", plato: "Lomo saltado", descripcion: "Tiras de lomo fino salteadas con verduras y papas fritas", precio: 150.00, imagen: DEFAULT_IMAGE },
        viernes: { fecha: "05", plato: "Paella mixta", descripcion: "Paella con mariscos, pollo y verduras", precio: 150.00, imagen: DEFAULT_IMAGE }
    };
}

// Función para mostrar el menú en la página
function mostrarMenu() {
    const menuSemanal = cargarMenu();
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

    for (const [dia, menu] of Object.entries(menuSemanal)) {
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

// Cargar el menú cuando la página se carga
document.addEventListener('DOMContentLoaded', mostrarMenu);