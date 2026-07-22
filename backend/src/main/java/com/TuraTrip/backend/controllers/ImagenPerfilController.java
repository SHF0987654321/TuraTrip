package com.TuraTrip.backend.controllers;

import com.TuraTrip.backend.services.ImagenPerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class ImagenPerfilController {

    private final ImagenPerfilService imagenPerfilService;

    /**
     * POST /api/v1/usuarios/perfil/foto
     * Sube la imagen de perfil. Requiere multipart/form-data con el campo "archivo".
     */
    @PostMapping(value = "/perfil/foto", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> subirFoto(
            Authentication authentication,
            @RequestParam("archivo") MultipartFile archivo) {

        String url = imagenPerfilService.subirFoto(authentication.getName(), archivo);
        return ResponseEntity.ok(Map.of("fotoPerfil", url));
    }
}