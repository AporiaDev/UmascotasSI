// JavaScript para register.html
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    const data = {
        nombreCompleto: e.target.nombreCompleto.value,
        correoElectronico: e.target.correoElectronico.value,
        contrasena: e.target.contrasena.value,
        telefono: e.target.telefono.value,
        ciudad: e.target.ciudad.value,
        tipoUsuario: e.target.tipoUsuario.value
    };

    try {
        const response = await fetch('/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            successDiv.textContent = '¡Cuenta creada exitosamente! Redirigiendo...';
            successDiv.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            errorDiv.textContent = result.message || 'Error al crear la cuenta';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = 'Error de conexión. Por favor, intenta nuevamente.';
        errorDiv.classList.remove('hidden');
    }
});