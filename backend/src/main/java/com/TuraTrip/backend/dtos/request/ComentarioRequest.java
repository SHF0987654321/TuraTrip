package com.TuraTrip.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ComentarioRequest(

    @NotBlank(message = "El comentario es obligatorio")
    @Size(max = 500, message = "El comentario no puede exceder los 500 caracteres")
    String contenido

) {}
