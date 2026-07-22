package com.TuraTrip.backend.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.configs.JwtUtils;
import com.TuraTrip.backend.dtos.request.LoginRequest;
import com.TuraTrip.backend.dtos.request.RegistroRequest;
import com.TuraTrip.backend.dtos.response.AuthResponse;
import com.TuraTrip.backend.dtos.response.UsuarioResponse;
import com.TuraTrip.backend.exceptions.CorreoYaRegistradoException;
import com.TuraTrip.backend.exceptions.CuentaInhabilitadaException;
import com.TuraTrip.backend.exceptions.CuentaYaVerificadaException;
import com.TuraTrip.backend.exceptions.ResourceNotFoundException;
import com.TuraTrip.backend.exceptions.TokenExpiradoException;
import com.TuraTrip.backend.exceptions.TokenVerificadoException;
import com.TuraTrip.backend.mappers.UsuarioMapper;
import com.TuraTrip.backend.models.Rol;
import com.TuraTrip.backend.models.Token;
import com.TuraTrip.backend.models.TipoToken;
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
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    private final EmailService emailService;
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

        // 1. Buscamos el usuario por correo
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
            .orElseThrow(() -> new BadCredentialsException("Correo o contraseña incorrectos."));

        // 2. Verificamos si la contraseña es correcta
        if (!passwordEncoder.matches(request.clave(), usuario.getClave())) {
            throw new BadCredentialsException("Correo o contraseña incorrectos.");
        }

        // 3. AHORA verificamos si está habilitado (Si llega aquí, la clave es correcta)
        if (!usuario.getHabilitado()) {
            throw new CuentaInhabilitadaException("Tu cuenta no ha sido activada. Por favor, revisa tu correo.");
        }

        // 4. Si todo está bien, generamos el token
        String token = jwtUtils.generateToken(usuario);
        return new AuthResponse(token, usuarioMapper.toResponse(usuario));
    }

    @Override
    @Transactional
    public void confirmarToken(String tokenStr) {
        Token tokenVerificacion = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.VERIFICACION)
            .orElseThrow(() -> new ResourceNotFoundException("Enlace no válido."));

        if (tokenVerificacion.isUsado()) throw new TokenVerificadoException("Ya verificado.");
        if (tokenVerificacion.estaExpirado()) throw new TokenExpiradoException("Enlace expirado.", tokenVerificacion.getUsuario().getCorreo());

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

        if (tokenRec.isUsado()) throw new TokenVerificadoException("Enlace ya utilizado.");
        if (tokenRec.estaExpirado()) throw new TokenExpiradoException("Enlace expirado.", tokenRec.getUsuario().getCorreo());

        Usuario usuario = tokenRec.getUsuario();
        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);

        tokenRec.setUsado(true);
        tokenRepository.save(tokenRec);
    }

    @Override
    @Transactional
    public void generarNuevoTokenVerificacion(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        if (usuario.getHabilitado()) {
            throw new CuentaYaVerificadaException("La cuenta ya está activa.");
        }

        // Buscamos si existe un token previo NO USADO
        Optional<Token> tokenExistente = tokenRepository.findByUsuarioAndTipoAndUsadoFalse(usuario, TipoToken.VERIFICACION);

        if (tokenExistente.isPresent()) {
            Token token = tokenExistente.get();
            // Si no ha expirado, reutilizamos o informamos
            if (token.getFechaExpiracion().isAfter(LocalDateTime.now())) {
                emailService.enviarCorreoVerificacion(usuario.getCorreo(), usuario.getNombre(), token.getToken());
                return; // Salimos sin crear nada nuevo
            }
        }

        // Si no había token o estaba expirado, creamos uno nuevo
        String tokenStr = UUID.randomUUID().toString();
        Token nuevoToken = Token.builder()
            .token(tokenStr)
            .usuario(usuario)
            .tipo(TipoToken.VERIFICACION)
            .fechaExpiracion(LocalDateTime.now().plusHours(24))
            .usado(false)
            .build();

        tokenRepository.save(nuevoToken);
        emailService.enviarCorreoVerificacion(usuario.getCorreo(), usuario.getNombre(), tokenStr);
    }
}
