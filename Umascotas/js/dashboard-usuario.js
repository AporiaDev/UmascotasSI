// JavaScript para dashboard-usuario.html
// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        const idUsuario = localStorage.getItem('idUsuario');
        
        // Cargar mascotas
        const mascotasResponse = await fetch('/api/mascotas');
        if (mascotasResponse.ok) {
            const mascotas = await mascotasResponse.json();
            // Filtrar solo mascotas disponibles
            const disponibles = mascotas.filter(m => m.statusPublicacion === 'DISPONIBLE');
            document.getElementById('totalMascotas').textContent = disponibles.length;
            
            // Mostrar mascotas recientes (últimas 3)
            const mascotasRecientes = disponibles.slice(0, 3);
            mostrarMascotasRecientes(mascotasRecientes);
        }

        // Cargar solicitudes del usuario
        const solicitudesResponse = await fetch('/api/solicitudes');
        if (solicitudesResponse.ok) {
            const solicitudes = await solicitudesResponse.json();
            // Filtrar solo las del usuario actual
            const misSolicitudes = solicitudes.filter(s => {
                const idUsuarioSolicitud = s.usuarioAdoptante?.idUsuario || s.usuarioAdoptante?.id;
                return idUsuarioSolicitud == idUsuario;
            });
            document.getElementById('misSolicitudes').textContent = misSolicitudes.length;
            const aceptadas = misSolicitudes.filter(s => s.estadoSolicitud === 'ACEPTADA').length;
            document.getElementById('solicitudesAceptadas').textContent = aceptadas;
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

function mostrarMascotasRecientes(mascotas) {
    const container = document.getElementById('mascotasRecientes');
    if (mascotas.length === 0) {
        container.innerHTML = '<div class="col-span-3 text-center py-8 text-gray-400">No hay mascotas disponibles</div>';
        return;
    }
    container.innerHTML = mascotas.map(mascota => `
        <div class="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition">
            ${mascota.foto ? 
                `<img src="${mascota.foto}" alt="${mascota.nombre}" class="w-full h-32 object-cover rounded-lg mb-3">` :
                `<div class="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <i class="fas fa-paw text-3xl text-gray-400"></i>
                </div>`
            }
            <h3 class="font-semibold text-gray-800 mb-1">${mascota.nombre}</h3>
            <p class="text-sm text-gray-500">${mascota.especie || 'Sin especificar'}</p>
        </div>
    `).join('');
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    window.location.href = '/';
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarEstadisticas);
