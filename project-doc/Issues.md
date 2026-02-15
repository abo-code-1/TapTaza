# Tap-Taza - Issues & Technical Debt

> **Document Type:** Issue Tracking & Technical Debt Registry
> **Last Updated:** February 2026
> **Priority Scale:** P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

---

## Overview

This document tracks all known issues, bugs, missing features, and technical debt in the Tap-Taza application. Issues are categorized by type and prioritized for resolution.

---

## Critical Issues (P0)

### ISS-001: No Backend Integration
**Status:** Open
**Category:** Architecture
**Impact:** Application cannot function in production

**Description:**
The entire application runs on hardcoded mock data. No API integration exists.

**Current State:**
- Mock companies array in `app/companies/page.tsx`
- Mock services array in `app/(tabs)/home.tsx`
- Mock user data in `app/(tabs)/profile.tsx`

**Required Actions:**
1. Design and implement REST API
2. Create API client service layer
3. Implement data fetching with React Query
4. Add loading and error states
5. Implement data caching strategy

**Affected Files:**
- `app/(tabs)/home.tsx`
- `app/(tabs)/profile.tsx`
- `app/companies/page.tsx`
- `app/companies/[id].tsx`

---

### ISS-002: No Authentication System
**Status:** Open
**Category:** Security
**Impact:** No user management, data not personalized

**Description:**
Application has no login/signup flow. User is hardcoded.

**Current State:**
```tsx
// app/(tabs)/profile.tsx
const [user, setUser] = useState({
  firstName: 'Сергей',
  lastName: 'Сергеев',
  phone: '+7 (777) 123-45-67',
  email: 'chlenososer@gmail.com',
  avatar: '',
  bonuses: 450,
});
```

**Required Actions:**
1. Add auth screens (login, register, forgot password)
2. Integrate Firebase Auth or custom auth
3. Implement secure token storage (Expo SecureStore)
4. Add protected route guards
5. Implement session management

**Blocked By:** ISS-001 (Backend required)

---

### ISS-003: No Booking Flow
**Status:** Open
**Category:** Core Feature
**Impact:** Cannot complete primary user journey

**Description:**
Users can browse companies but cannot book a cleaning service. The "Заказать уборку" button shows an alert placeholder.

**Current State:**
```tsx
// app/companies/[id].tsx
Alert.alert('Заказ', 'Функция заказа будет доступна в следующей версии');
```

**Required Actions:**
1. Design booking flow UX
2. Implement date/time selection screen
3. Implement address selection/input screen
4. Implement payment screen
5. Implement confirmation screen
6. Create booking API integration

---

## High Priority Issues (P1)

### ISS-004: No Input Validation
**Status:** Open
**Category:** Security
**Impact:** Potential security vulnerabilities, poor UX

**Description:**
No form validation exists anywhere in the app.

**Locations:**
- Search input in companies list
- Profile data (when editable)
- Future booking forms

**Required Actions:**
1. Add Zod or Yup for schema validation
2. Create validation utilities
3. Add form error states and messages
4. Implement input sanitization

---

### ISS-005: No Error Handling
**Status:** Open
**Category:** UX
**Impact:** Poor user experience on errors

**Description:**
No error boundaries, no API error handling, no offline detection.

**Required Actions:**
1. Add React Error Boundaries
2. Create error UI components
3. Implement API error handling
4. Add offline detection and messaging
5. Add retry mechanisms

---

### ISS-006: No Loading States
**Status:** Open
**Category:** UX
**Impact:** Poor perceived performance

**Description:**
No skeleton loaders or loading indicators for data-dependent content.

**Current State:**
All data is synchronous (mock), so no loading needed currently.

**Required Actions:**
1. Create skeleton components
2. Add loading spinners
3. Implement suspense boundaries
4. Add pull-to-refresh functionality

---

### ISS-007: Company Detail Missing Real Data
**Status:** Open
**Category:** Feature
**Impact:** Company pages lack useful information

**Description:**
Company detail page (`app/companies/[id].tsx`) uses placeholder data, not actual company info.

**Current State:**
- Hardcoded logo placeholder
- Generic description
- No gallery/photos
- No reviews display
- No actual services list

