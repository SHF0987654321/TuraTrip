# TuraTrip — Backend

API REST construida con Spring Boot 4 y Java 21.

## Requisitos para desarrollo local (sin Docker)

- Java 21+
- Maven 3.9+
- MySQL 9.7

> Con Docker no necesitas instalar nada. Usa `docker compose up` desde la raíz del proyecto.

## Variables de entorno

Copia `.env.example` en la raíz del proyecto y ajusta los valores:

| Variable                                                      | Descripción                                                                                                                                                                                                   | Default dev                                                        |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------- |
| `DB_URL`                                                      | URL JDBC de conexión a MySQL                                                                                                                                                                                  | `jdbc:mysql://127.0.0.1:3306/turatrip_db...`                       |
| `DB_USERNAME`                                                 | Usuario de la base de datos                                                                                                                                                                                   | `root`                                                             |
| `DB_PASSWORD`                                                 | Contraseña de la base de datos                                                                                                                                                                                | `root`                                                             |
| `DB_DRIVER`                                                   | Driver JDBC                                                                                                                                                                                                   | `com.mysql.cj.jdbc.Driver`                                         |
| `HIBERNATE_DIALECT`                                           | Dialecto de Hibernate (opcional, se autodetecta)                                                                                                                                                              | —                                                                  |
| `JPA_DDL_AUTO`                                                | Estrategia de `ddl-auto` (usar `validate` en prod; el esquema lo gestiona Flyway)                                                                                                                             | `update`                                                           |
| `JWT_SECRET`                                                  | Secreto para firmar tokens JWT (mín. 32 chars)                                                                                                                                                                | `9780fbdc24f409a10c25bd5120ed1d484b47d5a4c78c73a834d2fcb50d293362` |
| `JWT_EXPIRATION_MS`                                           | Duración del token en milisegundos                                                                                                                                                                            | `86400000` (24h)                                                   |
| `FRONTEND_URL`                                                | Origin permitido para CORS y base de los enlaces en los correos. En local: `http://localhost:3000`. En producción: la URL pública de tu dominio, **sin** `/api` ni slash final (ej. `https://tu-dominio.com`) | `http://localhost:3000`                                            |
| `API_URL`                                                     | Solo se usa en el build del frontend para construir `NEXT_PUBLIC_API_URL`. En local: `http://localhost:8080/api`. En producción: tu dominio **con** `/api` al final (ej. `https://tu-dominio.com/api`)        | `http://localhost:8080/api`                                        |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` | Servidor SMTP para correos de verificación/recuperación                                                                                                                                                       | —                                                                  |
| `UPLOADS_DIR`                                                 | Carpeta donde se guardan las imágenes subidas                                                                                                                                                                 | `/app/uploads`                                                     |
| `MAX_FILE_SIZE` / `MAX_REQUEST_SIZE`                          | Límites de tamaño para subida de archivos                                                                                                                                                                     | `10MB`                                                             |

> ⚠️ `API_URL` y `FRONTEND_URL` no son intercambiables: `API_URL` lleva `/api` (se concatena con rutas como `/v1/auth/login`), `FRONTEND_URL` no lleva nada extra (Spring Security lo usa tal cual como `Origin` permitido en CORS).

### Correo (SMTP)

El envío de correos (`EmailServiceImpl`) es asíncrono (`@Async`) y solo registra el error en el log si falla — nunca hace fallar el registro/login. Si un correo no llega:

1. Revisa los logs: `docker logs turatrip-backend-prod | grep -i correo`.
2. Si dice "Correo enviado con éxito" pero no llega, revisa Spam primero.
3. La config actual (`spring.mail.properties.mail.smtp.starttls.enable=true`) solo funciona con **puerto 587 (STARTTLS)**. Si usas puerto 465 (SSL implícito), hay que ajustar la propiedad a `mail.smtp.ssl.enable=true`.
4. En producción, usa un dominio propio + proveedor transaccional (Resend, Brevo, SES) con SPF/DKIM/DMARC — una cuenta Gmail personal como remitente automático suele terminar en Spam sin importar la configuración del código.

## Ejecutar sin Docker

Abre una terminal en el proyecto y ejecuta:

```bash
cd backend
./mvnw spring-boot:run
```

o abrela terminal directamente en la carpeta backend del proyecto y ejecuta:

```bash
./mvnw spring-boot:run
```

## Inicialización de datos

Al arrancar, el sistema crea automáticamente los roles `USUARIO` y `ADMIN`
si no existen en la base de datos (via `DataInitializer`).

## Cambios en base de datos

| Versión | Cambio                                      |
| :------ | :------------------------------------------ |
| SUG-1   | Tablas `usuarios`, `roles`, `usuario_roles` |

## Despliegue en producción

Ver la sección [🚢 Despliegue en Producción](../README.md#-despliegue-en-producción-cicd) en el README principal para el flujo de CI/CD, la configuración de nginx como reverse proxy y los secrets requeridos en GitHub Actions.

## Endpoints disponibles

La documentación completa e interactiva de la API se genera automáticamente con springdoc-openapi y vive en Swagger UI:

- Local: `http://localhost:8080/swagger-ui.html`
- Especificación OpenAPI (JSON): `http://localhost:8080/v3/api-docs`
- Documentación pública en línea (hosteada): _próximamente_

> Mantener aquí una tabla manual de endpoints se desactualiza rápido a medida que el proyecto crece; Swagger siempre refleja el estado real del código porque se genera desde las anotaciones de los controladores.

Resumen de los recursos disponibles (`/api/v1/...`): `auth` (registro, login, verificación de cuenta, recuperación de contraseña), `usuarios` (perfil propio y ajeno, foto de perfil), `publicaciones` (feed, CRUD, filtrado por usuario), `publicaciones/{id}/comentarios` (CRUD de comentarios) y `categorias` y `admin` (protegidos, solo rol `ADMIN`).
