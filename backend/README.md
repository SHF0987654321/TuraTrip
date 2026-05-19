# TuraTrip — Backend

API REST construida con Spring Boot 3 y Java 21.

## Requisitos para desarrollo local (sin Docker)

- Java 21+
- Maven 3.9+
- MySQL 9.7 corriendo en puerto 3306

> Con Docker no necesitas instalar nada. Usa `docker compose up` desde la raíz del proyecto.

## Variables de entorno

Copia `.env.example` en la raíz del proyecto y ajusta los valores:

| Variable | Descripción | Default dev |
| :--- | :--- | :--- |
| `DB_URL` | URL JDBC de conexión a MySQL | `jdbc:mysql://127.0.0.1:3306/turatrip_db...` |
| `DB_USERNAME` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `root` |
| `JWT_SECRET` | Secreto para firmar tokens JWT (mín. 32 chars) | `9780fbdc24f409a10c25bd5120ed1d484b47d5a4c78c73a834d2fcb50d293362` |
| `JWT_EXPIRATION_MS` | Duración del token en milisegundos | `86400000` (24h) |

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

| Versión | Cambio |
| :--- | :--- |
| SUG-1 | Tablas `usuarios`, `roles`, `usuario_roles`|

## Endpoints disponibles

| Método | Ruta | Auth | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/registro` | ❌ Público | Registro de usuario con rol USUARIO |