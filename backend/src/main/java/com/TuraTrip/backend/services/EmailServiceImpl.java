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
            <div style='font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 20px;'>
                <h2 style='color: hsl(174, 72%%, 40%%); margin-bottom: 16px;'>¡Hola, %s!</h2>
                <p style='color: #334155; line-height: 1.5;'>Gracias por unirte a TuraTrip. Por favor, confirma tu cuenta haciendo clic en el siguiente botón:</p>
                <div style='margin: 24px 0;'>
                    <a href='%s' target='_blank' rel='noopener noreferrer' style='background-color: hsl(174, 72%%, 40%%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Verificar Cuenta</a>
                </div>
                <p style='color: #64748b; font-size: 13px;'>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br><a href='%s' target='_blank' style='color: hsl(174, 72%%, 40%%);'>%s</a></p>
            </div>
            """, nombre, enlace, enlace, enlace);

        enviarHtml(destino, "Verifica tu cuenta - TuraTrip", html);
    }

    @Async
    @Override
    public void enviarCorreoRecuperacion(String destino, String nombre, String tokenRecuperacion) {
        String enlace = frontendUrl + "/restablecer-clave?token=" + tokenRecuperacion;

        String html = String.format("""
            <div style='font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 20px;'>
                <h2 style='color: hsl(174, 72%%, 40%%); margin-bottom: 16px;'>Restablecer Contraseña - TuraTrip</h2>
                <p style='color: #334155; line-height: 1.5;'>Hola, %s. Has solicitado restablecer tus credenciales de acceso.</p>
                <p style='color: #334155; line-height: 1.5;'>Este enlace es de un solo uso y vencerá en 15 minutos. Haz clic abajo para proceder:</p>
                <div style='margin: 24px 0;'>
                    <a href='%s' target='_blank' rel='noopener noreferrer' style='background-color: hsl(174, 72%%, 40%%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Restablecer Contraseña</a>
                </div>
                <p style='color: #94a3b8; font-size: 12px; margin-top: 24px;'>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
            """, nombre, enlace);

        enviarHtml(destino, "Restablece tu contraseña - TuraTrip", html);
    }

    @Async
    @Override
    public void enviarCorreoCambioClaveAdmin(String destino, String nombre, String claveTemporal) {
        String enlace = frontendUrl + "/login";

        String html = String.format("""
            <div style='font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 20px;'>
                <h2 style='color: #0f172a; margin-bottom: 16px;'>Acceso Administrativo - TuraTrip</h2>
                <p style='color: #334155;'>Hola %s, se ha generado tu cuenta de Administrador del sistema.</p>
                <p style='color: #334155;'>Tu contraseña temporal de acceso es: <strong style='font-size: 16px; color: #ef4444; background: #fef2f2; padding: 2px 8px; border-radius: 4px;'>%s</strong></p>
                <p style='color: #334155;'>Por seguridad, debes iniciar sesión e ir a tu panel para cambiar esta clave inmediatamente.</p>
                <div style='margin: 24px 0;'>
                    <a href='%s' target='_blank' rel='noopener noreferrer' style='background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Ir al Login</a>
                </div>
            </div>
            """, nombre, claveTemporal, enlace);

        enviarHtml(destino, "Tu cuenta de Administrador está lista - Cambio Obligatorio de Clave", html);
    }

    private void enviarHtml(String destino, String asunto, String cuerpoHtml) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            // Establecemos el remitente con un alias visible para el cliente de correo
            helper.setFrom(String.format("TuraTrip <%s>", remitente));
            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(cuerpoHtml, true);

            mailSender.send(mensaje);
            log.info("📧 Correo enviado con éxito a {}", destino);
        } catch (MessagingException e) {
            log.error("❌ Error al estructurar o enviar el correo a {}: {}", destino, e.getMessage());
        } catch (Exception e) {
            log.error("❌ Error inesperado al enviar correo a {}: {}", destino, e.getMessage());
        }
    }
}
