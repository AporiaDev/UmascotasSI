# Guía de Verificación: Botones de Google en Railway

## Pasos para Verificar y Solucionar

### 1. Verificar que el Script de Google esté en el HTML

**En tu navegador:**
1. Abre tu aplicación en Railway: `https://tu-app.railway.app/login`
2. Click derecho > **"Ver código fuente"** o **"View Page Source"**
3. Busca (Ctrl+F): `accounts.google.com/gsi/client`
4. **Debe aparecer esta línea:**
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```

✅ **Si aparece:** El script está correctamente incluido
❌ **Si NO aparece:** El template no se está usando o no se compiló correctamente

### 2. Verificar Variables de Entorno en Railway

**En Railway Dashboard:**
1. Ve a tu servicio
2. Click en **"Variables"**
3. Verifica que existan:
   - `VITE_GOOGLE_CLIENT_ID` (debe tener el mismo valor que `GOOGLE_CLIENT_ID`)
   - `GOOGLE_CLIENT_ID`

⚠️ **IMPORTANTE:** `VITE_GOOGLE_CLIENT_ID` debe estar configurada **ANTES** del build.

### 3. Verificar en la Consola del Navegador

**En tu navegador:**
1. Abre tu aplicación: `https://tu-app.railway.app/login`
2. Abre la consola (F12 > Console)
3. Recarga la página
4. Busca estos mensajes:

**✅ Si funciona correctamente:**
```
Inicializando Google Sign-In...
Client ID disponible: Sí
Client ID value: 1234567890-abc...
Botón de Google renderizado correctamente
```

**❌ Si hay problemas:**
```
VITE_GOOGLE_CLIENT_ID no está configurado
→ Solución: Agrega VITE_GOOGLE_CLIENT_ID en Railway y haz redeploy

Google Identity Services no está cargado
→ Solución: Verifica que el script esté en el HTML (paso 1)

Timeout: Google Identity Services no se cargó
→ Solución: Problema de red o bloqueador de anuncios
```

### 4. Verificar en la Pestaña Network

**En tu navegador:**
1. Abre DevTools (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Busca: `gsi/client`

**✅ Si aparece:**
- Debe haber una solicitud a `https://accounts.google.com/gsi/client`
- Status debe ser `200` o `304`

**❌ Si NO aparece:**
- El script no se está cargando
- Verifica que esté en el HTML (paso 1)

### 5. Verificar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. Edita tu **OAuth 2.0 Client ID**
4. En **Authorized JavaScript origins**, debe estar:
   - `https://tu-app.railway.app`
   - `http://localhost:8080` (para desarrollo)

### 6. Forzar un Nuevo Build

Si después de verificar todo aún no funciona:

1. **En Railway:**
   - Ve a tu servicio
   - Click en **"Deploy"** > **"Redeploy"**
   - Esto forzará un nuevo build con las variables actuales

2. **O desde Git:**
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push
   ```

### 7. Checklist Final

- [ ] Script de Google visible en el HTML (ver código fuente)
- [ ] `VITE_GOOGLE_CLIENT_ID` configurada en Railway
- [ ] `GOOGLE_CLIENT_ID` configurada en Railway
- [ ] Ambas variables tienen el mismo valor
- [ ] Dominio de Railway en Google Cloud Console
- [ ] Solicitud a `gsi/client` visible en Network tab
- [ ] No hay errores en la consola del navegador
- [ ] El botón aparece después del deploy

## Solución Rápida

Si el botón aún no aparece después de seguir todos los pasos:

1. **Verifica los logs de Railway durante el build:**
   - Debe ejecutar `npm install`
   - Debe ejecutar `npm run build`
   - Debe ejecutar `mvn clean package`

2. **Verifica que `VITE_GOOGLE_CLIENT_ID` esté disponible durante el build:**
   - En Railway, las variables deben estar configuradas **antes** del build
   - Si las agregas después, necesitas hacer un nuevo deploy

3. **Verifica el HTML servido:**
   - El template `react-app.html` debe tener el script
   - El script debe estar presente en el HTML que se sirve

## Contacto

Si después de seguir esta guía el problema persiste, comparte:
- Screenshot de la consola del navegador
- Screenshot de la pestaña Network
- El HTML fuente de la página (ver código fuente)
- Los logs de Railway durante el build

