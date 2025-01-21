# FROM openjdk:17-jdk-slim as build
FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

COPY ./pom.xml ./pom.xml
COPY ./src ./src

RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jre-slim

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

# FROM openjdk:17
# WORKDIR /app
# COPY . /app
# RUN ./mvnw install
# CMD ["./mvnw", "spring-boot:run"]