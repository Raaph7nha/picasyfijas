# Etapa de construcción

FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiar Maven Wrapper y configuración

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Dar permisos de ejecución al wrapper

RUN chmod +x mvnw

# Descargar dependencias

RUN ./mvnw dependency:go-offline

# Copiar código fuente

COPY src ./src

# Compilar proyecto

RUN ./mvnw clean package -DskipTests

# Etapa final

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR generado

COPY --from=build /app/target/picas-fijas-0.0.1-SNAPSHOT.jar app.jar

# Exponer puerto

EXPOSE 8080

# Variable de entorno para Render

ENV PORT=8080

# Ejecutar aplicación

ENTRYPOINT ["java", "-jar", "app.jar"]
