package com.TuraTrip.backend.dtos.response;

import java.time.LocalDateTime;

public record PublicacionResponse(
    Long id,
    String titulo,
    String descripcion,
    String imagen,
    LocalDateTime fechaCreacion,
    String autorNombre,
    String autorFotoPerfil
) {}
