# Tap-Taza - Project Architecture

> **Version:** 1.0.0
> **Last Updated:** February 2026
> **Platform:** iOS, Android, Web
> **Tech Stack:** React Native + Expo + TypeScript

---

## 1. Executive Summary

**Tap-Taza** is a mobile-first cleaning services marketplace application targeting the Kazakhstan market (primarily Almaty). The app connects users with verified cleaning companies, allowing them to browse services, compare prices, read reviews, and book cleaning appointments.

### Vision
Become the #1 platform for booking professional cleaning services in Central Asia, providing a seamless experience for both customers and cleaning service providers.

### Current State
MVP/Prototype stage with core UI implemented, mock data, and no backend integration.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │   Home   │  │Companies │  │ Company  │  │     Profile      │ │
│  │  Screen  │  │   List   │  │  Detail  │  │     Screen       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        NAVIGATION LAYER                          │
│                      Expo Router (File-based)                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Root Layout → Tab Navigator → Stack Navigator              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        COMPONENT LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ ServiceCard │  │ CompanyCard │  │   Reusable UI Elements  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                        │
│                   (Currently: Local useState)                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  FUTURE: Zustand/Redux + React Query for API caching        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│                      (TO BE IMPLEMENTED)                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Auth     │  │  Booking  │  │  Company  │  │   Payment    │  │
│  │  Service  │  │  Service  │  │  Service  │  │   Service    │  │
│  └───────────┘  └───────────┘  └───────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                      (TO BE IMPLEMENTED)                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │           REST API / GraphQL + WebSocket for Real-time      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Future)                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Node.js  │  │ PostgreSQL│  │   Redis   │  │   Firebase   │  │
│  │  /NestJS  │  │  Database │  │   Cache   │  │   Storage    │  │
│  └───────────┘  └───────────┘  └───────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
tap-taza-cleaning-app/
│
├── app/                              # Expo Router - Screens
│   ├── _layout.tsx                   # Root layout (SafeArea, StatusBar)
│   ├── index.tsx                     # Entry redirect → /home
│   │
│   ├── (tabs)/                       # Tab Navigation Group
│   │   ├── _layout.tsx               # Tab bar configuration
│   │   ├── home.tsx                  # Home screen (services)
│   │   └── profile.tsx               # User profile
│   │
│   ├── companies/                    # Company Stack Navigator
│   │   ├── page.tsx                  # Companies listing
│   │   └── [id].tsx                  # Dynamic company detail
│   │
│   ├── (auth)/                       # [FUTURE] Auth Stack
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   │
│   └── booking/                      # [FUTURE] Booking Flow
│       ├── select-date.tsx
│       ├── select-address.tsx
│       ├── payment.tsx
│       └── confirmation.tsx
│
├── src/
│   ├── components/                   # Reusable UI Components
│   │   ├── ui/                       # [FUTURE] Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── companyCard.tsx           # Company list card
│   │   └── ServiceCard.tsx           # Service selection card
│   │
│   ├── hooks/                        # [FUTURE] Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useCompanies.ts
│   │
│   ├── services/                     # [FUTURE] API services
│   │   ├── api.ts                    # API client (axios)
│   │   ├── auth.service.ts
│   │   ├── company.service.ts
│   │   └── booking.service.ts
│   │
│   ├── store/                        # [FUTURE] State management
│   │   ├── index.ts
│   │   ├── authStore.ts
│   │   └── bookingStore.ts
│   │
│   ├── types/                        # [FUTURE] TypeScript types
│   │   ├── index.ts
│   │   ├── company.types.ts
│   │   ├── user.types.ts
│   │   └── booking.types.ts
│   │
│   ├── constants/                    # [FUTURE] App constants
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── config.ts
│   │
│   └── utils/                        # [FUTURE] Utility functions
│       ├── formatters.ts
│       ├── validators.ts
│       └── storage.ts
│
├── assets/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── project-doc/                      # Documentation
    ├── ProjectArc.md
    ├── Documentation.md
    ├── Issues.md
    ├── Roadmap.md
    ├── Features.md
    └── UIDesign.md
