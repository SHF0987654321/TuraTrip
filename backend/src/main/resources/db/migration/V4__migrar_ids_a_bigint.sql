-- V4__migrar_ids_a_bigint.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar relaciones actuales
ALTER TABLE usuario_roles DROP FOREIGN KEY fk_usuario_roles_usuario;
ALTER TABLE usuario_roles DROP FOREIGN KEY fk_usuario_roles_rol;

ALTER TABLE tokens DROP FOREIGN KEY fk_tokens_usuario;

ALTER TABLE publicaciones DROP FOREIGN KEY fk_publicaciones_usuario;


-- Cambiar Primary Keys
ALTER TABLE usuarios
MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE roles
MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE publicaciones
MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE tokens
MODIFY id BIGINT AUTO_INCREMENT;


-- Cambiar Foreign Keys
ALTER TABLE usuario_roles
MODIFY usuario_id BIGINT NOT NULL,
MODIFY rol_id BIGINT NOT NULL;


ALTER TABLE tokens
MODIFY usuario_id BIGINT NOT NULL;


ALTER TABLE publicaciones
MODIFY usuario_id BIGINT NOT NULL;


-- Restaurar Foreign Keys

ALTER TABLE usuario_roles
ADD CONSTRAINT fk_usuario_roles_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE CASCADE;


ALTER TABLE usuario_roles
ADD CONSTRAINT fk_usuario_roles_rol
FOREIGN KEY (rol_id) REFERENCES roles(id)
ON DELETE CASCADE;


ALTER TABLE tokens
ADD CONSTRAINT fk_tokens_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE CASCADE;


ALTER TABLE publicaciones
ADD CONSTRAINT fk_publicaciones_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE CASCADE;


SET FOREIGN_KEY_CHECKS = 1;
