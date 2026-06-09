package com.TuraTrip.backend.repositories;

import com.TuraTrip.backend.models.TokenVerificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TokenVerificacionRepository extends JpaRepository<TokenVerificacion, Long> {
    Optional<TokenVerificacion> findByToken(String token);
}