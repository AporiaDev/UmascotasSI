# 🐾 U-Mascota - Plataforma de Adopción de Mascotas

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-green.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-11-orange.svg)](https://www.oracle.com/java/)
[![Thymeleaf](https://img.shields.io/badge/Thymeleaf-3.0-blue.svg)](https://www.thymeleaf.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2.19-38B2AC.svg)](https://tailwindcss.com/)

Una plataforma web moderna y completa diseñada para facilitar el proceso de adopción de mascotas sin hogar en la Universidad Industrial de Santander. Conectamos corazones con patitas, permitiendo que las mascotas encuentren el hogar perfecto y las familias encuentren su compañero ideal.

## 🌟 Características Principales

### 👥 **Para Adoptantes**
- 🔍 **Explorar mascotas disponibles** con filtros avanzados
- ❤️ **Proceso de adopción seguro** con confirmación
- 📊 **Estadísticas en tiempo real** de adopciones
- 🎨 **Interfaz intuitiva** y fácil de usar
- 📱 **Diseño responsive** para móviles y desktop

### 📝 **Para Publicadores**
- ➕ **Publicar mascotas** con información detallada
- 📈 **Gestionar publicaciones** propias
- 📊 **Estadísticas de adopciones** exitosas
- ✏️ **Editar y eliminar** publicaciones
- 🔍 **Filtros personalizados** para sus mascotas

### 🛡️ **Seguridad y Confiabilidad**
- 🔐 **Autenticación segura** con encriptación de contraseñas
- 👤 **Sistema de roles** (Adoptante/Publicador)
- ✅ **Validación de datos** en frontend y backend
- 🔒 **Proceso de adopción** con confirmación

## 🚀 Tecnologías Utilizadas

### **Backend**
- **Spring Boot 2.7.0** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Web** - API REST
- **H2 Database** - Base de datos en memoria
- **Maven** - Gestión de dependencias

### **Frontend**
- **Thymeleaf** - Motor de plantillas
- **Tailwind CSS** - Framework de estilos
- **FontAwesome** - Iconografía
- **JavaScript Vanilla** - Interactividad
- **HTML5** - Estructura semántica

### **Herramientas de Desarrollo**
- **Java 11** - Lenguaje de programación
- **Maven** - Build tool
- **Git** - Control de versiones

## 📋 Requisitos del Sistema

- **Java 11** o superior
- **Maven 3.6** o superior
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación y Configuración

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/UmascotasSI.git
cd UmascotasSI/Umascotas-main/umascota
```

### 2. **Instalar Dependencias**
```bash
mvn clean install
```

### 3. **Ejecutar la Aplicación**
```bash
mvn spring-boot:run
```

### 4. **Acceder a la Aplicación**
Abre tu navegador y visita: `http://localhost:8080`

## 📖 Guía de Uso

### **Primer Uso**

1. **Registrarse**: Crea una cuenta como Adoptante o Publicador
2. **Iniciar Sesión**: Accede con tus credenciales
3. **Explorar**: Navega por las diferentes secciones según tu rol

### **Para Adoptantes**

1. **Buscar Mascotas**: Usa los filtros para encontrar tu mascota ideal
2. **Ver Detalles**: Haz clic en "Ver Detalles" para más información
3. **Adoptar**: Confirma la adopción en el modal de confirmación
4. **Seguimiento**: Ve el estado de tus adopciones en el panel

### **Para Publicadores**

1. **Crear Publicación**: Usa el botón "Nueva Mascota" para publicar
2. **Gestionar**: Edita o elimina tus publicaciones existentes
3. **Estadísticas**: Monitorea el éxito de tus publicaciones
4. **Filtros**: Organiza tus mascotas con filtros personalizados

## 🏗️ Arquitectura del Proyecto

```
umascota/
├── src/main/java/com/example/umascota/
│   ├── controller/          # Controladores REST y MVC
│   │   ├── AuthController.java
│   │   ├── MascotaController.java
│   │   └── ViewController.java
│   ├── model/              # Entidades del dominio
│   │   ├── Mascota.java
│   │   └── Usuario.java
│   ├── repository/         # Repositorios de datos
│   │   ├── MascotaRepository.java
│   │   └── UsuarioRepository.java
│   ├── service/           # Lógica de negocio
│   │   └── UsuarioService.java
│   ├── util/              # Utilidades
│   │   ├── JwtUtil.java
│   │   └── PasswordUtil.java
│   └── Umascota2Application.java
├── src/main/resources/
│   ├── templates/view/     # Plantillas Thymeleaf
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── adoptante.html
│   │   ├── publicador.html
│   │   ├── listar-mascotas.html
│   │   └── crear-mascota.html
│   └── application.properties
└── pom.xml
```

## 🔌 API Endpoints

### **Autenticación**
- `POST /auth/registro` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### **Mascotas**
- `GET /api/mascotas` - Obtener todas las mascotas
- `GET /api/mascotas/disponibles` - Obtener mascotas disponibles
- `GET /api/mascotas/{id}` - Obtener mascota por ID
- `POST /api/mascotas` - Crear nueva mascota
- `PUT /api/mascotas/{id}` - Actualizar mascota
- `PUT /api/mascotas/{id}/adoptar` - Adoptar mascota
- `DELETE /api/mascotas/{id}` - Eliminar mascota

### **Vistas**
- `GET /` - Página de inicio
- `GET /login` - Página de login
- `GET /registro` - Página de registro
- `GET /adoptante` - Panel de adoptante
- `GET /publicador` - Panel de publicador
- `GET /listar-mascotas` - Lista general de mascotas
- `GET /crear-mascota` - Formulario de creación

## 🎨 Diseño y UX

### **Paleta de Colores**
- **Primario**: Azul (#3B82F6)
- **Secundario**: Púrpura (#8B5CF6)
- **Éxito**: Verde (#10B981)
- **Advertencia**: Amarillo (#F59E0B)
- **Error**: Rojo (#EF4444)

### **Características de Diseño**
- **Gradientes modernos** para elementos destacados
- **Iconografía consistente** con FontAwesome
- **Animaciones suaves** en transiciones
- **Diseño responsive** para todos los dispositivos
- **Tipografía clara** y jerarquía visual

## 🧪 Testing

### **Ejecutar Tests**
```bash
mvn test
```

### **Cobertura de Tests**
```bash
mvn jacoco:report
```

## 📊 Base de Datos

### **Entidades Principales**

#### **Usuario**
- `idUsuario` (PK)
- `nombreCompleto`
- `correoElectronico` (Unique)
- `contrasena` (Encriptada)
- `telefono`
- `ciudad`
- `fechaRegistro`
- `tipoUsuario` (ADOPTANTE/PUBLICADOR)

#### **Mascota**
- `idMascota` (PK)
- `nombre`
- `especie`
- `raza`
- `edad`
- `descripcion`
- `estadoSalud`
- `foto`
- `estadoPublicacion` (disponible/adoptado/pendiente)
- `idUsuarioPublica` (FK)

## 🚀 Despliegue

### **Despliegue Local**
```bash
mvn spring-boot:run
```

### **Despliegue con JAR**
```bash
mvn clean package
java -jar target/umascota-0.0.1-SNAPSHOT.jar
```

### **Variables de Entorno**
```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📝 Changelog

### **v1.0.0** (2024)
- ✅ Sistema de autenticación completo
- ✅ Vistas específicas para adoptantes y publicadores
- ✅ Funcionalidad de adopción
- ✅ Diseño moderno y responsive
- ✅ API REST completa
- ✅ Filtros y búsqueda avanzada

## 📞 Contacto

**Desarrollado por**: Bryan - Universidad Industrial de Santander
**Email**: tu-email@uis.edu.co
**Proyecto**: U-Mascota - Conectando Corazones con Patitas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p>Hecho con ❤️ para las mascotas de la UIS</p>
  <p>🐾 U-Mascota - Donde cada patita encuentra su hogar 🏠</p>
</div>
