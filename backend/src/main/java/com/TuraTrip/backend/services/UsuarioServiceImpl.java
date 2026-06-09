package com.TuraTrip.backend.services;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.exceptions.CorreoYaRegistradoException;
import com.TuraTrip.backend.exceptions.ResourceNotFoundException;
import com.TuraTrip.backend.exceptions.TokenExpiradoException;
import com.TuraTrip.backend.exceptions.TokenVerificacionException;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.TipoToken;
import com.TuraTrip.backend.models.Token;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.RolRepository;
import com.TuraTrip.backend.repositories.TokenRepository;
import com.TuraTrip.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Override
    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
       if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new CorreoYaRegistradoException(request.correo());
        }

        Rol rolUsuario = rolRepository.findByNombre("USUARIO")
            .orElseThrow(() -> new ResourceNotFoundException("El rol USUARIO  no está configurado en el sistema. Contacta al administrador."));

        Usuario usuario = Usuario.builder()
            .nombre(request.nombre())
            .correo(request.correo())
            .clave(passwordEncoder.encode(request.clave()))
            .roles(Set.of(rolUsuario))
            .habilitado(false)
            .build();
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        String tokenStr = UUID.randomUUID().toString();
        Token tokenVerificacion = Token.builder()
            .token(tokenStr)
            .usuario(usuarioGuardado)
            .tipo(TipoToken.VERIFICACION) // <-- Configurado explícitamente
            .fechaExpiracion(LocalDateTime.now().plusHours(24)) // 24 horas para activarse
            .usado(false)
            .build();
        
        tokenRepository.save(tokenVerificacion);

        emailService.enviarCorreoVerificacion(usuarioGuardado.getCorreo(), usuarioGuardado.getNombre(), tokenStr);

        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    @Transactional
    public void confirmarToken(String tokenStr) {
        Token tokenVerificacion = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.VERIFICACION)
            .orElseThrow(() -> new ResourceNotFoundException("El enlace de verificación no es válido o no existe."));

        if (tokenVerificacion.isUsado()) {
            throw new TokenVerificacionException("Este correo ya ha sido verificado anteriormente.");
        }

        if (tokenVerificacion.estaExpirado()) {
            throw new TokenExpiradoException("El enlace de verificación ha expirado.");
        }

        tokenVerificacion.setUsado(true);
        tokenRepository.save(tokenVerificacion);

        Usuario usuario = tokenVerificacion.getUsuario();
        usuario.setHabilitado(true);
        usuarioRepository.save(usuario);
    }
    
    @Override
    @Transactional
    public void solicitarRecuperacionClave(String correo) {

        usuarioRepository.findByCorreo(correo).ifPresent(usuario -> {
            String tokenStr = UUID.randomUUID().toString();
            Token tokenRecuperacion = Token.builder()
                .token(tokenStr)
                .usuario(usuario)
                .tipo(TipoToken.RECUPERACION)
                .fechaExpiracion(LocalDateTime.now().plusMinutes(15))
                .usado(false)
                .build();
    
            tokenRepository.save(tokenRecuperacion);
            emailService.enviarCorreoRecuperacion(usuario.getCorreo(), usuario.getNombre(), tokenStr);
        });
    }
    @Override
    @Transactional
    public void cambiarClaveConToken(String tokenStr, String nuevaClave) {
        Token tokenRecuperacion = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.RECUPERACION)
            .orElseThrow(() -> new ResourceNotFoundException("El enlace de recuperación no es válido o no existe."));

        if (tokenRecuperacion.isUsado()) {
            throw new TokenVerificacionException("Este enlace ya fue utilizado.");
        }

        if (tokenRecuperacion.estaExpirado()) {
            throw new TokenExpiradoException("El enlace de recuperación ha expirado. Solicita uno nuevo.");
        }

        Usuario usuario = tokenRecuperacion.getUsuario();
        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);

        tokenRecuperacion.setUsado(true);
        tokenRepository.save(tokenRecuperacion);
    }

}