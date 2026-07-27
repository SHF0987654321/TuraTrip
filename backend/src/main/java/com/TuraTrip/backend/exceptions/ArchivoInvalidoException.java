package com.TuraTrip.backend.exceptions;

public class ArchivoInvalidoException extends RuntimeException {
    public ArchivoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
