package com.TuraTrip.backend.dtos.response;

import java.time.LocalDateTime;
import java.util.Set;

public record UsuarioResponse(
    Long id,
    String nombre,
    String correo,
    Boolean habilitado,
    Set<RolResponse> roles,
    LocalDateTime creado
) {}
