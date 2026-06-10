# Etapa 1 — build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Etapa 2 — runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# SEGURIDAD: Cambiar el dueño de los archivos al usuario 'node' al copiarlos
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# SEGURIDAD: Forzar que el contenedor corra bajo el usuario sin privilegios
USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]