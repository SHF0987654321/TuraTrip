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
import com.TuraTrip.backend.models.TokenVerificacion;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.RolRepository;
import com.TuraTrip.backend.repositories.TokenVerificacionRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import java.util.UUID;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    private final EmailService emailService;
    private final TokenVerificacionRepository tokenRepository;

    @Override
    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
       if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new CorreoYaRegistradoException(request.correo());
        }

        Rol rolUsuario = rolRepository.findByNombre("USUARIO")
            .orElseThrow(() -> new ResourceNotFoundException("auth.registro.rol_not_found"));

        Usuario usuario = Usuario.builder()
            .nombre(request.nombre())
            .correo(request.correo())
            .clave(passwordEncoder.encode(request.clave()))
            .roles(Set.of(rolUsuario))
            .habilitado(false)
            .build();
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        String tokenStr = UUID.randomUUID().toString();
        TokenVerificacion tokenVerificacion = TokenVerificacion.builder()
            .token(tokenStr)
            .usuario(usuarioGuardado)
            .fechaExpiracion(LocalDateTime.now().plusHours(24))
            .build();
        
        tokenRepository.save(tokenVerificacion);

        emailService.enviarCorreoVerificacion(usuarioGuardado.getCorreo(), usuarioGuardado.getNombre(), tokenStr);

        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    @Transactional
    public void confirmarToken(String token) {
        // 1. ¿Existe el token?
        TokenVerificacion tokenVerificacion = tokenRepository.findByToken(token)
            .orElseThrow(() -> new ResourceNotFoundException("El enlace de verificación no es válido."));

        // 2. ¿Ya fue utilizado?
        if (tokenVerificacion.getConfirmadoEn() != null) {
            throw new IllegalStateException("Este correo ya ha sido verificado anteriormente.");
        }

        // 3. ¿Ya expiró?
        if (tokenVerificacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("El enlace de verificación ha expirado.");
        }

        // 4. Si todo es correcto, marcamos el token como usado
        tokenVerificacion.setConfirmadoEn(LocalDateTime.now());
        tokenRepository.save(tokenVerificacion);

        // 5. Aquí activamos al usuario
        Usuario usuario = tokenVerificacion.getUsuario();
        usuario.setHabilitado(true);
        usuarioRepository.save(usuario);
    }
}