```

---

## 4. Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile framework |
| Expo | 54.0.0 | Development platform & SDK |
| React | 19.1.0 | UI library |
| TypeScript | 5.9.2 | Type-safe JavaScript |

### Navigation
| Technology | Purpose |
|------------|---------|
| Expo Router 6.0 | File-based routing |
| React Navigation (via Expo Router) | Tab & Stack navigation |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| NativeWind | Tailwind CSS for React Native |
| Tailwind CSS 3.4 | Utility-first styling |
| Expo Linear Gradient | Gradient backgrounds |
| Expo Blur | iOS blur effects |

### Animation
| Technology | Purpose |
|------------|---------|
| React Native Reanimated 4.1 | High-performance animations |
| React Native Screens | Native screen components |

### Dev Tools
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Babel | JavaScript transpilation |

---

## 5. Data Flow Architecture

### Current State (MVP)
```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│    Screen     │ ───► │   useState    │ ───► │   Mock Data   │
│  Components   │ ◄─── │   useMemo     │ ◄─── │   (Hardcoded) │
└───────────────┘      └───────────────┘      └───────────────┘
```

### Target Architecture (Production)
```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│    Screen     │      │    Zustand    │      │  React Query  │
│  Components   │ ◄──► │    Store      │ ◄──► │    Cache      │
└───────────────┘      └───────────────┘      └───────────────┘
                                                      │
                                                      ▼
                              ┌───────────────────────────────────┐
                              │           API Service             │
                              │         (axios instance)          │
                              └───────────────────────────────────┘
                                                      │
                                                      ▼
                              ┌───────────────────────────────────┐
                              │         Backend REST API          │
                              │    (Node.js/NestJS + PostgreSQL)  │
                              └───────────────────────────────────┘
```

---

## 6. Screen Architecture

### 6.1 Home Screen (`/home`)
```
┌─────────────────────────────────────┐
│           HEADER                     │
│  Logo        [Search]  [Notifications]│
├─────────────────────────────────────┤
│          STATS CHIPS                 │
│  [120 companies] [2.5K reviews] [24h]│
├─────────────────────────────────────┤
│                                     │
│         SERVICE CARDS               │
│  ┌─────────────────────────────┐   │
│  │  Стандартная уборка         │   │
│  │  от 5000₸  •  45 предложений│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Генеральная уборка         │   │
│  │  от 12000₸ •  38 предложений│   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│         PROMO BANNER                │
│  [После вызова заказа - скидка!]    │
├─────────────────────────────────────┤
│     [  Показать компании  ]         │
└─────────────────────────────────────┘
```

### 6.2 Companies List (`/companies/page`)
```
┌─────────────────────────────────────┐
│  ← Back          15 компаний        │
├─────────────────────────────────────┤
│  🔍 [Search companies...]           │
├─────────────────────────────────────┤
│  [Все] [Норм] [Пойдет] [Хуйня]      │
│  Sort: ★Rating  💰Price  💬Reviews  │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ CleanMaster    ★ 4.9  ✓    │   │
│  │ от 5000₸    •   234 отзыва │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ EcoCleaning    ★ 4.7  ✓    │   │
│  │ от 4500₸    •   189 отзывов│   │
│  └─────────────────────────────┘   │
│              ...                    │
└─────────────────────────────────────┘
```

### 6.3 Company Detail (`/companies/[id]`)
```
┌─────────────────────────────────────┐
│  ← Back        [Animated Header]    │
├─────────────────────────────────────┤
│           ┌───────┐                 │
│           │ LOGO  │                 │
│           └───────┘                 │
│        CleanMaster ✓                │
│        ★★★★★ 4.9 (234)              │
├─────────────────────────────────────┤
│  PRICE CARD                         │
│  от 5 000 ₸                         │
├─────────────────────────────────────┤
│  [⏱ 2-3 часа]   [✓ Гарантия 100%]   │
├─────────────────────────────────────┤
│  DESCRIPTION                        │
│  Профессиональная уборка...         │
│                                     │
├─────────────────────────────────────┤
│    blur [ Заказать уборку ]         │
└─────────────────────────────────────┘
```

### 6.4 Profile (`/profile`)
```
┌─────────────────────────────────────┐
│  Аккаунт                  🔔        │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ [Avatar]  Сергей Сергеев      │  │
│  │           chlenososer@gmail   │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [📍 Адреса] [📋 Заказы] [💳 Оплата]│
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 📞 +7 (777) 123-45-67         │  │
│  │ 🔒 Безопасность настроена    │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│       [ Выйти из аккаунта ]         │
└─────────────────────────────────────┘
```

---

## 7. Navigation Structure

```
Root Layout (_layout.tsx)
│
├── / (index.tsx) ──────────────────► Redirect to /home
│
├── (tabs)/ ────────────────────────► Tab Navigator
│   ├── home ───────────────────────► Home Screen
│   └── profile ────────────────────► Profile Screen
│
├── companies/ ─────────────────────► Stack Navigator
│   ├── page ───────────────────────► Companies List
│   └── [id] ───────────────────────► Company Detail (dynamic)
│
├── (auth)/ ────────────────────────► [FUTURE] Auth Stack
│   ├── login
│   ├── register
│   └── forgot-password
│
└── booking/ ───────────────────────► [FUTURE] Booking Flow
    ├── select-date
    ├── select-address
    ├── payment
    └── confirmation
