# Etapa 1 — build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Etapa 2 — runtime (imagen mínima)
FROM eclipse-temurin:21-jre-alpine

# Definir directorio de trabajo principal
WORKDIR /app

# Crear usuario y grupo (seguridad)
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar tus archivos
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar
COPY entrypoint.sh .

# Permisos y configuración final
RUN chmod +x entrypoint.sh && chown spring:spring entrypoint.sh

# Exponer puerto
EXPOSE 8080

# Punto de entrada
ENTRYPOINT ["./entrypoint.sh"]