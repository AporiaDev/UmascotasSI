# U-Mascota - Sistema de Gestión de Adopción de Mascotas

Sistema web full-stack para la gestión de adopción de mascotas desarrollado con Spring Boot y React.

## 📁 Estructura del Proyecto

```
umascota/
├── docs/                          # Documentación del proyecto
│   ├── HELP.md                    # Documentación de Spring Boot
│   └── INSTRUCCIONES_INSTALACION.md  # Guía de instalación
├── scripts/                       # Scripts de utilidad
│   └── update-template.js        # Script para actualizar template después del build
├── src/
│   ├── main/
│   │   ├── java/                  # Código fuente Java (Backend)
│   │   │   └── com/example/umascota/
│   │   │       ├── config/        # Configuraciones (OAuth2, Security, etc.)
│   │   │       ├── controller/    # Controladores REST
│   │   │       ├── model/         # Modelos de datos (JPA Entities)
│   │   │       ├── repository/    # Repositorios JPA
│   │   │       ├── service/       # Lógica de negocio
│   │   │       └── util/          # Utilidades (JWT, Password, etc.)
│   │   └── resources/
│   │       ├── react/             # Código fuente React (Frontend)
│   │       │   ├── components/    # Componentes reutilizables
│   │       │   ├── pages/         # Páginas/Vistas
│   │       │   ├── styles/        # Estilos globales
│   │       │   ├── App.jsx        # Componente principal
│   │       │   └── main.jsx       # Punto de entrada
│   │       ├── static/            # Archivos estáticos (compilados)
│   │       │   ├── assets/        # CSS y JS compilados
│   │       │   └── images/        # Imágenes (logo, etc.)
│   │       ├── templates/         # Plantillas Thymeleaf
│   │       └── application.properties  # Configuración de Spring Boot
│   └── test/                      # Tests
├── target/                        # Archivos compilados (generados)
├── node_modules/                  # Dependencias de Node.js
├── pom.xml                        # Configuración Maven
├── package.json                   # Configuración Node.js
├── vite.config.js                 # Configuración Vite
├── tailwind.config.js             # Configuración Tailwind CSS
└── postcss.config.js              # Configuración PostCSS
```

## 🚀 Inicio Rápido

### Requisitos Previos

- **Java 21** o superior
- **Maven** 3.6+
- **Node.js** 16+ y npm
- **MySQL** 8.0+

### Instalación

1. **Clonar el repositorio** (si aplica)

2. **Configurar la base de datos MySQL**:
   - Crear una base de datos llamada `umascotas`
   - Configurar credenciales en `src/main/resources/application.properties`

3. **Instalar dependencias de Node.js**:
   ```bash
   npm install
   ```

4. **Compilar el frontend React**:
   ```bash
   npm run build
   ```

5. **Ejecutar la aplicación Spring Boot**:
   ```bash
   mvn spring-boot:run
   ```

6. **Acceder a la aplicación**:
   - Abre tu navegador en: `http://localhost:8080`

## 📚 Documentación

- **[Instrucciones de Instalación](./docs/INSTRUCCIONES_INSTALACION.md)**: Guía detallada de instalación y configuración
- **[Ayuda de Spring Boot](./docs/HELP.md)**: Documentación oficial de Spring Boot

## 🛠️ Desarrollo

### Modo Desarrollo (Hot Reload)

1. **Terminal 1** - Servidor de desarrollo React:
   ```bash
   npm run dev
   ```
   Accede a `http://localhost:3000`

2. **Terminal 2** - Servidor Spring Boot:
   ```bash
   mvn spring-boot:run
   ```

### Compilar para Producción

```bash
npm run build
```

Esto compilará React y actualizará automáticamente el template de Thymeleaf.

## 🎨 Tecnologías Utilizadas

### Backend
- **Spring Boot 3.x**: Framework Java
- **Spring Data JPA**: Persistencia de datos
- **Spring Security**: Autenticación y autorización
- **OAuth2**: Autenticación con Google
- **JWT**: Tokens de autenticación
- **MySQL**: Base de datos

### Frontend
- **React 18**: Biblioteca de UI
- **React Router**: Enrutamiento
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Framework de estilos
- **PostCSS**: Procesamiento de CSS

## 📝 Scripts Disponibles

- `npm run dev`: Inicia servidor de desarrollo Vite
- `npm run build`: Compila React para producción y actualiza template
- `npm run preview`: Previsualiza la build de producción
- `mvn spring-boot:run`: Ejecuta la aplicación Spring Boot

## 🔐 Configuración de OAuth2 (Google)

Para habilitar el login con Google:

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Configura las credenciales OAuth2
3. Agrega las variables de entorno:
   ```bash
   GOOGLE_CLIENT_ID=tu_client_id
   GOOGLE_CLIENT_SECRET=tu_client_secret
   ```

O configura directamente en `application.properties` (no recomendado para producción).

## 📄 Licencia

Este proyecto es parte del sistema U-Mascota.

## 👥 Contribuidores

- Equipo de desarrollo U-Mascota

