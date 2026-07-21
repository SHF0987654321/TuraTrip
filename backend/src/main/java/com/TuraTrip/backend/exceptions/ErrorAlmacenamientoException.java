package com.TuraTrip.backend.exceptions;

public class ErrorAlmacenamientoException extends RuntimeException {
    public ErrorAlmacenamientoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }

}
