package com.TuraTrip.backend.controllers;

import com.TuraTrip.backend.dtos.request.PublicacionRequest;
import com.TuraTrip.backend.dtos.response.PublicacionResponse;
import com.TuraTrip.backend.services.PublicacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/publicaciones")
@RequiredArgsConstructor
public class PublicacionController {

    private final PublicacionService publicacionService;

    @GetMapping
    public ResponseEntity<List<PublicacionResponse>> obtenerTodasLasPublicaciones() {
        List<PublicacionResponse> publicaciones = publicacionService.obtenerTodasLasPublicaciones();
        return ResponseEntity.ok(publicaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacionResponse> obtenerPublicacionPorId(@PathVariable Long id) {
        PublicacionResponse publicacion = publicacionService.obtenerPublicacionPorId(id);
        return ResponseEntity.ok(publicacion);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PublicacionResponse> crearPublicacion(
            Authentication authentication,
            @Valid @RequestPart("publicacion") PublicacionRequest request,
            @RequestPart("archivo") MultipartFile archivo
    ) {
        // Obtenemos el correo del usuario autenticado a través del token JWT en el contexto de seguridad
        String correoUsuario = authentication.getName();

        PublicacionResponse nuevaPublicacion = publicacionService.crearPublicacion(correoUsuario, request, archivo);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPublicacion);
    }

    @GetMapping("/mias")
    public ResponseEntity<List<PublicacionResponse>> obtenerMisPublicaciones(Authentication authentication) {
        String correoUsuario = authentication.getName();
        
        List<PublicacionResponse> misPublicaciones = publicacionService.obtenerPublicacionesPorUsuario(correoUsuario);
        
        return ResponseEntity.ok(misPublicaciones);
    }
}