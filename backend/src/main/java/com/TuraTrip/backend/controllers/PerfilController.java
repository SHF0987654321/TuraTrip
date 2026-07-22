package com.TuraTrip.backend.controllers;

import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.services.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil(
            Authentication authentication) {

        PerfilResponse perfil = perfilService.obtenerPerfil(authentication.getName());
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> editarPerfil(
            Authentication authentication,
            @Valid @RequestBody EditarPerfilRequest request) {

        PerfilResponse actualizado = perfilService.editarPerfil(
            authentication.getName(), request);
        return ResponseEntity.ok(actualizado);
    }
}