```

---

## 8. Component Architecture

### Component Hierarchy
```
App
├── RootLayout (SafeAreaProvider)
│   ├── StatusBar
│   └── Slot (Router outlet)
│
├── TabLayout
│   ├── HomeScreen
│   │   ├── Header
│   │   ├── StatsChips
│   │   ├── ServiceCard[] (selectable)
│   │   ├── PromoBanner
│   │   └── CTAButton
│   │
│   └── ProfileScreen
│       ├── ProfileHeader
│       ├── AvatarCard
│       ├── QuickActions[]
│       ├── InfoRows[]
│       └── LogoutButton
│
└── CompaniesStack
    ├── CompaniesPage
    │   ├── SearchBar
    │   ├── FilterChips
    │   ├── SortOptions
    │   └── CompanyCard[]
    │
    └── CompanyDetail
        ├── AnimatedHeader
        ├── CompanyInfo
        ├── PriceCard
        ├── InfoCards
        ├── Description
        └── OrderButton (BlurView)
```

### Component Design Principles
1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props-based Configuration**: Customize via props, not modification
4. **Animations with Reanimated**: Use worklets for 60fps animations

---

## 9. Future Backend Architecture (Recommended)

### Microservices Approach
```
┌────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                              │
│                    (Kong / AWS API Gateway)                     │
└────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    AUTH      │      │   COMPANY    │      │   BOOKING    │
│   SERVICE    │      │   SERVICE    │      │   SERVICE    │
│  (Firebase)  │      │  (Node.js)   │      │  (Node.js)   │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Firebase   │      │  PostgreSQL  │      │  PostgreSQL  │
│     Auth     │      │   + Redis    │      │   + Redis    │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Recommended Tech Stack (Backend)
| Layer | Technology | Reason |
|-------|------------|--------|
| API | NestJS (Node.js) | TypeScript, modular, enterprise-ready |
| Database | PostgreSQL | Relational data, complex queries |
| Cache | Redis | Session, caching, real-time |
| Auth | Firebase Auth | Quick setup, social logins |
| Storage | Firebase Storage / S3 | Images, documents |
| Search | Elasticsearch | Full-text search for companies |
| Payments | Kaspi Pay / Stripe | Local + international |
| Push | Firebase FCM | Cross-platform notifications |

---

## 10. Security Considerations

### Current Gaps (MVP)
- No authentication
- No input validation
- No secure storage
- Hardcoded mock data

### Production Requirements
1. **Authentication**: JWT tokens with refresh mechanism
2. **Secure Storage**: Expo SecureStore for sensitive data
3. **Input Validation**: Zod/Yup schemas on frontend + backend
4. **API Security**: Rate limiting, CORS, HTTPS only
5. **Code Security**: ProGuard/Hermes for obfuscation
6. **Data Privacy**: GDPR-compliant data handling

---

## 11. Performance Considerations

### Current Optimizations
- React Native Reanimated for 60fps animations
- FlatList for efficient list rendering
- useMemo for expensive computations

### Future Optimizations
1. **Images**: Use Expo Image with caching
2. **Lazy Loading**: Code splitting with React.lazy
3. **Memoization**: React.memo for pure components
4. **Virtualization**: FlashList for large lists
5. **Bundle Size**: Tree shaking, dynamic imports
6. **Offline**: React Query persistence

---

## 12. Scalability Path

### Phase 1: MVP (Current)
- Mock data, UI prototype
- 4 screens, basic navigation

### Phase 2: Backend Integration
- REST API connection
- User authentication
- Real company data

### Phase 3: Booking Flow
- Date/time selection
- Address management
- Payment integration

### Phase 4: Growth Features
- Push notifications
- Real-time chat
- Reviews & ratings
- Loyalty program

### Phase 5: Platform Expansion
- Company dashboard (web)
- Admin panel
- Analytics & reporting

---

## 13. Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Expo (managed) | Faster development, OTA updates |
| Routing | Expo Router | File-based, familiar to web devs |
| Styling | NativeWind | Tailwind syntax, utility-first |
| State | Zustand (future) | Simple, TypeScript-first |
| API Cache | React Query (future) | Automatic caching, refetching |
| Auth | Firebase (future) | Quick setup, social logins |
| Animations | Reanimated | Native performance |
| Forms | React Hook Form (future) | Performant, easy validation |

---

*This architecture document serves as the technical blueprint for Tap-Taza development. It should be updated as the project evolves.*
