# Tap-Taza - Feature Specifications

> **Document Type:** Product Requirements Document (PRD)
> **Version:** 1.0
> **Target Market:** Kazakhstan (Almaty, Astana)

---

## Table of Contents

1. [Current Features](#1-current-features)
2. [Core Features (Required)](#2-core-features-required)
3. [Enhancement Features](#3-enhancement-features)
4. [Future Features](#4-future-features)
5. [User Stories](#5-user-stories)

---

## 1. Current Features

### 1.1 Home Screen
**Status:** ✅ Implemented (UI Only)

**Description:**
Landing screen showing available cleaning services with selection capability.

**Components:**
| Element | Description | Status |
|---------|-------------|--------|
| Header | Logo + notification icon | ✅ |
| Stats chips | Company count, reviews, guarantee | ✅ |
| Service cards | 3 selectable service types | ✅ |
| Promo banner | Marketing promotion area | ✅ |
| CTA button | Navigate to companies | ✅ |

**User Flow:**
```
User opens app
    └── Views available services
        └── Selects a service type
            └── Taps "Показать компании"
                └── Navigates to companies list
```

---

### 1.2 Companies List
**Status:** ✅ Implemented (Mock Data)

**Description:**
Browse and filter cleaning companies.

**Components:**
| Element | Description | Status |
|---------|-------------|--------|
| Search bar | Text search with animation | ✅ |
| Category filters | Filter chips (Все, Норм, etc.) | ✅ |
| Sort options | Rating, Price, Reviews | ✅ |
| Company cards | Animated list with details | ✅ |
| Empty state | No results message | ✅ |

**Functionality:**
- [x] Local text search by company name
- [x] Category filtering
- [x] Sort by rating/price/reviews
- [ ] Server-side search
- [ ] Pagination
- [ ] Pull-to-refresh

---

### 1.3 Company Detail
**Status:** ✅ Implemented (UI Only)

**Description:**
View detailed information about a cleaning company.

**Components:**
| Element | Description | Status |
|---------|-------------|--------|
| Animated header | Show/hide on scroll | ✅ |
| Company logo | Avatar placeholder | ✅ |
| Verification badge | Verified indicator | ✅ |
| Rating display | Stars + score | ✅ |
| Price card | Starting price | ✅ |
| Info cards | Duration, guarantee | ✅ |
| Description | Service details | ✅ |
| Order button | Blur effect CTA | ✅ |

**Missing:**
- [ ] Real company data
- [ ] Photo gallery
- [ ] Service list
- [ ] Reviews section
- [ ] Contact options

---

### 1.4 Profile Screen
**Status:** ✅ Implemented (Mock Data)

**Description:**
User account management and settings.

**Components:**
| Element | Description | Status |
|---------|-------------|--------|
| Profile card | Avatar, name, email | ✅ |
| Avatar upload | Image picker integration | ✅ |
| Quick actions | Addresses, Orders, Payment | ✅ (UI only) |
| Account info | Phone, security status | ✅ |
| Logout button | Exit account | ✅ (UI only) |

**Missing:**
- [ ] Backend integration
- [ ] Profile editing
- [ ] Address management
- [ ] Order history
- [ ] Payment methods

---

## 2. Core Features (Required)

### 2.1 Authentication (OTP-Based)

**Priority:** P0 - Critical
**Phase:** 1
**Method:** Phone + SMS OTP (No passwords)

#### Why OTP-Only Authentication?

| Benefit | Description |
|---------|-------------|
| **Higher Conversion** | 40-60% higher signup completion vs password-based |
| **Zero Password Fatigue** | Users don't need to remember another password |
| **Local Market Standard** | Kaspi, Choco, Glovo KZ all use this method |
| **Built-in Verification** | Phone is verified automatically |
| **Simpler Backend** | No password hashing, reset flows, or security questions |
| **Mobile-First** | SMS codes auto-fill on iOS/Android |

#### Auth Flow Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Enter Phone │────▶│ Enter Code  │────▶│   Success   │
│   Number    │     │  (4-6 dig)  │     │  (Home)     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │ Code expires
       │                   │ in 60 seconds
       │                   ▼
       │            ┌─────────────┐
       │            │ Resend Code │
       │            └─────────────┘
       │
       ▼ (New user)
┌─────────────┐
│ Enter Name  │
│ (First/Last)│
└─────────────┘
```

#### Screen 1: Phone Entry (Login/Register Combined)
```
┌─────────────────────────────────┐
│                                 │
│         [Tap-Taza Logo]         │
│                                 │
│      Добро пожаловать!          │
│                                 │
│   Введите номер телефона        │
│                                 │
│  ┌───────────────────────────┐  │
│  │ +7 │ (___) ___-__-__      │  │
│  └───────────────────────────┘  │
│                                 │
│  Мы отправим SMS с кодом        │
│  для входа в приложение         │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Получить код         │  │
│  └───────────────────────────┘  │
│                                 │
│  Нажимая кнопку, вы соглашаетесь│
│  с Условиями и Политикой        │
│                                 │
└─────────────────────────────────┘
```

**Requirements:**
- Phone input with +7 KZ prefix (auto-filled)
- Input mask: +7 (XXX) XXX-XX-XX
- Single "Get Code" button
- Terms link at bottom
- Auto-detect if user exists (login) or new (register)

**Validation:**
- 10 digits after +7 (total 11)
- Only numeric input
- Disable button until valid

---

#### Screen 2: OTP Verification
```
┌─────────────────────────────────┐
│  ←                              │
│                                 │
│         Введите код             │
│                                 │
│   Код отправлен на номер        │
│   +7 (777) 123-45-67            │
│                                 │
│      ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│      │ _ │ │ _ │ │ _ │ │ _ │    │
│      └───┘ └───┘ └───┘ └───┘    │
│                                 │
│      Код действителен 0:59      │
│                                 │
│      [ Отправить повторно ]     │
│        (активно через 60с)      │
│                                 │
│      [ Изменить номер ]         │
│                                 │
└─────────────────────────────────┘
```

**Requirements:**
- 4-digit code input (or 6-digit for higher security)
- Auto-focus on first box
- Auto-advance to next box on input
- Auto-submit when all digits entered
- 60-second countdown timer
- Resend button (disabled during countdown)
- Change number link (goes back)
- Keyboard: numeric only

**Validation:**
- Auto-verify on 4th digit
- Show error if code invalid
- Max 3 attempts, then block 5 minutes

---

#### Screen 3: Name Entry (New Users Only)
```
┌─────────────────────────────────┐
│  ←                              │
│                                 │
│       Как вас зовут?            │
│                                 │
│   Эти данные будут видны        │
│   компаниям при заказе          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👤 Имя                    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👤 Фамилия                │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │       Продолжить          │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Requirements:**
- First name (required, 2+ characters)
- Last name (required, 2+ characters)
- Only shown for NEW users
- Skip for returning users (go straight to home)

**Validation:**
- Min 2 characters per field
- Only letters (Cyrillic + Latin)
- No numbers or special characters

---

### 2.2 Booking Flow

**Priority:** P0 - Critical
**Phase:** 2

#### Step 1: Select Date & Time
```
┌─────────────────────────────────┐
│  ← Выбор даты и времени         │
│                                 │
│  ┌───────────────────────────┐  │
│  │      February 2026        │  │
│  │  Mo Tu We Th Fr Sa Su     │  │
│  │                        1  │  │
│  │   2  3  4  5  6  7  8     │  │
│  │   9 10 11 12 13 14 [15]   │  │
│  │  16 17 18 19 20 21 22     │  │
│  └───────────────────────────┘  │
│                                 │
│  Доступное время:               │
│  [09:00] [10:00] [11:00]        │
│  [12:00] [14:00] [15:00]        │
│  [16:00] [17:00] [18:00]        │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Продолжить           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Requirements:**
- Calendar view (current + 2 months)
- Disable past dates
- Show company availability
- Time slots in 1-hour increments
- Show unavailable times (grayed out)
- Selected state visual feedback

---

#### Step 2: Select Address
```
┌─────────────────────────────────┐
│  ← Адрес уборки                 │
│                                 │
│  Сохраненные адреса:            │
│  ┌───────────────────────────┐  │
│  │ 🏠 Дом                    │  │
│  │ ул. Абая 150, кв. 45      │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 🏢 Офис                   │  │
│  │ пр. Достык 5, офис 301    │  │
│  └───────────────────────────┘  │
│                                 │
│  [ + Добавить новый адрес ]     │
│                                 │
│  ───────────────────────────    │
│                                 │
│  Детали:                        │
│  Кол-во комнат: [ - ] 2 [ + ]   │
│  Площадь: [___] м²              │
│                                 │
│  ☐ Есть домашние животные       │
│  ☐ Нужны эко-средства           │
│                                 │
│  Комментарий:                   │
│  ┌───────────────────────────┐  │
│  │ Дополнительные пожелания  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Продолжить           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Requirements:**
- Saved addresses list
- Add new address with map
- Room count selector
- Area (m²) input
- Pet checkbox
- Eco-friendly products checkbox
- Special instructions textarea

---

#### Step 3: Confirmation & Payment
```
┌─────────────────────────────────┐
│  ← Подтверждение заказа         │
│                                 │
│  Компания                       │
│  ┌───────────────────────────┐  │
│  │ CleanMaster ✓  ★ 4.9      │  │
│  └───────────────────────────┘  │
│                                 │
│  Услуга                         │
│  ┌───────────────────────────┐  │
│  │ Стандартная уборка        │  │
│  │ 2 комнаты, 50 м²          │  │
│  └───────────────────────────┘  │
│                                 │
│  Дата и время                   │
│  ┌───────────────────────────┐  │
│  │ 📅 15 февраля, 10:00      │  │
│  └───────────────────────────┘  │
│                                 │
│  Адрес                          │
│  ┌───────────────────────────┐  │
│  │ 🏠 ул. Абая 150, кв. 45   │  │
│  └───────────────────────────┘  │
│                                 │
│  ───────────────────────────    │
│  Стоимость услуги    5 000 ₸    │
│  Скидка              -500 ₸     │
│  ───────────────────────────    │
│  Итого               4 500 ₸    │
│                                 │
│  [ 🎁 Промокод ]                │
│                                 │
│  Способ оплаты:                 │
│  ○ Kaspi Pay                    │
│  ○ Банковская карта             │
│  ○ Наличные                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Оформить заказ         │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Requirements:**
- Order summary
- Price breakdown
- Promo code input
- Payment method selection
- Terms acceptance
- Submit booking

---

#### Step 4: Success Screen
```
┌─────────────────────────────────┐
│                                 │
│           ✓                     │
│                                 │
│    Заказ успешно оформлен!      │
│                                 │
│    Номер заказа: #12345         │
│                                 │
│    CleanMaster свяжется с       │
│    вами в течение 15 минут      │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Мои заказы             │  │
│  └───────────────────────────┘  │
│                                 │
│  [ На главную ]                 │
│                                 │
└─────────────────────────────────┘
```

---

### 2.3 Order Management

**Priority:** P1 - High
**Phase:** 2

#### Orders List Screen
```
┌─────────────────────────────────┐
│  ← Мои заказы                   │
│                                 │
│  [Активные] [История]           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🟢 Подтвержден            │  │
│  │ CleanMaster               │  │
│  │ Стандартная уборка        │  │
│  │ 📅 15 фев, 10:00          │  │
│  │ 4 500 ₸                   │  │
│  │ [ Подробнее ]             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🟡 Ожидает подтверждения  │  │
│  │ EcoCleaning               │  │
│  │ Генеральная уборка        │  │
│  │ 📅 20 фев, 14:00          │  │
│  │ 12 000 ₸                  │  │
│  │ [ Подробнее ] [ Отменить ]│  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Order Statuses:**
| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | Awaiting company confirmation |
| Confirmed | Green | Company accepted |
| In Progress | Blue | Cleaning in progress |
| Completed | Gray | Service finished |
| Cancelled | Red | Order cancelled |

---

### 2.4 Reviews & Ratings

**Priority:** P1 - High
**Phase:** 3

#### Write Review Screen
```
┌─────────────────────────────────┐
│  ← Оставить отзыв               │
│                                 │
│  CleanMaster                    │
│  Заказ от 15 февраля            │
│                                 │
│  Оцените качество:              │
│  ☆ ☆ ☆ ☆ ☆                      │
│                                 │
│  Что понравилось:               │
│  [Пунктуальность] [Качество]    │
│  [Вежливость] [Аккуратность]    │
│                                 │
│  Ваш отзыв:                     │
│  ┌───────────────────────────┐  │
│  │ Напишите ваши впечатления │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Добавить фото:                 │
│  [ + ] [ + ] [ + ]              │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Отправить отзыв        │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 3. Enhancement Features

### 3.1 Favorites

**Priority:** P2 - Medium

**Description:**
Users can save favorite companies for quick access.

**Requirements:**
- Heart icon on company cards
- Favorites list in profile
- Sync across devices
- Quick book from favorites

---

### 3.2 Notifications Center

**Priority:** P2 - Medium

**Description:**
Centralized notification management.

**Types:**
- Booking confirmations
- Status updates
- Promotional offers
- System messages

**Screen:**
```
┌─────────────────────────────────┐
│  ← Уведомления        [Clear]   │
│                                 │
│  Сегодня                        │
│  ┌───────────────────────────┐  │
│  │ ✓ Заказ подтвержден       │  │
│  │ CleanMaster принял ваш... │  │
│  │ 10:30                     │  │
│  └───────────────────────────┘  │
│                                 │
│  Вчера                          │
│  ┌───────────────────────────┐  │
│  │ 🎁 Скидка 20%!            │  │
│  │ Используйте промокод...   │  │
│  │ 15:45                     │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

---

### 3.3 Loyalty Program

**Priority:** P2 - Medium
**Phase:** 3

**Mechanics:**
- Earn 1 point per 100 ₸ spent
- 100 points = 500 ₸ discount
- Bonus multipliers for streaks
- Referral bonuses

**Screen:**
```
┌─────────────────────────────────┐
│  ← Бонусы                       │
│                                 │
│  ┌───────────────────────────┐  │
│  │         450               │  │
│  │        баллов             │  │
│  │                           │  │
│  │  ══════════════▒▒▒▒▒     │  │
│  │  50 баллов до след. ур.  │  │
│  └───────────────────────────┘  │
│                                 │
│  История начислений:            │
│  + 50 баллов  Заказ #123  10.02 │
│  + 120 баллов Заказ #115  05.02 │
│  - 100 баллов Скидка      01.02 │
│                                 │
│  ───────────────────────────    │
│                                 │
│  Пригласи друга:                │
│  Получи 500 баллов за каждого   │
│  приглашенного друга            │
│                                 │
│  [ Пригласить ]                 │
│                                 │
└─────────────────────────────────┘
```

---

### 3.4 In-App Chat

**Priority:** P2 - Medium
**Phase:** 3

**Description:**
Real-time messaging between customer and company.

**Features:**
- Text messages
- Image sharing
- Read receipts
- Typing indicator
- Push notifications

---

### 3.5 Recurring Bookings

**Priority:** P2 - Medium
**Phase:** 3

**Options:**
- Weekly
- Bi-weekly
- Monthly
- Custom schedule

**Management:**
- Skip next booking
- Pause subscription
- Change schedule
- Cancel recurring

---

## 4. Future Features

### 4.1 Company Comparison

Compare multiple companies side-by-side:
- Pricing
- Services
- Ratings
- Response time

### 4.2 Price Calculator

Estimate cleaning cost before booking:
- Room count
- Area size
- Service type
- Additional services

### 4.3 Live Tracking

Track cleaner arrival in real-time:
- Map view
- ETA
- Direct call option

### 4.4 Multi-Language

Support for:
- Russian (default)
- Kazakh
- English

### 4.5 Referral Program

Invite friends:
- Unique referral code
- Track invites
- Earn rewards

### 4.6 Service Scheduling Calendar

View all bookings in calendar format:
- Month/week/day views
- Quick reschedule
- Reminders

---

## 5. User Stories

### Authentication

```
AS A new user
I WANT TO sign up with just my phone number
SO THAT I can quickly start booking services

Acceptance Criteria:
- Phone number field with +7 prefix auto-filled
- SMS code sent within 5 seconds
- 4-digit code auto-submits on last digit
- Prompt for first/last name after verification
- Redirect to home on completion
- No passwords required
```

```
AS A returning user
I WANT TO login with just my phone number
SO THAT I can access my bookings without remembering passwords

Acceptance Criteria:
- Phone number field (remembers last used)
- SMS code sent on button press
- Auto-login after code verification
- Session persists until logout
- No password required
```

### Booking

```
AS A customer
I WANT TO select a date and time for cleaning
SO THAT I can schedule at my convenience

Acceptance Criteria:
- Calendar shows available dates
- Unavailable slots are disabled
- Selected date/time is highlighted
- Confirmation before proceeding
```

```
AS A customer
I WANT TO save multiple addresses
SO THAT I can quickly book for different locations

Acceptance Criteria:
- Add address with map picker
- Label addresses (Home, Office, etc.)
- Set default address
- Edit or delete addresses
```

### Discovery

```
AS A customer
I WANT TO search for companies by name
SO THAT I can find a specific cleaning service

Acceptance Criteria:
- Search bar at top of list
- Results update as I type
- Clear button to reset search
- "No results" message when empty
```

```
AS A customer
I WANT TO filter companies by rating
SO THAT I can find highly-rated services

Acceptance Criteria:
- Filter options visible
- Can combine multiple filters
- Clear all filters button
- Result count updates
```

### Orders

```
AS A customer
I WANT TO view my booking history
SO THAT I can track past and upcoming cleanings

Acceptance Criteria:
- Tabs for active/history
- Order status clearly visible
- Can view order details
- Can cancel pending orders
```

```
AS A customer
I WANT TO leave a review after service
SO THAT I can share my experience

Acceptance Criteria:
- Star rating (1-5)
- Optional text review
- Optional photo upload
- Review appears on company page
```

---

## Feature Comparison: Current vs Target

| Feature | Current | MVP | Full Product |
|---------|---------|-----|--------------|
| Browse Services | ✅ | ✅ | ✅ |
| View Companies | ✅ | ✅ | ✅ |
| Search | ✅ (local) | ✅ (server) | ✅ (advanced) |
| Authentication | ❌ | ✅ | ✅ |
| Booking | ❌ | ✅ | ✅ |
| Payments | ❌ | ✅ | ✅ |
| Order History | ❌ | ✅ | ✅ |
| Reviews | ❌ | ✅ | ✅ |
| Favorites | ❌ | ❌ | ✅ |
| Chat | ❌ | ❌ | ✅ |
| Notifications | ❌ | ✅ | ✅ |
| Recurring | ❌ | ❌ | ✅ |
| Loyalty | ❌ | ❌ | ✅ |
| Multi-language | ❌ | ❌ | ✅ |

---

*Document maintained by Product Team*
*Last Updated: February 2026*
