# Dockerfile

FROM gradle:8.11.1-jdk17 AS build

WORKDIR /backend

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew clean build --no-daemon -x test

FROM openjdk:17-slim

WORKDIR /app

COPY --from=build /backend/build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
