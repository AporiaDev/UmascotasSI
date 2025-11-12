// JavaScript para decision-solicitud.html
// Verificar que el usuario sea admin
document.addEventListener('DOMContentLoaded', function() {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
        alert('Acceso denegado. Solo los administradores pueden tomar decisiones sobre las solicitudes.');
        window.location.href = '/listar-solicitudes';
        return;
    }
    cargarSolicitud();
});

// Obtener el ID de la solicitud de la URL
const urlParts = window.location.pathname.split('/');
const solicitudId = urlParts[urlParts.length - 1];

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
    const container = document.getElementById('decisionContainer');
    container.classList.remove('hidden');

    // Verificar que la solicitud esté pendiente
    if (solicitud.estadoSolicitud !== 'PENDIENTE') {
        mostrarError('Esta solicitud ya ha sido resuelta. No se puede modificar.');
        return;
    }

    document.getElementById('idSolicitud').textContent = solicitud.idSolicitud;
    document.getElementById('idSolicitudInput').value = solicitud.idSolicitud;

    // Resumen
    const fechaSolicitud = solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'No especificada';
    
    document.getElementById('resumenSolicitud').innerHTML = `
        <p><strong>ID Solicitud:</strong> ${solicitud.idSolicitud}</p>
        <p><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</p>
        <p><strong>Estado Actual:</strong> <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">${solicitud.estadoSolicitud}</span></p>
    `;

    // Información de la mascota
    const mascota = solicitud.mascotaSolicitada || {};
    document.getElementById('infoMascota').innerHTML = `
        <p><strong>Nombre:</strong> ${mascota.nombre || 'No disponible'}</p>
        <p><strong>Especie:</strong> ${mascota.especie || 'No disponible'}</p>
        <p><strong>Raza:</strong> ${mascota.raza || 'No disponible'}</p>
        <p><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'No disponible'}</p>
        <p><strong>Estado de Salud:</strong> ${mascota.estadoSalud || 'No disponible'}</p>
    `;

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
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    const mensajeContenido = document.getElementById('mensajeContenido');
    
    mensajeDiv.classList.remove('hidden');
    mensajeContenido.textContent = mensaje;
    mensajeContenido.className = `p-4 rounded-lg ${tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.classList.add('hidden');
    }, 5000);
}

// Manejo del envío del formulario
document.getElementById('decisionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const decision = document.querySelector('input[name="decision"]:checked').value;
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
        mostrarMensaje('Error: No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.', 'error');
        return;
    }
    
    // Preparar datos de la decisión
    const decisionData = {
        estadoSolicitud: decision,
        idUsuario: parseInt(idUsuario)
    };
    
    try {
        const response = await fetch(`/api/solicitudes/${solicitudId}/decision`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(decisionData)
        });
        
        if (response.ok) {
            const solicitud = await response.json();
            mostrarMensaje(`¡Decisión guardada exitosamente! La solicitud ha sido ${decision === 'ACEPTADA' ? 'aceptada' : decision === 'RECHAZADA' ? 'rechazada' : 'cancelada'}.`, 'success');
            setTimeout(() => {
                window.location.href = '/listar-solicitudes';
            }, 2000);
        } else {
            const error = await response.text();
            mostrarMensaje(`Error al guardar la decisión: ${error}`, 'error');
        }
    } catch (error) {
        mostrarMensaje(`Error de conexión: ${error.message}`, 'error');
    }
});

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

