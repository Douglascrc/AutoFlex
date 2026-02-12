
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend-ui/package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY frontend-ui/ ./


RUN npm run build

FROM maven:3.9-eclipse-temurin-17-alpine AS backend-build

WORKDIR /app

COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./

RUN ./mvnw dependency:go-offline -B || true

COPY src ./src

COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache curl

RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

RUN chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-dev}", \
  "-jar", \
  "app.jar"]

