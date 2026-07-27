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
import lombok.extern.slf4j.Slf4j;

@Slf4j
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

        // Generamos el primer token de verificación
        crearYEnviarTokenVerificacion(usuarioGuardado);

        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {

        // 1. Buscamos el usuario por correo
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
            .orElseThrow(() -> new BadCredentialsException("Correo o contraseña incorrectos."));

        // 2. Verificamos si la contraseña es correcta
        if (!passwordEncoder.matches(request.clave(), usuario.getClave())) {
            throw new BadCredentialsException("Correo o contraseña incorrectos.");
        }

        // 3. Verificamos si la cuenta no está activada
        if (!usuario.getHabilitado()) {
            // Reenviamos o generamos el token de verificación automáticamente
            gestionarReenvioTokenVerificacion(usuario);

            throw new CuentaInhabilitadaException(
                "Tu cuenta no ha sido activada. Se ha enviado un nuevo enlace de verificación a tu correo."
            );
        }

        // 4. Si todo está bien, generamos el JWT token
        String token = jwtUtils.generateToken(usuario);
        return new AuthResponse(token, usuarioMapper.toResponse(usuario));
    }

    @Override
    @Transactional
    public void confirmarToken(String tokenStr) {
        Token tokenVerificacion = tokenRepository.findByTokenAndTipo(tokenStr, TipoToken.VERIFICACION)
            .orElseThrow(() -> new ResourceNotFoundException("Enlace no válido."));

        // Si el token ya fue marcado como usado
        if (tokenVerificacion.isUsado()) {
            // Si el usuario ya quedó activo, retornamos sin lanzar excepción para evitar
            // fallos por peticiones duplicadas desde React StrictMode o dobles clics
            if (Boolean.TRUE.equals(tokenVerificacion.getUsuario().getHabilitado())) {
                return;
            }
            throw new TokenVerificadoException("Ya verificado.");
        }

        // Validación de expiración
        if (tokenVerificacion.estaExpirado()) {
            throw new TokenExpiradoException("Enlace expirado.", tokenVerificacion.getUsuario().getCorreo());
        }

        // Marcar como usado y activar la cuenta
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

        gestionarReenvioTokenVerificacion(usuario);
    }

    private void gestionarReenvioTokenVerificacion(Usuario usuario) {
        Optional<Token> tokenExistente = tokenRepository.findByUsuarioAndTipoAndUsadoFalse(usuario, TipoToken.VERIFICACION);

        if (tokenExistente.isPresent()) {
            Token token = tokenExistente.get();

            if (!token.estaExpirado()) {
                // Sigue vigente -> Reenviamos el correo con el token actual
                log.info("📧 Reenviando token de verificación vigente para el usuario: {}", usuario.getCorreo());
                emailService.enviarCorreoVerificacion(usuario.getCorreo(), usuario.getNombre(), token.getToken());
                return;
            }

            // Si ya expiró -> Lo marcamos como usado para inutilizarlo limpiamente
            token.setUsado(true);
            tokenRepository.save(token);
        }

        // Si no existía o expiró -> Generamos uno totalmente nuevo
        crearYEnviarTokenVerificacion(usuario);
    }

    private void crearYEnviarTokenVerificacion(Usuario usuario) {
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
