# Tap-Taza Backend - Spring Boot Project Structure

## Overview

This document outlines the Spring Boot backend architecture for the Tap-Taza cleaning services application. The backend follows a layered architecture pattern with clear separation of concerns, implementing RESTful APIs for mobile client consumption.

---

## Project Structure

```
backend/
├── src/main/java/com/taptaza/
│   ├── TapTazaApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   ├── TwilioConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── CompanyController.java
│   │   ├── BookingController.java
│   │   └── AddressController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── CompanyService.java
│   │   ├── BookingService.java
│   │   ├── AddressService.java
│   │   ├── SmsService.java
│   │   └── impl/
│   │       ├── AuthServiceImpl.java
│   │       ├── UserServiceImpl.java
│   │       ├── CompanyServiceImpl.java
│   │       ├── BookingServiceImpl.java
│   │       ├── AddressServiceImpl.java
│   │       └── SmsServiceImpl.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── CompanyRepository.java
│   │   ├── BookingRepository.java
│   │   ├── AddressRepository.java
│   │   └── OtpRepository.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Company.java
│   │   ├── Booking.java
│   │   ├── Address.java
│   │   ├── Otp.java
│   │   └── enums/
│   │       ├── UserRole.java
│   │       ├── BookingStatus.java
│   │       └── CleaningType.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── VerifyOtpRequest.java
│   │   │   ├── CreateBookingRequest.java
│   │   │   ├── UpdateUserRequest.java
│   │   │   └── AddressRequest.java
│   │   ├── response/
│   │   │   ├── AuthResponse.java
│   │   │   ├── UserResponse.java
│   │   │   ├── CompanyResponse.java
│   │   │   ├── BookingResponse.java
│   │   │   └── ApiResponse.java
│   │   └── mapper/
│   │       ├── UserMapper.java
│   │       ├── CompanyMapper.java
│   │       ├── BookingMapper.java
│   │       └── AddressMapper.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthFilter.java
│   │   └── UserPrincipal.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── BadRequestException.java
│       ├── UnauthorizedException.java
│       └── InvalidOtpException.java
├── src/main/resources/
│   ├── application.yml
│   └── application-dev.yml
├── src/test/java/com/taptaza/
│   └── ...
└── pom.xml
```

---

## 1. Package Structure Explanation

### `com.taptaza` - Root Package

| Package | Purpose |
|---------|---------|
| `config/` | Spring configuration classes for security, JWT, Twilio, CORS, and other beans |
| `controller/` | REST API endpoints that handle HTTP requests and responses |
| `service/` | Business logic layer with interfaces and implementations |
| `repository/` | Data access layer using Spring Data JPA repositories |
| `model/` | JPA entity classes representing database tables |
| `dto/` | Data Transfer Objects for request/response payloads |
| `security/` | JWT authentication and authorization components |
| `exception/` | Custom exceptions and global exception handling |

### Package Details

#### `config/`
Contains Spring `@Configuration` classes:
- **SecurityConfig.java** - Spring Security configuration, filter chain, authentication provider
- **JwtConfig.java** - JWT secret, expiration time, and related settings
- **TwilioConfig.java** - Twilio SDK initialization for SMS/OTP functionality
- **CorsConfig.java** - Cross-Origin Resource Sharing configuration for mobile app

#### `controller/`
REST controllers with `@RestController` annotation:
- **AuthController.java** - `/api/auth/*` - Login, OTP verification, token refresh
- **UserController.java** - `/api/users/*` - User profile management
- **CompanyController.java** - `/api/companies/*` - Cleaning company listings
- **BookingController.java** - `/api/bookings/*` - Booking CRUD operations
- **AddressController.java** - `/api/addresses/*` - User address management

#### `service/`
Business logic with interface + implementation pattern:
- Interfaces define contracts
- `impl/` subfolder contains implementations
- Enables easier testing and potential future swapping

#### `repository/`
Spring Data JPA repositories extending `JpaRepository`:
- Provides CRUD operations out of the box
- Custom query methods using method naming conventions
- `@Query` annotations for complex queries