**Required Actions:**
1. Fetch real company data by ID
2. Display actual company logo/images
3. Show company services
4. Display reviews with pagination
5. Add contact information

---

### ISS-008: Profile Features Non-Functional
**Status:** Open
**Category:** Feature
**Impact:** Profile actions don't work

**Description:**
Quick action buttons in profile don't navigate anywhere:
- "Адреса" (Addresses)
- "Заказы" (Orders)
- "Оплата" (Payment)

**Current State:**
```tsx
<QuickAction icon="location-outline" label="Адреса" color="#10b981" />
// No onPress handler
```

**Required Actions:**
1. Create addresses list screen
2. Create orders history screen
3. Create payment methods screen
4. Link quick actions to screens

---

## Medium Priority Issues (P2)

### ISS-009: Inconsistent Component Structure
**Status:** Open
**Category:** Code Quality
**Impact:** Maintainability issues

**Description:**
Components are not consistently organized:
- `companyCard.tsx` (lowercase)
- `ServiceCard.tsx` (PascalCase)
- Inline components in screen files

**Required Actions:**
1. Rename to consistent PascalCase
2. Extract inline components to separate files
3. Create `/src/components/ui` for base components
4. Add component index files

---

### ISS-010: Missing Type Definitions
**Status:** Open
**Category:** Code Quality
**Impact:** Type safety gaps

**Description:**
No centralized type definitions. Types are defined inline or not at all.

**Examples:**
```tsx
// Inline type in page.tsx
const ALL_COMPANIES = [
  { id: '1', name: 'CleanMaster', ... }  // No interface
];
```

**Required Actions:**
1. Create `/src/types` directory
2. Define `Company` interface
3. Define `Service` interface
4. Define `User` interface
5. Define `Booking` interface
6. Export types from index

---

### ISS-011: Hardcoded Strings (No i18n)
**Status:** Open
**Category:** Internationalization
**Impact:** Cannot support multiple languages

**Description:**
All UI strings are hardcoded in Russian. No internationalization setup.

**Examples:**
- "Показать компании"
- "Заказать уборку"
- "Выйти из аккаунта"

**Required Actions:**
1. Install i18n library (react-i18next or expo-localization)
2. Create translation files
3. Replace hardcoded strings
4. Support Russian, Kazakh, English

---

### ISS-012: No Push Notifications
**Status:** Open
**Category:** Feature
**Impact:** Cannot notify users

**Description:**
No push notification setup for booking updates, promotions, etc.

**Required Actions:**
1. Set up Firebase Cloud Messaging
2. Request notification permissions
3. Handle notification tokens
4. Implement notification handling

---

### ISS-013: Avatar Upload Incomplete
**Status:** Open
**Category:** Feature
**Impact:** Avatar changes don't persist

**Description:**
Image picker is implemented but avatar isn't uploaded to server.

**Current State:**
```tsx
// app/(tabs)/profile.tsx
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({...});
  if (!result.canceled) {
    setUser({ ...user, avatar: result.assets[0].uri });
    // Local state only, not persisted
  }
};
```

**Required Actions:**
1. Implement image upload API
2. Store image URL in user profile
3. Display server-hosted images

**Blocked By:** ISS-001, ISS-002

---

### ISS-014: Missing Search Functionality
**Status:** Open
**Category:** Feature
**Impact:** Cannot search for companies effectively

**Description:**
Search bar exists but has limitations:
- Local filtering only (no server search)
- Only searches by name
- No search suggestions
- No recent searches

**Required Actions:**
1. Implement server-side search API
2. Add search by service type, location
3. Add search suggestions
4. Add search history

---

### ISS-015: No Payment Integration
**Status:** Open
**Category:** Feature
**Impact:** Cannot process payments

**Description:**
No payment system integrated for booking payments.

**Required Actions:**
1. Research local payment options (Kaspi Pay, Halyk)
2. Integrate payment SDK
3. Implement payment flow
4. Add saved payment methods
5. Handle payment receipts

---

## Low Priority Issues (P3)

### ISS-016: Accessibility Issues
**Status:** Open
**Category:** Accessibility
**Impact:** App not accessible to all users

**Description:**
Limited accessibility support:
- Missing `accessibilityLabel` props
- No screen reader testing
- Contrast ratios not verified

