# Publicar Colección de Postman

## Opción 1: Publicar en Postman (Recomendado)

### Pasos para publicar y obtener el enlace:

1. **Abre Postman** y haz clic en **"Import"** (botón superior izquierdo)

2. **Importa la colección:**
   - Selecciona el archivo `Umascotas_API.postman_collection.json`
   - Haz clic en **"Import"**

3. **Publica la colección:**
   - En la barra lateral izquierda, encuentra la colección **"Umascotas API - Documentación Completa"**
   - Haz clic en los **tres puntos (...)** junto al nombre de la colección
   - Selecciona **"Publish"** o **"Share"** > **"Publish"**

4. **Configura la publicación:**
   - **Collection**: Selecciona "Umascotas API - Documentación Completa"
   - **Environment**: Opcional (puedes crear uno con la variable `base_url`)
   - **Visibility**: Selecciona **"Public"** para que sea accesible públicamente
   - Haz clic en **"Publish Collection"**

5. **Obtén el enlace:**
   - Postman te proporcionará una URL pública como:
     ```
     https://documenter.getpostman.com/view/XXXXXXX/XXXXXXX
     ```
   - Este enlace será público y podrás compartirlo

## Opción 2: Compartir como archivo JSON

Si prefieres compartir el archivo directamente:

1. El archivo está en: `Umascotas-main/umascota/Umascotas_API.postman_collection.json`
2. Puedes subirlo a:
   - GitHub (en el repositorio)
   - Google Drive
   - Dropbox
   - Cualquier servicio de hosting de archivos

## Opción 3: Usar Postman Public API (Avanzado)

Si tienes una cuenta de Postman con API key, puedes usar este script:

```bash
# Instalar Postman CLI (si no lo tienes)
npm install -g newman

# O usar la API de Postman directamente
curl -X POST \
  https://api.getpostman.com/collections \
  -H 'X-Api-Key: TU_API_KEY' \
  -H 'Content-Type: application/json' \
  -d @Umascotas_API.postman_collection.json
```

## Importar en Postman

Para importar la colección:

1. Abre Postman
2. Click en **"Import"** (esquina superior izquierda)
3. Selecciona **"File"** o **"Upload Files"**
4. Selecciona `Umascotas_API.postman_collection.json`
5. Click en **"Import"**

## Configurar Variable de Entorno

Después de importar:

1. Crea un nuevo Environment (opcional pero recomendado)
2. Agrega la variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:8080`
   - **Current Value**: `http://localhost:8080` (o tu URL de producción)

## Notas

- La colección incluye **29 endpoints** documentados
- Todos los endpoints tienen descripciones y ejemplos
- Los endpoints están organizados por categorías
- La variable `base_url` se puede cambiar según el entorno (desarrollo/producción)

