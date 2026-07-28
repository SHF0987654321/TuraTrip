package com.TuraTrip.backend.exceptions;

public class CategoriaYaExistenteException extends RuntimeException {
    public CategoriaYaExistenteException(String mensaje) {
        super(mensaje);
    }
}
