package com.TuraTrip.backend.services;

import com.TuraTrip.backend.exceptions.ArchivoDemasiadoGrandeException;
import com.TuraTrip.backend.exceptions.ArchivoInvalidoException;
import com.TuraTrip.backend.exceptions.ErrorAlmacenamientoException;
import com.TuraTrip.backend.exceptions.FormatoNoSoportadoException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalStorageServiceImpl implements StorageService {

    @Value("${app.uploads-dir}")
    private String uploadsDir;

    @Value("${app.api-url}")
    private String apiUrl;

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    @Override
    public String guardarArchivo(MultipartFile archivo, String carpeta) {
        validarArchivo(archivo);

        try {
            Path directorio = Paths.get(uploadsDir, carpeta);
            Files.createDirectories(directorio);

            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = UUID.randomUUID() + "." + extension;
            Path destino = directorio.resolve(nombreArchivo);

            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Retorna solo la ruta relativa (ej: "perfiles/uuid.jpg")
            return carpeta + "/" + nombreArchivo;

        } catch (IOException e) {
            throw new ErrorAlmacenamientoException("Error al guardar la imagen en disco", e);
        }
    }

    @Override
    public void eliminarArchivo(String rutaRelativa) {
        if (rutaRelativa == null || rutaRelativa.isBlank()) return;

        try {
            Path rutaArchivo = Paths.get(uploadsDir, rutaRelativa);
            Files.deleteIfExists(rutaArchivo);
        } catch (IOException e) {
            log.warn("No se pudo eliminar el archivo físico {}: {}", rutaRelativa, e.getMessage());
        }
    }

    @Override
    public String construirUrlPublica(String rutaRelativa) {
        if (rutaRelativa == null || rutaRelativa.isBlank()) return null;

        // Si ya es una URL pública completa (HTTP / HTTPS)
        if (rutaRelativa.startsWith("http://") || rutaRelativa.startsWith("https://")) {
            return rutaRelativa;
        }

        // Si la ruta no parece un archivo subido (ej: "perfiles/uuid.jpg" o "publicaciones/uuid.jpg"), no le concatenamos la URL
        if (!rutaRelativa.contains("/")) {
            return rutaRelativa;
        }

        return apiUrl + "/uploads/" + rutaRelativa;
    }

    private void validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ArchivoInvalidoException("El archivo no puede estar vacío");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new FormatoNoSoportadoException("Solo se permiten imágenes JPG, JPEG, PNG o WebP");
        }
        if (archivo.getSize() > MAX_SIZE_BYTES) {
            throw new ArchivoDemasiadoGrandeException("El archivo no puede superar 5 MB");
        }
    }

    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            String ext = nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase();
            if (Set.of("jpg", "jpeg", "png", "webp").contains(ext)) {
                return ext;
            }
        }
        throw new FormatoNoSoportadoException("Extensión de archivo no válida");
    }
}
