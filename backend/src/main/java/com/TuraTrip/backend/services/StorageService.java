package com.TuraTrip.backend.services;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String guardarArchivo(MultipartFile archivo, String carpeta);
    void eliminarArchivo(String rutaRelativa);
    String construirUrlPublica(String rutaRelativa);
}
