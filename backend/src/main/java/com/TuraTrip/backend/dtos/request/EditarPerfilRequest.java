package com.TuraTrip.backend.dtos.request;

import jakarta.validation.constraints.Size;

public record EditarPerfilRequest(

    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    String nombre

) {}
