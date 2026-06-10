package com.TuraTrip.backend.services;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.configs.JwtUtils;
import com.TuraTrip.backend.dtos.request.LoginRequest;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.AuthResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.exceptions.*;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.models.*;
import com.TuraTrip.backend.repositories.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new CorreoYaRegistradoException(request.correo());
        }

        Rol rolUsuario = rolRepository.findByNombre("USUARIO")
            .orElseThrow(() -> new ResourceNotFoundException("El rol USUARIO no está configurado."));

        Usuario usuario = Usuario.builder()
            .nombre(request.nombre())
            .correo(request.correo())
            .clave(passwordEncoder.encode(request.clave()))
            .roles(Set.of(rolUsuario))
            .habilitado(false)
            .build();
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Lógica de token de verificación
        String tokenStr = UUID.randomUUID().toString();
        Token tokenVerificacion = Token.builder()
            .token(tokenStr)
            .usuario(usuarioGuardado)
            .tipo(TipoToken.VERIFICACION)
            .fechaExpiracion(LocalDateTime.now().plusHours(24))
            .usado(false)
            .build();
        
        tokenRepository.save(tokenVerificacion);
        emailService.enviarCorreoVerificacion(usuarioGuardado.getCorreo(), usuarioGuardado.getNombre(), tokenStr);

        return usuarioMapper.toResponse(usuarioGuardado);
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

    @Override
    @Transactional
    public void confirmarToken(String tokenStr) {
        Token tokenVerificacion = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.VERIFICACION)
            .orElseThrow(() -> new ResourceNotFoundException("Enlace no válido."));

        if (tokenVerificacion.isUsado()) throw new TokenVerificacionException("Ya verificado.");
        if (tokenVerificacion.estaExpirado()) throw new TokenExpiradoException("Enlace expirado.");

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
        Token tokenRec = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.RECUPERACION)
            .orElseThrow(() -> new ResourceNotFoundException("Enlace no válido."));

        if (tokenRec.isUsado()) throw new TokenVerificacionException("Enlace ya utilizado.");
        if (tokenRec.estaExpirado()) throw new TokenExpiradoException("Enlace expirado.");

        Usuario usuario = tokenRec.getUsuario();
        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);

        tokenRec.setUsado(true);
        tokenRepository.save(tokenRec);
    }
}