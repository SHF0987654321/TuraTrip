package com.TuraTrip.backend.exceptions;

public class TokenExpiradoException extends RuntimeException {
    public TokenExpiradoException(String mensaje) {
        super(mensaje);
    }
}