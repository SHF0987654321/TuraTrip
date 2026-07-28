package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.UbicacionSugerenciaDTO;
import java.util.List;

public interface NominatimService {
    List<UbicacionSugerenciaDTO> buscarSugerencias(String query, int limit);
}
