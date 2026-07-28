package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.AdminDashboardStatsResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.repositories.PublicacionRepository;
import com.TuraTrip.backend.repositories.ComentarioRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PublicacionRepository publicacionRepository;
    private final ComentarioRepository comentarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse obtenerEstadisticas() {
        long totalUsuarios = usuarioRepository.count();
        long totalPublicaciones = publicacionRepository.count();
        long totalComentarios = comentarioRepository.count();

        return new AdminDashboardStatsResponse(totalUsuarios, totalPublicaciones, totalComentarios);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }
}
