# Tap-Taza - UI Design System

> **Version:** 1.0
> **Framework:** NativeWind (Tailwind CSS)
> **Design Philosophy:** Clean, Professional, Trustworthy

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Icons](#6-icons)
7. [Animations](#7-animations)
8. [Patterns](#8-patterns)

---

## 1. Design Principles

### Core Values

**1. Clarity**
> Every element should have a clear purpose. Users should never wonder what something does.

**2. Trust**
> Design choices should convey professionalism and reliability. Users are inviting strangers into their homes.

**3. Efficiency**
> Minimize taps to complete actions. Booking should be achievable in under 60 seconds.

**4. Accessibility**
> Design for all users. Clear contrast, readable text, touch-friendly targets.

### Design Language

| Aspect | Approach |
|--------|----------|
| Visual Style | Clean, minimal, modern |
| Corners | Rounded (12-16px radius) |
| Shadows | Soft, subtle elevation |
| Gradients | Light, accent colors only |
| Motion | Smooth, purposeful |
| Density | Comfortable spacing |

---

## 2. Color System

### Primary Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Primary Blue | `#2563EB` | `blue-600` | CTAs, links, active states |
| Primary Dark | `#1D4ED8` | `blue-700` | Pressed states |
| Primary Light | `#3B82F6` | `blue-500` | Hover states |
| Primary Pale | `#EFF6FF` | `blue-50` | Backgrounds |

```tsx
// Usage
<View className="bg-blue-600" />
<Text className="text-blue-600" />
```

### Semantic Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Success | `#10B981` | `emerald-500` | Verified, confirmed |
| Warning | `#F59E0B` | `amber-500` | Ratings, attention |
| Error | `#EF4444` | `red-500` | Errors, required |
| Info | `#3B82F6` | `blue-500` | Information |

### Neutral Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Black | `#000000` | `black` | - |
| Gray 900 | `#111827` | `gray-900` | Primary text |
| Gray 700 | `#374151` | `gray-700` | Secondary text |
| Gray 500 | `#6B7280` | `gray-500` | Placeholder |
| Gray 400 | `#9CA3AF` | `gray-400` | Disabled |
| Gray 300 | `#D1D5DB` | `gray-300` | Borders |
| Gray 100 | `#F3F4F6` | `gray-100` | Backgrounds |
| White | `#FFFFFF` | `white` | Cards, surfaces |

### Gradients

```tsx
// Light blue gradient (for icons)
<LinearGradient colors={['#EFF6FF', '#DBEAFE']} />

// Company card gradient
<LinearGradient colors={['#EFF6FF', '#DBEAFE']} />
```

### Color Application

```
┌─────────────────────────────────────────────┐
│ App Background: #F8FAFC (slate-50)          │
│ ┌─────────────────────────────────────────┐ │
│ │ Card Background: #FFFFFF (white)        │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Primary Text: #111827 (gray-900)    │ │ │
│ │ │ Secondary Text: #6B7280 (gray-500)  │ │ │
│ │ │ CTA Button: #2563EB (blue-600)      │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 3. Typography

### Font Family

The app uses system fonts for optimal performance:

```tsx
// iOS: San Francisco
// Android: Roboto
fontFamily: 'System'
```

### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 32px | Bold | 40px | Hero headers |
| H1 | 24px | Bold | 32px | Page titles |
| H2 | 20px | SemiBold | 28px | Section headers |
| H3 | 18px | SemiBold | 24px | Card titles |
| Body | 16px | Regular | 24px | Body text |
| Body SM | 14px | Regular | 20px | Secondary text |
| Caption | 12px | Medium | 16px | Labels, tags |
| Tiny | 10px | Medium | 14px | Fine print |

### Tailwind Typography Classes

```tsx
// Display
<Text className="text-3xl font-bold">Display</Text>

// H1
<Text className="text-2xl font-bold">Heading 1</Text>

// H2
<Text className="text-xl font-semibold">Heading 2</Text>

// H3
<Text className="text-lg font-semibold">Heading 3</Text>

// Body
<Text className="text-base">Body text</Text>

// Body Small
<Text className="text-sm text-gray-500">Secondary text</Text>

// Caption
<Text className="text-xs font-medium">CAPTION</Text>
```

### Text Colors

| Usage | Class | Example |
|-------|-------|---------|
| Primary | `text-gray-900` | Titles, body |
| Secondary | `text-gray-500` | Subtitles |
| Tertiary | `text-gray-400` | Hints |
| Accent | `text-blue-600` | Links |
| Success | `text-emerald-500` | Verified |
| Error | `text-red-500` | Errors |

---

## 4. Spacing & Layout

### Spacing Scale

Based on 4px base unit:

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| xs | 4px | `1` | Tight spacing |
| sm | 8px | `2` | Icon gaps |
| md | 12px | `3` | Element gaps |
| lg | 16px | `4` | Section spacing |
| xl | 24px | `6` | Group spacing |
| 2xl | 32px | `8` | Screen padding |
| 3xl | 48px | `12` | Major sections |

### Common Patterns

```tsx
// Screen container
<View className="flex-1 bg-slate-50 px-5 pt-4">

// Card
<View className="bg-white rounded-2xl p-4 mb-3">

// Section header
<View className="mb-4 mt-6">

// Button group
<View className="flex-row gap-3">

// List item
<View className="py-3 border-b border-gray-100">
```

### Screen Layout

```
┌──────────────────────────────────────┐
│ Status Bar                       │ 44px (iOS)
├──────────────────────────────────────┤
│                                      │
│ ← Header Area (Safe)             │ 52px
│                                      │
├──────────────────────────────────────┤
│ px-5                             │
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │      Content Area            │ │
│ │                              │ │
│ │                              │ │
│ └──────────────────────────────┘ │
│                                      │
├──────────────────────────────────────┤
│ Tab Bar                          │ 90px
└──────────────────────────────────────┘
```

### Safe Areas

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-white">
  {/* Content */}
</SafeAreaView>
```

---

## 5. Components

### 5.1 Buttons

#### Primary Button
```tsx
<TouchableOpacity
  className="bg-blue-600 rounded-2xl py-4 items-center"
  activeOpacity={0.9}
>
  <Text className="text-white font-semibold text-base">
    Button Text
  </Text>
</TouchableOpacity>
```

#### Secondary Button
```tsx
<TouchableOpacity
  className="bg-white border border-gray-200 rounded-2xl py-4 items-center"
  activeOpacity={0.8}
>
  <Text className="text-gray-900 font-semibold text-base">
    Button Text
  </Text>
</TouchableOpacity>
```

#### Ghost Button
```tsx
<TouchableOpacity
  className="py-3 items-center"
  activeOpacity={0.6}
>
  <Text className="text-blue-600 font-semibold text-base">
    Button Text
  </Text>
</TouchableOpacity>
```

#### Button States

| State | Style Change |
|-------|--------------|
| Default | Base styles |
| Pressed | `activeOpacity={0.8}` |
| Disabled | `opacity-50` + disabled |
| Loading | Spinner + text hidden |

### 5.2 Cards

#### Standard Card
```tsx
<View
  className="bg-white rounded-2xl p-4"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  }}
>
  {/* Content */}
</View>
```

#### Interactive Card
```tsx
<TouchableOpacity
  activeOpacity={0.95}
  className="bg-white rounded-2xl p-4"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  }}
>
  {/* Content */}
</TouchableOpacity>
```

#### Selected Card
```tsx
<View className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-4">
  {/* Content */}
</View>
```

### 5.3 Inputs

#### Text Input
```tsx
<View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
  <Ionicons name="search" size={20} color="#9CA3AF" />
  <TextInput
    placeholder="Search..."
    placeholderTextColor="#9CA3AF"
    className="flex-1 ml-3 text-base text-gray-900"
  />
</View>
```

#### Input States

| State | Border | Background |
|-------|--------|------------|
| Default | none | gray-100 |
| Focused | blue-500 | white |
| Error | red-500 | red-50 |
| Disabled | gray-200 | gray-50 |

### 5.4 Chips/Tags

#### Filter Chip
```tsx
// Inactive
<TouchableOpacity className="px-4 py-2 rounded-full bg-white border border-gray-200">
  <Text className="text-sm text-gray-600">Filter</Text>
</TouchableOpacity>

// Active
<TouchableOpacity className="px-4 py-2 rounded-full bg-blue-600">
  <Text className="text-sm text-white font-medium">Filter</Text>
</TouchableOpacity>
```

#### Status Tag
```tsx
// Verified
<View className="bg-emerald-100 px-2 py-1 rounded-lg flex-row items-center">
  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
  <Text className="text-xs text-emerald-700 ml-1">Verified</Text>
</View>

// Popular
<View className="bg-amber-100 px-2 py-1 rounded-lg">
  <Text className="text-xs text-amber-700 font-medium">Popular</Text>
</View>
```

### 5.5 Lists

#### List Item
```tsx
<TouchableOpacity
  className="flex-row items-center py-4 px-4 bg-white border-b border-gray-100"
  activeOpacity={0.7}
>
  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
    <Ionicons name="person" size={20} color="#2563EB" />
  </View>
  <View className="flex-1 ml-3">
    <Text className="text-base font-medium text-gray-900">Title</Text>
    <Text className="text-sm text-gray-500">Subtitle</Text>
  </View>
  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
</TouchableOpacity>
```

### 5.6 Rating Display

```tsx
<View className="flex-row items-center">
  <Ionicons name="star" size={16} color="#F59E0B" />
  <Text className="text-base font-semibold text-gray-900 ml-1">4.9</Text>
  <Text className="text-sm text-gray-500 ml-1">(234)</Text>
</View>
```

### 5.7 Avatar

```tsx
// With image
<Image
  source={{ uri: avatarUrl }}
  className="w-16 h-16 rounded-full"
/>

// Placeholder
<View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center">
  <Ionicons name="person" size={28} color="#2563EB" />
</View>
```

---

## 6. Icons

### Icon Library

Using `@expo/vector-icons` with Ionicons as primary set.

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| xs | 16px | Inline, tags |
| sm | 20px | List items |
| md | 24px | Navigation, buttons |
| lg | 28px | Headers |
| xl | 32px | Empty states |
| 2xl | 48px | Hero icons |

### Common Icons

| Purpose | Icon Name | Variant |
|---------|-----------|---------|
| Home | `home` / `home-outline` | Tab |
| Profile | `person` / `person-outline` | Tab |
| Search | `search` | Input |
| Back | `arrow-back` | Header |
| Close | `close` | Modal |
| Settings | `settings-outline` | Menu |
| Notifications | `notifications-outline` | Header |
| Star | `star` | Rating |
| Check | `checkmark-circle` | Verified |
| Location | `location-outline` | Address |
| Time | `time-outline` | Duration |
| Calendar | `calendar-outline` | Date |
| Card | `card-outline` | Payment |

### Icon Usage

```tsx
import { Ionicons } from '@expo/vector-icons';

// Tab bar (filled when active)
<Ionicons
  name={focused ? 'home' : 'home-outline'}
  size={24}
  color={focused ? '#2563EB' : '#9CA3AF'}
/>

// List item
<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />

// Action
<Ionicons name="add" size={24} color="#FFFFFF" />
```

---

## 7. Animations

### Using React Native Reanimated

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
```

### Common Animations

#### Fade In
```tsx
const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
```

#### Scale on Press
```tsx
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const onPressIn = () => {
  scale.value = withSpring(0.95);
};

const onPressOut = () => {
  scale.value = withSpring(1);
};
```

#### Slide In (List Items)
```tsx
const translateY = useSharedValue(50);

useEffect(() => {
  translateY.value = withTiming(0, {
    duration: 300,
    delay: index * 50, // Stagger
  });
}, []);
```

#### Header Show/Hide on Scroll
```tsx
const scrollY = useSharedValue(0);

const headerStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [0, 100], [0, 1]),
  transform: [{
    translateY: interpolate(scrollY.value, [0, 100], [-50, 0]),
  }],
}));

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});
```

### Animation Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Fade | 200-300ms | ease-out |
| Scale | Spring | damping: 15 |
| Slide | 300ms | ease-out |
| Layout | 250ms | ease-in-out |

### Spring Config

```tsx
const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

