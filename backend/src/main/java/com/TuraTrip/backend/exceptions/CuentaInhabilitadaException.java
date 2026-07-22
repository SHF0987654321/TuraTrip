package com.TuraTrip.backend.exceptions;

public class CuentaInhabilitadaException extends RuntimeException {
    public CuentaInhabilitadaException(String mensaje) {
        super(mensaje);
    }
}
