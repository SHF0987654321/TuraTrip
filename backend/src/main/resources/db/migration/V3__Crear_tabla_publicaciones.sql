-- 5. Crear tabla de Publicaciones (Relación One-To-Many con Usuarios)
CREATE TABLE publicaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    imagen VARCHAR(500) NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT fk_publicaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;