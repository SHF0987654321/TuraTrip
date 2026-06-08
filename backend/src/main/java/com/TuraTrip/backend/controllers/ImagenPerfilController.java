package com.TuraTrip.backend.controllers;
 
import com.TuraTrip.backend.services.ImagenPerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
     * Sube imagen de perfil. Multipart form-data, campo "archivo". (SUG-70)
     */
    @PostMapping(value = "/perfil/foto", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> subirFoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("archivo") MultipartFile archivo) {
 
        String url = imagenPerfilService.subirFoto(userDetails.getUsername(), archivo);
        return ResponseEntity.ok(Map.of("fotoPerfil", url));
    }
}