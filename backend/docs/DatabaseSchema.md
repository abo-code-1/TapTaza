# Tap-Taza Cleaning App - Database Schema Documentation

## Overview

This document describes the PostgreSQL database schema for the Tap-Taza cleaning services application. The schema supports user authentication via OTP, company and service management, booking workflows, reviews, and payment method storage.

---

## Table of Contents

1. [ER Diagram](#er-diagram)
2. [Table Definitions](#table-definitions)
   - [users](#users)
   - [otp_codes](#otp_codes)
   - [companies](#companies)
   - [services](#services)
   - [addresses](#addresses)
   - [bookings](#bookings)
   - [reviews](#reviews)
   - [payment_methods](#payment_methods)
3. [Indexes](#indexes)
4. [SQL CREATE Statements](#sql-create-statements)

---

## ER Diagram

```
+------------------+          +------------------+          +------------------+
|      users       |          |    companies     |          |    services      |
+------------------+          +------------------+          +------------------+
| PK id            |          | PK id            |<----+    | PK id            |
|    phone         |          |    name          |     |    | FK company_id    |----+
|    first_name    |          |    description   |     |    |    name          |    |
|    last_name     |          |    rating        |     |    |    description   |    |
|    created_at    |          |    review_count  |     |    |    price         |    |
|    updated_at    |          |    price_range   |     |    |    duration_mins |    |
+--------+---------+          |    verified      |     |    +------------------+    |
         |                    |    logo_url      |     |                            |
         |                    |    created_at    |     |                            |
         |                    +--------+---------+     |                            |
         |                             |               |                            |
         |                             |               |                            |
+--------+---------+                   |               |                            |
|    otp_codes     |                   |               |                            |
+------------------+                   |               |                            |
| PK id            |                   |               |                            |
|    phone         |                   |               |                            |
|    code          |                   |               |                            |
|    expires_at    |                   |               |                            |
|    verified      |                   |               |                            |
|    created_at    |                   |               |                            |
+------------------+                   |               |                            |
         |                             |               |                            |
         |    +------------------------+---------------+----------------------------+
         |    |                        |               |
         v    v                        v               v
+------------------+          +------------------+          +------------------+
|    addresses     |          |    bookings      |          |    reviews       |
+------------------+          +------------------+          +------------------+
| PK id            |<----+    | PK id            |     +--->| PK id            |
| FK user_id       |--+  |    | FK user_id       |--+  |    | FK user_id       |----+
|    label         |  |  |    | FK company_id    |--|--+    | FK company_id    |-+  |
|    street        |  |  |    | FK service_id    |--|--+    | FK booking_id    | |  |
|    apartment     |  |  |    | FK address_id    |--+  |    |    rating        | |  |
|    city          |  |  |    |    date          |     |    |    comment       | |  |
|    is_default    |  |  |    |    time          |     |    |    created_at    | |  |
+------------------+  |  |    |    status        |     |    +------------------+ |  |
                      |  |    |    room_count    |     |                         |  |
                      |  |    |    has_pets      |     |                         |  |
                      |  |    |    eco_friendly  |     |                         |  |
                      |  |    |    notes         |     |                         |  |
                      |  |    |    total_price   |     |                         |  |
                      |  |    |    created_at    |     |                         |  |
                      |  |    +------------------+     |                         |  |
                      |  |                             |                         |  |
                      |  +-----------------------------+-------------------------+  |
                      |                                                             |
                      |    +--------------------------------------------------------+
                      |    |
                      v    v
               +------------------+
               | payment_methods  |
               +------------------+
               | PK id            |
               | FK user_id       |
               |    type          |
               |    last_four     |
               |    is_default    |
               +------------------+


LEGEND:
  PK = Primary Key
  FK = Foreign Key
  --> = Foreign Key Reference
```

### Relationship Summary

| Parent Table | Child Table      | Relationship | Description                           |
|--------------|------------------|--------------|---------------------------------------|
| users        | addresses        | 1:N          | A user can have multiple addresses    |
| users        | bookings         | 1:N          | A user can have multiple bookings     |
| users        | reviews          | 1:N          | A user can write multiple reviews     |
| users        | payment_methods  | 1:N          | A user can have multiple payment methods |
| companies    | services         | 1:N          | A company offers multiple services    |
| companies    | bookings         | 1:N          | A company receives multiple bookings  |
| companies    | reviews          | 1:N          | A company receives multiple reviews   |
| services     | bookings         | 1:N          | A service can be booked multiple times|
| addresses    | bookings         | 1:N          | An address can be used for multiple bookings |
| bookings     | reviews          | 1:1          | Each booking can have one review      |

---

## Table Definitions

### users

Stores registered user information. Users authenticate via phone number and OTP.

| Column     | Data Type                  | Constraints                    | Description                    |
|------------|----------------------------|--------------------------------|--------------------------------|
| id         | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier |
| phone      | VARCHAR(20)                | NOT NULL, UNIQUE               | Phone number (E.164 format)    |
| first_name | VARCHAR(100)               | NOT NULL                       | User's first name              |
| last_name  | VARCHAR(100)               | NOT NULL                       | User's last name               |
| created_at | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | Account creation timestamp     |
| updated_at | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | Last update timestamp          |

---

### otp_codes

Stores one-time password codes for phone verification. Codes expire after a set duration.

| Column     | Data Type                  | Constraints                    | Description                    |
|------------|----------------------------|--------------------------------|--------------------------------|
| id         | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique OTP record identifier |
| phone      | VARCHAR(20)                | NOT NULL                       | Phone number receiving OTP     |
| code       | VARCHAR(6)                 | NOT NULL                       | 6-digit OTP code               |
| expires_at | TIMESTAMP WITH TIME ZONE   | NOT NULL                       | Code expiration timestamp      |
| verified   | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Whether code was verified      |
| created_at | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | OTP creation timestamp         |

---

### companies

Stores cleaning service provider companies.

| Column       | Data Type                  | Constraints                    | Description                    |
|--------------|----------------------------|--------------------------------|--------------------------------|
| id           | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique company identifier |
| name         | VARCHAR(255)               | NOT NULL                       | Company name                   |
| description  | TEXT                       |                                | Company description            |
| rating       | DECIMAL(2,1)               | DEFAULT 0.0, CHECK (rating >= 0 AND rating <= 5) | Average rating (0.0-5.0) |
| review_count | INTEGER                    | NOT NULL, DEFAULT 0, CHECK (review_count >= 0) | Total number of reviews |
| price_range  | VARCHAR(10)                | NOT NULL, CHECK (price_range IN ('$', '$$', '$$$')) | Price category |
| verified     | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Company verification status    |
| logo_url     | VARCHAR(500)               |                                | URL to company logo            |
| created_at   | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | Company registration timestamp |

---

### services

Stores services offered by cleaning companies.

| Column           | Data Type                  | Constraints                    | Description                    |
|------------------|----------------------------|--------------------------------|--------------------------------|
| id               | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique service identifier |
| company_id       | UUID                       | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | Parent company |
| name             | VARCHAR(255)               | NOT NULL                       | Service name                   |
| description      | TEXT                       |                                | Service description            |
| price            | DECIMAL(10,2)              | NOT NULL, CHECK (price >= 0)   | Service price in local currency|
| duration_minutes | INTEGER                    | NOT NULL, CHECK (duration_minutes > 0) | Estimated duration in minutes |

---

### addresses

Stores user delivery/service addresses.

| Column     | Data Type                  | Constraints                    | Description                    |
|------------|----------------------------|--------------------------------|--------------------------------|
| id         | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique address identifier |
| user_id    | UUID                       | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Owner user |
| label      | VARCHAR(50)                | NOT NULL                       | Address label (e.g., "Home", "Office") |
| street     | VARCHAR(255)               | NOT NULL                       | Street address                 |
| apartment  | VARCHAR(50)                |                                | Apartment/unit number          |
| city       | VARCHAR(100)               | NOT NULL                       | City name                      |
| is_default | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Whether this is the default address |

---

### bookings

Stores service booking records.

| Column       | Data Type                  | Constraints                    | Description                    |
|--------------|----------------------------|--------------------------------|--------------------------------|
| id           | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique booking identifier |
| user_id      | UUID                       | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Booking customer |
| company_id   | UUID                       | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | Service provider |
| service_id   | UUID                       | NOT NULL, REFERENCES services(id) ON DELETE CASCADE | Booked service |
| address_id   | UUID                       | NOT NULL, REFERENCES addresses(id) ON DELETE RESTRICT | Service location |
| date         | DATE                       | NOT NULL                       | Scheduled service date         |
| time         | TIME                       | NOT NULL                       | Scheduled service time         |
| status       | VARCHAR(20)                | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) | Booking status |
| room_count   | INTEGER                    | NOT NULL, CHECK (room_count > 0) | Number of rooms to clean |
| has_pets     | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Whether location has pets      |
| eco_friendly | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Use eco-friendly products      |
| notes        | TEXT                       |                                | Additional instructions        |
| total_price  | DECIMAL(10,2)              | NOT NULL, CHECK (total_price >= 0) | Total booking price |
| created_at   | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | Booking creation timestamp     |

---

### reviews

Stores user reviews for completed bookings.

| Column     | Data Type                  | Constraints                    | Description                    |
|------------|----------------------------|--------------------------------|--------------------------------|
| id         | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique review identifier |
| user_id    | UUID                       | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Review author |
| company_id | UUID                       | NOT NULL, REFERENCES companies(id) ON DELETE CASCADE | Reviewed company |
| booking_id | UUID                       | NOT NULL, UNIQUE, REFERENCES bookings(id) ON DELETE CASCADE | Associated booking |
| rating     | INTEGER                    | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Rating (1-5 stars) |
| comment    | TEXT                       |                                | Review text                    |
| created_at | TIMESTAMP WITH TIME ZONE   | NOT NULL, DEFAULT NOW()        | Review creation timestamp      |

---

### payment_methods

Stores user payment method information (tokenized, not full card details).

| Column     | Data Type                  | Constraints                    | Description                    |
|------------|----------------------------|--------------------------------|--------------------------------|
| id         | UUID                       | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique payment method identifier |
| user_id    | UUID                       | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Owner user |
| type       | VARCHAR(20)                | NOT NULL, CHECK (type IN ('card', 'apple_pay', 'google_pay')) | Payment type |
| last_four  | VARCHAR(4)                 |                                | Last 4 digits of card (if applicable) |
| is_default | BOOLEAN                    | NOT NULL, DEFAULT FALSE        | Whether this is the default method |

---

## Indexes

### Primary Key Indexes (Automatic)
- `users_pkey` on `users(id)`
- `otp_codes_pkey` on `otp_codes(id)`
- `companies_pkey` on `companies(id)`
- `services_pkey` on `services(id)`
- `addresses_pkey` on `addresses(id)`
- `bookings_pkey` on `bookings(id)`
- `reviews_pkey` on `reviews(id)`
- `payment_methods_pkey` on `payment_methods(id)`

### Unique Indexes
- `idx_users_phone` on `users(phone)` - Fast phone lookup for authentication
- `idx_reviews_booking_id` on `reviews(booking_id)` - Enforces one review per booking

### Foreign Key Indexes
- `idx_services_company_id` on `services(company_id)` - List services by company
- `idx_addresses_user_id` on `addresses(user_id)` - List addresses by user
- `idx_bookings_user_id` on `bookings(user_id)` - List bookings by user
- `idx_bookings_company_id` on `bookings(company_id)` - List bookings by company
- `idx_bookings_service_id` on `bookings(service_id)` - List bookings by service
- `idx_bookings_address_id` on `bookings(address_id)` - List bookings by address
- `idx_reviews_user_id` on `reviews(user_id)` - List reviews by user
- `idx_reviews_company_id` on `reviews(company_id)` - List reviews by company
- `idx_payment_methods_user_id` on `payment_methods(user_id)` - List payment methods by user

### Query Optimization Indexes
- `idx_otp_codes_phone_expires` on `otp_codes(phone, expires_at)` - OTP verification lookup
- `idx_bookings_date_status` on `bookings(date, status)` - Schedule and status queries
- `idx_companies_rating` on `companies(rating DESC)` - Sort companies by rating
- `idx_companies_verified` on `companies(verified)` - Filter verified companies

---

## SQL CREATE Statements

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone       VARCHAR(20) NOT NULL UNIQUE,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for phone lookup
CREATE INDEX idx_users_phone ON users(phone);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: otp_codes
-- ============================================
CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone       VARCHAR(20) NOT NULL,
    code        VARCHAR(6) NOT NULL,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    verified    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Composite index for OTP verification queries
CREATE INDEX idx_otp_codes_phone_expires ON otp_codes(phone, expires_at);

-- ============================================
-- TABLE: companies
-- ============================================
CREATE TABLE companies (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    rating       DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    price_range  VARCHAR(10) NOT NULL CHECK (price_range IN ('$', '$$', '$$$')),
    verified     BOOLEAN NOT NULL DEFAULT FALSE,
    logo_url     VARCHAR(500),
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_companies_rating ON companies(rating DESC);
CREATE INDEX idx_companies_verified ON companies(verified);

-- ============================================
-- TABLE: services
-- ============================================
CREATE TABLE services (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id       UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    price            DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0)
);

-- Index for listing services by company
CREATE INDEX idx_services_company_id ON services(company_id);

-- ============================================
-- TABLE: addresses
-- ============================================
CREATE TABLE addresses (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label      VARCHAR(50) NOT NULL,
    street     VARCHAR(255) NOT NULL,
    apartment  VARCHAR(50),
    city       VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for listing addresses by user
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================
-- TABLE: bookings
-- ============================================
CREATE TABLE bookings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id   UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    service_id   UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    address_id   UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    date         DATE NOT NULL,
    time         TIME NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    room_count   INTEGER NOT NULL CHECK (room_count > 0),
    has_pets     BOOLEAN NOT NULL DEFAULT FALSE,
    eco_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    notes        TEXT,
    total_price  DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_address_id ON bookings(address_id);
CREATE INDEX idx_bookings_date_status ON bookings(date, status);

-- ============================================
-- TABLE: reviews
-- ============================================
CREATE TABLE reviews (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_company_id ON reviews(company_id);

-- ============================================
-- TABLE: payment_methods
-- ============================================
CREATE TABLE payment_methods (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(20) NOT NULL CHECK (type IN ('card', 'apple_pay', 'google_pay')),
    last_four  VARCHAR(4),
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for listing payment methods by user
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
```

---

## Notes

### Data Integrity
- All foreign keys use `ON DELETE CASCADE` except `addresses` in `bookings` which uses `ON DELETE RESTRICT` to preserve booking history.
- UUID primary keys ensure globally unique identifiers and prevent enumeration attacks.
- Check constraints enforce valid status values, ratings, and price ranges.

### Security Considerations
- Phone numbers should be stored in E.164 format for consistency.
- Payment method table only stores tokenized data (last 4 digits), never full card numbers.
- OTP codes should be hashed in production; plain storage shown here for simplicity.

### Performance Considerations
- Indexes are created on all foreign keys to optimize JOIN operations.
- Composite indexes support common query patterns (e.g., OTP verification, booking scheduling).
- Consider partitioning `bookings` and `otp_codes` tables by date for large-scale deployments.

### Future Enhancements
- Add `users.email` column for email notifications.
- Add `bookings.payment_method_id` to track payment method used.
- Add `services.is_active` flag for soft-delete functionality.
- Consider adding a `transactions` table for payment history.