#### `model/`
JPA entities with `@Entity` annotation:
- Map directly to PostgreSQL database tables
- Use Lombok for boilerplate reduction
- `enums/` subfolder for type-safe enumerations

#### `dto/`
Data Transfer Objects separated by direction:
- `request/` - Incoming payloads with validation annotations
- `response/` - Outgoing payloads (sanitized, no sensitive data)
- `mapper/` - MapStruct interfaces for entity-DTO conversion

#### `security/`
JWT authentication components:
- **JwtTokenProvider.java** - Token generation, validation, parsing
- **JwtAuthFilter.java** - Filter that intercepts requests and validates tokens
- **UserPrincipal.java** - Custom UserDetails implementation

#### `exception/`
Exception handling:
- **GlobalExceptionHandler.java** - `@ControllerAdvice` for centralized error handling
- Custom exception classes for specific error scenarios

---

## 2. Layer Responsibilities

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Mobile App)                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY FILTER CHAIN                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐  │
│  │ CORS Filter │ -> │ JWT Filter  │ -> │ Authentication Manager  │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CONTROLLER LAYER                              │
│  • Receives HTTP requests                                            │
│  • Validates request DTOs (@Valid)                                   │
│  • Delegates to Service layer                                        │
│  • Returns Response DTOs                                             │
│  • HTTP status code management                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
│  • Contains business logic                                           │
│  • Transaction management (@Transactional)                           │
│  • Coordinates between repositories                                  │
│  • Entity <-> DTO mapping                                            │
│  • External service integration (Twilio)                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       REPOSITORY LAYER                               │
│  • Data access operations                                            │
│  • JPA/Hibernate queries                                             │
│  • Entity persistence                                                │
│  • Database transaction participation                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL)                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Layer Details

#### Controller Layer
**Responsibility:** HTTP request/response handling

```
Annotations: @RestController, @RequestMapping, @GetMapping, @PostMapping, etc.

Key Principles:
- Thin controllers - minimal logic
- Validate input with @Valid
- Return ResponseEntity with appropriate status codes
- Use DTOs, never expose entities directly
- Handle path variables and query parameters
```

#### Service Layer
**Responsibility:** Business logic and orchestration

```
Annotations: @Service, @Transactional

Key Principles:
- All business rules implemented here
- Transaction boundaries defined here
- Coordinate multiple repository calls
- Handle entity-DTO conversions
- Integrate with external services (Twilio SMS)
- Throw custom exceptions for error cases
```

#### Repository Layer
**Responsibility:** Data persistence and retrieval

```
Annotations: @Repository (inherited from JpaRepository)

Key Principles:
- Extend JpaRepository<Entity, ID>
- Use derived query methods
- Custom @Query for complex operations
- No business logic - pure data access
- Support pagination with Pageable
```

---

## 3. Security Filter Chain Flow

### Authentication Flow (Phone + OTP)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHONE NUMBER LOGIN FLOW                          │
└────────────────────────────────────────────────────────────────────────┘

Step 1: Request OTP
┌──────────┐         ┌────────────────┐         ┌─────────────┐
│  Client  │ ──────> │ AuthController │ ──────> │ AuthService │
│          │  POST   │ /auth/login    │         │             │
│          │  phone  │                │         │             │
└──────────┘         └────────────────┘         └──────┬──────┘
                                                       │
                     ┌─────────────────────────────────┘
                     ▼
           ┌─────────────────┐         ┌─────────────┐
           │   SmsService    │ ──────> │   Twilio    │
           │ Generate OTP    │   SMS   │   API       │
           │ Store in DB     │         │             │
           └─────────────────┘         └─────────────┘

Step 2: Verify OTP & Get Token
┌──────────┐         ┌────────────────┐         ┌─────────────┐
│  Client  │ ──────> │ AuthController │ ──────> │ AuthService │
│          │  POST   │ /auth/verify   │         │ Verify OTP  │
│          │  OTP    │                │         │             │
└──────────┘         └────────────────┘         └──────┬──────┘
                                                       │
                     ┌─────────────────────────────────┘
                     ▼
           ┌─────────────────┐         ┌─────────────┐
           │ JwtTokenProvider│ ──────> │   Client    │
           │ Generate JWT    │  Token  │   Stores    │
           │                 │         │   Token     │
           └─────────────────┘         └─────────────┘
