# Etapa de construcción

FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar archivos

COPY . .

# Compilar proyecto

RUN mvn clean package -DskipTests

# Imagen final

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR generado

COPY --from=build /app/target/*.jar app.jar

# Puerto para Render

EXPOSE 8080

# Ejecutar aplicación

ENTRYPOINT ["java", "-jar", "app.jar"]

