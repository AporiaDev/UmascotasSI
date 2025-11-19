# Solución: Botones de Google no aparecen en Railway

## Problema Identificado

Los botones de Google no aparecían porque:
1. El script de Google no estaba en el template de Thymeleaf (usado en producción)
2. La variable `VITE_GOOGLE_CLIENT_ID` podría no estar configurada correctamente

## Solución Aplicada

✅ **Script de Google agregado al template de Thymeleaf**
- El script ahora está en `src/main/resources/templates/view/react-app.html`
- Se agregó logging mejorado para diagnosticar problemas

## Pasos para Deploy en Railway

### 1. Verificar Variables de Entorno en Railway

Asegúrate de tener estas variables configuradas:

```
GOOGLE_CLIENT_ID=tu_client_id_completo_aqui
VITE_GOOGLE_CLIENT_ID=tu_client_id_completo_aqui
SPRING_DATASOURCE_URL=jdbc:mysql://tu_host:3306/umascotas
MYSQLUSER=tu_usuario
MYSQLPASSWORD=tu_contraseña
```

⚠️ **IMPORTANTE**: 
- `VITE_GOOGLE_CLIENT_ID` debe tener **exactamente el mismo valor** que `GOOGLE_CLIENT_ID`
- Ambas deben estar configuradas antes del build

### 2. Verificar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. Edita tu **OAuth 2.0 Client ID**
4. En **Authorized JavaScript origins**, agrega:
   - `https://tu-app.railway.app` (tu dominio de Railway)
   - `http://localhost:8080` (para desarrollo local)
   - `http://localhost:3000` (para desarrollo local con Vite)

5. En **Authorized redirect URIs**, agrega:
   - `https://tu-app.railway.app` (tu dominio de Railway)
   - `http://localhost:8080` (para desarrollo local)

### 3. Hacer el Deploy

1. **Commit y push** de los cambios:
   ```bash
   git add .
   git commit -m "Agregar soporte para Google OAuth en producción"
   git push
   ```

2. Railway detectará los cambios y hará un nuevo build

3. **Verifica los logs de Railway** durante el build:
   - Debe ejecutar `npm install`
   - Debe ejecutar `npm run build` (aquí se inyecta `VITE_GOOGLE_CLIENT_ID`)
   - Debe ejecutar `mvn clean package`

### 4. Verificar que Funcione

1. Abre tu aplicación en Railway
2. Ve a `/login` o `/registro`
3. **Abre la consola del navegador** (F12 > Console)
4. Deberías ver estos mensajes:
   ```
   Inicializando Google Sign-In...
   Client ID disponible: Sí
   Botón de Google renderizado correctamente
   ```

5. Si ves errores, revisa:
   - `VITE_GOOGLE_CLIENT_ID no está configurado` → La variable no está en Railway
   - `Google Identity Services no está cargado` → El script no se cargó
   - `Timeout: Google Identity Services no se cargó` → Problema de red o bloqueador

### 5. Si Aún No Funciona

**Opción A: Verificar que la variable esté disponible durante el build**

En Railway, verifica que `VITE_GOOGLE_CLIENT_ID` esté en la sección de **Variables** y que esté disponible **antes** del build.

**Opción B: Rebuild manual**

1. En Railway, ve a tu servicio
2. Haz clic en **Deploy** > **Redeploy**
3. Esto forzará un nuevo build con las variables actuales

**Opción C: Verificar el HTML compilado**

1. Después del deploy, abre tu aplicación
2. Ve a "Ver código fuente" (Ctrl+U)
3. Busca `accounts.google.com/gsi/client`
4. Si no está, el script no se está incluyendo

## Debugging

### En la Consola del Navegador

Abre la consola (F12) y busca:

✅ **Si funciona correctamente:**
```
Inicializando Google Sign-In...
Client ID disponible: Sí
Botón de Google renderizado correctamente
```

❌ **Si hay problemas:**
```
VITE_GOOGLE_CLIENT_ID no está configurado
→ Solución: Agrega VITE_GOOGLE_CLIENT_ID en Railway

Google Identity Services no está cargado
→ Solución: Verifica que el script esté en el HTML

Timeout: Google Identity Services no se cargó
→ Solución: Verifica conexión a internet o bloqueadores
```

### Verificar el HTML

1. Abre tu aplicación en Railway
2. Click derecho > "Ver código fuente"
3. Busca: `<script src="https://accounts.google.com/gsi/client"`
4. Si no está, el template no se actualizó correctamente

## Checklist Final

- [ ] `VITE_GOOGLE_CLIENT_ID` configurado en Railway
- [ ] `GOOGLE_CLIENT_ID` configurado en Railway
- [ ] Ambas variables tienen el mismo valor
- [ ] Dominio de Railway agregado en Google Cloud Console
- [ ] Script de Google visible en el HTML (ver código fuente)
- [ ] No hay errores en la consola del navegador
- [ ] El botón aparece después del deploy

## Contacto

Si después de seguir estos pasos el botón aún no aparece, revisa los logs de Railway y la consola del navegador para identificar el error específico.