```

### JWT Authentication Filter Chain

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SPRING SECURITY FILTER CHAIN                        │
└─────────────────────────────────────────────────────────────────────────┘

HTTP Request
     │
     ▼
┌─────────────────────┐
│    CorsFilter       │  <- Handles CORS preflight requests
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────────────────────────┐
│   JwtAuthFilter     │ --> │ 1. Extract token from header        │
│                     │     │ 2. Validate token signature         │
│                     │     │ 3. Check token expiration           │
│                     │     │ 4. Load UserPrincipal               │
│                     │     │ 5. Set SecurityContext               │
└──────────┬──────────┘     └─────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ AuthorizationFilter │  <- Checks roles/permissions
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ExceptionTranslation│  <- Handles auth exceptions
│      Filter         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   FilterSecurity    │  <- Final authorization check
│    Interceptor      │
└──────────┬──────────┘
           │
           ▼
     Controller
```

### Security Configuration Summary

```
Public Endpoints (No Authentication Required):
├── POST /api/auth/login          - Request OTP
├── POST /api/auth/verify         - Verify OTP, get token
├── POST /api/auth/refresh        - Refresh expired token
├── GET  /api/companies           - List cleaning companies
└── GET  /api/companies/{id}      - Company details

Protected Endpoints (JWT Required):
├── GET/PUT  /api/users/me        - User profile
├── GET/POST /api/bookings        - User's bookings
├── PUT      /api/bookings/{id}   - Update booking
├── DELETE   /api/bookings/{id}   - Cancel booking
└── CRUD     /api/addresses       - User addresses

Admin Endpoints (JWT + ADMIN Role):
├── GET  /api/admin/users         - All users
├── GET  /api/admin/bookings      - All bookings
└── POST /api/admin/companies     - Create company
```

---

## 4. Configuration Properties

### application.yml (Base Configuration)

```yaml
spring:
  application:
    name: tap-taza-api

  # Database Configuration
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    driver-class-name: org.postgresql.Driver

  # JPA/Hibernate Configuration
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

  # Jackson Configuration
  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

# Server Configuration
server:
  port: ${PORT:8080}
  servlet:
    context-path: /api

# JWT Configuration
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000        # 24 hours in milliseconds
  refresh-expiration: 604800000  # 7 days in milliseconds

# Twilio Configuration
twilio:
  account-sid: ${TWILIO_ACCOUNT_SID}
  auth-token: ${TWILIO_AUTH_TOKEN}
  phone-number: ${TWILIO_PHONE_NUMBER}

# OTP Configuration
otp:
  expiration: 300000  # 5 minutes in milliseconds
  length: 6

# Logging
logging:
  level:
    root: INFO
    com.taptaza: INFO
    org.springframework.security: INFO
```

### application-dev.yml (Development Profile)

```yaml
spring:
  # Development Database
  datasource:
    url: jdbc:postgresql://localhost:5432/taptaza_dev
    username: postgres
    password: postgres

  # JPA Development Settings
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

# Development Server
server:
  port: 8080

# Development JWT (NOT FOR PRODUCTION)
jwt:
  secret: dev-secret-key-minimum-256-bits-for-hs256-algorithm-security
  expiration: 86400000

# Development Logging
logging:
  level:
    com.taptaza: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://host:5432/taptaza` |
