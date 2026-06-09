package com.TuraTrip.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.TuraTrip.backend.dtos.request.RegistroRequest;

import com.TuraTrip.backend.dtos.response.UsuarioResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.TuraTrip.backend.services.UsuarioService;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(request));
    }

    @GetMapping("/verificar")
    public ResponseEntity<String> verificarCuenta(@RequestParam("token") String token) {
        usuarioService.confirmarToken(token);
        return ResponseEntity.ok("Cuenta verificada exitosamente. Ya puedes iniciar sesión.");
    }
}