**Required Actions:**
1. Add accessibility labels
2. Test with VoiceOver/TalkBack
3. Verify color contrast
4. Add focus management

---

### ISS-017: Performance Optimization Needed
**Status:** Open
**Category:** Performance
**Impact:** Potential performance issues at scale

**Description:**
Current optimizations are minimal:
- No image caching
- FlatList instead of FlashList
- No code splitting

**Required Actions:**
1. Replace FlatList with FlashList
2. Implement image caching (expo-image)
3. Add code splitting for screens
4. Profile and optimize renders

---

### ISS-018: No Analytics Integration
**Status:** Open
**Category:** Feature
**Impact:** Cannot track user behavior

**Description:**
No analytics to track user behavior, screen views, conversions.

**Required Actions:**
1. Integrate analytics (Firebase Analytics/Mixpanel)
2. Track key events
3. Set up conversion funnels
4. Monitor user retention

---

### ISS-019: No Crash Reporting
**Status:** Open
**Category:** DevOps
**Impact:** Cannot identify production issues

**Description:**
No crash reporting or error monitoring.

**Required Actions:**
1. Integrate Sentry or Firebase Crashlytics
2. Set up error alerts
3. Create crash-free rate dashboards

---

### ISS-020: Unused Development File
**Status:** Open
**Category:** Cleanup
**Impact:** Minor - cluttered repo

**Description:**
`cesconfig.jsonc` appears to be a debug/IDE config that shouldn't be in repo.

**File:** `/cesconfig.jsonc`

**Required Actions:**
1. Add to .gitignore
2. Remove from repository

---

### ISS-021: Inconsistent Spacing/Padding
**Status:** Open
**Category:** UI
**Impact:** Minor visual inconsistency

**Description:**
Some screens have inconsistent padding values (px-4 vs px-5 vs px-6).

**Examples:**
- Home screen: `px-5`
- Companies list: `px-4`
- Company detail: varies

**Required Actions:**
1. Define spacing scale constants
2. Apply consistent padding across screens
3. Document spacing guidelines

---

### ISS-022: No Dark Mode Support
**Status:** Open
**Category:** Feature
**Impact:** User preference not supported

**Description:**
App only supports light mode (`userInterfaceStyle: "light"` in app.json).

**Required Actions:**
1. Design dark mode color palette
2. Implement theme context
3. Add system theme detection
4. Allow manual theme toggle

---

### ISS-023: Tab Bar Home Screen Label
**Status:** Open
**Category:** Bug
**Impact:** Minor UX issue

**Description:**
Tab label shows "Главная" but screen title doesn't match.

**Required Actions:**
1. Verify consistent naming
2. Consider showing "Tap-Taza" as header title

---

## Technical Debt Summary

| Category | Count | Severity |
|----------|-------|----------|
| Missing Core Features | 3 | Critical |
| Security | 2 | High |
| Code Quality | 2 | Medium |
| UX/UI | 4 | Medium |
| DevOps | 2 | Low |
| Performance | 1 | Low |
| Accessibility | 1 | Low |
| **Total** | **23** | - |

---

## Resolution Priority

### Sprint 1 (Critical Path)
1. ISS-001: Backend Integration
2. ISS-002: Authentication
3. ISS-003: Booking Flow

### Sprint 2 (Core UX)
4. ISS-005: Error Handling
5. ISS-006: Loading States
6. ISS-007: Company Detail Data

### Sprint 3 (Polish)
7. ISS-004: Input Validation
8. ISS-008: Profile Features
9. ISS-009: Component Structure

### Sprint 4 (Enhancement)
10. ISS-010: Type Definitions
11. ISS-014: Search Functionality
12. ISS-015: Payment Integration

### Backlog
- All P3 issues
- ISS-011: i18n
- ISS-012: Push Notifications

---

## How to Report Issues

When adding new issues to this document:

1. Use the format: `ISS-XXX: Title`
2. Include:
   - Status (Open/In Progress/Resolved)
   - Category
   - Impact description
   - Current state (code examples if applicable)
   - Required actions
   - Dependencies/blockers
3. Update the summary table
4. Add to resolution priority if critical

---

*Last reviewed: February 2026*
*Next review: TBD after Sprint 1*
