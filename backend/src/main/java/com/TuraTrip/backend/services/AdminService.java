package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.AdminDashboardStatsResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import java.util.List;

public interface AdminService {
    AdminDashboardStatsResponse obtenerEstadisticas();
    List<UsuarioResponse> listarTodosLosUsuarios();
}
