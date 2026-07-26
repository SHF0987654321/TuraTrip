# Etapa 1 — Build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B -q

# Etapa 2 — Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Crear el grupo y usuario asignando explícitamente el UID/GID 1000
RUN addgroup -g 1000 -S spring && \
    adduser -u 1000 -S spring -G spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app

COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Correr de forma nativa como el usuario 'spring' sin pasar por root
USER spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
