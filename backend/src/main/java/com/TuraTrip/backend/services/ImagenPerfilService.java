package com.TuraTrip.backend.services;

import org.springframework.web.multipart.MultipartFile;

/**
 * ImagenPerfilService
 */
public interface ImagenPerfilService {
     String subirFoto(String correo, MultipartFile archivo);
}
