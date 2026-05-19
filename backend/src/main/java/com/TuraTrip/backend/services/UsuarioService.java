package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.UsuarioResponse;

import com.TuraTrip.backend.dtos.request.RegistroRequest;

public interface UsuarioService {
    UsuarioResponse registrar(RegistroRequest request);
}