| `DATABASE_USERNAME` | Database username | `taptaza_user` |
| `DATABASE_PASSWORD` | Database password | `secure_password` |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | `your-256-bit-secret...` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `ACxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `your_auth_token` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | `+1234567890` |
| `PORT` | Server port (optional) | `8080` |

---

## 5. Dependencies (pom.xml)

### Complete pom.xml Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.2</version>
        <relativePath/>
    </parent>

    <groupId>com.taptaza</groupId>
    <artifactId>tap-taza-api</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>Tap-Taza API</name>
    <description>Backend API for Tap-Taza Cleaning Services App</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.3</jjwt.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <twilio.version>10.1.0</twilio.version>
    </properties>

    <dependencies>

        <!-- ==================== -->
        <!-- Spring Boot Starters -->
        <!-- ==================== -->

        <!-- Spring Boot Web - REST API support -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Security - Authentication & Authorization -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Boot Data JPA - Database access -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Validation - Request validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- ==================== -->
        <!-- Database             -->
        <!-- ==================== -->

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- ==================== -->
        <!-- Security - JWT       -->
        <!-- ==================== -->

        <!-- JJWT API -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>

        <!-- JJWT Implementation -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- JJWT Jackson Support -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- ==================== -->
        <!-- External Services    -->
        <!-- ==================== -->

        <!-- Twilio SDK - SMS/OTP -->
        <dependency>
            <groupId>com.twilio.sdk</groupId>
            <artifactId>twilio</artifactId>
            <version>${twilio.version}</version>
        </dependency>

        <!-- ==================== -->
        <!-- Code Generation      -->
        <!-- ==================== -->

        <!-- Lombok - Reduce boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- MapStruct - DTO mapping -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>

        <!-- ==================== -->
        <!-- Development Tools    -->
        <!-- ==================== -->

        <!-- DevTools - Hot reload -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Configuration Processor -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- ==================== -->
        <!-- Testing              -->
        <!-- ==================== -->

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Spring Security Test -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- H2 Database for Testing -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <!-- Spring Boot Maven Plugin -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <!-- Maven Compiler Plugin - For Lombok + MapStruct -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok-mapstruct-binding</artifactId>
                            <version>0.2.0</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

### Dependency Summary Table

| Dependency | Version | Purpose |
|------------|---------|---------|
| spring-boot-starter-web | 3.2.2 | REST API, embedded Tomcat |
| spring-boot-starter-security | 3.2.2 | Authentication, authorization |
| spring-boot-starter-data-jpa | 3.2.2 | JPA/Hibernate ORM |
| spring-boot-starter-validation | 3.2.2 | Bean validation (@Valid) |
| postgresql | Runtime | PostgreSQL JDBC driver |
| jjwt-api/impl/jackson | 0.12.3 | JWT token handling |
| twilio | 10.1.0 | SMS/OTP via Twilio |
| lombok | Managed | Reduce boilerplate code |
| mapstruct | 1.5.5 | Entity-DTO mapping |

---

## API Endpoint Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Request OTP | Public |
| POST | `/auth/verify` | Verify OTP, get JWT | Public |
| POST | `/auth/refresh` | Refresh JWT token | Public |
| GET | `/users/me` | Get current user profile | JWT |
| PUT | `/users/me` | Update current user profile | JWT |
| GET | `/companies` | List all cleaning companies | Public |
| GET | `/companies/{id}` | Get company details | Public |
| GET | `/bookings` | Get user's bookings | JWT |
| POST | `/bookings` | Create new booking | JWT |
| GET | `/bookings/{id}` | Get booking details | JWT |
| PUT | `/bookings/{id}` | Update booking | JWT |
| DELETE | `/bookings/{id}` | Cancel booking | JWT |
| GET | `/addresses` | Get user's addresses | JWT |
| POST | `/addresses` | Add new address | JWT |
| PUT | `/addresses/{id}` | Update address | JWT |
| DELETE | `/addresses/{id}` | Delete address | JWT |

---

## Next Steps

1. **Initialize Project** - Generate Spring Boot project with dependencies
2. **Create Entity Models** - Define JPA entities for database tables
3. **Implement Repositories** - Create Spring Data JPA repositories
4. **Build Service Layer** - Implement business logic
5. **Create Controllers** - Define REST endpoints
6. **Configure Security** - Set up JWT authentication
7. **Integrate Twilio** - Implement SMS/OTP functionality
8. **Write Tests** - Unit and integration tests
9. **Deploy** - Configure for production deployment
