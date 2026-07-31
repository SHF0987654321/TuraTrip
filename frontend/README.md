# TuraTrip — Frontend

Aplicación web construida con Next.js 16, TypeScript y Tailwind CSS.

## Requisitos para desarrollo local (sin Docker)

- Node.js 22+
- npm 10+

> Con Docker no necesitas instalar nada. Usa `docker compose up` desde la raíz.

## Variables de entorno

Crea un archivo `.env.local` dentro de `frontend`:

```bash
cp frontend/.env.example frontend/.env.local
```

| Variable               | Descripción                                                                                                         | Default dev                 |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL base del backend, **incluyendo `/api`** (todos los servicios agregan rutas tipo `/v1/auth/login`)               | `http://localhost:8080/api` |
| `INTERNAL_BACKEND_URL` | Solo en producción/Docker: URL interna backend↔frontend dentro de la red de contenedores, para llamadas server-side | `http://backend:8080`       |

> ⚠️ Si `NEXT_PUBLIC_API_URL` no lleva `/api`, todas las llamadas del frontend fallarán con 404, ya que los controladores de Spring están mapeados bajo `/api/v1/...`.

## Ejecutar sin Docker

Abre una terminal en el proyecto y ejecuta los sigientes comandos:

```bash
cd frontend
npm install
npm run dev
```

O abre una terminal directamente en la carpeta frontend del proyecto y ejecuta:

```bash
npm install
npm run dev
```

## Rutas disponibles

Organizadas en grupos de rutas de Next.js App Router (`(auth)`, `(landing)`, `(main)`, `(admin)`) — los paréntesis no forman parte de la URL.

### Autenticación — grupo `(auth)`

| Ruta                 | Descripción                                               |
| :------------------- | :-------------------------------------------------------- |
| `/login`             | Inicio de sesión                                          |
| `/registro`          | Registro de usuario                                       |
| `/verificar-cuenta`  | Confirma la cuenta a partir del enlace enviado por correo |
| `/olvide-mi-clave`   | Solicita el enlace de recuperación de contraseña          |
| `/restablecer-clave` | Define la nueva contraseña con el token recibido          |

### Landing — grupo `(landing)`

| Ruta          | Descripción                  |
| :------------ | :--------------------------- |
| `/bienvenida` | Página de bienvenida pública |

### App principal — grupo `(main)`

| Ruta                  | Descripción                                        |
| :-------------------- | :------------------------------------------------- |
| `/`                   | Feed principal de publicaciones                    |
| `/publicaciones/[id]` | Detalle de una publicación (comentarios incluidos) |
| `/perfil`             | Perfil del usuario autenticado                     |
| `/perfil/[id]`        | Perfil público de otro usuario                     |

### Panel de administración — grupo `(admin)`

| Ruta                  | Descripción                        |
| :-------------------- | :--------------------------------- |
| `/dashboard`          | Estadísticas generales del sistema |
| `/dashboard/usuarios` | Listado y gestión de usuarios      |
