package com.TuraTrip.backend.exceptions;

public class TokenExpiradoException extends RuntimeException {
    private final String correo;

    public TokenExpiradoException(String mensaje, String correo) {
        super(mensaje);
        this.correo = correo;
    }

    public String getcorreo() { return correo; }
}
