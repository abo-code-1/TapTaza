# Tap-Taza Cleaning Services API Specification

**Version:** 1.0.0
**Base URL:** `https://api.tap-taza.com/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Auth Endpoints](#auth-endpoints)
5. [User Endpoints](#user-endpoints)
6. [Company Endpoints](#company-endpoints)
7. [Booking Endpoints](#booking-endpoints)

---

## Overview

This document describes the REST API for the Tap-Taza cleaning services mobile application. The API follows RESTful conventions and uses JSON for request and response bodies.

### Common Headers

| Header | Description | Required |
|--------|-------------|----------|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <jwt_token>` | For authenticated endpoints |
| `Accept-Language` | `en`, `ru`, `uz` | Optional (defaults to `en`) |

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are obtained through the OTP verification flow via WhatsApp.

### Token Lifecycle

- **Access Token:** Valid for 15 minutes
- **Refresh Token:** Valid for 30 days

### Authentication Flow

1. User requests OTP via WhatsApp (`POST /api/auth/send-otp`)
2. User verifies OTP and receives JWT tokens (`POST /api/auth/verify-otp`)
3. Use access token in `Authorization` header for authenticated requests
4. Refresh access token when expired (`POST /api/auth/refresh`)

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 401 | `TOKEN_EXPIRED` | JWT token has expired |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic error |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Auth Endpoints

Authentication endpoints are public and do not require a JWT token.

---

### POST /api/auth/send-otp

Send a one-time password (OTP) to the user's WhatsApp number.

**Authentication:** None (Public)

**Rate Limit:** 3 requests per phone number per 10 minutes

#### Request Body

```json
{
  "phone": "+998901234567"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Phone number in E.164 format (e.g., +998XXXXXXXXX) |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 300,
    "retryAfter": 60
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `expiresIn` | integer | OTP validity in seconds |
| `retryAfter` | integer | Seconds before a new OTP can be requested |

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | OTP sent successfully |
| 400 | Invalid phone number format |
| 429 | Rate limit exceeded |
| 500 | Failed to send OTP |

#### Error Examples

**Invalid Phone Format (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": {
      "phone": "Phone number must be in E.164 format"
    }
  }
}
```

**Rate Limited (429)**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many OTP requests",
    "details": {
      "retryAfter": 540
    }
  }
}
```

---

### POST /api/auth/verify-otp

Verify the OTP and receive JWT tokens. Creates a new user account if the phone number is not registered.

**Authentication:** None (Public)

#### Request Body

```json
{
  "phone": "+998901234567",
  "otp": "123456"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Phone number in E.164 format |
| `otp` | string | Yes | 6-digit OTP code |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123def456",
      "phone": "+998901234567",
      "name": "John Doe",
      "email": "john@example.com",
      "avatarUrl": "https://cdn.tap-taza.com/avatars/usr_abc123def456.jpg",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    },
    "isNewUser": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `user` | object | User profile information |
| `tokens.accessToken` | string | JWT access token |
| `tokens.refreshToken` | string | JWT refresh token |
| `tokens.expiresIn` | integer | Access token validity in seconds |
| `isNewUser` | boolean | True if account was just created |

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | OTP verified successfully |
| 400 | Invalid request format |
| 401 | Invalid or expired OTP |
| 429 | Too many failed attempts |

#### Error Examples

**Invalid OTP (401)**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "Invalid or expired OTP code",
    "details": {
      "attemptsRemaining": 2
    }
  }
}
```

---

### POST /api/auth/refresh

Refresh an expired access token using a valid refresh token.

**Authentication:** None (Public)

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | Yes | Valid refresh token |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Tokens refreshed successfully |
| 401 | Invalid or expired refresh token |

#### Error Examples

**Invalid Refresh Token (401)**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token is invalid or expired"
  }
}
```

---

## User Endpoints

User endpoints require authentication via JWT access token.

---

### GET /api/users/me

Get the current authenticated user's profile.

