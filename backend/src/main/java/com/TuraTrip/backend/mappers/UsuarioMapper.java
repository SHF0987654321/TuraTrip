package com.TuraTrip.backend.mappers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.dtos.response.RolResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    // MapStruct mapea automáticamente los campos con el mismo nombre (id, nombre, correo, habilitado, creado)
    UsuarioResponse toResponse(Usuario usuario);

    // Método auxiliar que MapStruct usa automáticamente para convertir Set<Rol> a Set<RolResponse>
    default RolResponse rolToRolResponse(Rol rol) {
        if (rol == null) {
            return null;
        }
        return new RolResponse(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }

    @Mapping(target = "roles", expression = "java(mapRolesAStrings(usuario.getRoles()))")
    PerfilResponse toPerfilResponse(Usuario usuario);

    // Método auxiliar para transformar los roles a una lista de Strings en el perfil
    default List<String> mapRolesAStrings(Set<Rol> roles) {
        if (roles == null) {
            return List.of();
        }
        return roles.stream()
                .map(Rol::getNombre)
                .toList();
    }
}