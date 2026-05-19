package com.TuraTrip.backend.services;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.exceptions.CorreoYaRegistradoException;
import com.TuraTrip.backend.exceptions.ResourceNotFoundException;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.RolRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Override
    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new CorreoYaRegistradoException(request.correo());
        }

        Rol rolUsuario = rolRepository.findByNombre("USUARIO")
            .orElseThrow(() -> new ResourceNotFoundException(
        "Rol USUARIO no encontrado. Verifica que exista en la base de datos."
            ));

        Usuario usuario = Usuario.builder()
            .nombre(request.nombre())
            .correo(request.correo())
            .clave(passwordEncoder.encode(request.clave()))
            .roles(Set.of(rolUsuario))
            .build();

        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }
    
}