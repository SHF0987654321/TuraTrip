package com.TuraTrip.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

    Page<Publicacion> findAllByUsuarioId(Long usuarioId, Pageable pageable);

    Page<Publicacion> findAllByUsuario(Usuario usuario, Pageable pageable);

    int countByCategoriaId(Long categoriaId);
}
