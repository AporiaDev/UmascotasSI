package com.example.umascota.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
@Order(1)
public class DatabaseMigration {

    private static final Logger logger = Logger.getLogger(DatabaseMigration.class.getName());

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrateDatabase() {
        try {
            logger.info("Iniciando migración de base de datos...");
            
            // Verificar y modificar columna contrasena para permitir NULL
            try {
                jdbcTemplate.execute("ALTER TABLE usuarios MODIFY COLUMN contrasena VARCHAR(255) NULL");
                logger.info("Columna 'contrasena' modificada para permitir NULL");
            } catch (Exception e) {
                logger.warning("No se pudo modificar la columna 'contrasena': " + e.getMessage());
            }
            
            // Verificar y agregar columna google_id si no existe
            try {
                jdbcTemplate.execute("ALTER TABLE usuarios ADD COLUMN google_id VARCHAR(255) NULL");
                logger.info("Columna 'google_id' agregada");
            } catch (Exception e) {
                // La columna ya existe, ignorar el error
                logger.info("Columna 'google_id' ya existe o no se pudo agregar: " + e.getMessage());
            }
            
            // Crear índice para google_id si no existe
            try {
                jdbcTemplate.execute("CREATE INDEX idx_usuarios_google_id ON usuarios(google_id)");
                logger.info("Índice 'idx_usuarios_google_id' creado");
            } catch (Exception e) {
                // El índice ya existe, ignorar el error
                logger.info("Índice 'idx_usuarios_google_id' ya existe o no se pudo crear: " + e.getMessage());
            }
            
            logger.info("Migración de base de datos completada");
        } catch (Exception e) {
            logger.severe("Error durante la migración de base de datos: " + e.getMessage());
            // No lanzar excepción para que la aplicación pueda iniciar
        }
    }
}

