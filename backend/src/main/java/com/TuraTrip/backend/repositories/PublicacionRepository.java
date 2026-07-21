package com.TuraTrip.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.TuraTrip.backend.models.Publicacion;
import com.TuraTrip.backend.models.Usuario;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    List<Publicacion> findAllByUsuarioOrderByFechaCreacionDesc(Usuario usuario);

    List<Publicacion> findAllByOrderByFechaCreacionDesc();
}
