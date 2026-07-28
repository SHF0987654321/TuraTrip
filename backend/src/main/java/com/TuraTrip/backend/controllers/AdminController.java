package com.TuraTrip.backend.controllers;

import com.TuraTrip.backend.dtos.response.AdminDashboardStatsResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.services.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/estadisticas")
    public ResponseEntity<AdminDashboardStatsResponse> obtenerEstadisticas() {
        return ResponseEntity.ok(adminService.obtenerEstadisticas());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarTodosLosUsuarios());
    }
}
