package com.TuraTrip.backend.dtos.response;
 
import java.util.List;
 
public record PerfilResponse(
    int id,
    String nombre,
    String correo,
    String fotoPerfil,
    List<String> roles
) {}
 