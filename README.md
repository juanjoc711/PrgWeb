
# 📚 **Gestor de Asociaciones Universitarias**

Esta aplicación permite la gestión de **asociaciones universitarias** facilitando la creación, administración y participación en asociaciones. Además, cuenta con un **sistema de chat** implementado para que los usuarios puedan comunicarse en tiempo real dentro de las asociaciones.

## 🚀 **Características Principales**
1. **Autenticación y Gestión de Usuarios**:
   - Registro de usuarios.
   - Inicio de sesión seguro con JWT.
   - Posibilidad de cambiar el nombre de usuario y contraseña.

2. **Gestión de Asociaciones**:
   - Creación, visualización, edición y eliminación de asociaciones.
   - Los usuarios pueden unirse o abandonar asociaciones.

3. **Foro/Chat de Asociaciones**:
   - Los usuarios pueden enviar mensajes en las asociaciones a las que pertenecen.
   - **Extensibilidad**: El backend ya cuenta con las funcionalidades para editar, borrar y actualizar mensajes, pero estas características aún no están desarrolladas en el frontend. Actualmente, los mensajes son permanentes.

---

## 💻 **Requisitos y Configuración**

### **Requisitos Previos**
- **Docker** y **Docker Compose** instalados.
- **Node.js** y **npm** (opcional si no usas Docker).

---

### **Cómo Ejecutar la Aplicación con Docker**
1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/juanjoc711/PrgWeb.git
   cd PrgWeb
   ```

2. **Levantar los Contenedores**:
   ```bash
   docker-compose up --build
   ```

3. **Acceso a los Servicios**:
   - **Backend**: `http://localhost:3000`
   - **Frontend**: `http://localhost:8080`
   - **MongoDB**: `mongodb://localhost:27020`
   - **Documentación Swagger**: `http://localhost:3000/api-docs`

---

## 🛠️ **Tecnologías y Arquitectura**

### **Arquitectura Usada**
La aplicación sigue una arquitectura **cliente-servidor** con **separación de responsabilidades**:

1. **Frontend**:
   - Desarrollado en **HTML, CSS y JavaScript**.
   - Organización de vistas y componentes:
     - **General**: Listado de asociaciones y gestión principal.
     - **Detalles**: Visualización de una asociación específica con chat.
     - **Mis Asociaciones**: Sección donde el usuario puede ver y gestionar sus asociaciones.
   - **Bootstrap**: Para diseño responsivo y modals.

2. **Backend**:
   - Desarrollado con **Node.js** y **Express.js**.
   - Base de datos en **MongoDB**.
   - Rutas principales:
     - **Autenticación**: Registro e inicio de sesión.
     - **Asociaciones**: CRUD de asociaciones.
     - **Mensajes**: CRUD de mensajes dentro de asociaciones.
   - **Documentación con Swagger** disponible en `http://localhost:3000/api-docs`.

3. **Docker**:
   - Se han configurado contenedores independientes para:
     - Backend.
     - Frontend.
     - MongoDB.
   - Docker Compose facilita la orquestación de estos contenedores.

4. **Persistencia de Datos**:
   - Volúmenes de Docker utilizados para **subida de imágenes** y **almacenamiento de datos MongoDB**.
