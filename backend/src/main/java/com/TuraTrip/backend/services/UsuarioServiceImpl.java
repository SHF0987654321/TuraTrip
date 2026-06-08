package com.TuraTrip.backend.services;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import com.TuraTrip.backend.configs.JwtUtils;
import com.TuraTrip.backend.dtos.request.LoginRequest;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.AuthResponse;
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
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

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

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.correo(), request.clave())
        );

        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String token = jwtUtils.generateToken(usuario);
        return new AuthResponse(token, usuarioMapper.toResponse(usuario));
    }
}
