-- Migración para permitir NULL en contrasena para usuarios de Google
-- También agrega la columna google_id si no existe

-- Modificar columna contrasena para permitir NULL
ALTER TABLE usuarios MODIFY COLUMN contrasena VARCHAR(255) NULL;

-- Agregar columna google_id si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL;

-- Agregar índice para búsquedas por google_id
CREATE INDEX IF NOT EXISTS idx_usuarios_google_id ON usuarios(google_id);

