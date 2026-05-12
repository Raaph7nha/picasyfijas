# Picas y Fijas - Proyecto Profesional

Este proyecto es una implementación completa y profesional del juego **Picas y Fijas** (también conocido como Bulls and Cows), diseñado para ser escalable, limpio y fácil de desplegar.

## 🚀 Estructura del Proyecto

```txt
picas-y-fijas/
├── backend/          # API REST con Spring Boot 3 & Java 17
├── frontend/         # SPA con React, TypeScript y Vite
├── database/         # Esquema de base de datos PostgreSQL
├── render.yaml       # Configuración de Infraestructura como Código
└── README.md         # Documentación principal
```

## 🛠️ Tecnologías

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Hibernate, PostgreSQL, Lombok, Maven.
- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Motion (Framer), Axios, Lucide Icons.
- **Base de Datos:** PostgreSQL.
- **Despliegue:** Preparado para Render.com.

---

## 💻 Desarrollo Local

### 1. Requisitos Previos
- **Java 17 JDK** instalado.
- **Node.js 18+** y npm.
- **PostgreSQL** instalado y corriendo.
- Un IDE como IntelliJ IDEA o VS Code.

### 2. Configuración de Base de Datos
Crea una base de datos llamada `picas_fijas` y ejecuta el script en `database/database.sql`.

### 3. Ejecución del Backend
```bash
cd backend
# Configura tus credenciales en src/main/resources/application.properties
mvn spring-boot:run
```

### 4. Ejecución del Frontend
```bash
cd frontend
# Crea un archivo .env basado en .env.example
# VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

---

## 🌎 Despliegue en Render (Sin Docker)

Este proyecto está configurado para desplegarse mediante el archivo `render.yaml`.

1. **GitHub:** Sube este código a un repositorio privado o público en GitHub.
2. **Render:** En el dashboard de Render, crea un nuevo **"Blueprint Instance"**.
3. **Conexión:** Render detectará automáticamente el archivo `render.yaml` y creará 3 servicios:
   - **PostgreSQL:** Base de datos gestionada.
   - **Backend:** Servicio web de Java que se conecta automáticamente a la DB.
   - **Frontend:** Sitio estático rápido.
4. **Variables:** Asegúrate de que el `VITE_API_URL` en el servicio frontend apunte a la URL de tu backend de Render.

## 🔑 Variables de Entorno del Frontend
Crea un archivo `.env` en la carpeta `frontend/`:
```env
VITE_API_URL=https://tu-backend-en-render.com
```

---

## 🎮 Cómo Jugar
1. El servidor genera un número secreto de **4 dígitos únicos**.
2. Debes ingresar un intento de 4 dígitos (no repetidos).
3. Obtendrás:
   - **Fijas:** Dígitos correctos en la posición correcta.
   - **Picas:** Dígitos correctos en la posición incorrecta.
4. ¡Ganas cuando obtienes **4 Fijas**!

---
*Desarrollado con ❤️ por Rafael y Karen*
