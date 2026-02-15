# Tap-Taza Cleaning Services - System Architecture

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Microservices/Modules](#3-microservicesmodules)
4. [API Design](#4-api-design)
5. [Security Architecture](#5-security-architecture)
6. [Data Flow](#6-data-flow)
7. [Infrastructure](#7-infrastructure)

---

## 1. System Overview

### High-Level Architecture Diagram

```
                                    +------------------+
                                    |   Mobile App     |
                                    | (iOS / Android)  |
                                    +--------+---------+
                                             |
                                             | HTTPS
                                             v
+------------------------------------------------------------------------------------+
|                              NGINX (Reverse Proxy / Load Balancer)                 |
|                                    Port: 80/443                                    |
+------------------------------------------------------------------------------------+
                                             |
                                             v
+------------------------------------------------------------------------------------+
|                              API GATEWAY / SPRING CLOUD GATEWAY                    |
|                                    Port: 8080                                      |
|                          (Rate Limiting, Request Routing, CORS)                    |
+------------------------------------------------------------------------------------+
              |                |                |                |
              v                v                v                v
+-------------+--+  +----------+---+  +--------+-----+  +--------+-----+
|  AUTH SERVICE  |  | USER SERVICE |  |COMPANY SERVICE|  |BOOKING SERVICE|
|   Port: 8081   |  |  Port: 8082  |  |  Port: 8083   |  |  Port: 8084   |
+-------------+--+  +----------+---+  +--------+-----+  +--------+-----+
              |                |                |                |
              +----------------+----------------+----------------+
                                             |
                                             v
                              +-----------------------------+
                              |    NOTIFICATION SERVICE     |
                              |        Port: 8085           |
                              |    (Twilio WhatsApp OTP)    |
                              +-----------------------------+
                                             |
                                             v
                              +-----------------------------+
                              |        Twilio API           |
                              |   (WhatsApp Sandbox/Prod)   |
                              +-----------------------------+

+------------------------------------------------------------------------------------+
|                                   DATA LAYER                                       |
+------------------------------------------------------------------------------------+
|                                                                                    |
|   +------------------+    +------------------+    +------------------+             |
|   |   PostgreSQL     |    |      Redis       |    |   File Storage   |             |
|   |   Port: 5432     |    |   Port: 6379     |    |   (S3/MinIO)     |             |
|   |  (Primary DB)    |    |  (Cache/Session) |    |                  |             |
|   +------------------+    +------------------+    +------------------+             |
|                                                                                    |
+------------------------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Mobile App | User interface for customers and cleaning companies |
| NGINX | SSL termination, load balancing, static content serving |
| API Gateway | Request routing, rate limiting, authentication verification |
| Auth Service | OTP generation/verification, JWT token management |
| User Service | User profiles, preferences, address management |
| Company Service | Cleaning company profiles, services, pricing, availability |
| Booking Service | Booking creation, scheduling, status management |
| Notification Service | WhatsApp OTP delivery, booking notifications |
| PostgreSQL | Primary data persistence |
| Redis | Session cache, OTP storage, rate limiting counters |

---

## 2. Tech Stack

### Backend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ (LTS) | Primary programming language |
| Spring Boot | 3.x | Application framework |
| Spring Security | 6.x | Security and authentication |
| Spring Data JPA | 3.x | Database ORM |
| Spring Cloud Gateway | 4.x | API Gateway implementation |

### Database & Caching
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Primary relational database |
| Redis | 7.x | Caching, session storage, OTP storage |
| Flyway | 9.x | Database migrations |

### Security & Authentication
| Technology | Purpose |
|------------|---------|
| JWT (JSON Web Tokens) | Stateless authentication |
| BCrypt | Password hashing (if needed) |
| Twilio | WhatsApp OTP delivery |

### Infrastructure & DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local development orchestration |
| NGINX | Reverse proxy and load balancer |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |

### Build & Dependency Management
| Technology | Purpose |
|------------|---------|
| Maven / Gradle | Build automation |
| Lombok | Boilerplate code reduction |
| MapStruct | DTO mapping |
| OpenAPI/Swagger | API documentation |

---

## 3. Microservices/Modules

### 3.1 Auth Service

**Responsibilities:**
- Phone number verification via WhatsApp OTP
- JWT token generation and refresh
- Token validation for other services
- Session management

**Key Endpoints:**
```
POST /api/v1/auth/otp/request     - Request OTP via WhatsApp
POST /api/v1/auth/otp/verify      - Verify OTP and get tokens
POST /api/v1/auth/token/refresh   - Refresh access token
POST /api/v1/auth/logout          - Invalidate tokens
```

**Dependencies:**
- Notification Service (for OTP delivery)
- Redis (OTP storage with TTL)
- PostgreSQL (user authentication records)

---

### 3.2 User Service

**Responsibilities:**
- User profile management (customers)
- Address management (multiple addresses per user)
- User preferences
- User history and activity

**Key Endpoints:**
```
GET    /api/v1/users/me                  - Get current user profile
PUT    /api/v1/users/me                  - Update profile
GET    /api/v1/users/me/addresses        - List user addresses
POST   /api/v1/users/me/addresses        - Add new address
PUT    /api/v1/users/me/addresses/{id}   - Update address
DELETE /api/v1/users/me/addresses/{id}   - Delete address
GET    /api/v1/users/me/preferences      - Get preferences
PUT    /api/v1/users/me/preferences      - Update preferences
```

**Data Model:**
```
User
  - id (UUID)
  - phone_number (unique)
  - full_name
  - email (optional)
  - profile_image_url
  - created_at
  - updated_at

Address
  - id (UUID)
  - user_id (FK)
  - label (home, work, other)
  - street_address
  - city
  - district
  - latitude
  - longitude
  - is_default
```

---

### 3.3 Company Service

**Responsibilities:**
- Cleaning company registration and profiles
- Service catalog management
- Pricing configuration
- Availability and scheduling
- Company ratings and reviews
- Employee/cleaner management

**Key Endpoints:**
```
# Public endpoints
GET    /api/v1/companies                      - List companies (with filters)
GET    /api/v1/companies/{id}                 - Get company details
GET    /api/v1/companies/{id}/services        - List company services
GET    /api/v1/companies/{id}/reviews         - List company reviews
GET    /api/v1/companies/{id}/availability    - Check availability

# Company admin endpoints
POST   /api/v1/companies                      - Register company
PUT    /api/v1/companies/{id}                 - Update company profile
POST   /api/v1/companies/{id}/services        - Add service
PUT    /api/v1/companies/{id}/services/{sid}  - Update service
DELETE /api/v1/companies/{id}/services/{sid}  - Remove service
PUT    /api/v1/companies/{id}/availability    - Set availability
GET    /api/v1/companies/{id}/employees       - List employees
POST   /api/v1/companies/{id}/employees       - Add employee
```

**Data Model:**
```
Company
  - id (UUID)
  - owner_user_id (FK to User)
  - name
  - description
  - logo_url
  - phone_number
  - email
  - rating_average
  - total_reviews
  - is_verified
  - is_active
  - created_at

Service
  - id (UUID)
  - company_id (FK)
  - name
  - description
  - base_price
  - price_unit (per_hour, per_sqm, fixed)
  - duration_minutes
  - is_active

CompanyEmployee
  - id (UUID)
  - company_id (FK)
  - user_id (FK)
  - role (cleaner, supervisor, admin)
  - is_active
```

---

### 3.4 Booking Service

**Responsibilities:**
- Booking creation and management
- Scheduling and calendar management
- Booking status workflow
- Payment integration preparation
- Booking history

**Key Endpoints:**
```
# Customer endpoints
POST   /api/v1/bookings                    - Create booking
GET    /api/v1/bookings                    - List my bookings
GET    /api/v1/bookings/{id}               - Get booking details
PUT    /api/v1/bookings/{id}/cancel        - Cancel booking
POST   /api/v1/bookings/{id}/review        - Add review after completion

# Company endpoints
GET    /api/v1/companies/{id}/bookings     - List company bookings
PUT    /api/v1/bookings/{id}/accept        - Accept booking
PUT    /api/v1/bookings/{id}/reject        - Reject booking
PUT    /api/v1/bookings/{id}/assign        - Assign cleaner
PUT    /api/v1/bookings/{id}/start         - Start service
PUT    /api/v1/bookings/{id}/complete      - Complete service
```

**Booking Status Workflow:**
```
PENDING --> ACCEPTED --> ASSIGNED --> IN_PROGRESS --> COMPLETED
    |           |
    v           v
CANCELLED   REJECTED
```

**Data Model:**
```
Booking
  - id (UUID)
  - customer_id (FK to User)
  - company_id (FK to Company)
  - service_id (FK to Service)
  - address_id (FK to Address)
  - assigned_employee_id (FK, nullable)
  - scheduled_date
  - scheduled_time
  - duration_minutes
  - status
  - total_price
  - notes
  - created_at
  - updated_at

Review
  - id (UUID)
  - booking_id (FK)
  - rating (1-5)
  - comment
  - created_at
```

---

### 3.5 Notification Service

**Responsibilities:**
- WhatsApp message delivery via Twilio
- OTP generation and delivery
- Booking notification delivery
- Notification templates management
- Delivery status tracking

**Key Endpoints (Internal):**
```
POST /api/v1/notifications/otp/send       - Send OTP via WhatsApp
POST /api/v1/notifications/booking        - Send booking notification
POST /api/v1/notifications/reminder       - Send booking reminder
GET  /api/v1/notifications/status/{id}    - Check delivery status
```

**Twilio WhatsApp Sandbox Configuration:**
```
Account SID: [from Twilio Console]
Auth Token: [from Twilio Console]
WhatsApp Number: +14155238886 (sandbox)
Sandbox Join Code: join <sandbox-keyword>
```

**Message Templates:**
```
OTP Template:
"Your Tap-Taza verification code is: {otp}. Valid for 5 minutes."

Booking Confirmation:
"Your cleaning service is booked for {date} at {time}.
Company: {company_name}. Booking ID: {booking_id}"

Booking Reminder:
"Reminder: Your cleaning service is tomorrow at {time}.
Company: {company_name}"
```

---

## 4. API Design

### RESTful API Conventions

**Base URL Structure:**
```
https://api.tap-taza.com/api/v1/{resource}
```

**HTTP Methods:**
| Method | Usage |
|--------|-------|
| GET | Retrieve resources |
| POST | Create new resource |
| PUT | Update entire resource |
| PATCH | Partial update |
| DELETE | Remove resource |

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": [
      {
        "field": "phone_number",
        "message": "Phone number must start with country code"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**HTTP Status Codes:**
| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "size": 20,
    "total_items": 150,
    "total_pages": 8,
    "has_next": true,
    "has_previous": false
  }
}
```

**Query Parameters:**
```
GET /api/v1/companies?page=1&size=20&sort=rating_average,desc&city=Tashkent
```

### API Versioning
- URL path versioning: `/api/v1/`, `/api/v2/`
- Header versioning (optional): `Accept: application/vnd.tap-taza.v1+json`

---

## 5. Security Architecture

### 5.1 JWT Authentication Flow

```
+----------+     +------------+     +---------------+     +----------+
|  Client  |     |  Gateway   |     |  Auth Service |     |  Redis   |
+----+-----+     +-----+------+     +-------+-------+     +----+-----+
     |                 |                    |                   |
     |  1. Request OTP |                    |                   |
     |---------------->|                    |                   |
     |                 |  2. Forward        |                   |
     |                 |------------------->|                   |
     |                 |                    |  3. Generate OTP  |
     |                 |                    |------------------>|
     |                 |                    |  4. Store (5min)  |
     |                 |                    |<------------------|
     |                 |                    |                   |
     |                 |                    |  5. Send via Twilio
     |                 |                    |------------------>| WhatsApp
     |                 |  6. OTP Sent       |                   |
     |<----------------|<-------------------|                   |
     |                 |                    |                   |
     | 7. User receives OTP via WhatsApp   |                   |
     |                 |                    |                   |
     | 8. Verify OTP   |                    |                   |
     |---------------->|                    |                   |
     |                 | 9. Forward         |                   |
     |                 |------------------->|                   |
     |                 |                    | 10. Validate OTP  |
     |                 |                    |------------------>|
     |                 |                    | 11. OTP Valid     |
     |                 |                    |<------------------|
     |                 |                    |                   |
     |                 |                    | 12. Generate JWT  |
     |                 |                    | (Access + Refresh)|
     |                 |                    |                   |
     |                 | 13. Return Tokens  |                   |
     |<----------------|<-------------------|                   |
     |                 |                    |                   |
```

### 5.2 JWT Token Structure

**Access Token (Short-lived: 15-30 minutes):**
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "phone": "+998901234567",
    "roles": ["CUSTOMER"],
    "iat": 1705312200,
    "exp": 1705314000
  }
}
```

**Refresh Token (Long-lived: 7-30 days):**
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "type": "refresh",
    "jti": "unique-token-id",
    "iat": 1705312200,
    "exp": 1707904200
  }
}
```

### 5.3 Token Refresh Flow

```
+----------+     +------------+     +---------------+
|  Client  |     |  Gateway   |     |  Auth Service |
+----+-----+     +-----+------+     +-------+-------+
     |                 |                    |
     | 1. Access Token Expired              |
     | (401 Unauthorized)                   |
     |<----------------|                    |
     |                 |                    |
     | 2. Refresh Token Request             |
     |---------------->|                    |
     |                 | 3. Forward         |
     |                 |------------------->|
     |                 |                    |
     |                 |   4. Validate      |
     |                 |   Refresh Token    |
     |                 |                    |
     |                 | 5. New Access Token|
     |<----------------|<-------------------|
     |                 |                    |
```

### 5.4 OTP Security Measures

| Measure | Implementation |
|---------|----------------|
| OTP Length | 6 digits |
| OTP Expiry | 5 minutes |
| Rate Limiting | Max 3 OTP requests per phone per 10 minutes |
| Retry Limit | Max 5 verification attempts per OTP |
| Cooldown | 60 seconds between OTP requests |
| Blocking | Block phone after 10 failed attempts (30 min) |

### 5.5 Role-Based Access Control (RBAC)

**Roles:**
```
CUSTOMER        - Regular app user
COMPANY_ADMIN   - Cleaning company owner/admin
COMPANY_STAFF   - Company employee (cleaner, supervisor)
SYSTEM_ADMIN    - Platform administrator
```

**Permission Matrix:**
| Resource | CUSTOMER | COMPANY_ADMIN | COMPANY_STAFF | SYSTEM_ADMIN |
|----------|----------|---------------|---------------|--------------|
| View Companies | Yes | Yes | Yes | Yes |
| Create Booking | Yes | No | No | Yes |
| Manage Company | No | Own | No | All |
| View All Bookings | Own | Company | Assigned | All |
| Manage Users | No | No | No | Yes |

### 5.6 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## 6. Data Flow

### 6.1 User Registration Flow

```
+--------+    +----------+    +-------+    +-----------+    +-------+    +--------+
| Mobile |    |  NGINX   |    |Gateway|    |   Auth    |    |Notific|    | Twilio |
|  App   |    |          |    |       |    |  Service  |    |Service|    |WhatsApp|
+---+----+    +----+-----+    +---+---+    +-----+-----+    +---+---+    +---+----+
    |              |              |              |              |            |
    | 1. POST /auth/otp/request   |              |              |            |
    |  {phone: "+998901234567"}   |              |              |            |
    |------------->|              |              |              |            |
    |              |------------->|              |              |            |
    |              |              |------------->|              |            |
    |              |              |              |              |            |
    |              |              |              | 2. Generate  |            |
    |              |              |              |    6-digit   |            |
    |              |              |              |    OTP       |            |
    |              |              |              |              |            |
    |              |              |              | 3. Store in Redis (TTL 5m)|
    |              |              |              |              |            |
    |              |              |              | 4. Send OTP  |            |
    |              |              |              |------------->|            |
    |              |              |              |              | 5. WhatsApp|
    |              |              |              |              |----------->|
    |              |              |              |              |            |
    |              | 6. {success: true, message: "OTP sent"}   |            |
    |<-------------|<-------------|<-------------|              |            |
    |              |              |              |              |            |
    | 7. User receives WhatsApp message with OTP               |            |
    |              |              |              |              |            |
    | 8. POST /auth/otp/verify    |              |              |            |
    |  {phone: "...", otp: "123456"}            |              |            |
    |------------->|------------->|------------->|              |            |
    |              |              |              |              |            |
    |              |              |              | 9. Validate OTP from Redis|
    |              |              |              | 10. Create/Get User       |
    |              |              |              | 11. Generate JWT tokens   |
    |              |              |              |              |            |
    |              | 12. {access_token, refresh_token, user}   |            |
    |<-------------|<-------------|<-------------|              |            |
```

### 6.2 Booking Creation Flow

```
+--------+    +-------+    +-------+    +-------+    +-------+    +-------+
| Mobile |    |Gateway|    |Booking|    |Company|    | User  |    |Notific|
|  App   |    |       |    |Service|    |Service|    |Service|    |Service|
+---+----+    +---+---+    +---+---+    +---+---+    +---+---+    +---+---+
    |             |            |            |            |            |
    | 1. POST /bookings        |            |            |            |
    | {company_id, service_id, |            |            |            |
    |  address_id, date, time} |            |            |            |
    |------------>|            |            |            |            |
    |             |            |            |            |            |
    |             | 2. Validate JWT         |            |            |
    |             | 3. Forward  |            |            |            |
    |             |------------>|            |            |            |
    |             |            |            |            |            |
    |             |            | 4. Validate Company      |            |
    |             |            |----------->|            |            |
    |             |            |<-----------|            |            |
    |             |            |            |            |            |
    |             |            | 5. Validate Service     |            |
    |             |            |----------->|            |            |
    |             |            |<-----------|            |            |
    |             |            |            |            |            |
    |             |            | 6. Validate Address     |            |
    |             |            |---------------------------->|        |
    |             |            |<----------------------------|        |
    |             |            |            |            |            |
    |             |            | 7. Check Availability   |            |
    |             |            |----------->|            |            |
    |             |            |<-----------|            |            |
    |             |            |            |            |            |
    |             |            | 8. Create Booking       |            |
    |             |            | (status: PENDING)       |            |
    |             |            |            |            |            |
    |             |            | 9. Send Notifications   |            |
    |             |            |-------------------------------------------->|
    |             |            |            |            |            |
    |             | 10. Return Booking      |            |            |
    |<------------|<-----------|            |            |            |
```

### 6.3 Booking Status Update Flow

```
Company accepts booking:
PENDING -> ACCEPTED -> (Notification to Customer)

Company assigns cleaner:
ACCEPTED -> ASSIGNED -> (Notification to Customer & Cleaner)

Service starts:
ASSIGNED -> IN_PROGRESS -> (Notification to Customer)

Service completes:
IN_PROGRESS -> COMPLETED -> (Notification to Customer for Review)
```

---

## 7. Infrastructure

### 7.1 Docker Container Architecture

```
+------------------------------------------------------------------+
|                    Docker Network: tap-taza-network              |
+------------------------------------------------------------------+
|                                                                   |
|  +------------+  +------------+  +------------+  +------------+  |
|  |   nginx    |  |  gateway   |  |    auth    |  |    user    |  |
|  | Port: 80   |  | Port: 8080 |  | Port: 8081 |  | Port: 8082 |  |
|  +------------+  +------------+  +------------+  +------------+  |
|                                                                   |
|  +------------+  +------------+  +------------+                  |
|  |  company   |  |  booking   |  |notification|                  |
|  | Port: 8083 |  | Port: 8084 |  | Port: 8085 |                  |
|  +------------+  +------------+  +------------+                  |
|                                                                   |
|  +---------------------------+  +---------------------------+    |
|  |        postgres           |  |          redis            |    |
|  |       Port: 5432          |  |        Port: 6379         |    |
|  +---------------------------+  +---------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Docker Compose Configuration Structure

```yaml
# docker-compose.yml structure
version: '3.8'

services:
  # Infrastructure
  postgres:
    image: postgres:15
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    depends_on: [gateway]

  # Application Services
  gateway:
    build: ./gateway
    ports: ["8080:8080"]
    depends_on: [postgres, redis]

  auth-service:
    build: ./auth-service
    ports: ["8081:8081"]
    depends_on: [postgres, redis]

  user-service:
    build: ./user-service
    ports: ["8082:8082"]
    depends_on: [postgres]

  company-service:
    build: ./company-service
    ports: ["8083:8083"]
    depends_on: [postgres]

  booking-service:
    build: ./booking-service
    ports: ["8084:8084"]
    depends_on: [postgres]

  notification-service:
    build: ./notification-service
    ports: ["8085:8085"]

volumes:
  postgres_data:

networks:
  tap-taza-network:
    driver: bridge
```

### 7.3 Environment Configuration

**Development (.env.dev):**
```
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=taptaza_dev
POSTGRES_USER=taptaza
POSTGRES_PASSWORD=dev_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=dev-secret-key
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d

# Twilio (Sandbox)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_SANDBOX_MODE=true
```

**Production (.env.prod):**
```
# Database
POSTGRES_HOST=db.tap-taza.com
POSTGRES_PORT=5432
POSTGRES_DB=taptaza_prod
POSTGRES_USER=taptaza_prod
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}  # From secrets manager

# Redis
REDIS_HOST=redis.tap-taza.com
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}  # From secrets manager
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Twilio (Production)
TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
TWILIO_WHATSAPP_NUMBER=+998xxxxxxxxx
TWILIO_SANDBOX_MODE=false
```

### 7.4 Database Schema Overview

```
+------------------+     +------------------+     +------------------+
|      users       |     |    companies     |     |    services      |
+------------------+     +------------------+     +------------------+
| id (PK)          |     | id (PK)          |     | id (PK)          |
| phone_number     |<-+  | owner_user_id(FK)|---->| company_id (FK)  |
| full_name        |  |  | name             |     | name             |
| email            |  |  | description      |     | base_price       |
| created_at       |  |  | rating_average   |     | price_unit       |
+------------------+  |  +------------------+     +------------------+
         |            |           |                       |
         |            |           |                       |
         v            |           v                       v
+------------------+  |  +------------------+     +------------------+
|    addresses     |  |  |company_employees |     |    bookings      |
+------------------+  |  +------------------+     +------------------+
| id (PK)          |  |  | id (PK)          |     | id (PK)          |
| user_id (FK)     |--+  | company_id (FK)  |     | customer_id (FK) |
| label            |  |  | user_id (FK)     |--+  | company_id (FK)  |
| street_address   |  |  | role             |  |  | service_id (FK)  |
| city             |  |  +------------------+  |  | address_id (FK)  |
| latitude         |  |                        |  | assigned_emp (FK)|
| longitude        |  +------------------------+  | status           |
+------------------+                              | scheduled_date   |
                                                  | total_price      |
                                                  +------------------+
                                                           |
                                                           v
                                                  +------------------+
                                                  |     reviews      |
                                                  +------------------+
                                                  | id (PK)          |
                                                  | booking_id (FK)  |
                                                  | rating           |
                                                  | comment          |
                                                  +------------------+
```

### 7.5 Monitoring & Logging

**Logging Stack:**
```
Application Logs -> Logback -> Stdout -> Docker Logs -> (Optional: ELK Stack)
```

**Metrics Collection:**
```
Spring Actuator -> Prometheus -> Grafana Dashboards
```

**Health Check Endpoints:**
```
GET /actuator/health        - Application health
GET /actuator/health/liveness  - Kubernetes liveness probe
GET /actuator/health/readiness - Kubernetes readiness probe
GET /actuator/prometheus    - Prometheus metrics
```

### 7.6 Scaling Considerations

| Service | Scaling Strategy | Notes |
|---------|------------------|-------|
| Gateway | Horizontal | Stateless, scale with load |
| Auth Service | Horizontal | Redis for session state |
| User Service | Horizontal | Stateless |
| Company Service | Horizontal | Stateless |
| Booking Service | Horizontal | Use database locking for conflicts |
| Notification Service | Horizontal | Queue-based for reliability |
| PostgreSQL | Vertical + Read Replicas | Primary-replica setup |
| Redis | Cluster | Redis Cluster for HA |

---

## Appendix A: Twilio WhatsApp Sandbox Setup

### Initial Setup Steps:
1. Create Twilio account at https://www.twilio.com
2. Navigate to Messaging > Try it out > Send a WhatsApp message
3. Note the sandbox number: `+1 415 523 8886`
4. Note your sandbox join code: `join <your-sandbox-keyword>`

### User Onboarding (Sandbox Mode):
1. User must first send the join code to the sandbox number
2. After joining, they can receive OTP messages
3. Sandbox connection expires after 72 hours of inactivity

### Production Migration:
1. Apply for WhatsApp Business API access
2. Submit message templates for approval
3. Configure your own WhatsApp Business number
4. Update `TWILIO_SANDBOX_MODE=false` and number

---

## Appendix B: API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid or expired access token |
| AUTH_002 | 401 | Invalid refresh token |
| AUTH_003 | 400 | Invalid OTP |
| AUTH_004 | 429 | Too many OTP requests |
| AUTH_005 | 403 | Phone number blocked |
| USER_001 | 404 | User not found |
| USER_002 | 409 | Phone number already registered |
| COMPANY_001 | 404 | Company not found |
| COMPANY_002 | 403 | Not company owner |
| BOOKING_001 | 404 | Booking not found |
| BOOKING_002 | 400 | Invalid booking status transition |
| BOOKING_003 | 409 | Time slot not available |
| NOTIF_001 | 500 | WhatsApp delivery failed |

---

*Document Version: 1.0*
*Last Updated: January 2024*
*Author: System Architecture Team*
