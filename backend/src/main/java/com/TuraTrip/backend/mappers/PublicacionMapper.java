package com.TuraTrip.backend.mappers;

import com.TuraTrip.backend.dtos.response.PublicacionResponse;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;
import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.services.StorageService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {StorageService.class, ComentarioMapper.class})
public interface PublicacionMapper {

    @Mapping(source = "usuario.nombre", target = "autorNombre")
    @Mapping(source = "usuario.id", target = "autorId")
    @Mapping(target = "autorFotoPerfil", expression = "java(publicacion.getUsuario() != null && publicacion.getUsuario().getFotoPerfil() != null ? storageService.construirUrlPublica(publicacion.getUsuario().getFotoPerfil()) : null)")
    @Mapping(target = "imagen", expression = "java(storageService.construirUrlPublica(publicacion.getImagen()))")
    @Mapping(target = "categoriaId", expression = "java(publicacion.getCategoria() != null ? publicacion.getCategoria().getId() : null)")
    @Mapping(target = "categoriaNombre", expression = "java(publicacion.getCategoria() != null ? publicacion.getCategoria().getNombre() : null)")
    @Mapping(target = "comentarios", ignore = true)
    PublicacionResponse toResponse(Publicacion publicacion);
}
