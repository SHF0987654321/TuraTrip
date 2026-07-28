package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.UbicacionSugerenciaDTO;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NominatimServiceImpl implements NominatimService {
    private final RestTemplate restTemplate;
    private final String userAgent;

    public NominatimServiceImpl(@Value("${app.user-agent:Nominatim-TuraTrip-Backend}") String userAgent) {
        this.userAgent = userAgent;
        this.restTemplate = new RestTemplate();
        this.restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
            request.getHeaders().set(HttpHeaders.USER_AGENT, userAgent);
            return execution.execute(request, body);
        });
    }

    @Override
    public List<UbicacionSugerenciaDTO> buscarSugerencias(String query, int limit) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String url = "https://nominatim.openstreetmap.org/search";
        var params = new java.util.HashMap<String, String>();
        params.put("q", query.trim());
        params.put("format", "json");
        params.put("limit", String.valueOf(Math.min(limit, 10)));
        params.put("addressdetails", "0");

        JsonNode root;
        try {
            root = restTemplate.getForObject(url + "?q={q}&format={format}&limit={limit}&addressdetails={addressdetails}", JsonNode.class, params);
        } catch (Exception e) {
            return List.of();
        }

        List<UbicacionSugerenciaDTO> results = new ArrayList<>();
        if (root == null || !root.isArray()) {
            return results;
        }

        for (JsonNode item : root) {
            if (results.size() >= limit) break;

            String nombre = safeText(item, "display_name");
            String direccion = safeText(item, "display_name");
            String latStr = safeText(item, "lat");
            String lonStr = safeText(item, "lon");

            Double lat = parseDouble(latStr);
            Double lon = parseDouble(lonStr);

            if (lat != null && lon != null) {
                results.add(new UbicacionSugerenciaDTO(nombre, direccion, lat, lon));
            }
        }
        return results;
    }

    private String safeText(JsonNode node, String field) {
        JsonNode child = node.get(field);
        return (child == null || child.isMissingNode()) ? "" : child.asText("");
    }

    private Double parseDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch (Exception e) {
            return null;
        }
    }
}
