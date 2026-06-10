package com.TuraTrip.backend.configs;

import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.repositories.RolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RolRepository rolRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<String> rolesRequeridos = List.of("USUARIO", "ADMIN");

        for (String nombre : rolesRequeridos) {
            if (rolRepository.findByNombre(nombre).isEmpty()) {
                rolRepository.save(
                    Rol.builder()
                        .nombre(nombre)
                        .descripcion("Rol " + nombre.toLowerCase())
                        .build()
                );
                log.info("✅ Rol '{}' creado", nombre);
            } else {
                log.info("⚙️  Rol '{}' ya existe, omitiendo", nombre);
            }
        }
    }
}