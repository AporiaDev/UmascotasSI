// JavaScript para ver-solicitud.html
// Obtener el ID de la solicitud de la URL
const urlParts = window.location.pathname.split('/');
const solicitudId = urlParts[urlParts.length - 1];

// Cargar solicitud al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarSolicitud();
});

// Función para cargar la solicitud desde la API
async function cargarSolicitud() {
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await fetch(`/api/solicitudes/${solicitudId}`);
        if (response.ok) {
            const solicitud = await response.json();
            mostrarSolicitud(solicitud);
        } else if (response.status === 404) {
            mostrarError('Solicitud no encontrada.');
        } else {
            mostrarError('Error al cargar la solicitud. Inténtalo de nuevo.');
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar la solicitud
function mostrarSolicitud(solicitud) {
    const container = document.getElementById('solicitudContainer');
    container.classList.remove('hidden');

    // Estado
    document.getElementById('idSolicitud').textContent = solicitud.idSolicitud;
    const estadoBadge = document.getElementById('estadoBadge');
    const estadoColor = {
        'PENDIENTE': 'bg-yellow-100 text-yellow-800',
        'ACEPTADA': 'bg-green-100 text-green-800',
        'RECHAZADA': 'bg-red-100 text-red-800',
        'CANCELADA': 'bg-gray-100 text-gray-800'
    };
    const estadoIcon = {
        'PENDIENTE': 'fas fa-clock',
        'ACEPTADA': 'fas fa-check-circle',
        'RECHAZADA': 'fas fa-times-circle',
        'CANCELADA': 'fas fa-ban'
    };
    estadoBadge.className = `px-4 py-2 rounded-full text-sm font-medium ${estadoColor[solicitud.estadoSolicitud]}`;
    estadoBadge.innerHTML = `<i class="${estadoIcon[solicitud.estadoSolicitud]} mr-1"></i>${solicitud.estadoSolicitud}`;

    // Fecha
    const fechaSolicitud = solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'No especificada';
    document.getElementById('fechaSolicitud').textContent = fechaSolicitud;

    // Información de la mascota
    const mascota = solicitud.mascotaSolicitada || {};
    document.getElementById('infoMascota').innerHTML = `
        <p><strong>Nombre:</strong> ${mascota.nombre || 'No disponible'}</p>
        <p><strong>Especie:</strong> ${mascota.especie || 'No disponible'}</p>
        <p><strong>Raza:</strong> ${mascota.raza || 'No disponible'}</p>
        <p><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'No disponible'}</p>
        <p><strong>Estado de Salud:</strong> ${mascota.estadoSalud || 'No disponible'}</p>
    `;
    const linkMascota = document.getElementById('linkMascota');
    if (mascota.idMascota) {
        linkMascota.href = `/mascota/${mascota.idMascota}`;
    } else {
        linkMascota.style.display = 'none';
    }

    // Información del usuario
    const usuario = solicitud.usuarioAdoptante || {};
    document.getElementById('infoUsuario').innerHTML = `
        <p><strong>Nombre:</strong> ${usuario.nombreCompleto || usuario.nombre || 'No disponible'}</p>
        <p><strong>Email:</strong> ${usuario.correoElectronico || usuario.email || 'No disponible'}</p>
        <p><strong>Teléfono:</strong> ${usuario.telefono || 'No disponible'}</p>
    `;

    // Mensaje del adoptante
    const mensajeDiv = document.getElementById('mensajeAdoptante');
    if (solicitud.mensajeAdoptante) {
        mensajeDiv.textContent = solicitud.mensajeAdoptante;
    } else {
        mensajeDiv.textContent = 'No se proporcionó un mensaje.';
        mensajeDiv.classList.add('text-gray-500', 'italic');
    }

    // Información de resolución
    if (solicitud.fechaResolucion || solicitud.usuarioResolvio) {
        const resolucionDiv = document.getElementById('infoResolucion');
        resolucionDiv.classList.remove('hidden');
        
        const fechaResolucion = solicitud.fechaResolucion ? new Date(solicitud.fechaResolucion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'No especificada';
        
        const usuarioResolvio = solicitud.usuarioResolvio || {};
        document.getElementById('detallesResolucion').innerHTML = `
            <p><strong>Fecha de Resolución:</strong> ${fechaResolucion}</p>
            <p><strong>Resuelto por:</strong> ${usuarioResolvio.nombreCompleto || usuarioResolvio.nombre || 'No disponible'}</p>
        `;
    }

    // Botón de decisión (solo si está pendiente Y el usuario es admin)
    const esAdmin = localStorage.getItem('rol') === 'ADMIN';
    if (solicitud.estadoSolicitud === 'PENDIENTE' && esAdmin) {
        document.getElementById('btnDecision').classList.remove('hidden');
    }
}

// Función para ir a la página de decisión
function irADecision() {
    window.location.href = `/decision-solicitud/${solicitudId}`;
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
