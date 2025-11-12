// JavaScript para listar-solicitudes.html
let todasLasSolicitudes = [];
let esAdmin = false;
let idUsuarioActual = null;

// Cargar solicitudes al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar rol del usuario
    const rol = localStorage.getItem('rol');
    esAdmin = rol === 'ADMIN';
    idUsuarioActual = localStorage.getItem('idUsuario');
    
    // Actualizar título según el rol
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = esAdmin ? 'Todas las Solicitudes' : 'Mis Solicitudes';
    }
    
    cargarSolicitudes();
});

// Función para cargar solicitudes desde la API
async function cargarSolicitudes() {
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await fetch('/api/solicitudes');
        if (response.ok) {
            todasLasSolicitudes = await response.json();
            mostrarSolicitudes(todasLasSolicitudes);
        } else {
            mostrarError('Error al cargar las solicitudes. Inténtalo de nuevo.');
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar solicitudes
function mostrarSolicitudes(solicitudes) {
    const container = document.getElementById('solicitudesContainer');
    const sinSolicitudes = document.getElementById('sinSolicitudes');
    
    // Filtrar solicitudes si no es admin
    let solicitudesFiltradas = solicitudes;
    if (!esAdmin && idUsuarioActual) {
        solicitudesFiltradas = solicitudes.filter(s => {
            const idUsuarioSolicitud = s.usuarioAdoptante?.idUsuario || s.usuarioAdoptante?.id;
            return idUsuarioSolicitud == idUsuarioActual;
        });
    }
    
    const tarjetas = solicitudesFiltradas.map(solicitud => crearTarjetaSolicitud(solicitud)).filter(t => t !== '').join('');
    
    if (tarjetas === '') {
        container.innerHTML = '';
        sinSolicitudes.classList.remove('hidden');
        return;
    }
    
    sinSolicitudes.classList.add('hidden');
    container.innerHTML = tarjetas;
}

// Función para crear una tarjeta de solicitud
function crearTarjetaSolicitud(solicitud) {
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

    const fechaSolicitud = solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES') : 'No especificada';
    const nombreMascota = solicitud.mascotaSolicitada?.nombre || 'Mascota no disponible';
    const nombreUsuario = solicitud.usuarioAdoptante?.nombreCompleto || solicitud.usuarioAdoptante?.nombre || 'Usuario no disponible';

    return `
        <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${estadoColor[solicitud.estadoSolicitud]}">
                            <i class="${estadoIcon[solicitud.estadoSolicitud]} mr-1"></i>
                            ${solicitud.estadoSolicitud}
                        </span>
                        <span class="text-sm text-gray-500">
                            <i class="fas fa-calendar mr-1"></i>${fechaSolicitud}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Solicitud #${solicitud.idSolicitud}</h3>
                    <div class="space-y-2 text-sm text-gray-600">
                        <p><i class="fas fa-paw mr-2"></i><strong>Mascota:</strong> ${nombreMascota}</p>
                        <p><i class="fas fa-user mr-2"></i><strong>Usuario Adoptante:</strong> ${nombreUsuario}</p>
                        ${solicitud.mensajeAdoptante ? 
                            `<p class="mt-2 text-gray-700"><strong>Mensaje:</strong> ${solicitud.mensajeAdoptante}</p>` : ''
                        }
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-2 mt-4">
                <a href="/ver-solicitud/${solicitud.idSolicitud}" 
                   class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium text-center">
                    <i class="fas fa-eye mr-1"></i>Ver Detalles
                </a>
                ${esAdmin && solicitud.estadoSolicitud === 'PENDIENTE' ? 
                    `<a href="/decision-solicitud/${solicitud.idSolicitud}" 
                        class="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm font-medium text-center">
                        <i class="fas fa-gavel mr-1"></i>Tomar Decisión
                    </a>` : ''
                }
            </div>
        </div>
    `;
}

// Función para filtrar solicitudes
function filtrarSolicitudes() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const buscarMascota = document.getElementById('buscarMascota').value.toLowerCase();
    const buscarUsuario = document.getElementById('buscarUsuario').value.toLowerCase();

    let solicitudesParaFiltrar = todasLasSolicitudes;
    
    // Filtrar por usuario actual si no es admin
    if (!esAdmin && idUsuarioActual) {
        solicitudesParaFiltrar = todasLasSolicitudes.filter(solicitud => {
            const idUsuarioSolicitud = solicitud.usuarioAdoptante?.idUsuario || solicitud.usuarioAdoptante?.id;
            return idUsuarioSolicitud == idUsuarioActual;
        });
    }

    const solicitudesFiltradas = solicitudesParaFiltrar.filter(solicitud => {
        const cumpleEstado = !filtroEstado || solicitud.estadoSolicitud === filtroEstado;
        const nombreMascota = (solicitud.mascotaSolicitada?.nombre || '').toLowerCase();
        const nombreUsuario = (solicitud.usuarioAdoptante?.nombreCompleto || solicitud.usuarioAdoptante?.nombre || '').toLowerCase();
        const cumpleMascota = !buscarMascota || nombreMascota.includes(buscarMascota);
        const cumpleUsuario = !buscarUsuario || nombreUsuario.includes(buscarUsuario);
        
        return cumpleEstado && cumpleMascota && cumpleUsuario;
    });

    mostrarSolicitudes(solicitudesFiltradas);
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

