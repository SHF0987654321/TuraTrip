package com.TuraTrip.backend.controllers;

import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;
import com.TuraTrip.backend.dtos.response.PerfilResponse;
import com.TuraTrip.backend.services.ComentarioService;
import com.TuraTrip.backend.services.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;
    private final ComentarioService comentarioService;

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil(
            Authentication authentication) {

        PerfilResponse perfil = perfilService.obtenerPerfil(authentication.getName());
        return ResponseEntity.ok(perfil);
    }

    @GetMapping("/perfil/{id}")
    public ResponseEntity<PerfilResponse> obtenerPerfilPorId(
            @PathVariable Long id) {

        PerfilResponse perfil = perfilService.obtenerPerfilPorId(id);
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

    @GetMapping("/{id}/comentarios")
    public ResponseEntity<Page<ComentarioResponse>> obtenerComentariosDeUsuario(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ComentarioResponse> comentarios =
                comentarioService.obtenerComentariosPorUsuarioId(id, page, size);
        return ResponseEntity.ok(comentarios);
    }
}
