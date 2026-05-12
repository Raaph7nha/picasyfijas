# Etapa de construcción

FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiar todo el proyecto

COPY . .

# Dar permisos al Maven Wrapper

RUN chmod +x mvnw

# Compilar aplicación

RUN ./mvnw clean package -DskipTests

# Imagen final

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR generado

COPY --from=build /app/target/*.jar app.jar

# Puerto usado por Render

EXPOSE 8080

# Ejecutar aplicación

ENTRYPOINT ["java", "-jar", "app.jar"]
