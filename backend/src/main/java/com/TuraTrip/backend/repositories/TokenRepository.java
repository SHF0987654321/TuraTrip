package com.TuraTrip.backend.repositories;

import com.TuraTrip.backend.models.Token;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.models.TipoToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByTokenAndTipo(String token, TipoToken tipo);
    Optional<Token> findByUsuarioAndTipoAndUsadoFalse(Usuario usuario, TipoToken tipo);
}