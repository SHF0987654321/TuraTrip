-- 1. Modificar la tabla 'tokens' (cambiar usuario_id a BIGINT)
ALTER TABLE tokens MODIFY COLUMN usuario_id BIGINT NOT NULL;

-- 2. Modificar la tabla 'usuario_roles' (cambiar usuario_id a BIGINT)
ALTER TABLE usuario_roles MODIFY COLUMN usuario_id BIGINT NOT NULL;

-- 3. Modificar la tabla 'publicaciones' (si usuario_id ya era BIGINT o INT, lo aseguramos)
ALTER TABLE publicaciones MODIFY COLUMN usuario_id BIGINT NOT NULL;

-- 4. Modificar la tabla principal 'usuarios' (cambiar el ID a BIGINT AUTO_INCREMENT)
ALTER TABLE usuarios MODIFY COLUMN id BIGINT AUTO_INCREMENT;