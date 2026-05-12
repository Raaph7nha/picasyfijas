-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    victorias INT DEFAULT 0
);

-- Tabla de Partidas
CREATE TABLE partidas (
    id SERIAL PRIMARY KEY,
    numero_secreto VARCHAR(4) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalizada BOOLEAN DEFAULT FALSE,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Intentos
CREATE TABLE intentos (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(4) NOT NULL,
    picas INT NOT NULL,
    fijas INT NOT NULL,
    partida_id INT REFERENCES partidas(id) ON DELETE CASCADE
);