**Authentication:** Required (Bearer Token)

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "phone": "+998901234567",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://cdn.tap-taza.com/avatars/usr_abc123def456.jpg",
    "preferredLanguage": "en",
    "notificationsEnabled": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-02-10T14:20:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 401 | Unauthorized |

---

### PUT /api/users/me

Update the current user's profile.

**Authentication:** Required (Bearer Token)

#### Request Body

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "preferredLanguage": "ru",
  "notificationsEnabled": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | User's full name (2-100 characters) |
| `email` | string | No | Valid email address |
| `preferredLanguage` | string | No | Language code: `en`, `ru`, `uz` |
| `notificationsEnabled` | boolean | No | Push notification preference |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123def456",
    "phone": "+998901234567",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "avatarUrl": "https://cdn.tap-taza.com/avatars/usr_abc123def456.jpg",
    "preferredLanguage": "ru",
    "notificationsEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-02-15T09:45:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Profile updated successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 409 | Email already in use |

#### Error Examples

**Email Conflict (409)**

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email address is already in use"
  }
}
```

---

### GET /api/users/me/addresses

Get all saved addresses for the current user.

**Authentication:** Required (Bearer Token)

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "addr_xyz789abc123",
      "label": "Home",
      "fullAddress": "123 Amir Temur Street, Tashkent",
      "apartment": "Apt 42",
      "entrance": "2",
      "floor": "5",
      "intercom": "42",
      "latitude": 41.311081,
      "longitude": 69.240562,
      "instructions": "Ring twice",
      "isDefault": true,
      "createdAt": "2024-01-20T08:00:00Z"
    },
    {
      "id": "addr_def456ghi789",
      "label": "Office",
      "fullAddress": "45 Navoi Street, Tashkent",
      "apartment": "Suite 301",
      "entrance": null,
      "floor": "3",
      "intercom": null,
      "latitude": 41.299496,
      "longitude": 69.240073,
      "instructions": null,
      "isDefault": false,
      "createdAt": "2024-02-01T12:00:00Z"
    }
  ]
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 401 | Unauthorized |

---

### POST /api/users/me/addresses

Add a new address for the current user.

**Authentication:** Required (Bearer Token)

#### Request Body

```json
{
  "label": "Home",
  "fullAddress": "123 Amir Temur Street, Tashkent",
  "apartment": "Apt 42",
  "entrance": "2",
  "floor": "5",
  "intercom": "42",
  "latitude": 41.311081,
  "longitude": 69.240562,
  "instructions": "Ring twice",
  "isDefault": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Address label (e.g., "Home", "Office") |
| `fullAddress` | string | Yes | Full street address |
| `apartment` | string | No | Apartment/unit number |
| `entrance` | string | No | Building entrance number |
| `floor` | string | No | Floor number |
| `intercom` | string | No | Intercom code |
| `latitude` | number | Yes | GPS latitude coordinate |
| `longitude` | number | Yes | GPS longitude coordinate |
| `instructions` | string | No | Delivery/access instructions |
| `isDefault` | boolean | No | Set as default address (default: false) |

#### Response

**Success (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "addr_xyz789abc123",
    "label": "Home",
    "fullAddress": "123 Amir Temur Street, Tashkent",
    "apartment": "Apt 42",
    "entrance": "2",
    "floor": "5",
    "intercom": "42",
    "latitude": 41.311081,
    "longitude": 69.240562,
    "instructions": "Ring twice",
    "isDefault": true,
    "createdAt": "2024-02-15T10:00:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 201 | Address created successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 422 | Maximum addresses limit reached (10) |

---

### PUT /api/users/me/addresses/{id}

Update an existing address.

**Authentication:** Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Address ID |

#### Request Body

```json
{
  "label": "Home Office",
  "apartment": "Apt 42B",
  "instructions": "Call upon arrival",
  "isDefault": true
}
```

All fields are optional. Only provided fields will be updated.

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "addr_xyz789abc123",
    "label": "Home Office",
    "fullAddress": "123 Amir Temur Street, Tashkent",
    "apartment": "Apt 42B",
    "entrance": "2",
    "floor": "5",
    "intercom": "42",
    "latitude": 41.311081,
    "longitude": 69.240562,
    "instructions": "Call upon arrival",
    "isDefault": true,
    "createdAt": "2024-01-20T08:00:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Address updated successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 404 | Address not found |

---

### DELETE /api/users/me/addresses/{id}

Delete an address.

**Authentication:** Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Address ID |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Address deleted successfully"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Address deleted successfully |
| 401 | Unauthorized |
| 404 | Address not found |
| 422 | Cannot delete address with active bookings |

---

## Company Endpoints

Company endpoints are public and do not require authentication.

---

### GET /api/companies

List cleaning companies with optional filters and pagination.

**Authentication:** None (Public)

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max: 50) |
| `search` | string | - | Search by company name |
| `serviceType` | string | - | Filter by service type (e.g., `deep_cleaning`, `regular`, `carpet`) |
| `minRating` | number | - | Minimum average rating (1-5) |
| `maxPrice` | number | - | Maximum hourly rate |
| `sortBy` | string | `rating` | Sort field: `rating`, `price`, `name`, `distance` |
| `sortOrder` | string | `desc` | Sort order: `asc`, `desc` |
| `latitude` | number | - | User's latitude (for distance sorting) |
| `longitude` | number | - | User's longitude (for distance sorting) |

#### Request Example

```
GET /api/companies?page=1&limit=10&serviceType=deep_cleaning&minRating=4&sortBy=rating
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "comp_abc123xyz789",
        "name": "Sparkle Clean Pro",
        "description": "Professional cleaning services for homes and offices",
        "logoUrl": "https://cdn.tap-taza.com/logos/comp_abc123xyz789.jpg",
        "coverImageUrl": "https://cdn.tap-taza.com/covers/comp_abc123xyz789.jpg",
        "rating": 4.8,
        "reviewCount": 256,
        "priceRange": {
          "min": 50000,
          "max": 150000,
          "currency": "UZS"
        },
        "serviceTypes": ["regular", "deep_cleaning", "carpet"],
        "isVerified": true,
        "responseTime": "Usually responds within 1 hour",
        "distance": 2.5
      },
      {
        "id": "comp_def456uvw123",
        "name": "Crystal Cleaners",
        "description": "Eco-friendly cleaning solutions",
        "logoUrl": "https://cdn.tap-taza.com/logos/comp_def456uvw123.jpg",
        "coverImageUrl": "https://cdn.tap-taza.com/covers/comp_def456uvw123.jpg",
        "rating": 4.6,
        "reviewCount": 189,
        "priceRange": {
          "min": 45000,
          "max": 120000,
          "currency": "UZS"
        },
        "serviceTypes": ["regular", "deep_cleaning", "window"],
        "isVerified": true,
        "responseTime": "Usually responds within 2 hours",
        "distance": 4.1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Invalid query parameters |

---

### GET /api/companies/{id}

Get detailed information about a specific company.

**Authentication:** None (Public)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Company ID |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "comp_abc123xyz789",
    "name": "Sparkle Clean Pro",
    "description": "Professional cleaning services for homes and offices. We use eco-friendly products and have over 10 years of experience in the cleaning industry.",
    "logoUrl": "https://cdn.tap-taza.com/logos/comp_abc123xyz789.jpg",
    "coverImageUrl": "https://cdn.tap-taza.com/covers/comp_abc123xyz789.jpg",
    "galleryImages": [
      "https://cdn.tap-taza.com/gallery/comp_abc123xyz789_1.jpg",
      "https://cdn.tap-taza.com/gallery/comp_abc123xyz789_2.jpg",
      "https://cdn.tap-taza.com/gallery/comp_abc123xyz789_3.jpg"
    ],
    "rating": 4.8,
    "reviewCount": 256,
    "priceRange": {
      "min": 50000,
      "max": 150000,
      "currency": "UZS"
    },
    "serviceTypes": ["regular", "deep_cleaning", "carpet", "window"],
    "isVerified": true,
    "contact": {
      "phone": "+998901234567",
      "email": "info@sparkleclean.uz",
      "website": "https://sparkleclean.uz"
    },
    "operatingHours": {
      "monday": { "open": "08:00", "close": "20:00" },
      "tuesday": { "open": "08:00", "close": "20:00" },
      "wednesday": { "open": "08:00", "close": "20:00" },
      "thursday": { "open": "08:00", "close": "20:00" },
      "friday": { "open": "08:00", "close": "20:00" },
      "saturday": { "open": "09:00", "close": "18:00" },
      "sunday": { "open": "closed", "close": "closed" }
    },
    "serviceAreas": ["Tashkent", "Chirchik", "Almalyk"],
    "features": [
      "Eco-friendly products",
      "Uniformed staff",
      "Insured service",
      "Same-day booking"
    ],
    "responseTime": "Usually responds within 1 hour",
    "completedJobs": 1250,
    "memberSince": "2020-03-15",
    "createdAt": "2020-03-15T00:00:00Z",
    "updatedAt": "2024-02-10T12:00:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 404 | Company not found |

---

### GET /api/companies/{id}/services

Get all services offered by a company.

**Authentication:** None (Public)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Company ID |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "svc_regular001",
      "name": "Regular Cleaning",
      "description": "Standard cleaning service including dusting, vacuuming, mopping, and bathroom cleaning",
      "type": "regular",
      "pricing": {
        "type": "per_hour",
        "basePrice": 50000,
        "currency": "UZS",
        "minimumHours": 2
      },
      "estimatedDuration": {
        "min": 2,
        "max": 4,
        "unit": "hours"
      },
      "includes": [
        "Dusting all surfaces",
        "Vacuuming carpets and floors",
        "Mopping hard floors",
        "Bathroom cleaning",
        "Kitchen cleaning",
        "Trash removal"
      ],
      "imageUrl": "https://cdn.tap-taza.com/services/regular_cleaning.jpg",
      "isAvailable": true
    },
    {
      "id": "svc_deep001",
      "name": "Deep Cleaning",
      "description": "Thorough cleaning of every corner including inside appliances, behind furniture, and detailed sanitization",
      "type": "deep_cleaning",
      "pricing": {
        "type": "per_sqm",
        "basePrice": 5000,
        "currency": "UZS",
        "minimumSqm": 30
      },
      "estimatedDuration": {
        "min": 4,
        "max": 8,
        "unit": "hours"
      },
      "includes": [
        "All regular cleaning tasks",
        "Inside oven and refrigerator",
        "Window cleaning (interior)",
        "Behind and under furniture",
        "Detailed sanitization",
        "Baseboard cleaning"
      ],
      "imageUrl": "https://cdn.tap-taza.com/services/deep_cleaning.jpg",
      "isAvailable": true
    },
    {
      "id": "svc_carpet001",
      "name": "Carpet Cleaning",
      "description": "Professional carpet and rug cleaning using hot water extraction method",
      "type": "carpet",
      "pricing": {
        "type": "per_sqm",
        "basePrice": 15000,
        "currency": "UZS",
        "minimumSqm": 10
      },
      "estimatedDuration": {
        "min": 1,
        "max": 3,
        "unit": "hours"
      },
      "includes": [
        "Pre-treatment of stains",
        "Hot water extraction",
        "Deodorizing",
        "Quick dry treatment"
      ],
      "imageUrl": "https://cdn.tap-taza.com/services/carpet_cleaning.jpg",
      "isAvailable": true
    }
  ]
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 404 | Company not found |

---

### GET /api/companies/{id}/reviews

Get reviews for a company with pagination.

**Authentication:** None (Public)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Company ID |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max: 50) |
| `rating` | integer | - | Filter by rating (1-5) |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `rating` |
| `sortOrder` | string | `desc` | Sort order: `asc`, `desc` |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 256,
      "ratingDistribution": {
        "5": 180,
        "4": 52,
        "3": 15,
        "2": 6,
        "1": 3
      }
    },
    "reviews": [
      {
        "id": "rev_abc123xyz789",
        "user": {
          "id": "usr_def456uvw123",
          "name": "Sarah M.",
          "avatarUrl": "https://cdn.tap-taza.com/avatars/usr_def456uvw123.jpg"
        },
        "rating": 5,
        "comment": "Excellent service! The team was professional, punctual, and thorough. My apartment has never looked cleaner. Highly recommend!",
        "serviceType": "deep_cleaning",
        "images": [
          "https://cdn.tap-taza.com/reviews/rev_abc123xyz789_1.jpg"
        ],
        "companyResponse": {
          "comment": "Thank you so much for your kind words, Sarah! We're glad you were satisfied with our service.",
          "respondedAt": "2024-02-11T10:00:00Z"
        },
        "isVerifiedBooking": true,
        "createdAt": "2024-02-10T14:30:00Z"
      },
      {
        "id": "rev_ghi789jkl012",
        "user": {
          "id": "usr_mno345pqr678",
          "name": "Alex K.",
          "avatarUrl": null
        },
        "rating": 4,
        "comment": "Good service overall. Arrived on time and did a thorough job. Only minor issue was they missed a spot under the sofa.",
        "serviceType": "regular",
        "images": [],
        "companyResponse": null,
        "isVerifiedBooking": true,
        "createdAt": "2024-02-08T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 256,
      "totalPages": 13,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 404 | Company not found |

---

## Booking Endpoints

Booking endpoints require authentication via JWT access token.

---

### POST /api/bookings

Create a new booking.

**Authentication:** Required (Bearer Token)

#### Request Body

```json
{
  "companyId": "comp_abc123xyz789",
  "serviceId": "svc_deep001",
  "addressId": "addr_xyz789abc123",
  "scheduledDate": "2024-02-20",
  "scheduledTime": "10:00",
  "estimatedDuration": 4,
  "propertySize": 80,
  "additionalServices": ["window_cleaning", "fridge_cleaning"],
  "specialInstructions": "Please bring eco-friendly products. I have a cat.",
  "paymentMethod": "cash"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyId` | string | Yes | Company ID |
| `serviceId` | string | Yes | Service ID from company's services |
| `addressId` | string | Yes | User's address ID |
| `scheduledDate` | string | Yes | Date in YYYY-MM-DD format |
| `scheduledTime` | string | Yes | Time in HH:MM format (24-hour) |
| `estimatedDuration` | number | No | Estimated hours (for hourly services) |
| `propertySize` | number | No | Property size in sqm (for per-sqm services) |
| `additionalServices` | array | No | Array of additional service codes |
| `specialInstructions` | string | No | Special instructions for cleaners |
| `paymentMethod` | string | Yes | Payment method: `cash`, `card`, `payme`, `click` |

#### Response

**Success (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "book_abc123xyz789",
    "bookingNumber": "TT-2024-00123",
    "status": "pending",
    "company": {
      "id": "comp_abc123xyz789",
      "name": "Sparkle Clean Pro",
      "logoUrl": "https://cdn.tap-taza.com/logos/comp_abc123xyz789.jpg",
      "phone": "+998901234567"
    },
    "service": {
      "id": "svc_deep001",
      "name": "Deep Cleaning",
      "type": "deep_cleaning"
    },
    "address": {
      "id": "addr_xyz789abc123",
      "fullAddress": "123 Amir Temur Street, Tashkent",
      "apartment": "Apt 42"
    },
    "scheduledDate": "2024-02-20",
    "scheduledTime": "10:00",
    "estimatedDuration": 4,
    "propertySize": 80,
    "additionalServices": [
      {
        "code": "window_cleaning",
        "name": "Window Cleaning",
        "price": 30000
      },
      {
        "code": "fridge_cleaning",
        "name": "Fridge Cleaning",
        "price": 20000
      }
    ],
    "specialInstructions": "Please bring eco-friendly products. I have a cat.",
    "pricing": {
      "basePrice": 400000,
      "additionalServicesTotal": 50000,
      "subtotal": 450000,
      "discount": 0,
      "total": 450000,
      "currency": "UZS"
    },
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "createdAt": "2024-02-15T11:00:00Z",
    "updatedAt": "2024-02-15T11:00:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 201 | Booking created successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 404 | Company, service, or address not found |
| 422 | Time slot not available or service not offered |

#### Error Examples

**Time Slot Unavailable (422)**

```json
{
  "success": false,
  "error": {
    "code": "TIME_SLOT_UNAVAILABLE",
    "message": "The selected time slot is not available",
    "details": {
      "suggestedSlots": ["11:00", "14:00", "16:00"]
    }
  }
}
```

---

### GET /api/bookings

Get all bookings for the current user.

**Authentication:** Required (Bearer Token)

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max: 50) |
| `status` | string | - | Filter by status: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled` |
| `fromDate` | string | - | Filter bookings from this date (YYYY-MM-DD) |
| `toDate` | string | - | Filter bookings until this date (YYYY-MM-DD) |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "book_abc123xyz789",
        "bookingNumber": "TT-2024-00123",
        "status": "confirmed",
        "company": {
          "id": "comp_abc123xyz789",
          "name": "Sparkle Clean Pro",
          "logoUrl": "https://cdn.tap-taza.com/logos/comp_abc123xyz789.jpg"
        },
        "service": {
          "id": "svc_deep001",
          "name": "Deep Cleaning",
          "type": "deep_cleaning"
        },
        "address": {
          "fullAddress": "123 Amir Temur Street, Tashkent"
        },
        "scheduledDate": "2024-02-20",
        "scheduledTime": "10:00",
        "pricing": {
          "total": 450000,
          "currency": "UZS"
        },
        "paymentStatus": "pending",
        "createdAt": "2024-02-15T11:00:00Z"
      },
      {
        "id": "book_def456uvw123",
        "bookingNumber": "TT-2024-00098",
        "status": "completed",
        "company": {
          "id": "comp_def456uvw123",
          "name": "Crystal Cleaners",
          "logoUrl": "https://cdn.tap-taza.com/logos/comp_def456uvw123.jpg"
        },
        "service": {
          "id": "svc_regular002",
          "name": "Regular Cleaning",
          "type": "regular"
        },
        "address": {
          "fullAddress": "45 Navoi Street, Tashkent"
        },
        "scheduledDate": "2024-02-10",
        "scheduledTime": "14:00",
        "pricing": {
          "total": 120000,
          "currency": "UZS"
        },
        "paymentStatus": "paid",
        "createdAt": "2024-02-08T09:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 12,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Invalid query parameters |
| 401 | Unauthorized |

---

### GET /api/bookings/{id}

Get detailed information about a specific booking.

**Authentication:** Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Booking ID |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "book_abc123xyz789",
    "bookingNumber": "TT-2024-00123",
    "status": "confirmed",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-02-15T11:00:00Z",
        "note": "Booking created"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-02-15T11:30:00Z",
        "note": "Confirmed by company"
      }
    ],
    "company": {
      "id": "comp_abc123xyz789",
      "name": "Sparkle Clean Pro",
      "logoUrl": "https://cdn.tap-taza.com/logos/comp_abc123xyz789.jpg",
      "phone": "+998901234567",
      "rating": 4.8
    },
    "service": {
      "id": "svc_deep001",
      "name": "Deep Cleaning",
      "type": "deep_cleaning",
      "description": "Thorough cleaning of every corner"
    },
    "address": {
      "id": "addr_xyz789abc123",
      "label": "Home",
      "fullAddress": "123 Amir Temur Street, Tashkent",
      "apartment": "Apt 42",
      "entrance": "2",
      "floor": "5",
      "intercom": "42",
      "latitude": 41.311081,
      "longitude": 69.240562,
      "instructions": "Ring twice"
    },
    "scheduledDate": "2024-02-20",
    "scheduledTime": "10:00",
    "estimatedDuration": 4,
    "propertySize": 80,
    "additionalServices": [
      {
        "code": "window_cleaning",
        "name": "Window Cleaning",
        "price": 30000
      },
      {
        "code": "fridge_cleaning",
        "name": "Fridge Cleaning",
        "price": 20000
      }
    ],
    "specialInstructions": "Please bring eco-friendly products. I have a cat.",
    "assignedTeam": {
      "leadCleaner": {
        "name": "Maria S.",
        "avatarUrl": "https://cdn.tap-taza.com/staff/maria_s.jpg",
        "rating": 4.9
      },
      "teamSize": 2
    },
    "pricing": {
      "basePrice": 400000,
      "additionalServicesTotal": 50000,
      "subtotal": 450000,
      "discount": 0,
      "discountCode": null,
      "total": 450000,
      "currency": "UZS"
    },
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "canCancel": true,
    "cancellationPolicy": "Free cancellation up to 24 hours before the scheduled time",
    "createdAt": "2024-02-15T11:00:00Z",
    "updatedAt": "2024-02-15T11:30:00Z"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 401 | Unauthorized |
