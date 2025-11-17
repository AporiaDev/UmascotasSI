// JavaScript para login.html
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.add('hidden');

    const correo = document.querySelector('input[name="correoElectronico"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;

    const data = {
        correoElectronico: correo,
        contrasena: contrasena
    };

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Guardar token en localStorage
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('rol', result.rol);
                localStorage.setItem('idUsuario', result.idUsuario);
            }
            
            // Redirigir según el rol
            if (result.rol === 'ADMIN') {
                window.location.href = "/dashboard-admin";
            } else {
                window.location.href = "/dashboard-usuario";
            }
        } else {
            errorDiv.textContent = result.message || 'Error al iniciar sesión';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = 'Error de conexión. Por favor, intenta nuevamente.';
        errorDiv.classList.remove('hidden');
    }
});
