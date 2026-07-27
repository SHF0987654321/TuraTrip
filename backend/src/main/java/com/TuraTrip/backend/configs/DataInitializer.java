package com.TuraTrip.backend.configs;

import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.RolRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import com.TuraTrip.backend.services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public void run(ApplicationArguments args) {
        // 1. Inicializar Roles
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
            }
        }

        // 2. Inicializar Administrador por primera vez si no existe ninguno
        String correoAdmin = "adminturatrip@gmail.com"; // Modifica por el correo real de tu admin inicial
        if (!usuarioRepository.existsByCorreo(correoAdmin)) {
            Rol rolAdmin = rolRepository.findByNombre("ADMIN")
                .orElseThrow(() -> new RuntimeException("Error fatal: Rol ADMIN no configurado."));

            // Generamos una clave temporal dinámica y segura de 12 caracteres
            String claveTemporal = UUID.randomUUID().toString().substring(0, 12);

            Usuario adminInicial = Usuario.builder()
                .nombre("Administrador Principal")
                .correo(correoAdmin)
                .clave(passwordEncoder.encode(claveTemporal))
                .roles(Set.of(rolAdmin))
                .habilitado(true)
                .build();

            usuarioRepository.save(adminInicial);
            log.info("🚀 Cuenta de Administrador inicial creada exitosamente");

            // Lanzamos el correo de cambio obligatorio de contraseña
            emailService.enviarCorreoCambioClaveAdmin(correoAdmin, adminInicial.getNombre(), claveTemporal);
        } else {
            log.info("⚙️  El usuario administrador ya existe, omitiendo inicialización");
        }
    }
}
