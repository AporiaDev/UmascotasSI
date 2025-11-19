# Configuración de Railway para U-Mascota

## Variables de Entorno Requeridas

En Railway, necesitas configurar las siguientes variables de entorno:

### Backend (Spring Boot)
- `GOOGLE_CLIENT_ID` - Client ID de Google OAuth (el mismo que usas en el frontend)
- `SPRING_DATASOURCE_URL` - URL completa de conexión a MySQL
- `MYSQLUSER` - Usuario de MySQL
- `MYSQLPASSWORD` - Contraseña de MySQL

### Frontend (Vite/React)
- `VITE_GOOGLE_CLIENT_ID` - **IMPORTANTE**: Debe ser el mismo Client ID que `GOOGLE_CLIENT_ID`

## ⚠️ Importante para el Frontend

**Las variables de entorno que comienzan con `VITE_` deben estar configuradas en Railway ANTES del build.**

Railway ejecutará:
1. `npm install` - Instala dependencias
2. `npm run build` - Compila React (necesita `VITE_GOOGLE_CLIENT_ID` en este momento)
3. `mvn clean package` - Compila Spring Boot

## Pasos de Configuración en Railway

1. **Ve a tu proyecto en Railway**
2. **Sección "Variables"**
3. **Agrega las siguientes variables:**

```
GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
SPRING_DATASOURCE_URL=jdbc:mysql://tu_host:3306/umascotas
MYSQLUSER=tu_usuario
MYSQLPASSWORD=tu_contraseña
```

4. **Asegúrate de que `VITE_GOOGLE_CLIENT_ID` tenga el mismo valor que `GOOGLE_CLIENT_ID`**

5. **Configura los orígenes autorizados en Google Cloud Console:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - APIs & Services > Credentials
   - Edita tu OAuth 2.0 Client ID
   - En "Authorized JavaScript origins", agrega:
     - `https://tu-app.railway.app` (tu dominio de Railway)
     - `http://localhost:8080` (para desarrollo local)

## Verificación

Después del deploy:
1. Ve a tu aplicación en Railway
2. Abre `/login` o `/registro`
3. Deberías ver el botón "Continuar con Google" o "Regístrate con Google"
4. Si no aparece, verifica:
   - Que `VITE_GOOGLE_CLIENT_ID` esté configurado
   - Que el build se haya completado correctamente
   - Revisa los logs de Railway para errores

## Notas

- El archivo `nixpacks.toml` está configurado para construir primero el frontend y luego el backend
- Las variables de entorno de Vite se inyectan durante el build
- Si cambias `VITE_GOOGLE_CLIENT_ID`, necesitas hacer un nuevo deploy para que se refleje