| 403 | Booking belongs to another user |
| 404 | Booking not found |

---

### PUT /api/bookings/{id}/cancel

Cancel a booking.

**Authentication:** Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Booking ID |

#### Request Body

```json
{
  "reason": "schedule_conflict",
  "comment": "I need to reschedule due to a work meeting"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | Yes | Cancellation reason code: `schedule_conflict`, `found_alternative`, `price_too_high`, `no_longer_needed`, `other` |
| `comment` | string | No | Additional explanation |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "book_abc123xyz789",
    "bookingNumber": "TT-2024-00123",
    "status": "cancelled",
    "cancellation": {
      "reason": "schedule_conflict",
      "comment": "I need to reschedule due to a work meeting",
      "cancelledAt": "2024-02-16T09:00:00Z",
      "cancelledBy": "user",
      "refundStatus": "not_applicable",
      "refundAmount": 0
    },
    "message": "Booking cancelled successfully"
  }
}
```

#### Status Codes

| Status | Description |
|--------|-------------|
| 200 | Booking cancelled successfully |
| 400 | Invalid cancellation reason |
| 401 | Unauthorized |
| 403 | Booking belongs to another user |
| 404 | Booking not found |
| 422 | Booking cannot be cancelled (already completed, in progress, or past cancellation window) |

