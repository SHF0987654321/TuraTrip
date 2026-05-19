package com.TuraTrip.backend.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuariosRequest {
    private String nombre;
    private String correo;
    private String clave;
}
