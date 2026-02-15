# DevOps Documentation - Tap-Taza Cleaning Services App

This document outlines the containerization strategy, environment configuration, and deployment practices for the Tap-Taza Spring Boot backend application.

---

## Table of Contents

1. [Dockerfile Design](#1-dockerfile-design)
2. [Docker Compose Structure](#2-docker-compose-structure)
3. [Environment Configuration](#3-environment-configuration)
4. [Development Workflow](#4-development-workflow)
5. [Production Considerations](#5-production-considerations)

---

## 1. Dockerfile Design

### Multi-Stage Build Strategy

The Dockerfile uses a multi-stage build to optimize image size and build performance. This separates the build environment from the runtime environment.

```dockerfile
# ===========================================
# Stage 1: Build Stage
# ===========================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Gradle wrapper and build files first (for layer caching)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Download dependencies (cached if build files unchanged)
RUN chmod +x ./gradlew && ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build the application
RUN ./gradlew bootJar --no-daemon -x test

# ===========================================
# Stage 2: Runtime Stage
# ===========================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# JVM optimization flags
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -Djava.security.egd=file:/dev/./urandom"

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Layer Optimization Explained

| Layer | Purpose | Cache Benefit |
|-------|---------|---------------|
| Gradle wrapper | Build tool | Rarely changes |
| Build files | Dependencies definition | Changes with dependency updates |
| Dependencies download | Fetch libraries | Cached unless build files change |
| Source code | Application code | Changes frequently |
| Runtime image | Minimal JRE | Stable base layer |

### Alternative: Maven Build

If using Maven instead of Gradle:

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime (same as above)
FROM eclipse-temurin:17-jre-alpine AS runtime
# ... (identical to Gradle version)
```

---

## 2. Docker Compose Structure

### Complete docker-compose.yml

```yaml
version: '3.8'

services:
  # ===========================================
  # Spring Boot Application Service
  # ===========================================
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: taptaza-api
    restart: unless-stopped
    ports:
      - "${APP_PORT:-8080}:8080"
    environment:
      # Spring profiles
      - SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-dev}

      # Database configuration
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/${POSTGRES_DB}
      - SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
      - SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}

      # JPA/Hibernate
      - SPRING_JPA_HIBERNATE_DDL_AUTO=${DDL_AUTO:-validate}
      - SPRING_JPA_SHOW_SQL=${SHOW_SQL:-false}

      # Security
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}

      # Twilio SMS
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}

      # Application settings
      - APP_BASE_URL=${APP_BASE_URL:-http://localhost:8080}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - taptaza-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    volumes:
      - app-logs:/app/logs
    # Resource limits (production)
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  # ===========================================
  # PostgreSQL Database Service
  # ===========================================
  db:
    image: postgres:15-alpine
    container_name: taptaza-db
    restart: unless-stopped
    ports:
      - "${DB_PORT:-5432}:5432"
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
    networks:
      - taptaza-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

# ===========================================
# Networks
# ===========================================
networks:
  taptaza-network:
    driver: bridge
    name: taptaza-network

# ===========================================
# Volumes
# ===========================================
volumes:
  postgres-data:
    name: taptaza-postgres-data
  app-logs:
    name: taptaza-app-logs
```

### Service Descriptions

| Service | Image | Purpose |
|---------|-------|---------|
| `app` | Custom (Spring Boot) | REST API backend |
| `db` | postgres:15-alpine | Primary database |

### Volume Descriptions

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `postgres-data` | `/var/lib/postgresql/data` | Persistent database storage |
| `app-logs` | `/app/logs` | Application log files |

### Network Configuration

- **Network Name**: `taptaza-network`
- **Driver**: `bridge` (default Docker network driver)
- **Internal DNS**: Services communicate via container names (e.g., `db:5432`)

---

## 3. Environment Configuration

### .env.example File Structure

Create a `.env.example` file as a template for environment variables:

```bash
# ===========================================
# Tap-Taza Environment Configuration
# ===========================================
# Copy this file to .env and fill in the values
# NEVER commit .env to version control

# ===========================================
# Application Settings
# ===========================================
APP_PORT=8080
APP_BASE_URL=http://localhost:8080
SPRING_PROFILES_ACTIVE=dev

# ===========================================
# Database Configuration
# ===========================================
POSTGRES_DB=taptaza
POSTGRES_USER=taptaza_user
POSTGRES_PASSWORD=<strong-password-here>
DB_PORT=5432

# JPA Settings
DDL_AUTO=update
SHOW_SQL=false

# ===========================================
# Security - JWT Configuration
# ===========================================
# Generate with: openssl rand -base64 64
JWT_SECRET=<your-256-bit-secret-key>
JWT_EXPIRATION=86400000

# ===========================================
# Twilio SMS Configuration
# ===========================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=+1234567890

# ===========================================
# Optional: Logging
# ===========================================
LOG_LEVEL=INFO
```

### Required Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `POSTGRES_DB` | Database name | `taptaza` | Yes |
| `POSTGRES_USER` | Database username | `taptaza_user` | Yes |
| `POSTGRES_PASSWORD` | Database password | `SecurePass123!` | Yes |
| `JWT_SECRET` | JWT signing key (min 256-bit) | Base64 encoded string | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `ACxxxx...` | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Token string | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio sender number | `+1234567890` | Yes |

### Generating Secure Values

```bash
# Generate JWT secret (256-bit)
openssl rand -base64 64

# Generate secure database password
openssl rand -base64 32

# Generate random string
tr -dc 'A-Za-z0-9!@#$%' </dev/urandom | head -c 32
```

---

## 4. Development Workflow

### Local Development Setup

#### Prerequisites

- Docker Desktop 4.x+
- Docker Compose V2
- Java 17 JDK (for IDE development)
- Git

#### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd tap-taza-cleaning-app/backend

# 2. Create environment file
cp .env.example .env
# Edit .env with your local values

# 3. Start the database only (for local development)
docker compose up db -d

# 4. Run the application locally with hot reload
./gradlew bootRun --args='--spring.profiles.active=dev'
```

#### Full Docker Development

```bash
# Build and start all services
docker compose up --build

# Start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f app
docker compose logs -f db

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Hot Reload Configuration

#### Option 1: Spring Boot DevTools (Recommended for IDE)

Add to `build.gradle`:

```gradle
dependencies {
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

Add to `application-dev.yml`:

```yaml
spring:
  devtools:
    restart:
      enabled: true
      poll-interval: 2s
      quiet-period: 1s
    livereload:
      enabled: true
```

#### Option 2: Docker with Volume Mount (Container Development)

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - ./src:/app/src:ro
      - ./build:/app/build
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DEVTOOLS_RESTART_ENABLED=true
```

### Database Initialization

#### Using Init Scripts

Place SQL files in `./init-scripts/` directory:

```
init-scripts/
├── 01-schema.sql
├── 02-seed-data.sql
└── 03-test-users.sql
```

Scripts execute alphabetically on first container creation.

#### Example Init Script (`01-schema.sql`)

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE booking_status AS ENUM (
    'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

CREATE TYPE user_role AS ENUM (
    'CUSTOMER', 'CLEANER', 'ADMIN'
);

-- Additional schema setup as needed
```

#### Resetting the Database

```bash
# Remove volumes and recreate
docker compose down -v
docker compose up -d db

# Or connect and reset manually
docker compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

---

## 5. Production Considerations

### Security Best Practices

#### Container Security

1. **Non-root user**: The Dockerfile creates and uses a non-root user (`appuser`)

2. **Read-only filesystem** (where possible):
   ```yaml
   services:
     app:
       read_only: true
       tmpfs:
         - /tmp
   ```

3. **No new privileges**:
   ```yaml
   services:
     app:
       security_opt:
         - no-new-privileges:true
   ```

4. **Secrets management** (Docker Swarm or external):
   ```yaml
   secrets:
     jwt_secret:
       external: true
     db_password:
       external: true
   ```

#### Network Security

1. **Internal network for database**:
   ```yaml
   services:
     db:
       ports: []  # Remove external port exposure in production
       networks:
         - internal

   networks:
     internal:
       internal: true
   ```

2. **Expose only necessary ports**

3. **Use TLS/SSL for external communication**

#### Environment Security

- Never commit `.env` files to version control
- Use secrets management (HashiCorp Vault, AWS Secrets Manager, etc.)
- Rotate credentials regularly
- Use different credentials per environment

### Logging Configuration

#### application-prod.yml

```yaml
logging:
  level:
    root: WARN
    com.taptaza: INFO
    org.springframework.security: WARN
    org.hibernate.SQL: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: /app/logs/taptaza-api.log
    max-size: 100MB
    max-history: 30
    total-size-cap: 3GB

# Structured logging for production (JSON)
spring:
  main:
    banner-mode: off
```

#### Docker Logging Driver

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
        labels: "service,environment"
```

#### Centralized Logging (ELK Stack example)

```yaml
services:
  app:
    logging:
      driver: "gelf"
      options:
        gelf-address: "udp://logstash:12201"
        tag: "taptaza-api"
```

### Resource Limits

#### Production docker-compose.prod.yml

```yaml
version: '3.8'

services:
  app:
    deploy:
      mode: replicated
      replicas: 2
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        order: start-first

  db:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
```

#### JVM Memory Configuration

For containerized Java applications:

```dockerfile
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseG1GC \
               -XX:+HeapDumpOnOutOfMemoryError \
               -XX:HeapDumpPath=/app/logs/heapdump.hprof"
```

### Health Checks and Monitoring

#### Spring Boot Actuator Configuration

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```

#### Kubernetes-Style Probes

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/actuator/health/readiness"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 60s
```

---

## Quick Reference Commands

```bash
# Development
docker compose up -d                    # Start all services
docker compose logs -f app              # Follow app logs
docker compose exec app sh              # Shell into app container
docker compose exec db psql -U user -d db  # Connect to database

# Build
docker compose build --no-cache         # Rebuild without cache
docker compose up --build               # Build and start

# Cleanup
docker compose down                     # Stop services
docker compose down -v                  # Stop and remove volumes
docker system prune -a                  # Clean unused Docker resources

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## File Structure Reference

```
backend/
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.example
├── .env                    # (gitignored)
├── .dockerignore
├── init-scripts/
│   ├── 01-schema.sql
│   └── 02-seed-data.sql
├── src/
│   └── ...
└── docs/
    └── DevOps.md           # This file
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial documentation |

---

**Maintained by**: Tap-Taza DevOps Team
