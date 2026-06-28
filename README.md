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

| Variable | Descripción | Default dev |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base del backend | `http://localhost:8080` |

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

| Ruta | Descripción |
| :--- | :--- |
| `/` | Landing — acceso a login y registro |
| `/registro` | Formulario de registro de usuario |
| `/login` | Formulario de inicio de sesión *(próximo)* |
| `/feed` | Feed principal *(próximo)* |
| `/lugar/[id]` | Detalle de un lugar turístico *(próximo)* |
| `/perfil/[id]` | Perfil de usuario *(próximo)* |