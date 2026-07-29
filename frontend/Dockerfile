# -----------------------------------------------------------------
# ETAPA 1: Dependencias
# -----------------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# -----------------------------------------------------------------
# ETAPA 2: Compilación (Build)
# -----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Recibir variables en Build-Time desde GitHub Actions
ARG NEXT_PUBLIC_API_URL
ARG INTERNAL_BACKEND_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV INTERNAL_BACKEND_URL=$INTERNAL_BACKEND_URL

# Evita que el worker de Next.js se quede sin memoria RAM al compilar
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# -----------------------------------------------------------------
# ETAPA 3: Ejecución en Producción
# -----------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar solo lo estrictamente necesario del build estático/standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
