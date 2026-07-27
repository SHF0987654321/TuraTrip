package com.TuraTrip.backend.exceptions;

public class CorreoYaRegistradoException extends RuntimeException {
    public CorreoYaRegistradoException(String correo) {
        super("El correo ya está registrado: " + correo);
    }
}
