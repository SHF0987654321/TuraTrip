package com.TuraTrip.backend.dtos.response;

import java.util.Set;

public record PerfilResponse(
    Long id,
    String nombre,
    String correo,
    String fotoPerfil,
    Set<String> roles
) {}
