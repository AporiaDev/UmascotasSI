let todasLasAdopciones = [];
let esAdmin = false;
let idUsuarioActual = null;

// Cargar adopciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar rol del usuario
    const rol = localStorage.getItem('rol');
    esAdmin = rol === 'ADMIN';
    idUsuarioActual = localStorage.getItem('idUsuario');

    // Mostrar enlaces de dashboard según el rol
    if (esAdmin) {
        document.getElementById('linkDashboardAdmin').style.display = 'block';
    } else {
        document.getElementById('linkDashboardUsuario').style.display = 'block';
    }

    cargarAdopciones();
});

// Función para cargar adopciones desde la API
async function cargarAdopciones() {
    mostrarLoading(true);
    ocultarError();

    try {
        const response = await fetch('/api/adopciones');
        if (response.ok) {
            const data = await response.json();
            todasLasAdopciones = Array.isArray(data) ? data : [];
            mostrarAdopciones(todasLasAdopciones);
        } else {
            const errorText = await response.text();
            mostrarError('Error al cargar las adopciones: ' + errorText);
        }
    } catch (error) {
        console.error('Error cargando adopciones:', error);
        mostrarError('Error de conexión: ' + (error.message || 'Error desconocido'));
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar adopciones
function mostrarAdopciones(adopciones) {
    const container = document.getElementById('adopcionesContainer');
    const sinAdopciones = document.getElementById('sinAdopciones');

    // Filtrar adopciones si no es admin (mostrar solo las del usuario)
    let adopcionesFiltradas = adopciones;
    if (!esAdmin && idUsuarioActual) {
        adopcionesFiltradas = adopciones.filter(adopcion => {
            const idUsuarioAdopcion = adopcion.adoptante?.idUsuario || adopcion.adoptante?.id;
            return idUsuarioAdopcion == idUsuarioActual;
        });
    }

    const tarjetas = adopcionesFiltradas.map(adopcion => crearTarjetaAdopcion(adopcion)).filter(t => t !== '').join('');

    if (tarjetas === '') {
        container.innerHTML = '';
        sinAdopciones.classList.remove('hidden');
        return;
    }

    sinAdopciones.classList.add('hidden');
    container.innerHTML = tarjetas;
}

// Función para crear una tarjeta de adopción
function crearTarjetaAdopcion(adopcion) {
    const fechaAdopcion = adopcion.fechaAdopcion ? new Date(adopcion.fechaAdopcion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'No especificada';
    
    const nombreMascota = adopcion.mascota?.nombre || 'Mascota no disponible';
    const nombreAdoptante = adopcion.adoptante?.nombreCompleto || 'Usuario no disponible';
    const especieMascota = adopcion.mascota?.especie || 'No especificada';
    const razaMascota = adopcion.mascota?.raza || 'No especificada';

    return `
        <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 adopcion-card">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="badge-adopcion bg-green-100 text-green-800">
                            <i class="fas fa-heart mr-1"></i>
                            Adopción Completada
                        </span>
                        <span class="fecha-adopcion">
                            <i class="fas fa-calendar mr-1"></i>${fechaAdopcion}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Adopción #${adopcion.idAdopcion}</h3>
                    <div class="space-y-2 text-sm text-gray-600">
                        <p><i class="fas fa-paw mr-2"></i><strong>Mascota:</strong> ${nombreMascota}</p>
                        <p><i class="fas fa-dna mr-2"></i><strong>Especie:</strong> ${especieMascota}</p>
                        <p><i class="fas fa-dog mr-2"></i><strong>Raza:</strong> ${razaMascota}</p>
                        <p><i class="fas fa-user mr-2"></i><strong>Adoptante:</strong> ${nombreAdoptante}</p>
                    </div>
                    ${adopcion.notas ?
                        `<p class="mt-3 text-gray-700 text-sm"><strong>Notas:</strong> ${adopcion.notas}</p>` : ''
                    }
                </div>
            </div>

            <div class="flex space-x-2 mt-4">
                <a href="/adopcion/${adopcion.idAdopcion}"
                   class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium text-center">
                    <i class="fas fa-eye mr-1"></i>Ver Detalles
                </a>
                ${adopcion.mascota?.idMascota ?
                    `<a href="/mascota/${adopcion.mascota.idMascota}"
                        class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium text-center">
                        <i class="fas fa-paw mr-1"></i>Ver Mascota
                    </a>` : ''
                }
                ${esAdmin ?
                    `<button onclick="eliminarAdopcion(${adopcion.idAdopcion}, '${nombreMascota}')"
                        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm font-medium">
                        <i class="fas fa-trash mr-1"></i>Borrar
                    </button>` : ''
                }
            </div>
        </div>
    `;
}

// Función para filtrar adopciones
function filtrarAdopciones() {
    const buscarMascota = document.getElementById('buscarMascota').value.toLowerCase();
    const buscarAdoptante = document.getElementById('buscarAdoptante').value.toLowerCase();
    const filtroFecha = document.getElementById('filtroFecha').value;

    let adopcionesFiltradas = todasLasAdopciones;

    // Filtrar por usuario actual si no es admin
    if (!esAdmin && idUsuarioActual) {
        adopcionesFiltradas = adopcionesFiltradas.filter(adopcion => {
            const idUsuarioAdopcion = adopcion.adoptante?.idUsuario || adopcion.adoptante?.id;
            return idUsuarioAdopcion == idUsuarioActual;
        });
    }

    // Aplicar filtros de búsqueda
    adopcionesFiltradas = adopcionesFiltradas.filter(adopcion => {
        const nombreMascota = (adopcion.mascota?.nombre || '').toLowerCase();
        const nombreAdoptante = (adopcion.adoptante?.nombreCompleto || '').toLowerCase();
        
        const cumpleMascota = !buscarMascota || nombreMascota.includes(buscarMascota);
        const cumpleAdoptante = !buscarAdoptante || nombreAdoptante.includes(buscarAdoptante);

        return cumpleMascota && cumpleAdoptante;
    });

    // Ordenar por fecha
    if (filtroFecha === 'reciente') {
        adopcionesFiltradas.sort((a, b) => {
            const fechaA = a.fechaAdopcion ? new Date(a.fechaAdopcion).getTime() : 0;
            const fechaB = b.fechaAdopcion ? new Date(b.fechaAdopcion).getTime() : 0;
            return fechaB - fechaA;
        });
    } else if (filtroFecha === 'antigua') {
        adopcionesFiltradas.sort((a, b) => {
            const fechaA = a.fechaAdopcion ? new Date(a.fechaAdopcion).getTime() : 0;
            const fechaB = b.fechaAdopcion ? new Date(b.fechaAdopcion).getTime() : 0;
            return fechaA - fechaB;
        });
    }

    mostrarAdopciones(adopcionesFiltradas);
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

// Función para eliminar adopción (solo admin)
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
            cargarAdopciones(); // Recargar la lista
        } else {
            const error = await response.text();
            alert('Error al eliminar la adopción: ' + error);
        }
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    }
}
