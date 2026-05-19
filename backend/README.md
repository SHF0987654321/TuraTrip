# TuraTrip — Backend

API REST construida con Spring Boot para la plataforma de turismo social TuraTrip.

## Requisitos
- Java 21+
- Maven 3.9+
- Docker (para la base de datos)

## Base de datos

Levantar MySQL con Docker:
```bash
docker compose up -d
```

## Variables de entorno

Copia `.env.example` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|---|---|---|
| `DB_URL` | URL de conexión JDBC a MySQL | `jdbc:mysql://127.0.0.1:3306/turatrip_db...` |
| `DB_USERNAME` | Usuario de la BD | `root` |
| `DB_PASSWORD` | Contraseña de la BD | `root` |
| `JWT_SECRET` | Secreto para firmar JWT (mín. 32 chars) | ⚠️ cambiar |
| `JWT_EXPIRATION_MS` | Duración del token en ms | `86400000` (24h) |
| `PORT` | Puerto del servidor | `8080` |

## Inicialización de datos

Al arrancar, el sistema crea automáticamente los roles `USUARIO`, `OPERARIO` y `ADMIN` si no existen (via `DataInitializer`).

## Ejecutar

```bash
./mvnw spring-boot:run
```

## Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/registro` | ❌ | Registro de usuario |

## Cambios en base de datos

- Tablas gestionadas por Hibernate (`ddl-auto=update`)
- Constraint `UNIQUE` en `roles.nombre`
- Roles iniciales insertados por `DataInitializer`