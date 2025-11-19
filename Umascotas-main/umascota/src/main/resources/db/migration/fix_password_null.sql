-- Script SQL para corregir la columna contrasena y agregar google_id
-- Ejecuta este script en tu base de datos MySQL

-- Modificar columna contrasena para permitir NULL (para usuarios de Google)
ALTER TABLE usuarios MODIFY COLUMN contrasena VARCHAR(255) NULL;

-- Agregar columna google_id si no existe (compatible con MySQL 5.7+)
-- Si la columna ya existe, este comando fallará pero puedes ignorarlo
ALTER TABLE usuarios 
ADD COLUMN google_id VARCHAR(255) NULL;

-- Agregar índice para búsquedas por google_id (opcional, mejora el rendimiento)
-- Si el índice ya existe, este comando fallará pero puedes ignorarlo
CREATE INDEX idx_usuarios_google_id ON usuarios(google_id);