#### Error Examples

**Cannot Cancel (422)**

```json
{
  "success": false,
  "error": {
    "code": "CANCELLATION_NOT_ALLOWED",
    "message": "This booking cannot be cancelled",
    "details": {
      "reason": "Booking is already in progress",
      "currentStatus": "in_progress"
    }
  }
}
```

**Late Cancellation (422)**

```json
{
  "success": false,
  "error": {
    "code": "LATE_CANCELLATION",
    "message": "Cancellation window has passed",
    "details": {
      "cancellationDeadline": "2024-02-19T10:00:00Z",
      "cancellationFee": 50000,
      "currency": "UZS"
    }
  }
}
```

---

## Appendix

### Service Types

| Code | Name |
|------|------|
| `regular` | Regular Cleaning |
| `deep_cleaning` | Deep Cleaning |
| `carpet` | Carpet Cleaning |
| `window` | Window Cleaning |
| `post_construction` | Post-Construction Cleaning |
| `move_in_out` | Move In/Out Cleaning |
| `office` | Office Cleaning |
| `disinfection` | Disinfection Service |

### Booking Statuses

| Status | Description |
|--------|-------------|
| `pending` | Awaiting company confirmation |
| `confirmed` | Confirmed by company |
| `in_progress` | Service is being performed |
| `completed` | Service completed successfully |
| `cancelled` | Booking was cancelled |

### Payment Methods

| Code | Name |
|------|------|
| `cash` | Cash on service |
| `card` | Credit/Debit card |
| `payme` | Payme |
| `click` | Click |

### Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment not yet received |
| `paid` | Payment completed |
| `refunded` | Payment refunded |
| `failed` | Payment failed |

---

## Changelog

### Version 1.0.0 (2024-02-15)

- Initial API specification
- Auth endpoints (send-otp, verify-otp, refresh)
- User profile and address management
- Company listing and details
- Booking creation and management
