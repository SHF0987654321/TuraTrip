enperfilservice · JAVA
package com.TuraTrip.backend.services;
 
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
 
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class ImagenPerfilService {
 
    private final UsuarioRepository usuarioRepository;
 
    @Value("${app.uploads.dir:uploads/perfiles}")
    private String uploadsDir;
 
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
 
    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final java.util.Set<String> TIPOS_PERMITIDOS =
        java.util.Set.of("image/jpeg", "image/png", "image/webp");
 
    /**
     * POST /api/v1/usuarios/perfil/foto
     * Sube una imagen, la guarda en disco y actualiza el campo fotoPerfil. (SUG-70)
     *
     * @return URL pública de la imagen guardada.
     */
    public String subirFoto(String correo, MultipartFile archivo) {
        // ── Validaciones ────────────────────────────────────────────────────
        if (archivo == null || archivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo está vacío");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Solo se permiten imágenes JPEG, PNG o WebP");
        }
        if (archivo.getSize() > MAX_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                "El archivo no puede superar 5 MB");
        }
 
        // ── Guardar en disco ─────────────────────────────────────────────────
        try {
            Path directorio = Paths.get(uploadsDir);
            Files.createDirectories(directorio);
 
            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = UUID.randomUUID() + "." + extension;
            Path destino = directorio.resolve(nombreArchivo);
 
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
 
            String urlFoto = baseUrl + "/uploads/perfiles/" + nombreArchivo;
 
            // ── Actualizar usuario ───────────────────────────────────────────
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Usuario no encontrado"));
 
            usuario.setFotoPerfil(urlFoto);
            usuarioRepository.save(usuario);
 
            return urlFoto;
 
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error al guardar la imagen: " + e.getMessage());
        }
    }
 
    // ── Helpers ──────────────────────────────────────────────────────────────
 
    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            return nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase();
        }
        return "jpg";
    }
}