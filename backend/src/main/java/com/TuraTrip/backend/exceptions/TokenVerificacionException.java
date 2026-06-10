package com.TuraTrip.backend.exceptions;

public class TokenVerificacionException extends RuntimeException {
    public TokenVerificacionException(String mensaje) {
        super(mensaje);
    }
}