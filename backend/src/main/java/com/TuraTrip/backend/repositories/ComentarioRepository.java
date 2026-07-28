package com.TuraTrip.backend.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.TuraTrip.backend.models.Comentario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByPublicacionIdOrderByFechaCreacionAsc(Long publicacionId);

    Page<Comentario> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId, Pageable pageable);

}
