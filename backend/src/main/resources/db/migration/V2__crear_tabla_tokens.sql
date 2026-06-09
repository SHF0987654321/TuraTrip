CREATE TABLE tokens_verificacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,
    fecha_expiracion DATETIME(6) NOT NULL,
    confirmado_en DATETIME(6) NULL,
    CONSTRAINT uq_tokens_verificacion UNIQUE (token),
    CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;