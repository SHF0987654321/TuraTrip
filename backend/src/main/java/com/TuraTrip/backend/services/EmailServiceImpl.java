package com.TuraTrip.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remitente;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    @Override
    public void enviarCorreoVerificacion(String destino, String nombre, String tokenVerificacion) {
        String enlace = frontendUrl + "/verificar-cuenta?token=" + tokenVerificacion;
        
        String html = String.format("""
            <div style='font-family: sans-serif; max-width: 600px; margin: auto;'>
                <h2 style='color: hsl(174, 72%%, 40%%);'>¡Hola, %s!</h2>
                <p>Gracias por unirte a TuraTrip. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href='%s' style='background-color: hsl(174, 72%%, 40%%); color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;'>Verificar Cuenta</a>
            </div>
            """, nombre, enlace);

        enviarHtml(destino, "Verifica tu cuenta - TuraTrip", html);
    }

    @Async
    @Override
    public void enviarCorreoRecuperacion(String destino, String nombre, String tokenRecuperacion) {

        String enlace = frontendUrl + "/restablecer-clave?token=" + tokenRecuperacion;
        
        String html = String.format("""
            <div style='font-family: sans-serif; max-width: 600px; margin: auto;'>
                <h2 style='color: hsl(174, 72%%, 40%%);'>Restablecer Contraseña - TuraTrip</h2>
                <p>Hola, %s. Has solicitado restablecer tus credenciales de acceso.</p>
                <p>Este enlace es de un solo uso y vencerá en 15 minutos. Haz clic abajo para proceder:</p>
                <a href='%s' style='background-color: hsl(174, 72%%, 40%%); color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;'>Restablecer Contraseña</a>
                <p style='color: #7f8c8d; font-size: 12px; margin-top: 20px;'>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
            """, nombre, enlace);

        enviarHtml(destino, "Restablece tu contraseña - TuraTrip", html);
    }

    @Async
    @Override
    public void enviarCorreoCambioClaveAdmin(String destino, String nombre, String claveTemporal) {
        String enlace = frontendUrl + "/login";
        
        String html = String.format("""
            <div style='font-family: sans-serif; max-width: 600px; margin: auto;'>
                <h2 style='color: #2c3e50;'>Acceso Administrativo - TuraTrip</h2>
                <p>Hola %s, se ha generado tu cuenta de Administrador del sistema.</p>
                <p>Tu contraseña temporal de acceso es: <strong style='font-size: 16px; color: #e74c3c;'>%s</strong></p>
                <p>Por seguridad, debes iniciar sesión e ir a tu panel para cambiar esta clave inmediatamente.</p>
                <a href='%s' style='background-color: #2c3e50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;'>Ir al Inicio de Sesión</a>
            </div>
            """, nombre, claveTemporal, enlace);

        enviarHtml(destino, "Tu cuenta de Administrador está lista - Cambio Obligatorio de Clave", html);
    }

    private void enviarHtml(String destino, String asunto, String cuerpoHtml) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            
            helper.setFrom(remitente);
            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(cuerpoHtml, true);

            mailSender.send(mensaje);
            log.info("📧 Correo enviado con éxito a {}", destino);
        } catch (MessagingException e) {
            log.error("❌ Error al estructurar o enviar el correo a {}: {}", destino, e.getMessage());
        }
    }
}