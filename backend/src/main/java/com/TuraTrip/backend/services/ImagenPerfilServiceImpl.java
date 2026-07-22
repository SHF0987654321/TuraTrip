package com.TuraTrip.backend.services;
 
import com.TuraTrip.backend.exceptions.ArchivoDemasiadoGrandeException;
import com.TuraTrip.backend.exceptions.ArchivoInvalidoException;
import com.TuraTrip.backend.exceptions.ErrorAlmacenamientoException;
import com.TuraTrip.backend.exceptions.FormatoNoSoportadoException;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
 
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class ImagenPerfilServiceImpl implements ImagenPerfilService {
 
    private final UsuarioRepository usuarioRepository;
 
    @Value("${app.uploads-dir}")
    private String uploadsDir;
 
    @Value("${app.api-url}")
    private String apiUrl;
 
    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg", // Cubre JPG y JPEG
            "image/png",
            "image/webp"
        );
 
    /**
     * POST /api/v1/usuarios/perfil/foto
     * Sube una imagen, la guarda en disco y actualiza el campo fotoPerfil. (SUG-70)
     *
     * @return URL pública de la imagen guardada.
     */
    @Override
    @Transactional
    public String subirFoto(String correo, MultipartFile archivo) {
        // ── Validaciones ────────────────────────────────────────────────────
        if (archivo == null || archivo.isEmpty()) {
            throw new ArchivoInvalidoException("El archivo está vacío");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new FormatoNoSoportadoException("Solo se permiten imágenes JPG, JPEG, PNG o WebP");
        }
        if (archivo.getSize() > MAX_SIZE_BYTES) {
            throw new ArchivoDemasiadoGrandeException("El archivo no puede superar 5 MB");
        }
 
        // ── Guardar en disco ─────────────────────────────────────────────────
        try {
            Path directorio = Paths.get(uploadsDir, "perfiles");
            Files.createDirectories(directorio);
 
            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = UUID.randomUUID() + "." + extension;
            Path destino = directorio.resolve(nombreArchivo);
 
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
 
            String urlFoto = apiUrl + "/uploads/perfiles/" + nombreArchivo;
 
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

            // 2. Si ya tenía una foto, bórrala
            if (usuario.getFotoPerfil() != null && !usuario.getFotoPerfil().isEmpty()) {
             try {
                 // Extraemos el nombre del archivo de la URL
                 String nombreArchivoAnterior = usuario.getFotoPerfil().substring(usuario.getFotoPerfil().lastIndexOf("/") + 1);
                 Path rutaAnterior = Paths.get(uploadsDir, "perfiles").resolve(nombreArchivoAnterior);
                 
                 // Eliminamos el archivo físico
                 Files.deleteIfExists(rutaAnterior);
             } catch (Exception e) {
                 // Logueamos el error pero no bloqueamos la subida de la nueva foto
                 System.err.println("No se pudo borrar la foto anterior: " + e.getMessage());
             }
            }

            // ── Actualizar usuario ───────────────────────────────────────────
            usuario.setFotoPerfil(urlFoto);
            usuarioRepository.save(usuario);
 
            return urlFoto;
 
        } catch (IOException e) {
            throw new ErrorAlmacenamientoException("Error al guardar la imagen en el disco", e);
        }
    }
 
    // ── Helpers ──────────────────────────────────────────────────────────────
    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            String ext = nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase();
            // Validamos que sea una extensión de imagen conocida
            if (Set.of("jpg", "jpeg", "png", "webp").contains(ext)) {
                return ext;
            }
        }
        // Si no tiene extensión o es desconocida, lanzamos excepción
        throw new FormatoNoSoportadoException("Extensión de archivo no válida");
    }
}