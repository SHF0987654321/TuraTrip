package com.TuraTrip.backend.dtos.response;

import java.time.LocalDateTime;
import java.util.List;

public record PublicacionResponse(
    Long id,
    String titulo,
    String descripcion,
    String imagen,
    LocalDateTime fechaCreacion,
    String autorNombre,
    Long autorId,
    String autorFotoPerfil,
    Long categoriaId,
    String categoriaNombre,
    String direccion,
    Double latitud,
    Double longitud,
    List<ComentarioResponse> comentarios
) {}
