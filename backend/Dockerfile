# Etapa 1 — build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Etapa 2 — runtime (imagen mínima)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# SEGURIDAD: Crear grupo y usuario de sistema sin permisos de login ni home seguro
RUN addgroup -S spring && adduser -S spring -G spring

# SEGURIDAD: Copiar el artefacto asignando la propiedad al nuevo usuario
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# SEGURIDAD: Switch al usuario aislado antes de la ejecución del proceso
USER spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]