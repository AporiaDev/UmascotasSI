// JavaScript para ver-mascota.html
// Obtener el ID de la mascota de la URL
const urlParts = window.location.pathname.split('/');
const mascotaId = urlParts[urlParts.length - 1];

// Cargar información de la mascota al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarMascota();
});

// Función para cargar la mascota desde la API
async function cargarMascota() {
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await fetch(`/api/mascotas/${mascotaId}`);
        if (response.ok) {
            const mascota = await response.json();
            mostrarMascota(mascota);
        } else if (response.status === 404) {
            mostrarError('Mascota no encontrada.');
        } else {
            mostrarError('Error al cargar la información de la mascota.');
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar la mascota
function mostrarMascota(mascota) {
    const container = document.getElementById('mascotaContainer');
    container.classList.remove('hidden');

    // Nombre
    document.getElementById('nombreMascota').textContent = mascota.nombre || 'Sin nombre';

    // Foto
    const fotoDiv = document.getElementById('fotoMascota');
    if (mascota.foto) {
        fotoDiv.innerHTML = `<img src="${mascota.foto}" alt="${mascota.nombre}" class="w-full h-full object-cover">`;
    }

    // Estado - manejar ambos nombres posibles
    const estadoValue = mascota.statusPublicacion || mascota.estadoPublicacion || 'NO_DISPONIBLE';
    const estado = String(estadoValue).toUpperCase();
    const estadoBadge = document.getElementById('estadoBadge');
    const estadoConfig = {
        'DISPONIBLE': { class: 'bg-green-100 text-green-800', text: 'Disponible', icon: 'fa-check-circle' },
        'ADOPTADA': { class: 'bg-blue-100 text-blue-800', text: 'Adoptada', icon: 'fa-heart' },
        'RESERVADA': { class: 'bg-yellow-100 text-yellow-800', text: 'Reservada', icon: 'fa-clock' },
        'NO_DISPONIBLE': { class: 'bg-gray-100 text-gray-800', text: 'No Disponible', icon: 'fa-ban' }
    };
    const config = estadoConfig[estado] || estadoConfig['NO_DISPONIBLE'];
    estadoBadge.className = `inline-block px-4 py-2 rounded-full text-sm font-medium ${config.class}`;
    estadoBadge.innerHTML = `<i class="fas ${config.icon} mr-1"></i>${config.text}`;

    // Mostrar botón de adoptar solo si está disponible
    if (estado === 'DISPONIBLE') {
        document.getElementById('botonAdoptar').classList.remove('hidden');
    }

    // Información básica
    document.getElementById('especie').textContent = mascota.especie || 'No especificada';
    document.getElementById('raza').textContent = mascota.raza || 'No especificada';
    document.getElementById('edad').textContent = mascota.edad ? `${mascota.edad} años` : 'No especificada';
    
    const sexoMap = {
        'MACHO': 'Macho',
        'HEMBRA': 'Hembra',
        'OTRO': 'Otro'
    };
    const sexoValue = mascota.sexo ? String(mascota.sexo).toUpperCase() : '';
    document.getElementById('sexo').textContent = sexoMap[sexoValue] || 'No especificado';
    
    const tamanoMap = {
        'GRANDE': 'Grande',
        'MEDIANO': 'Mediano',
        'PEQUENO': 'Pequeño',
        'OTRO': 'Otro'
    };
    const tamanoValue = mascota.tamano ? String(mascota.tamano).toUpperCase() : '';
    document.getElementById('tamano').textContent = tamanoMap[tamanoValue] || 'No especificado';
    document.getElementById('esterilizado').textContent = mascota.esterilizado ? 'Sí' : 'No';

    // Estado de salud
    document.getElementById('estadoSalud').textContent = mascota.estadoSalud || 'No especificado';

    // Descripción
    if (mascota.descripcion) {
        document.getElementById('descripcion').textContent = mascota.descripcion;
        document.getElementById('descripcionContainer').classList.remove('hidden');
    } else {
        document.getElementById('descripcionContainer').classList.add('hidden');
    }

    // Información del publicador
    if (mascota.usuarioPublica) {
        const publicador = mascota.usuarioPublica;
        document.getElementById('infoPublicador').innerHTML = `
            <p class="text-lg font-semibold text-gray-800">${publicador.nombreCompleto || 'Usuario'}</p>
            ${publicador.telefono ? `<p class="text-gray-600 mt-1"><i class="fas fa-phone mr-2"></i>${publicador.telefono}</p>` : ''}
            ${publicador.ciudad ? `<p class="text-gray-600 mt-1"><i class="fas fa-map-marker-alt mr-2"></i>${publicador.ciudad}</p>` : ''}
        `;
    } else {
        document.getElementById('publicadorContainer').classList.add('hidden');
    }
}

// Función para adoptar mascota
function adoptarMascota() {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
        alert('Debes iniciar sesión para adoptar una mascota');
        window.location.href = '/login';
        return;
    }

    // Redirigir a la página de crear solicitud
    window.location.href = `/crear-solicitud/${mascotaId}`;
}

// Funciones auxiliares
function mostrarLoading(mostrar) {
    document.getElementById('loading').classList.toggle('hidden', !mostrar);
}

function mostrarError(mensaje) {
    document.getElementById('errorTexto').textContent = mensaje;
    document.getElementById('errorMensaje').classList.remove('hidden');
}

function ocultarError() {
    document.getElementById('errorMensaje').classList.add('hidden');
}
