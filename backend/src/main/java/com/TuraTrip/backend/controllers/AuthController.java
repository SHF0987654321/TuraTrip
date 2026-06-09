package com.TuraTrip.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.MensajeResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.services.UsuarioService;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MensajeResponse> verificarCuenta(@RequestParam("token") String token) {
        usuarioService.confirmarToken(token);
        return ResponseEntity.ok(new MensajeResponse("Cuenta verificada exitosamente. Ya puedes iniciar sesión."));
    }

    @PostMapping("/restablecer-clave/solicitar")
    public ResponseEntity<MensajeResponse> solicitarRecuperacion(@RequestBody Map<String, String> request) {
        usuarioService.solicitarRecuperacionClave(request.get("correo"));
        return ResponseEntity.ok(new MensajeResponse("Si el correo existe, se enviará un enlace de recuperación."));
    }

    @PostMapping("/restablecer-clave/confirmar")
    public ResponseEntity<MensajeResponse> confirmarRestablecer(@RequestBody Map<String, String> request) {
        usuarioService.cambiarClaveConToken(request.get("token"), request.get("nuevaClave"));
        return ResponseEntity.ok(new MensajeResponse("Contraseña restablecida de manera exitosa."));
    }
}