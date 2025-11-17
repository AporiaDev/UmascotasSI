// JavaScript para crear-solicitud.html
// Obtener el ID de la mascota de la URL
const urlParts = window.location.pathname.split('/');
const mascotaId = urlParts[urlParts.length - 1];

// Cargar información de la mascota al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('idMascota').value = mascotaId;
    cargarMascota();
});

// Función para cargar información de la mascota
async function cargarMascota() {
    try {
        const response = await fetch(`/api/mascotas/${mascotaId}`);
        if (response.ok) {
            const mascota = await response.json();
            mostrarInfoMascota(mascota);
        } else {
            mostrarMensaje('Error al cargar la información de la mascota.', 'error');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Función para mostrar información de la mascota
function mostrarInfoMascota(mascota) {
    const detallesDiv = document.getElementById('detallesMascota');
    detallesDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p><strong>Nombre:</strong> ${mascota.nombre || 'No disponible'}</p>
                <p><strong>Especie:</strong> ${mascota.especie || 'No disponible'}</p>
                <p><strong>Raza:</strong> ${mascota.raza || 'No disponible'}</p>
            </div>
            <div>
                <p><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'No disponible'}</p>
                <p><strong>Estado de Salud:</strong> ${mascota.estadoSalud || 'No disponible'}</p>
                <p><strong>Estado:</strong> ${mascota.statusPublicacion || mascota.estadoPublicacion || 'No disponible'}</p>
            </div>
        </div>
        ${mascota.descripcion ? 
            `<div class="mt-4">
                <p><strong>Descripción:</strong></p>
                <p class="text-gray-700 mt-1">${mascota.descripcion}</p>
            </div>` : ''
        }
    `;
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('mensajeAdoptante').value = '';
    document.getElementById('experiencia').value = '';
    document.getElementById('otrasMascotas').value = '';
    ocultarMensaje();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    const mensajeContenido = document.getElementById('mensajeContenido');
    
    mensajeDiv.classList.remove('hidden');
    mensajeContenido.textContent = mensaje;
    mensajeContenido.className = `p-4 rounded-lg ${tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(ocultarMensaje, 5000);
}

// Función para ocultar mensajes
function ocultarMensaje() {
    document.getElementById('mensaje').classList.add('hidden');
}

// Manejo del envío del formulario
document.getElementById('solicitudForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const mensajeAdoptante = document.getElementById('mensajeAdoptante').value;
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
        mostrarMensaje('Error: No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.', 'error');
        return;
    }
    
    // Preparar datos de la solicitud - solo enviar el mensaje y el ID de usuario
    const solicitudData = {
        mensajeAdoptante: mensajeAdoptante,
        idUsuario: parseInt(idUsuario)
    };
    
    try {
        // Obtener token de autenticación
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Agregar token si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/solicitudes/mascota/${mascotaId}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(solicitudData)
        });
        
        if (response.ok) {
            const solicitud = await response.json();
            mostrarMensaje(`¡Solicitud creada exitosamente! Tu solicitud #${solicitud.idSolicitud} está pendiente de revisión.`, 'success');
            setTimeout(() => {
                window.location.href = '/listar-solicitudes';
            }, 2000);
        } else {
            const error = await response.text();
            mostrarMensaje(`Error al crear la solicitud: ${error}`, 'error');
        }
    } catch (error) {
        mostrarMensaje(`Error de conexión: ${error.message}`, 'error');
    }
});
