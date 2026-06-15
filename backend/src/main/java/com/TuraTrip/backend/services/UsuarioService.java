package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.LoginRequest;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.AuthResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;

public interface UsuarioService {

    UsuarioResponse registrar(RegistroRequest request);

    AuthResponse login(LoginRequest request);

    void confirmarToken(String token);

    void solicitarRecuperacionClave(String correo);

    void cambiarClaveConToken(String token, String nuevaClave);
}