# Etapa de construcción
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar el wrapper de maven y el archivo de configuración
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Descargar dependencias
RUN ./mvnw dependency:go-offline

# Copiar el código fuente y compilar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa final
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el jar desde la etapa de construcción
COPY --from=build /app/target/picas-fijas-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV PORT=8080

# Iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
