package com.TuraTrip.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.dtos.request.ComentarioRequest;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;
import com.TuraTrip.backend.exceptions.PublicacionNoEncontradaException;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.mappers.ComentarioMapper;
import com.TuraTrip.backend.models.Comentario;
import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.ComentarioRepository;
import com.TuraTrip.backend.repositories.PublicacionRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository comentarioRepository;

    private final UsuarioRepository usuarioRepository;

    private final PublicacionRepository publicacionRepository;

    private final ComentarioMapper comentarioMapper;

    @Override
    @Transactional
    public ComentarioResponse crearComentario(
            Long publicacionId,
            String correoUsuario,
            ComentarioRequest request
    ) {

        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() ->
                        new UsuarioNoEncontradoException("Usuario no encontrado"));

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() ->
                        new PublicacionNoEncontradaException("Publicación no encontrada"));

        Comentario comentario = Comentario.builder()
                .contenido(request.contenido())
                .fechaCreacion(LocalDateTime.now())
                .usuario(usuario)
                .publicacion(publicacion)
                .build();

        Comentario guardado = comentarioRepository.save(comentario);

        return comentarioMapper.toResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComentarioResponse> obtenerComentarios(Long publicacionId) {

        if (!publicacionRepository.existsById(publicacionId)) {
            throw new PublicacionNoEncontradaException("Publicación no encontrada");
        }

        return comentarioRepository
                .findByPublicacionIdOrderByFechaCreacionAsc(publicacionId)
                .stream()
                .map(comentarioMapper::toResponse)
                .toList();

    }

}
