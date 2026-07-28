package com.TuraTrip.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.TuraTrip.backend.dtos.request.ComentarioRequest;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;
import com.TuraTrip.backend.services.ComentarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/publicaciones/{publicacionId}/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    @PostMapping
    public ResponseEntity<ComentarioResponse> crearComentario(
            @PathVariable Long publicacionId,
            Authentication authentication,
            @Valid @RequestBody ComentarioRequest request
    ) {

        String correoUsuario = authentication.getName();

        ComentarioResponse comentario = comentarioService.crearComentario(
                publicacionId,
                correoUsuario,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
    }

    @GetMapping
    public ResponseEntity<List<ComentarioResponse>> obtenerComentarios(
            @PathVariable Long publicacionId
    ) {

        return ResponseEntity.ok(
                comentarioService.obtenerComentarios(publicacionId)
        );

    }

}
