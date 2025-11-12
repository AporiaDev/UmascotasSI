// JavaScript para listar-mascotas.html
let todasLasMascotas = [];
let esAdmin = false;
let verAdoptadas = false;

// Cargar mascotas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es admin
    const rol = localStorage.getItem('rol');
    esAdmin = rol === 'ADMIN';
    
    // Mostrar botón de ver adoptadas solo si es admin
    if (esAdmin) {
        document.getElementById('filtroAdoptadas').style.display = 'block';
    }
    
    cargarMascotas();
});

// Función para cargar mascotas desde la API
async function cargarMascotas() {
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await fetch('/api/mascotas');
        if (response.ok) {
            const data = await response.json();
            // Asegurar que sea un array
            todasLasMascotas = Array.isArray(data) ? data : [];
            mostrarMascotas(todasLasMascotas);
        } else {
            const errorText = await response.text();
            mostrarError('Error al cargar las mascotas: ' + errorText);
        }
    } catch (error) {
        console.error('Error cargando mascotas:', error);
        mostrarError('Error de conexión: ' + (error.message || 'Error desconocido'));
    } finally {
        mostrarLoading(false);
    }
}

// Función para mostrar mascotas
function mostrarMascotas(mascotas) {
    const container = document.getElementById('mascotasContainer');
    const sinMascotas = document.getElementById('sinMascotas');
    
    // Filtrar mascotas según el modo de visualización
    let mascotasFiltradas = mascotas;
    
    if (verAdoptadas && esAdmin) {
        // Si está en modo "ver adoptadas", mostrar solo adoptadas
        mascotasFiltradas = mascotas.filter(mascota => {
            const estado = (mascota.statusPublicacion || mascota.estadoPublicacion || '').toUpperCase();
            return estado === 'ADOPTADA';
        });
    } else {
        // Por defecto, NUNCA mostrar mascotas adoptadas en la lista normal
        // (ni para admin ni para usuarios regulares, a menos que estén en modo "ver adoptadas")
        mascotasFiltradas = mascotas.filter(mascota => {
            const estado = (mascota.statusPublicacion || mascota.estadoPublicacion || '').toUpperCase();
            return estado !== 'ADOPTADA';
        });
    }
    
    if (mascotasFiltradas.length === 0) {
        container.innerHTML = '';
        sinMascotas.classList.remove('hidden');
        return;
    }
    
    sinMascotas.classList.add('hidden');
    container.innerHTML = mascotasFiltradas.map(mascota => crearTarjetaMascota(mascota)).join('');
}

// Función para alternar entre ver todas las mascotas y solo adoptadas
function toggleVerAdoptadas() {
    verAdoptadas = !verAdoptadas;
    const btn = document.getElementById('btnVerAdoptadas');
    
    if (verAdoptadas) {
        btn.innerHTML = '<i class="fas fa-list mr-1"></i>Ver Todas';
        btn.className = 'w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500';
    } else {
        btn.innerHTML = '<i class="fas fa-heart mr-1"></i>Ver Adoptadas';
        btn.className = 'w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500';
    }
    
    mostrarMascotas(todasLasMascotas);
}

