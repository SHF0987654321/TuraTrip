package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.PublicacionRequest;
import com.TuraTrip.backend.dtos.response.PublicacionResponse;
import com.TuraTrip.backend.exceptions.AccesoNoAutorizadoException;
import com.TuraTrip.backend.exceptions.PublicacionNoEncontradaException;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.mappers.PublicacionMapper;
import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.PublicacionRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicacionServiceImpl implements PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PublicacionMapper publicacionMapper;
    private final StorageService storageService;

    @Override
    @Transactional
    public PublicacionResponse crearPublicacion(String correo, PublicacionRequest request, MultipartFile archivo) {

        // 1. Validar que el usuario exista
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // 2. Guardar archivo utilizando el StorageService (devuelve la ruta relativa: ej. "publicaciones/uuid.jpg")
        String rutaRelativa = storageService.guardarArchivo(archivo, "publicaciones");

        // 3. Construir y guardar la publicación con la ruta relativa
        Publicacion publicacion = Publicacion.builder()
                .titulo(request.titulo())
                .descripcion(request.descripcion())
                .imagen(rutaRelativa)
                .fechaCreacion(LocalDateTime.now())
                .usuario(usuario)
                .build();

        Publicacion guardada = publicacionRepository.save(publicacion);

        return publicacionMapper.toResponse(guardada);
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

    @Override
    @Transactional
    public void eliminarPublicacion(Long id, String correoUsuario) {
        // 1. Buscar la publicación
        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new PublicacionNoEncontradaException("La publicación no existe"));

        // 2. Buscar al usuario autenticado
        Usuario usuarioActual = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // 3. Verificar si el usuario es ADMIN o si es el propietario de la publicación
        boolean esAdmin = usuarioActual.getRoles().stream()
                .anyMatch(rol -> rol.getNombre().equalsIgnoreCase("ADMIN"));

        boolean esPropietario = publicacion.getUsuario().getId().equals(usuarioActual.getId());

        if (!esAdmin && !esPropietario) {
            throw new AccesoNoAutorizadoException("No tienes permisos para eliminar esta publicación");
        }

        // 4. Eliminar el archivo del almacenamiento físico
        storageService.eliminarArchivo(publicacion.getImagen());

        // 5. Eliminar el registro en la base de datos
        publicacionRepository.delete(publicacion);
    }
}
