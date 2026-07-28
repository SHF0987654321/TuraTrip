-- 6. Agregar campos de ubicacion y geolocalizacion a publicaciones
ALTER TABLE publicaciones
    ADD COLUMN direccion VARCHAR(500) NULL,
    ADD COLUMN latitud DOUBLE NULL,
    ADD COLUMN longitud DOUBLE NULL;
