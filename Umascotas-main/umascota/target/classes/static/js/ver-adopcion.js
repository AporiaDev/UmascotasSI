// JavaScript para ver-adopcion.html
// Obtener el ID de la adopción de la URL
const urlParts = window.location.pathname.split('/');
const adopcionId = urlParts[urlParts.length - 1];

// Cargar adopción al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar enlaces de dashboard según el rol
    const rol = localStorage.getItem('rol');
    if (rol === 'ADMIN') {
        document.getElementById('linkDashboardAdmin').style.display = 'block';
        document.getElementById('btnBorrarAdopcion').classList.remove('hidden');
    } else if (rol === 'USUARIO') {
        document.getElementById('linkDashboardUsuario').style.display = 'block';
    }
    
    cargarAdopcion();
});

// Función para cargar la adopción desde la API
async function cargarAdopcion() {
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await fetch(`/api/adopciones/${adopcionId}`);
        if (response.ok) {
            const adopcion = await response.json();
            mostrarAdopcion(adopcion);
        } else if (response.status === 404) {
            mostrarError('Adopción no encontrada.');
        } else {
            mostrarError('Error al cargar la adopción. Inténtalo de nuevo.');
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar la adopción
function mostrarAdopcion(adopcion) {
    const container = document.getElementById('adopcionContainer');
    container.classList.remove('hidden');

    // ID y fecha
    document.getElementById('idAdopcion').textContent = adopcion.idAdopcion;
    
    const fechaAdopcion = adopcion.fechaAdopcion ? new Date(adopcion.fechaAdopcion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'No especificada';
    document.getElementById('fechaAdopcion').textContent = fechaAdopcion;

    // Información de la mascota
    const mascota = adopcion.mascota || {};
    document.getElementById('infoMascota').innerHTML = `
        <p><strong>Nombre:</strong> ${mascota.nombre || 'No disponible'}</p>
        <p><strong>Especie:</strong> ${mascota.especie || 'No disponible'}</p>
        <p><strong>Raza:</strong> ${mascota.raza || 'No disponible'}</p>
        <p><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'No disponible'}</p>
        <p><strong>Estado de Salud:</strong> ${mascota.estadoSalud || 'No disponible'}</p>
        <p><strong>Estado:</strong> ${mascota.statusPublicacion || 'No disponible'}</p>
    `;
    const linkMascota = document.getElementById('linkMascota');
    if (mascota.idMascota) {
        linkMascota.href = `/mascota/${mascota.idMascota}`;
    } else {
        linkMascota.style.display = 'none';
    }

    // Información del adoptante
    const adoptante = adopcion.adoptante || {};
    document.getElementById('infoAdoptante').innerHTML = `
        <p><strong>Nombre:</strong> ${adoptante.nombreCompleto || 'No disponible'}</p>
        <p><strong>Email:</strong> ${adoptante.correoElectronico || 'No disponible'}</p>
        <p><strong>Teléfono:</strong> ${adoptante.telefono || 'No disponible'}</p>
        ${adoptante.ciudad ? `<p><strong>Ciudad:</strong> ${adoptante.ciudad}</p>` : ''}
    `;

    // Información de la solicitud
    const solicitud = adopcion.solicitud || {};
    const fechaSolicitud = solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'No especificada';
    
    document.getElementById('infoSolicitud').innerHTML = `
        <p><strong>ID Solicitud:</strong> ${solicitud.idSolicitud || 'No disponible'}</p>
        <p><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</p>
        <p><strong>Estado:</strong> ${solicitud.estadoSolicitud || 'No disponible'}</p>
        ${solicitud.mensajeAdoptante ? 
            `<p class="mt-2"><strong>Mensaje del Adoptante:</strong> ${solicitud.mensajeAdoptante}</p>` : ''
        }
    `;
    const linkSolicitud = document.getElementById('linkSolicitud');
    if (solicitud.idSolicitud) {
        linkSolicitud.href = `/ver-solicitud/${solicitud.idSolicitud}`;
    } else {
        linkSolicitud.style.display = 'none';
    }

    // Notas
    if (adopcion.notas) {
        document.getElementById('notas').textContent = adopcion.notas;
        document.getElementById('notasContainer').classList.remove('hidden');
    }
}

// Función para eliminar adopción
async function eliminarAdopcion() {
    const mascota = document.getElementById('infoMascota').textContent;
    const nombreMascota = mascota.match(/Nombre:\s*([^\n]+)/)?.[1]?.trim() || 'esta mascota';
    
    if (!confirm(`¿Estás seguro de que quieres eliminar esta adopción? La mascota "${nombreMascota}" volverá a estar disponible para adopción.`)) {
        return;
    }

    try {
        const response = await fetch(`/api/adopciones/${adopcionId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert(`Adopción eliminada exitosamente. La mascota ahora está disponible nuevamente.`);
            window.location.href = '/adopciones';
        } else {
            const error = await response.text();
            alert('Error al eliminar la adopción: ' + error);
        }
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    }
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

