// Datos de mascotas
        const mascotas = [
            {
                id: 1,
                nombre: 'Luna',
                raza: 'Golden Retriever',
                edad: '2 años',
                vacunado: 'Sí',
                descripcion: 'Perrita amigable y cariñosa, perfecta para familias con niños. Le encanta jugar y es muy obediente.',
                color: 'dorado',
                imagen: 'https://pplx-res.cloudinary.com/image/upload/v1754745727/pplx_project_search_images/dcdb0b04d39ff9b19ae8bdf6fcc32818e59eb70c.png'
            },
            {
                id: 2,
                nombre: 'Max',
                raza: 'Labrador Retriever',
                edad: '8 meses',
                vacunado: 'Sí',
                descripcion: 'Cachorro juguetón y lleno de energía, le encanta correr y jugar al aire libre. Muy sociable con otros perros.',
                color: 'crema',
                imagen: 'https://pplx-res.cloudinary.com/image/upload/v1757048404/pplx_project_search_images/ecd33e1f71a309a31f953892dcddc342b7041ea7.png'
            },
            {
                id: 3,
                nombre: 'Rocky',
                raza: 'Beagle',
                edad: '3 años',
                vacunado: 'Sí',
                descripcion: 'Perro tranquilo y leal, excelente compañero para todas las edades. Muy cariñoso y adaptable.',
                color: 'tricolor',
                imagen: 'https://pplx-res.cloudinary.com/image/upload/v1759766778/pplx_project_search_images/274cae1a6ee7659fc385c8715190943574aac23b.png'
            },
            {
                id: 4,
                nombre: 'Kira',
                raza: 'Husky Siberiano',
                edad: '1 año',
                vacunado: 'Sí',
                descripcion: 'Muy activa y sociable, ideal para personas con estilo de vida dinámico. Le encanta el ejercicio y la aventura.',
                color: 'gris y blanco',
                imagen: 'https://pplx-res.cloudinary.com/image/upload/v1755200326/pplx_project_search_images/a370440ed3571140214b89818ad0fca6fb7152d1.png'
            },
            {
                id: 5,
                nombre: 'Bruno',
                raza: 'Bulldog Francés',
                edad: '4 años',
                vacunado: 'Sí',
                descripcion: 'Cariñoso y adaptable, perfecto para departamentos y espacios pequeños. Tranquilo pero juguetón.',
                color: 'gris',
                imagen: 'https://pplx-res.cloudinary.com/image/upload/v1755006174/pplx_project_search_images/59cb604d50d5e310f28d404349c2c53cf7713061.png'
            }
        ];

        // Variables de estado
        let currentPage = 'home';
        let selectedMascota = null;
        let selectedMonto = null;

        // Función para navegar entre páginas
        function navigateTo(page) {
            // Ocultar todas las páginas
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Mostrar la página seleccionada
            document.getElementById(page).classList.add('active');
            currentPage = page;
            
            // Scroll al inicio
            window.scrollTo(0, 0);
        }

        // Renderizar mascotas
        function renderMascotas() {
            const grid = document.getElementById('mascotasGrid');
            grid.innerHTML = mascotas.map(mascota => `
                <div class="mascota-card">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" class="mascota-image">
                    <div class="mascota-info">
                        <h3 class="mascota-nombre">${mascota.nombre}</h3>
                        <div class="mascota-detalles">
                            <div class="detalle-item">
                                <span class="detalle-label">Raza:</span>
                                <span class="detalle-value">${mascota.raza}</span>
                            </div>
                            <div class="detalle-item">
                                <span class="detalle-label">Edad:</span>
                                <span class="detalle-value">${mascota.edad}</span>
                            </div>
                            <div class="detalle-item">
                                <span class="detalle-label">Vacunado:</span>
                                <span class="detalle-value">${mascota.vacunado}</span>
                            </div>
                        </div>
                        <p class="mascota-descripcion">${mascota.descripcion}</p>
                        <button class="ver-detalles-btn" onclick="openModal(${mascota.id})">Ver Detalles</button>
                    </div>
                </div>
            `).join('');
        }

        // Abrir modal con detalles de mascota
        function openModal(id) {
            selectedMascota = mascotas.find(m => m.id === id);
            if (!selectedMascota) return;

            document.getElementById('modalImage').src = selectedMascota.imagen;
            document.getElementById('modalImage').alt = selectedMascota.nombre;
            document.getElementById('modalNombre').textContent = selectedMascota.nombre;
            document.getElementById('modalRaza').textContent = selectedMascota.raza;
            document.getElementById('modalEdad').textContent = selectedMascota.edad;
            document.getElementById('modalVacunado').textContent = selectedMascota.vacunado;
            document.getElementById('modalColor').textContent = selectedMascota.color;
            document.getElementById('modalDescripcion').textContent = selectedMascota.descripcion;

            document.getElementById('mascotaModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Cerrar modal
        function closeModal() {
            document.getElementById('mascotaModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            selectedMascota = null;
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('mascotaModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Manejar adopción
        function handleAdoptar() {
            if (selectedMascota) {
                alert(`¡Felicidades! Has iniciado el proceso de adopción de ${selectedMascota.nombre}. Pronto nos pondremos en contacto contigo.`);
                closeModal();
            }
        }

        // Manejar formulario de registro
        function handleRegistro(event) {
            event.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
                return;
            }
            
            const formData = new FormData(event.target);
            const nombre = formData.get('nombre');
            
            // Mostrar mensaje de éxito
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = `¡Registro exitoso! Bienvenido/a ${nombre} a UMascotas.`;
            
            const container = document.querySelector('#home .welcome-section');
            container.insertBefore(successMsg, container.firstChild);
            
            // Actualizar nombre de usuario en header
            document.querySelector('.user-section span').textContent = nombre.split(' ')[0];
            
            // Redirigir al home después de 2 segundos
            setTimeout(() => {
                navigateTo('home');
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            }, 2000);
            
            // Limpiar formulario
            event.target.reset();
        }

        // Seleccionar monto de donación
        function selectMonto(monto) {
            selectedMonto = monto;
            
            // Actualizar estilos de botones
            document.querySelectorAll('.monto-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');
            
            // Limpiar campo de otro monto
            document.querySelector('input[name="montoOtro"]').value = '';
        }

        // Manejar formulario de donación
        function handleDonar(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const nombre = formData.get('nombreDonante');
            const montoOtro = formData.get('montoOtro');
            const monto = montoOtro || selectedMonto;
            
            if (!monto) {
                alert('Por favor selecciona o ingresa un monto para donar.');
                return;
            }
            
            alert(`¡Gracias ${nombre}! Tu donación de $${monto} será de gran ayuda para nuestras mascotas. Serás redirigido a la página de pago.`);
            
            // Limpiar formulario
            event.target.reset();
            selectedMonto = null;
            document.querySelectorAll('.monto-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
        }

        // Inicializar la aplicación
        window.addEventListener('DOMContentLoaded', function() {
            renderMascotas();
        });