### **Diagrama de arquitectura:**
![image](https://github.com/user-attachments/assets/6ce57216-caf2-478e-9ce8-a5e43ae8f502)

---

# Estructura del Proyecto

Este repositorio contiene el **frontend** y el **backend** de una aplicación web para la gestión de asociaciones y mensajes. A continuación se detalla la estructura del proyecto.

---

## 📂 **Backend (src)**
La carpeta `src` contiene todo el código relacionado con el servidor, la API y la lógica del backend.

```
src/
│
├── config/                   # Configuración general del backend
│   ├── constants.js          # Variables y constantes globales
│   └── database.js           # Configuración de la conexión a la base de datos MongoDB
│
├── constants/                # Mensajes y textos globales
│   └── messages.js           # Mensajes de error y éxito para la API
│
├── controllers/              # Lógica de negocio para la API
│   ├── associationController.js # Controlador para asociaciones
│   ├── authController.js         # Controlador para autenticación
│   └── messagesController.js     # Controlador para mensajes
│
├── middleware/               # Middlewares (verificaciones, permisos)
│   ├── auth.js               # Middleware para autenticación JWT
│   ├── checkRole.js          # Middleware para roles (admin, user)
│   └── upload.js             # Middleware para gestión de archivos
│
├── models/                   # Modelos de Mongoose (MongoDB)
│   ├── Association.js        # Modelo de asociación
│   ├── Message.js            # Modelo de mensaje
│   └── User.js               # Modelo de usuario
│
├── routes/                   # Definición de rutas para la API
│   ├── associations.js       # Rutas para asociaciones
│   ├── auth.js               # Rutas de autenticación
│   └── messagesRoutes.js     # Rutas para mensajes
│
├── uploads/                  # Carpeta donde se guardan los archivos subidos
│
├── swagger.yaml              # Documentación de la API con Swagger
│
├── server.js                 # Punto de entrada principal del servidor
│
├── Dockerfile                # Configuración Docker del backend
└── .env                      # Variables de entorno (ejemplo: MONGO_URI)
```
## **Diagrama de clases del back:**
![image](https://github.com/user-attachments/assets/05284ee0-c284-421b-b3dc-7659ef0635cb)



## 🗂️ **Documentación de API con Swagger**

Puedes consultar la documentación completa de la API en la siguiente URL una vez que el backend esté corriendo:

📄 **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
---

## 🎨 **Frontend (frontend)**  
La carpeta `frontend` contiene el código y los recursos para la interfaz de usuario.

```
frontend/
│
├── assets/                   # Recursos estáticos
│   ├── css/                  # Archivos de estilo CSS
│   │   ├── admin.css         # Estilos para la vista admin
│   │   ├── base.css          # Estilos base
│   │   ├── detalle.css       # Estilos para la vista de detalles
│   │   ├── general.css       # Estilos generales
│   │   ├── login.css         # Estilos de login
│   │   └── misAsociaciones.css # Estilos para "Mis Asociaciones"
│   ├── img/                  # Imágenes del frontend
│   │   └── default.png       # Imagen por defecto
│   └── js/                   # Scripts JavaScript del frontend
│       ├── admin.js          # Funcionalidad admin
│       ├── api.js            # Manejo de peticiones API
│       ├── auth.js           # Autenticación de usuarios
│       ├── detalle.js        # Funcionalidad de la vista de detalles
│       ├── general.js        # Funcionalidad de la vista general
│       ├── misAsociaciones.js # Funcionalidad de "Mis Asociaciones"
│       └── utils.js          # Funciones utilitarias
│
├── constants/                # Constantes globales
│   ├── messages.js           # Mensajes de error y éxito
│   └── urls.js               # URLs de la API
│
├── uploads/                  # Carpeta para archivos subidos
│
├── admin.html                # Página para administración
├── detalle.html              # Página de detalles de una asociación
├── general.html              # Página principal
├── index.html                # Página de inicio de sesión/registro
├── misAsociaciones.html      # Página "Mis Asociaciones"
│
└── Dockerfile                # Configuración Docker del frontend
```
## **Diagrama de clases del front:**
![image](https://github.com/user-attachments/assets/fedf13d3-21a3-44f7-8a2f-6fd7dec0b728)

---






## 📝 **Contribución**

Este proyecto se ha elaborado como partede la asignatura Programación Web I de la Universidad Europea del atlántico, ¡Cualquier contribución es bienvenida! Si encuentras algún error o quieres proponer mejoras, abre un *issue* o envía un *pull request*.

---


## 🚀 **Autor**

Desarrollado por **Juan José Cobo Cano**  

