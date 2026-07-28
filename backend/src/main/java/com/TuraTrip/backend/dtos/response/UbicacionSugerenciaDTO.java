package com.TuraTrip.backend.dtos.response;

public record UbicacionSugerenciaDTO(
    String nombre,
    String direccion,
    Double latitud,
    Double longitud
) {}
