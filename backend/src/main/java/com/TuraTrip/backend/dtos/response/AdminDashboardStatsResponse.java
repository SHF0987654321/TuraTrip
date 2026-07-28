package com.TuraTrip.backend.dtos.response;

public record AdminDashboardStatsResponse(
    long totalUsuarios,
    long totalPublicaciones,
    long totalComentarios
) {}
