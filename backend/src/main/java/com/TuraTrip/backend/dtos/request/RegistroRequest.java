package com.TuraTrip.backend.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    String nombre,

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Correo inválido")
    @Size(max = 255)
    String correo,

    @NotBlank(message = "La clave es obligatoria")
    @Size(min = 8, message = "La clave debe tener mínimo 8 caracteres")
    String clave

) {}