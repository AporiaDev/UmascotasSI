// JavaScript para crear-mascota.html
// Cargar ID de usuario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
        document.getElementById('idUsuarioPublica').value = idUsuario;
    } else {
        // Si no hay usuario autenticado, redirigir al login
        alert('Debes iniciar sesión para crear una mascota');
        window.location.href = '/login';
    }
});

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('mascotaForm').reset();
    // Restaurar el ID de usuario después de limpiar
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
        document.getElementById('idUsuarioPublica').value = idUsuario;
    }
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
document.getElementById('mascotaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const mascotaData = Object.fromEntries(formData.entries());
    
    // Convertir edad a número si existe
    if (mascotaData.edad) {
        mascotaData.edad = parseInt(mascotaData.edad);
    }
    
    // Convertir idUsuarioPublica a número
    if (mascotaData.idUsuarioPublica) {
        mascotaData.idUsuarioPublica = parseInt(mascotaData.idUsuarioPublica);
    } else {
        mostrarMensaje('Error: No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.', 'error');
        return;
    }
    
    // Asegurar que statusPublicacion esté en mayúsculas
    if (mascotaData.estadoPublicacion) {
        mascotaData.statusPublicacion = mascotaData.estadoPublicacion.toUpperCase();
        delete mascotaData.estadoPublicacion;
    } else {
        mascotaData.statusPublicacion = 'DISPONIBLE'; // Valor por defecto
    }
    
    // Convertir sexo y tamano si existen
    if (mascotaData.sexo) {
        mascotaData.sexo = mascotaData.sexo.toUpperCase();
    }
    if (mascotaData.tamano) {
        mascotaData.tamano = mascotaData.tamano.toUpperCase();
    }
    
    // Convertir esterilizado a boolean
    if (mascotaData.esterilizado) {
        mascotaData.esterilizado = mascotaData.esterilizado === 'true' || mascotaData.esterilizado === 'on';
    }
    
    try {
        const response = await fetch('/api/mascotas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mascotaData)
        });
        
        if (response.ok) {
            const mascota = await response.json();
            mostrarMensaje(`¡Mascota "${mascota.nombre}" creada exitosamente!`, 'success');
            setTimeout(() => {
                limpiarFormulario();
            }, 2000);
        } else {
            const error = await response.text();
            mostrarMensaje(`Error al crear la mascota: ${error}`, 'error');
        }
    } catch (error) {
        mostrarMensaje(`Error de conexión: ${error.message}`, 'error');
    }
});
