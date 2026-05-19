package com.TuraTrip.backend.mappers;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.TuraTrip.backend.dtos.response.RolResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;

import com.TuraTrip.backend.models.Usuario;

@Component
public class UsuarioMapper {

    public UsuarioResponse toResponse(Usuario usuario) {
        Set<RolResponse> roles = usuario.getRoles().stream()
            .map(r -> new RolResponse(r.getId(), r.getNombre(), r.getDescripcion()))
            .collect(Collectors.toSet());

        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getCorreo(),
            roles,
            usuario.getCreado()
        );
    }
}