package com.TuraTrip.backend.exceptions;

public class TokenVerificadoException extends RuntimeException {
    public TokenVerificadoException(String mensaje) {
        super(mensaje);
    }
}
