# Picas y Fijas - Codebreaker

Aplicación full-stack del juego Picas y Fijas (Bulls and Cows).

## Tecnologías

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion.
- **Backend (Producción)**: Spring Boot 3 + Java 17 + Maven.
- **Base de Datos**: PostgreSQL.
- **Backend (Preview/AI Studio)**: Node.js + Express + pg (Mirroring logic).

## Estructura del Proyecto

- `/src`: Código fuente del frontend (React).
- `/backend-springboot`: Código fuente del backend en Java.
- `/server.ts`: Servidor Node.js para el entorno de desarrollo y preview.
- `database.sql`: Esquema de la base de datos.

## Configuración para Render

### 1. Base de Datos
- Crea una base de datos PostgreSQL en Render.
- Copia el Internal/External Database URL.

### 2. Backend (Spring Boot)
- Crea un "Web Service".
- **Runtime**: Java.
- **Build Command**: `./mvnw clean install` (asegúrate de tener el wrapper o usa `mvn`).
- **Start Command**: `java -jar target/picas-fijas-0.0.1-SNAPSHOT.jar`.
- **Variables de Entorno**:
  - `SPRING_DATASOURCE_URL`: Tu URL de JDBC de Postgres.
  - `SPRING_DATASOURCE_USERNAME`: Tu usuario.
  - `SPRING_DATASOURCE_PASSWORD`: Tu contraseña.

### 3. Frontend (Static Site)
- Crea un "Static Site".
- **Build Command**: `npm run build`.
- **Publish Directory**: `dist`.

## Reglas del Juego

1. El sistema genera un número de 4 dígitos únicos (no se repiten).
2. Debes adivinar el número.
3. **Picas**: El dígito está en el número secreto pero en la posición incorrecta.
4. **Fijas**: El dígito está en el número secreto y en la posición correcta.
5. Ganas cuando logras 4 Fijas.

## Desarrollo Local

1. Instala dependencias: `npm install`.
2. Configura tu `DATABASE_URL` en `.env`.
3. Ejecuta: `npm run dev`.