scale.value = withSpring(1, springConfig);
```

---

## 8. Patterns

### 8.1 Screen Layout Pattern

```tsx
export default function Screen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-2xl font-bold text-gray-900">Title</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen content */}
      </ScrollView>

      {/* Sticky Footer (optional) */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100">
        <TouchableOpacity className="bg-blue-600 rounded-2xl py-4 items-center">
          <Text className="text-white font-semibold">Action</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

### 8.2 Card List Pattern

```tsx
<FlatList
  data={items}
  renderItem={({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
    >
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3"
        style={shadowStyle}
        activeOpacity={0.95}
      >
        {/* Card content */}
      </TouchableOpacity>
    </Animated.View>
  )}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 20 }}
  showsVerticalScrollIndicator={false}
/>
```

### 8.3 Filter Tabs Pattern

```tsx
const [activeFilter, setActiveFilter] = useState('all');

const filters = ['all', 'popular', 'new', 'nearby'];

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="px-5"
>
  {filters.map((filter) => (
    <TouchableOpacity
      key={filter}
      onPress={() => setActiveFilter(filter)}
      className={`px-4 py-2 mr-2 rounded-full ${
        activeFilter === filter
          ? 'bg-blue-600'
          : 'bg-white border border-gray-200'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          activeFilter === filter ? 'text-white' : 'text-gray-600'
        }`}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

### 8.4 Empty State Pattern

```tsx
<View className="flex-1 items-center justify-center py-20">
  <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
    <Ionicons name="search" size={32} color="#9CA3AF" />
  </View>
  <Text className="text-lg font-semibold text-gray-900 mb-2">
    No Results Found
  </Text>
  <Text className="text-sm text-gray-500 text-center px-10">
    Try adjusting your search or filters
  </Text>
</View>
```

### 8.5 Loading State Pattern

```tsx
// Skeleton loader
<View className="bg-white rounded-2xl p-4 mb-3">
  <View className="flex-row items-center">
    <View className="w-12 h-12 rounded-full bg-gray-200" />
    <View className="ml-3">
      <View className="w-32 h-4 bg-gray-200 rounded mb-2" />
      <View className="w-20 h-3 bg-gray-200 rounded" />
    </View>
  </View>
</View>
```

---

## Quick Reference

### Shadow Presets

```tsx
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
};
```

### Border Radius

| Size | Value | Class |
|------|-------|-------|
| sm | 8px | `rounded-lg` |
| md | 12px | `rounded-xl` |
| lg | 16px | `rounded-2xl` |
| full | 9999px | `rounded-full` |

### Z-Index Layers

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default |
| Cards | 1 | Elevated cards |
| Sticky | 10 | Sticky headers |
| Modal | 50 | Modal overlays |
| Toast | 100 | Notifications |

---

*Design system maintained by the Design Team*
*Last Updated: February 2026*
