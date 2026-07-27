-- 5. Crear tabla de Categorías y agregar relación con publicaciones
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE publicaciones
    ADD COLUMN categoria_id BIGINT NULL,
    ADD CONSTRAINT fk_publicaciones_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL;
