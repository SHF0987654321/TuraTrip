package com.TuraTrip.backend.dtos.response;

public record AuthResponse(
    String token,
    UsuarioResponse usuario
) {}