// Función para crear una tarjeta de mascota
function crearTarjetaMascota(mascota) {
    // Validar que mascota existe
    if (!mascota) {
        console.error('Mascota es null o undefined');
        return '';
    }

    const estadoColor = {
        'DISPONIBLE': 'bg-green-100 text-green-800',
        'ADOPTADA': 'bg-blue-100 text-blue-800',
        'RESERVADA': 'bg-yellow-100 text-yellow-800',
        'NO_DISPONIBLE': 'bg-gray-100 text-gray-800'
    };

    const estadoIcon = {
        'DISPONIBLE': 'fas fa-check-circle',
        'ADOPTADA': 'fas fa-heart',
        'RESERVADA': 'fas fa-clock',
        'NO_DISPONIBLE': 'fas fa-ban'
    };
    
    // Normalizar el estado a mayúsculas - manejar ambos nombres posibles
    const estadoValue = mascota.statusPublicacion || mascota.estadoPublicacion || 'NO_DISPONIBLE';
    const estado = String(estadoValue).toUpperCase();

    return `
        <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden mascota-card">
            <div class="relative">
                ${mascota.foto ? 
                    `<img src="${mascota.foto}" alt="${mascota.nombre}" class="w-full h-48 object-cover">` :
                    `<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-paw text-4xl text-gray-400"></i>
                    </div>`
                }
                <div class="absolute top-2 right-2">
                    <span class="estado-badge ${estadoColor[estado] || 'bg-gray-100 text-gray-800'}">
                        <i class="${estadoIcon[estado] || 'fas fa-question'} mr-1"></i>
                        ${estado === 'DISPONIBLE' ? 'Disponible' : estado === 'ADOPTADA' ? 'Adoptada' : estado === 'RESERVADA' ? 'Reservada' : estado === 'NO_DISPONIBLE' ? 'No Disponible' : estado}
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${mascota.nombre || 'Sin nombre'}</h3>
                <div class="space-y-2 text-sm text-gray-600">
                    <p><i class="fas fa-paw mr-2"></i><strong>Especie:</strong> ${mascota.especie || 'No especificada'}</p>
                    <p><i class="fas fa-dna mr-2"></i><strong>Raza:</strong> ${mascota.raza || 'No especificada'}</p>
                    <p><i class="fas fa-calendar-alt mr-2"></i><strong>Edad:</strong> ${mascota.edad ? mascota.edad + ' años' : 'No especificada'}</p>
                    <p><i class="fas fa-heartbeat mr-2"></i><strong>Salud:</strong> ${mascota.estadoSalud || 'No especificada'}</p>
                </div>
                
                ${mascota.descripcion ? 
                    `<p class="mt-3 text-gray-700 text-sm line-clamp-2">${mascota.descripcion}</p>` : ''
                }
                
                <div class="mt-4 flex space-x-2">
                    <a href="/mascota/${mascota.idMascota}" 
                       class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium text-center">
                        <i class="fas fa-eye mr-1"></i>Ver Detalles
                    </a>
                    ${estado === 'DISPONIBLE' ? 
                        `<a href="/crear-solicitud/${mascota.idMascota}" 
                            class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium text-center">
                            <i class="fas fa-heart mr-1"></i>Adoptar
                        </a>` : ''
                    }
                </div>
            </div>
        </div>
    `;
}

// Función para filtrar mascotas
function filtrarMascotas() {
    const filtroEspecie = document.getElementById('filtroEspecie').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    const buscarNombre = document.getElementById('buscarNombre').value.toLowerCase();

    let mascotasParaFiltrar = todasLasMascotas;
    
    // Filtrar mascotas adoptadas si no está en modo "ver adoptadas"
    if (!verAdoptadas || !esAdmin) {
        mascotasParaFiltrar = todasLasMascotas.filter(mascota => {
            const estado = (mascota.statusPublicacion || mascota.estadoPublicacion || '').toUpperCase();
            return estado !== 'ADOPTADA';
        });
    }

    const mascotasFiltradas = mascotasParaFiltrar.filter(mascota => {
        if (!mascota) return false;
        
        const cumpleEspecie = !filtroEspecie || (mascota.especie && mascota.especie === filtroEspecie);
        const estadoValue = mascota.statusPublicacion || mascota.estadoPublicacion || 'NO_DISPONIBLE';
        const estadoMascota = String(estadoValue).toUpperCase();
        const filtroEstadoUpper = filtroEstado ? String(filtroEstado).toUpperCase() : '';
        const cumpleEstado = !filtroEstado || estadoMascota === filtroEstadoUpper;
        const nombreMascota = mascota.nombre ? String(mascota.nombre).toLowerCase() : '';
        const cumpleNombre = !buscarNombre || nombreMascota.includes(buscarNombre);
        
        return cumpleEspecie && cumpleEstado && cumpleNombre;
    });

    mostrarMascotas(mascotasFiltradas);
}

// Función para ver detalles de una mascota (redirige a la vista completa)
function verDetalles(idMascota) {
    window.location.href = `/mascota/${idMascota}`;
}

// Función para cerrar modal
function cerrarModal() {
    document.getElementById('modalDetalles').classList.add('hidden');
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

