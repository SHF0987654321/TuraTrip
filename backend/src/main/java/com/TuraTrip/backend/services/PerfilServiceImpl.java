package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilServiceImpl implements PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    @Transactional(readOnly = true)
    public PerfilResponse obtenerPerfil(String correo) {
        Usuario usuario = buscarPorCorreo(correo);
        return usuarioMapper.toPerfilResponse(usuario);
    }

    @Override
    @Transactional
    public PerfilResponse editarPerfil(String correo, EditarPerfilRequest request) {
        Usuario usuario = buscarPorCorreo(correo);

        if (request.nombre() != null && !request.nombre().isBlank()) {
            usuario.setNombre(request.nombre());
        }

        usuarioRepository.save(usuario);

        return usuarioMapper.toPerfilResponse(usuario);
    }

    private Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
    }
}