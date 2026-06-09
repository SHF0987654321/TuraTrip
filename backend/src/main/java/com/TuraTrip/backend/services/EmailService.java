package com.TuraTrip.backend.services;

public interface EmailService {
    void enviarCorreoVerificacion(String destino, String nombre, String tokenVerificacion);
    void enviarCorreoCambioClaveAdmin(String destino, String nombre, String claveTemporal);
}