PerfilController · JAVA
package com.TuraTrip.backend.controllers;
 
import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.services.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class PerfilController {
 
    private final PerfilService perfilService;
 
    /**
     * GET /api/v1/usuarios/perfil
     * Retorna los datos del usuario autenticado. (SUG-69)
     */
    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
 
        PerfilResponse perfil = perfilService.obtenerPerfil(userDetails.getUsername());
        return ResponseEntity.ok(perfil);
    }
 
    /**
     * PUT /api/v1/usuarios/perfil
     * Actualiza nombre y foto de perfil del usuario autenticado. (SUG-69)
     */
    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> editarPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EditarPerfilRequest request) {
 
        PerfilResponse actualizado = perfilService.editarPerfil(
            userDetails.getUsername(), request);
        return ResponseEntity.ok(actualizado);
    }
}