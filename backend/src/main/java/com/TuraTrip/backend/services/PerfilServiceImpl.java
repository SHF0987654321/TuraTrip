package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilServiceImpl implements PerfilService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public PerfilResponse obtenerPerfil(String correo) {
        Usuario usuario = buscarPorCorreo(correo);
        return toPerfilResponse(usuario);
    }

    @Override
    public PerfilResponse editarPerfil(String correo, EditarPerfilRequest request) {
        Usuario usuario = buscarPorCorreo(correo);

        usuario.setNombre(request.nombre());

        if (request.fotoPerfil() != null && !request.fotoPerfil().isBlank()) {
            usuario.setFotoPerfil(request.fotoPerfil());
        }

        usuarioRepository.save(usuario);

        return toPerfilResponse(usuario);
    }

    private Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Usuario no encontrado"
            ));
    }

    private PerfilResponse toPerfilResponse(Usuario usuario) {
        List<String> roles = usuario.getRoles()
            .stream()
            .map(r -> r.getNombre())
            .toList();

        return new PerfilResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getCorreo(),
            usuario.getFotoPerfil(),
            roles
        );
    }
}