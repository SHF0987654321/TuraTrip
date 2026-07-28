package com.TuraTrip.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.TuraTrip.backend.dtos.response.LikeResponse;
import com.TuraTrip.backend.services.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/publicaciones")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{publicacionId}/like")
    public ResponseEntity<LikeResponse> toggleLike(
            @PathVariable Long publicacionId,
            Authentication authentication
    ) {

        String correo = authentication.getName();

        LikeResponse response =
                likeService.toggleLike(publicacionId, correo);

        return ResponseEntity.ok(response);
    }

}
