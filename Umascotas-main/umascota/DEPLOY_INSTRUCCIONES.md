# Instrucciones de Deploy para Railway

## Problema: Los botones de Google no aparecen después del deploy

El problema es que Railway podría no estar ejecutando `npm run build` antes de compilar con Maven, por lo que los cambios en React no se están compilando.

## Solución

### Opción 1: Usar railway.json (Recomendado)

Railway debería detectar automáticamente el archivo `railway.json` que especifica el orden correcto del build.

### Opción 2: Configurar Build Command en Railway

1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Ve a **Settings** > **Build**
4. En **Build Command**, asegúrate de que esté:
   ```
   npm install && npm run build && mvn clean package -DskipTests
   ```

### Opción 3: Verificar que nixpacks.toml se use

Railway debería detectar automáticamente `nixpacks.toml` si está en la raíz del proyecto.

## Verificación del Build

Después del deploy, verifica los logs de Railway. Deberías ver:

1. ✅ `npm install` - Instalando dependencias
2. ✅ `npm run build` - Compilando React (esto es CRÍTICO)
3. ✅ `mvn clean package` - Compilando Spring Boot

Si NO ves `npm run build` en los logs, el problema es que Railway no está ejecutando el build de React.

## Verificación en el Navegador

Después del deploy:

1. Abre: `https://umascotassi-production.up.railway.app/login`
2. Abre la consola (F12 > Console)
3. Busca estos mensajes:
   ```
   Inicializando Google Sign-In...
   Client ID disponible: Sí
   Client ID value: 845856161916-7q8110...
   Botón de Google renderizado correctamente
   ```

4. **Verifica el HTML:**
   - Click derecho > "Ver código fuente"
   - Busca: `window.GOOGLE_CLIENT_ID`
   - Debe aparecer: `window.GOOGLE_CLIENT_ID = '845856161916-7q811079a7lgii3gn3656f01f2l5uaut.apps.googleusercontent.com';`

## Si el Botón Aún No Aparece

### 1. Verifica que los archivos compilados se actualizaron

Los archivos en `src/main/resources/static/` deben tener los cambios más recientes. Si no, el build de React no se ejecutó.

### 2. Forzar un nuevo build completo

En Railway:
1. Ve a **Deployments**
2. Click en **Redeploy** en el último deployment
3. O haz un commit vacío:
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push
   ```

### 3. Verifica las variables de entorno

En Railway, asegúrate de que `GOOGLE_CLIENT_ID` tenga exactamente:
```
845856161916-7q811079a7lgii3gn3656f01f2l5uaut.apps.googleusercontent.com
```

### 4. Verifica Google Cloud Console

Asegúrate de que tu dominio de Railway esté en:
- **Authorized JavaScript origins**: `https://umascotassi-production.up.railway.app`
- **Authorized redirect URIs**: `https://umascotassi-production.up.railway.app`

## Debugging

Si después de todo esto el botón no aparece:

1. **Abre la consola del navegador** y comparte los mensajes que ves
2. **Verifica el HTML fuente** y busca `window.GOOGLE_CLIENT_ID`
3. **Revisa los logs de Railway** durante el build para ver si `npm run build` se ejecutó

