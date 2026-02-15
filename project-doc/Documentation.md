# Tap-Taza Technical Documentation

> **Version:** 1.0.0
> **Framework:** React Native + Expo
> **Language:** TypeScript

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Project Structure](#2-project-structure)
3. [Development Guide](#3-development-guide)
4. [Components Reference](#4-components-reference)
5. [Navigation](#5-navigation)
6. [Styling Guide](#6-styling-guide)
7. [State Management](#7-state-management)
8. [API Integration](#8-api-integration-future)
9. [Testing](#9-testing)
10. [Deployment](#10-deployment)

---

## 1. Getting Started

### Prerequisites
- Node.js >= 18.x
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tap-taza-cleaning-app

# Install dependencies
yarn install
# or
npm install

# Start development server
yarn start
# or
npm start
```

### Running the App

```bash
# iOS Simulator
yarn ios

# Android Emulator
yarn android

# Web Browser
yarn web

# Expo Go (scan QR code)
yarn start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn start` | Start Expo development server |
| `yarn ios` | Run on iOS simulator |
| `yarn android` | Run on Android emulator |
| `yarn web` | Run in web browser |
| `yarn lint` | Check code style with ESLint |
| `yarn format` | Auto-fix code style issues |
| `yarn prebuild` | Generate native iOS/Android projects |

---

## 2. Project Structure

```
tap-taza-cleaning-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Entry point
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tab configuration
│   │   ├── home.tsx        # Home screen
│   │   └── profile.tsx     # Profile screen
│   └── companies/          # Company screens
│       ├── page.tsx        # Company list
│       └── [id].tsx        # Company detail
├── src/
│   └── components/         # Reusable components
│       ├── companyCard.tsx
│       └── ServiceCard.tsx
├── assets/                 # Static assets
├── global.css              # Tailwind directives
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── app.json                # Expo configuration
```

### File Naming Conventions
- **Screens**: `lowercase.tsx` or `[param].tsx` for dynamic routes
- **Components**: `PascalCase.tsx` (e.g., `ServiceCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `*.types.ts` (e.g., `company.types.ts`)
- **Hooks**: `use*.ts` (e.g., `useAuth.ts`)

---

## 3. Development Guide

### TypeScript Configuration

The project uses strict TypeScript with path aliases:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Usage:**
```tsx
// Instead of
import { Button } from '../../../src/components/Button';

// Use path alias
import { Button } from '@/components/Button';
```

### Code Style

The project uses ESLint + Prettier:

```bash
# Check for issues
yarn lint

# Auto-fix issues
yarn format
```

**Key Rules:**
- Single quotes for strings
- No semicolons (configured in Prettier)
- 100 character line width
- Tailwind class sorting (automatic)

### Environment Variables

Create `.env` file for environment-specific config:

```env
# .env (not committed to git)
EXPO_PUBLIC_API_URL=https://api.taptaza.kz
EXPO_PUBLIC_FIREBASE_KEY=your-key-here
```

**Usage in code:**
```tsx
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## 4. Components Reference

### ServiceCard

Selectable service card displayed on home screen.

```tsx
interface ServiceCardProps {
  id: string;
  title: string;
  price: string;
  info: string;
  offers: string;
  tag: string;
  selected: boolean;
  onSelect: (id: string) => void;
}
```

**Usage:**
```tsx
<ServiceCard
  id="standard"
  title="Стандартная уборка"
  price="от 5 000 ₸"
  info="2-3 комнаты"
  offers="45 предложений"
  tag="Популярное"
  selected={selectedId === 'standard'}
  onSelect={setSelectedId}
/>
```

### CompanyCard

Animated company card with gradient background.

```tsx
interface CompanyCardProps {
  id: string;
  name: string;
  rating: number;
  price: number;
  verified: boolean;
  reviews: number;
  responseTime: string;
  index: number;
  onPress: () => void;
}
```

**Features:**
- Entering animation with staggered delay
- Linear gradient background
- Verified badge
- Star rating display

**Usage:**
```tsx
<CompanyCard
  id="1"
  name="CleanMaster"
  rating={4.9}
  price={5000}
  verified={true}
  reviews={234}
  responseTime="~15 мин"
  index={0}
  onPress={() => router.push(`/companies/${id}`)}
/>
```

### Creating New Components

Follow this template:

```tsx
// src/components/MyComponent.tsx
import { View, Text, TouchableOpacity } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white p-4 rounded-xl"
    >
      <Text className="text-lg font-semibold text-gray-900">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

---

## 5. Navigation

### Expo Router Basics

The app uses file-based routing with Expo Router:

| File | Route |
|------|-------|
| `app/index.tsx` | `/` |
| `app/(tabs)/home.tsx` | `/home` |
| `app/(tabs)/profile.tsx` | `/profile` |
| `app/companies/page.tsx` | `/companies/page` |
| `app/companies/[id].tsx` | `/companies/:id` |

### Navigation Methods

```tsx
import { useRouter, useLocalSearchParams } from 'expo-router';

function MyScreen() {
  const router = useRouter();

  // Navigate to a screen
  router.push('/companies/page');

  // Navigate with params
  router.push('/companies/123');

  // Replace current screen
  router.replace('/home');

  // Go back
  router.back();

  // Check if can go back
  if (router.canGoBack()) {
    router.back();
  }
}
```

### Reading Route Parameters

```tsx
// In app/companies/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function CompanyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>Company ID: {id}</Text>;
}
```

### Tab Navigator Configuration

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 90,
          paddingBottom: 30,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Deep Linking

The app is configured with the `taptaza://` scheme:

```json
// app.json
{
  "expo": {
    "scheme": "taptaza"
  }
}
```

**Example deep links:**
- `taptaza://home`
- `taptaza://companies/123`
- `taptaza://profile`

---

## 6. Styling Guide

### NativeWind (Tailwind CSS)

The project uses NativeWind for styling with Tailwind CSS syntax:

```tsx
// Basic usage
<View className="flex-1 bg-white px-4 py-6">
  <Text className="text-xl font-bold text-gray-900">
    Hello World
  </Text>
</View>
```

### Common Utility Classes

**Layout:**
```tsx
flex-1         // flex: 1
flex-row       // flexDirection: 'row'
items-center   // alignItems: 'center'
justify-between // justifyContent: 'space-between'
```

**Spacing:**
```tsx
p-4    // padding: 16
px-6   // paddingHorizontal: 24
py-2   // paddingVertical: 8
m-4    // margin: 16
mt-2   // marginTop: 8
gap-3  // gap: 12
```

**Typography:**
```tsx
text-sm        // fontSize: 14
text-lg        // fontSize: 18
text-xl        // fontSize: 20
font-semibold  // fontWeight: '600'
font-bold      // fontWeight: '700'
text-gray-900  // color: '#111827'
text-center    // textAlign: 'center'
```

**Backgrounds & Borders:**
```tsx
bg-white       // backgroundColor: 'white'
bg-blue-500    // backgroundColor: '#3b82f6'
rounded-xl     // borderRadius: 12
rounded-full   // borderRadius: 9999
border         // borderWidth: 1
border-gray-200 // borderColor: '#e5e7eb'
```

### Shadows (Inline Styles)

NativeWind doesn't support shadows well, use inline styles:

```tsx
<View
  className="bg-white rounded-xl p-4"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3, // Android
  }}
>
```

### Gradients

Use Expo Linear Gradient:

```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#EFF6FF', '#DBEAFE']}
  className="w-14 h-14 rounded-2xl items-center justify-center"
>
  <Ionicons name="briefcase" size={24} color="#2563eb" />
</LinearGradient>
```

### Responsive Design

```tsx
// Platform-specific
Platform.OS === 'ios' ? 'pt-12' : 'pt-8'

// Screen dimensions
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
```

---

## 7. State Management

### Current: Local State (useState)

```tsx
const [selectedService, setSelectedService] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
```

### Recommended: Zustand (Future)

Install:
```bash
yarn add zustand
```

Create store:
```tsx
// src/store/bookingStore.ts
import { create } from 'zustand';

interface BookingState {
  selectedService: string | null;
  selectedCompany: string | null;
  setService: (id: string) => void;
  setCompany: (id: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  selectedCompany: null,
  setService: (id) => set({ selectedService: id }),
  setCompany: (id) => set({ selectedCompany: id }),
  reset: () => set({ selectedService: null, selectedCompany: null }),
}));
```

Usage:
```tsx
function ServiceScreen() {
  const { selectedService, setService } = useBookingStore();

  return (
    <ServiceCard
      selected={selectedService === 'standard'}
      onSelect={() => setService('standard')}
    />
  );
}
```

---

## 8. API Integration (Future)

### API Client Setup

```tsx
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken(); // from secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### React Query Integration

```bash
yarn add @tanstack/react-query
```

```tsx
// src/hooks/useCompanies.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function useCompanies(serviceType: string) {
  return useQuery({
    queryKey: ['companies', serviceType],
    queryFn: async () => {
      const { data } = await api.get(`/companies?service=${serviceType}`);
      return data;
    },
  });
}
```

Usage:
```tsx
function CompaniesScreen() {
  const { data: companies, isLoading, error } = useCompanies('standard');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <CompanyList companies={companies} />;
}
```

---

## 9. Testing

### Setup (Future)

```bash
yarn add -D jest @testing-library/react-native
```

### Component Testing

```tsx
// src/components/__tests__/ServiceCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { ServiceCard } from '../ServiceCard';

describe('ServiceCard', () => {
  it('calls onSelect when pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ServiceCard
        id="1"
        title="Test Service"
        selected={false}
        onSelect={onSelect}
        // ... other props
      />
    );

    fireEvent.press(getByText('Выбрать'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

### Running Tests

```bash
yarn test           # Run all tests
yarn test --watch   # Watch mode
yarn test --coverage # Coverage report
```

---

## 10. Deployment

### Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Building for Production

```bash
# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Both platforms
eas build --platform all
```

### Over-the-Air Updates

```bash
# Push an update
eas update --branch production --message "Bug fix"
```

### App Store Submission

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### Environment Configuration

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

---

## Appendix: Common Issues

### Metro Bundler Cache

```bash
# Clear cache and restart
npx expo start --clear
```

### iOS Simulator Issues

```bash
# Reset iOS simulator
xcrun simctl erase all
```

### Android Emulator Issues

```bash
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd Pixel_4_API_33
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn install

# Clear Expo cache
expo doctor --fix-dependencies
```

---

*For questions or issues, refer to the Issues.md document or contact the development team.*
