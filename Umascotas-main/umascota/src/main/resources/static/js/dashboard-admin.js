// JavaScript para dashboard-admin.html
// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        // Cargar mascotas
        const mascotasResponse = await fetch('/api/mascotas');
        if (mascotasResponse.ok) {
            const mascotas = await mascotasResponse.json();
            document.getElementById('totalMascotas').textContent = mascotas.length;
            
            // Mostrar mascotas recientes (últimas 4)
            const mascotasRecientes = mascotas.slice(0, 4);
            mostrarMascotasRecientes(mascotasRecientes);
        }

        // Cargar solicitudes
        const solicitudesResponse = await fetch('/api/solicitudes');
        if (solicitudesResponse.ok) {
            const solicitudes = await solicitudesResponse.json();
            document.getElementById('totalSolicitudes').textContent = solicitudes.length;
            
            const aceptadas = solicitudes.filter(s => s.estadoSolicitud === 'ACEPTADA').length;
            document.getElementById('solicitudesAceptadas').textContent = aceptadas;
            
            const pendientes = solicitudes.filter(s => s.estadoSolicitud === 'PENDIENTE');
            document.getElementById('solicitudesPendientes').textContent = pendientes.length;
            
            // Mostrar solicitudes pendientes
            mostrarSolicitudesPendientes(pendientes.slice(0, 5));
        }

        // Cargar adopciones
        const adopcionesResponse = await fetch('/api/adopciones');
        if (adopcionesResponse.ok) {
            const adopciones = await adopcionesResponse.json();
            // Mostrar mascotas adoptadas (últimas 4)
            const adopcionesRecientes = adopciones.slice(0, 4);
            mostrarMascotasAdoptadas(adopcionesRecientes);
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

function mostrarMascotasRecientes(mascotas) {
    const container = document.getElementById('mascotasRecientes');
    if (mascotas.length === 0) {
        container.innerHTML = '<div class="col-span-4 text-center py-8 text-gray-400">No hay mascotas disponibles</div>';
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
            <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full ${mascota.statusPublicacion === 'DISPONIBLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                ${mascota.statusPublicacion || 'N/A'}
            </span>
        </div>
    `).join('');
}

function mostrarSolicitudesPendientes(solicitudes) {
    const container = document.getElementById('solicitudesPendientesList');
    if (solicitudes.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-400">No hay solicitudes pendientes</div>';
        return;
    }
    container.innerHTML = solicitudes.map(solicitud => {
        const nombreMascota = solicitud.mascotaSolicitada?.nombre || 'Mascota no disponible';
        const nombreUsuario = solicitud.usuarioAdoptante?.nombreCompleto || solicitud.usuarioAdoptante?.nombre || 'Usuario no disponible';
        return `
            <div class="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mb-1">Solicitud #${solicitud.idSolicitud}</h3>
                        <p class="text-sm text-gray-600 mb-2">
                            <i class="fas fa-paw mr-1"></i>${nombreMascota}
                        </p>
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-user mr-1"></i>${nombreUsuario}
                        </p>
                    </div>
                    <a href="/decision-solicitud/${solicitud.idSolicitud}" 
                       class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium">
                        Revisar
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function mostrarMascotasAdoptadas(adopciones) {
    const container = document.getElementById('mascotasAdoptadas');
    if (adopciones.length === 0) {
        container.innerHTML = '<div class="col-span-4 text-center py-8 text-gray-400">No hay mascotas adoptadas</div>';
        return;
    }
    container.innerHTML = adopciones.map(adopcion => {
        const mascota = adopcion.mascota || {};
        const adoptante = adopcion.adoptante || {};
        return `
            <div class="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition">
                ${mascota.foto ? 
                    `<img src="${mascota.foto}" alt="${mascota.nombre}" class="w-full h-32 object-cover rounded-lg mb-3">` :
                    `<div class="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <i class="fas fa-paw text-3xl text-gray-400"></i>
                    </div>`
                }
                <h3 class="font-semibold text-gray-800 mb-1">${mascota.nombre || 'Sin nombre'}</h3>
                <p class="text-sm text-gray-500 mb-2">Adoptada por: ${adoptante.nombreCompleto || 'N/A'}</p>
                <div class="flex space-x-2 mt-3">
                    <a href="/adopcion/${adopcion.idAdopcion}" 
                       class="flex-1 bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition text-xs font-medium text-center">
                        <i class="fas fa-eye mr-1"></i>Ver
                    </a>
                    <button onclick="eliminarAdopcion(${adopcion.idAdopcion}, '${mascota.nombre || 'Mascota'}')" 
                            class="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-xs font-medium">
                        <i class="fas fa-trash mr-1"></i>Borrar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function eliminarAdopcion(idAdopcion, nombreMascota) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la adopción de "${nombreMascota}"? La mascota volverá a estar disponible.`)) {
        return;
    }

    try {
        const response = await fetch(`/api/adopciones/${idAdopcion}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert(`Adopción eliminada exitosamente. "${nombreMascota}" ahora está disponible nuevamente.`);
            cargarEstadisticas(); // Recargar estadísticas
        } else {
            const error = await response.text();
            alert('Error al eliminar la adopción: ' + error);
        }
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    }
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    window.location.href = '/';
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarEstadisticas);

