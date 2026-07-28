CREATE TABLE publicacion_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    usuario_id BIGINT NOT NULL,
    publicacion_id BIGINT NOT NULL,

    CONSTRAINT fk_likes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_likes_publicacion
        FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_likes_usuario_publicacion
        UNIQUE (usuario_id, publicacion_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
