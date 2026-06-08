package com.TuraTrip.backend.dtos.response;

import java.time.LocalDateTime;
import java.util.Set;

public record UsuarioResponse(
    Integer id,
    String nombre,
    String correo,
    Set<RolResponse> roles,
    LocalDateTime creado
) {}