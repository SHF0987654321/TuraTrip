package com.TuraTrip.backend.exceptions;

public class CategoriaEnUsoException extends RuntimeException {
    public CategoriaEnUsoException(String mensaje) {
        super(mensaje);
    }
}
