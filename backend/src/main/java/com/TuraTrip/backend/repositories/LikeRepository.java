package com.TuraTrip.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.TuraTrip.backend.models.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUsuarioIdAndPublicacionId(
            Long usuarioId,
            Long publicacionId
    );

    Long countByPublicacionId(Long publicacionId);

}
