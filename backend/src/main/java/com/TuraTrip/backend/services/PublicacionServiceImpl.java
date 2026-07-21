package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.PublicacionRequest;
import com.TuraTrip.backend.dtos.response.PublicacionResponse;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.mappers.PublicacionMapper;
import com.TuraTrip.backend.exceptions.ArchivoInvalidoException;
import com.TuraTrip.backend.exceptions.FormatoNoSoportadoException;
import com.TuraTrip.backend.exceptions.PublicacionNoEncontradaException;
import com.TuraTrip.backend.exceptions.ArchivoDemasiadoGrandeException;
import com.TuraTrip.backend.exceptions.ErrorAlmacenamientoException;
import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.PublicacionRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicacionServiceImpl implements PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PublicacionMapper publicacionMapper;

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
    @Transactional
    public PublicacionResponse crearPublicacion(String correo, PublicacionRequest request, MultipartFile archivo) {
        
        // 1. Validar que el usuario exista
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // 2. Validar imagen (reutilizando la misma lógica robusta que ya hiciste)
        if (archivo == null || archivo.isEmpty()) {
            throw new ArchivoInvalidoException("La imagen de la publicación es obligatoria");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new FormatoNoSoportadoException("Solo se permiten imágenes JPG, JPEG, PNG o WebP");
        }
        if (archivo.getSize() > MAX_SIZE_BYTES) {
            throw new ArchivoDemasiadoGrandeException("El archivo no puede superar 5 MB");
        }

        // 3. Guardar archivo en disco
        String urlImagen;
        try {
            Path directorio = Paths.get(uploadsDir, "publicaciones"); // Carpeta separada para orden
            Files.createDirectories(directorio);

            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = UUID.randomUUID() + "." + extension;
            Path destino = directorio.resolve(nombreArchivo);

            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            urlImagen = apiUrl + "/uploads/publicaciones/" + nombreArchivo;

        } catch (IOException e) {
            throw new ErrorAlmacenamientoException("Error al guardar la imagen en el disco", e);
        }

        // 4. Construir y guardar la publicación
        Publicacion publicacion = Publicacion.builder()
                .titulo(request.titulo())
                .descripcion(request.descripcion())
                .imagen(urlImagen)
                .fechaCreacion(LocalDateTime.now())
                .usuario(usuario)
                .build();

        Publicacion guardada = publicacionRepository.save(publicacion);

        return publicacionMapper.toResponse(guardada);
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

    @Override
    @Transactional(readOnly = true)
    public List<PublicacionResponse> obtenerTodasLasPublicaciones() {
        List<Publicacion> publicaciones = publicacionRepository.findAllByOrderByFechaCreacionDesc();

        return publicaciones.stream()
                .map(publicacionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicacionResponse> obtenerPublicacionesPorUsuario(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        List<Publicacion> publicaciones = publicacionRepository.findAllByUsuarioOrderByFechaCreacionDesc(usuario);

        return publicaciones.stream()
                .map(publicacionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PublicacionResponse obtenerPublicacionPorId(Long id) {
        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new PublicacionNoEncontradaException("Publicación no encontrada"));

        return publicacionMapper.toResponse(publicacion);
    }
}