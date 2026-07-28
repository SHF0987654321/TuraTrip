CREATE TABLE comentarios (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    contenido VARCHAR(500) NOT NULL,

    fecha_creacion DATETIME NOT NULL,

    usuario_id BIGINT NOT NULL,

    publicacion_id BIGINT NOT NULL,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_comentario_publicacion
        FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones(id)

);
