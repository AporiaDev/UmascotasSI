# Configuración de Autenticación con Google OAuth

Esta guía te ayudará a configurar la autenticación con Google en la aplicación U-Mascota.

## Requisitos Previos

1. Una cuenta de Google
2. Acceso a [Google Cloud Console](https://console.cloud.google.com/)

## Pasos para Configurar Google OAuth

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra tu proyecto (ej: "U-Mascota")

### 2. Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google+ API" o "Google Identity Services"
3. Haz clic en **Enable**

### 3. Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo de aplicación: **External**
   - Nombre de la aplicación: **U-Mascota**
   - Email de soporte: tu email
   - Dominios autorizados: deja vacío por ahora
   - Guarda y continúa
4. Para el tipo de aplicación, selecciona **Web application**
5. Configura:
   - **Name**: U-Mascota Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desarrollo)
     - `http://localhost:8080` (producción local)
     - Tu dominio de producción (ej: `https://tudominio.com`)
   - **Authorized redirect URIs**: 
     - `http://localhost:3000` (desarrollo)
     - `http://localhost:8080` (producción local)
     - Tu dominio de producción
6. Haz clic en **Create**
7. **Copia el Client ID** que se muestra (lo necesitarás después)

### 4. Configurar Variables de Entorno

#### Backend (Spring Boot)

Tienes dos opciones:

**Opción 1: Variable de Entorno (Recomendado para producción)**

```bash
export GOOGLE_CLIENT_ID=tu_client_id_aqui
```

En Windows (PowerShell):
```powershell
$env:GOOGLE_CLIENT_ID="tu_client_id_aqui"
```

**Opción 2: application.properties**

Edita `src/main/resources/application.properties`:

```properties
GOOGLE_CLIENT_ID=tu_client_id_aqui
```

⚠️ **Nota**: No recomendado para producción, ya que expone credenciales en el código.

#### Frontend (React/Vite)

Crea un archivo `.env` en la raíz del proyecto `umascota/`:

```env
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
```

⚠️ **Importante**: 
- El archivo `.env` debe estar en la raíz del proyecto (donde está `package.json`)
- Las variables de entorno en Vite deben comenzar con `VITE_`
- Reinicia el servidor de desarrollo después de crear/modificar el archivo `.env`

### 5. Verificar la Configuración

1. **Backend**: Asegúrate de que la variable `GOOGLE_CLIENT_ID` esté configurada
2. **Frontend**: Asegúrate de que el archivo `.env` contenga `VITE_GOOGLE_CLIENT_ID`
3. Reinicia ambos servidores:
   - Backend: `mvn spring-boot:run`
   - Frontend: `npm run dev`

### 6. Probar la Autenticación

1. Ve a la página de login: `http://localhost:3000/login`
2. Deberías ver un botón "Continuar con Google"
3. Haz clic en el botón y selecciona una cuenta de Google
4. Deberías ser redirigido al dashboard correspondiente

## Solución de Problemas

### El botón de Google no aparece

- Verifica que el script de Google se haya cargado (revisa la consola del navegador)
- Asegúrate de que `VITE_GOOGLE_CLIENT_ID` esté configurado correctamente
- Reinicia el servidor de desarrollo

### Error: "GOOGLE_CLIENT_ID no está configurado"

- Verifica que la variable de entorno esté configurada en el backend
- Reinicia el servidor de Spring Boot
- Verifica que no haya espacios en blanco en el Client ID

### Error: "Token de Google inválido"

- Verifica que el Client ID en el frontend coincida con el del backend
- Asegúrate de que los orígenes autorizados incluyan tu URL actual
- Verifica que la API de Google Identity Services esté habilitada

### Error de CORS

- Asegúrate de que los orígenes autorizados en Google Cloud Console incluyan tu URL
- Verifica la configuración del proxy en `vite.config.js`

## Seguridad

- ⚠️ **Nunca** commits el archivo `.env` con credenciales reales
- Usa variables de entorno en producción
- Mantén tus credenciales seguras y no las compartas públicamente
- Considera usar un gestor de secretos para producción (AWS Secrets Manager, Azure Key Vault, etc.)

## Recursos Adicionales

- [Documentación de Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Guía de OAuth 2.0 de Google](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

