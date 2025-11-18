# Instrucciones de Instalación - React en U-Mascota

## 📋 Requisitos Previos

1. **Node.js** (versión 16 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **Maven** (ya instalado en el proyecto)
3. **Java 21** (ya configurado en el proyecto)

## 🚀 Pasos de Instalación

### 1. Instalar Dependencias de Node.js

Navega a la carpeta del proyecto Maven:
```bash
cd umascota
```

Instala las dependencias de React y Vite:
```bash
npm install
```

Esto instalará:
- React y React DOM
- React Router DOM
- Vite (build tool)
- Tailwind CSS
- PostCSS y Autoprefixer

### 2. Compilar React para Producción

Una vez instaladas las dependencias, compila la aplicación React:
```bash
npm run build
```

Esto generará los archivos compilados en `src/main/resources/static/`

### 3. Ejecutar la Aplicación

Ejecuta Spring Boot como de costumbre:
```bash
mvn spring-boot:run
```

O desde tu IDE, ejecuta `Umascota2Application.java`

### 4. Acceder a la Aplicación

Abre tu navegador en: `http://localhost:8080`

Las siguientes rutas mostrarán la nueva interfaz React:
- `/` - Página principal
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta

## 🛠️ Desarrollo

### Modo Desarrollo (Hot Module Replacement)

Para desarrollo activo con recarga automática:

1. **Terminal 1** - Inicia Vite en modo desarrollo:
```bash
npm run dev
```
Esto iniciará el servidor de desarrollo en `http://localhost:3000`

2. **Terminal 2** - Inicia Spring Boot:
```bash
mvn spring-boot:run
```

3. **Accede a la app React** en `http://localhost:3000`
   - Los cambios en los archivos React se reflejarán automáticamente
   - El proxy está configurado para redirigir `/auth/*` a Spring Boot en `http://localhost:8080`

```

## 🎨 Características del Diseño

- **Paleta de Verde**: Basada en el logo U-Mascota
  - Verde Principal: `#4ADE80`
  - Verde Oscuro: `#22C55E`
  - Verde Claro: `#86EFAC`

- **Estilo Apple**: 
  - Diseño minimalista y limpio
  - Glassmorphism (efectos de vidrio)
  - Animaciones suaves
  - Tipografía Inter

- **Componentes Incluidos**:
  - Logo personalizado de U-Mascota
  - Botones estilo Apple
  - Tarjetas con glassmorphism
  - Inputs modernos
  - Sistema de diseño consistente

## ⚠️ Notas Importantes

1. **Primera vez**: Debes ejecutar `npm install` antes de compilar
2. **Después de cambios en React**: Ejecuta `npm run build` para actualizar los archivos estáticos
3. **En desarrollo**: Usa `npm run dev` para ver cambios en tiempo real
4. **Archivos compilados**: Se generan en `src/main/resources/static/` y son servidos por Spring Boot

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"
- Instala Node.js desde https://nodejs.org/
- Reinicia tu terminal después de la instalación

### Error: "Cannot find module"
- Ejecuta `npm install` nuevamente
- Verifica que estás en la carpeta `umascota`

### Los cambios no se reflejan
- En desarrollo: Usa `npm run dev` y accede a `http://localhost:3000`
- En producción: Ejecuta `npm run build` después de cada cambio

### Error de conexión con el backend
- Verifica que Spring Boot esté corriendo en `http://localhost:8080`
- En desarrollo, el proxy de Vite redirige `/auth/*` automáticamente

