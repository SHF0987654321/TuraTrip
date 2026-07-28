package com.TuraTrip.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.dtos.response.LikeResponse;
import com.TuraTrip.backend.exceptions.PublicacionNoEncontradaException;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.models.Like;
import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.LikeRepository;
import com.TuraTrip.backend.repositories.PublicacionRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final UsuarioRepository usuarioRepository;
    private final PublicacionRepository publicacionRepository;

    @Override
    @Transactional
    public LikeResponse toggleLike(Long publicacionId, String correoUsuario) {

        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() ->
                        new UsuarioNoEncontradoException("Usuario no encontrado"));

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() ->
                        new PublicacionNoEncontradaException("Publicación no encontrada"));

        return likeRepository
                .findByUsuarioIdAndPublicacionId(usuario.getId(), publicacionId)
                .map(like -> {

                    likeRepository.delete(like);

                    Long total = likeRepository.countByPublicacionId(publicacionId);

                    return new LikeResponse(false, total);

                })
                .orElseGet(() -> {

                    Like nuevoLike = Like.builder()
                            .usuario(usuario)
                            .publicacion(publicacion)
                            .build();

                    likeRepository.save(nuevoLike);

                    Long total = likeRepository.countByPublicacionId(publicacionId);

                    return new LikeResponse(true, total);

                });

    }

}
