package com.TuraTrip.backend.mappers;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.dtos.response.RolResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.services.StorageService;

@Mapper(componentModel = "spring", uses = {StorageService.class})
public interface UsuarioMapper {

    @Mapping(target = "fotoPerfil", expression = "java(storageService.construirUrlPublica(usuario.getFotoPerfil()))")
    UsuarioResponse toResponse(Usuario usuario);

    @Mapping(target = "roles", expression = "java(mapRolesAStrings(usuario.getRoles()))")
    @Mapping(
        target = "fotoPerfil",
        expression = "java(storageService.construirUrlPublica(usuario.getFotoPerfil()))"
    )
    PerfilResponse toPerfilResponse(Usuario usuario);

    default RolResponse rolToRolResponse(Rol rol) {
        if (rol == null) {
            return null;
        }
        return new RolResponse(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }

    default Set<String> mapRolesAStrings(Set<Rol> roles) {
        if (roles == null) {
            return Set.of();
        }
        return roles.stream()
                .filter(Objects::nonNull)
                .map(rol -> rol.getNombre())
                .collect(Collectors.toSet());
    }
}
