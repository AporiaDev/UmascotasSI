# 🚀 Publicar Colección de Postman - Guía Rápida

## Método Rápido (Recomendado)

### Paso 1: Obtener tu API Key de Postman

1. Ve a: https://web.postman.com/settings/me/api-keys
2. Haz clic en **"Generate API Key"**
3. Copia la API Key que se genera

### Paso 2: Ejecutar el script

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
.\publicar-postman.ps1 -PostmanApiKey "TU_API_KEY_AQUI"
```

### Paso 3: Publicar manualmente en Postman

1. Ve a https://web.postman.com/
2. Busca la colección **"Umascotas API - Documentación Completa"**
3. Haz clic en los **tres puntos (...)** > **"Publish"**
4. Selecciona **"Public"** como visibilidad
5. Haz clic en **"Publish Collection"**
6. **Copia el enlace público** que se genera

---

## Método Manual (Sin API Key)

### Paso 1: Importar en Postman

1. Abre Postman
2. Click en **"Import"** (esquina superior izquierda)
3. Selecciona el archivo: `Umascotas_API.postman_collection.json`
4. Click en **"Import"**

### Paso 2: Publicar

1. En la barra lateral, encuentra **"Umascotas API - Documentación Completa"**
2. Click en los **tres puntos (...)** junto al nombre
3. Selecciona **"Publish"**
4. Configura:
   - **Visibility**: Public
   - **Collection**: Umascotas API - Documentación Completa
5. Click en **"Publish Collection"**

### Paso 3: Obtener el enlace

Postman te dará una URL como:
```
https://documenter.getpostman.com/view/XXXXXXX/XXXXXXX
```

**Este es tu enlace público** - puedes compartirlo con cualquiera.

---

## 📋 Resumen

- ✅ **29 endpoints** documentados
- ✅ **7 categorías** organizadas
- ✅ **Ejemplos** de request/response
- ✅ **Descripciones** detalladas

## 🔗 Enlaces Útiles

- Postman Web: https://web.postman.com/
- API Keys: https://web.postman.com/settings/me/api-keys
- Documentación Postman: https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/

