package com.TuraTrip.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.TuraTrip.backend.dtos.response.PublicacionResponse;
import com.TuraTrip.backend.models.Publicacion;

@Mapper(componentModel = "spring")
public interface PublicacionMapper {

    @Mapping(source = "usuario.nombre", target = "autorNombre")
    @Mapping(source = "usuario.fotoPerfil", target = "autorFotoPerfil")
    PublicacionResponse toResponse(Publicacion publicacion);
}
