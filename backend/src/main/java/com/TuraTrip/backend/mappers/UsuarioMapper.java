package com.TuraTrip.backend.mappers;

import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.dtos.response.RolResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioResponse toResponse(Usuario usuario);

    default RolResponse rolToRolResponse(Rol rol) {
        if (rol == null) {
            return null;
        }
        return new RolResponse(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }

    @Mapping(target = "roles", expression = "java(mapRolesAStrings(usuario.getRoles()))")
    PerfilResponse toPerfilResponse(Usuario usuario);

    default List<String> mapRolesAStrings(Set<Rol> roles) {
        if (roles == null) {
            return List.of();
        }
        return roles.stream()
                .filter(Objects::nonNull)
                .map(rol -> rol.getNombre())
                .toList();
    }
}