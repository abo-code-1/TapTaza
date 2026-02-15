# Tap-Taza - Product Roadmap

> **Version:** 1.0
> **Product Vision:** The #1 platform for booking cleaning services in Kazakhstan

---

## Product Vision & Goals

### Vision Statement
Transform the way people in Kazakhstan book cleaning services by providing a seamless, trustworthy, and convenient mobile platform that connects customers with verified cleaning professionals.

### Success Metrics
| Metric | Target (Year 1) |
|--------|-----------------|
| Monthly Active Users | 50,000 |
| Registered Companies | 500+ |
| Monthly Bookings | 10,000 |
| Customer Satisfaction | 4.5+ stars |
| Company Response Rate | < 30 minutes |
| App Store Rating | 4.7+ |

---

## Development Phases

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1          PHASE 2          PHASE 3          PHASE 4        │
│  Foundation       Core Product     Growth           Scale          │
│  ─────────        ────────────     ──────           ─────          │
│                                                                     │
│  ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐   │
│  │ Backend │     │ Booking  │     │ Payments │     │ B2B      │   │
│  │ + Auth  │────▶│ Flow     │────▶│ + Loyalty│────▶│ Platform │   │
│  └─────────┘     └──────────┘     └──────────┘     └──────────┘   │
│                                                                     │
│  Current ──────▶                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation (Current → MVP)

**Goal:** Establish core infrastructure and authentication

### 1.1 Backend Development
- [ ] Set up Node.js/NestJS backend
- [ ] Design PostgreSQL database schema
- [ ] Implement REST API endpoints
- [ ] Set up Redis caching
- [ ] Configure cloud hosting (AWS/GCP)
- [ ] Set up CI/CD pipeline

### 1.2 Authentication System
- [ ] Implement Firebase Authentication
- [ ] Create login screen
- [ ] Create registration screen
- [ ] Create forgot password screen
- [ ] Implement phone number verification
- [ ] Add social login (Google, Apple)
- [ ] Implement secure token storage
- [ ] Add biometric authentication option

### 1.3 Data Integration
- [ ] Replace mock data with API calls
- [ ] Implement React Query for data fetching
- [ ] Add offline data caching
- [ ] Create loading skeletons
- [ ] Implement error handling
- [ ] Add pull-to-refresh

### 1.4 User Profile
- [ ] Connect profile to backend
- [ ] Implement avatar upload
- [ ] Add profile editing
- [ ] Create address management
- [ ] Implement notification preferences

**Deliverables:**
- Working authentication flow
- Real company data from backend
- User profiles with persistence
- Basic admin panel for data management

---

## Phase 2: Core Product (Post-MVP)

**Goal:** Complete booking flow and essential features

### 2.1 Booking Flow
- [ ] Design booking UX flow
- [ ] Create date/time picker screen
- [ ] Implement address selection
- [ ] Add service customization options
  - Room count
  - Special requests
  - Pet-friendly option
  - Eco-friendly products
- [ ] Create booking confirmation screen
- [ ] Implement booking API
- [ ] Add booking to order history

### 2.2 Company Features
- [ ] Complete company profile pages
- [ ] Add company photo gallery
- [ ] Display all company services
- [ ] Show company availability
- [ ] Implement reviews & ratings display
- [ ] Add "Write a Review" feature
- [ ] Show company response time
- [ ] Add company contact options

### 2.3 Search & Discovery
- [ ] Implement server-side search
- [ ] Add location-based filtering
- [ ] Create category filters
- [ ] Add price range filter
- [ ] Implement sorting options
- [ ] Add search suggestions
- [ ] Create "Recently Viewed" section
- [ ] Add "Favorites" functionality

### 2.4 Notifications
- [ ] Set up Firebase Cloud Messaging
- [ ] Implement push notification handling
- [ ] Create notification center screen
- [ ] Add booking status notifications
- [ ] Implement promotional notifications
- [ ] Add in-app notifications

**Deliverables:**
- Complete booking flow
- Enhanced company profiles
- Advanced search & filtering
- Push notifications

---

## Phase 3: Growth Features

**Goal:** Drive engagement and monetization

### 3.1 Payment Integration
- [ ] Integrate Kaspi Pay
- [ ] Add Halyk Bank integration
- [ ] Implement card payments (Stripe)
- [ ] Create payment screen
- [ ] Add saved payment methods
- [ ] Implement payment receipts
- [ ] Handle refunds flow
- [ ] Add tipping feature

### 3.2 Loyalty Program
- [ ] Design loyalty point system
- [ ] Create bonuses screen
- [ ] Implement point earning
- [ ] Add point redemption
- [ ] Create referral program
- [ ] Implement promo codes
- [ ] Add achievement badges

### 3.3 Real-Time Features
- [ ] Implement WebSocket connection
- [ ] Add real-time booking updates
- [ ] Create in-app chat (customer ↔ company)
- [ ] Add typing indicators
- [ ] Implement read receipts
- [ ] Add file/image sharing in chat

### 3.4 Reviews & Trust
- [ ] Implement review system
- [ ] Add photo reviews
- [ ] Create company response to reviews
- [ ] Implement review moderation
- [ ] Add verification badges
- [ ] Create "Trusted Company" program

### 3.5 Scheduling
- [ ] Create recurring bookings
- [ ] Implement booking reminders
- [ ] Add calendar integration
- [ ] Create subscription packages
- [ ] Implement auto-rebooking

**Deliverables:**
- Multiple payment options
- Loyalty & rewards system
- Real-time communication
- Recurring booking support

---

## Phase 4: Scale & Expansion

**Goal:** Platform expansion and B2B features

### 4.1 Company Dashboard (Web)
- [ ] Create company registration portal
- [ ] Build booking management dashboard
- [ ] Add analytics for companies
- [ ] Implement schedule management
- [ ] Create team member management
- [ ] Add financial reports
- [ ] Implement service pricing tools

### 4.2 Admin Panel
- [ ] Create super admin dashboard
- [ ] Add user management
- [ ] Implement company verification workflow
- [ ] Create content management
- [ ] Add analytics dashboard
- [ ] Implement moderation tools

### 4.3 Geographic Expansion
- [ ] Add multi-city support
- [ ] Implement city selection
- [ ] Create location-based promotions
- [ ] Add regional pricing
- [ ] Localize for different regions

### 4.4 Additional Services
- [ ] Add more cleaning types
  - Office cleaning
  - Window cleaning
  - Carpet cleaning
  - Move-in/Move-out cleaning
- [ ] Implement service bundles
- [ ] Add related services (laundry, repairs)

### 4.5 Quality & Safety
- [ ] Implement cleaner tracking (opt-in)
- [ ] Add quality inspection feature
- [ ] Create insurance integration
- [ ] Implement background check badges
- [ ] Add COVID safety protocols

### 4.6 Internationalization
- [ ] Add Kazakh language
- [ ] Add English language
- [ ] Implement RTL support
- [ ] Add currency formatting
- [ ] Create regional content

**Deliverables:**
- Company web dashboard
- Admin management panel
- Multi-city support
- Additional service types

---

## Technical Milestones

### Infrastructure
| Milestone | Description | Phase |
|-----------|-------------|-------|
| API v1.0 | Core REST API | 1 |
| WebSocket | Real-time communication | 3 |
| CDN | Image & asset delivery | 2 |
| Elasticsearch | Full-text search | 2 |
| Payment Gateway | Kaspi/Stripe integration | 3 |
| Analytics | Firebase Analytics + Mixpanel | 2 |

### Mobile App
| Milestone | Description | Phase |
|-----------|-------------|-------|
| Auth 1.0 | Login/Register/Social | 1 |
| Booking 1.0 | Basic booking flow | 2 |
| Payments 1.0 | First payment integration | 3 |
| Chat 1.0 | In-app messaging | 3 |
| Offline 1.0 | Offline mode support | 2 |

### Quality
| Milestone | Description | Phase |
|-----------|-------------|-------|
| Test Suite | 80% code coverage | 2 |
| CI/CD | Automated deployment | 1 |
| Monitoring | Sentry + Analytics | 2 |
| Performance | < 3s load time | 2 |

---

## Feature Priority Matrix

```
                    HIGH IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │   QUICK WINS       │   BIG BETS         │
    │                    │                    │
    │  • Push notifs     │  • Booking flow    │
    │  • Search filters  │  • Payments        │
    │  • Favorites       │  • Real-time chat  │
    │                    │                    │
LOW ├────────────────────┼────────────────────┤ HIGH
EFFORT                   │                   EFFORT
    │                    │                    │
    │   FILL-INS         │   STRATEGIC        │
    │                    │                    │
    │  • Dark mode       │  • Company dash    │
    │  • Achievements    │  • Admin panel     │
    │  • Share feature   │  • Multi-language  │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW IMPACT
```

---

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Backend scalability | Medium | High | Use auto-scaling, load testing |
| Payment failures | Low | High | Multiple payment providers |
| Data loss | Low | Critical | Daily backups, replication |
| API downtime | Medium | High | CDN caching, graceful degradation |

### Product Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low company adoption | Medium | High | Onboarding team, incentives |
| User churn | Medium | Medium | Loyalty program, engagement |
| Bad reviews | Medium | Medium | Quality control, support |
| Competition | High | Medium | Differentiation, speed |

### Market Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Economic downturn | Low | High | Flexible pricing, budget options |
| Regulatory changes | Low | Medium | Legal compliance monitoring |
| Payment regulations | Low | High | Work with licensed providers |

---

## Success Criteria by Phase

### Phase 1 Complete When:
- [ ] User can register and login
- [ ] User can view real company data
- [ ] User profile persists across sessions
- [ ] 99% API uptime achieved
- [ ] All P0 issues resolved

### Phase 2 Complete When:
- [ ] User can complete a booking
- [ ] Companies receive booking requests
- [ ] User receives push notifications
- [ ] Search returns relevant results
- [ ] 1,000 test bookings completed

### Phase 3 Complete When:
- [ ] User can pay through app
- [ ] Loyalty points are functional
- [ ] Real-time chat is working
- [ ] Recurring bookings available
- [ ] 5,000 paid bookings processed

### Phase 4 Complete When:
- [ ] Companies can manage via web dashboard
- [ ] App available in 3 languages
- [ ] Operating in 3+ cities
- [ ] 50,000 monthly active users
- [ ] Revenue positive

---

## Release Strategy

### Beta Testing
1. Internal team testing (2 weeks)
2. Closed beta with 100 users (4 weeks)
3. Open beta with 1,000 users (4 weeks)

### Launch Strategy
1. Soft launch in Almaty
2. Marketing push after stability confirmed
3. Expand to Astana after Almaty success
4. Nationwide rollout

### Update Cadence
- Bug fixes: As needed
- Minor features: Bi-weekly
- Major features: Monthly
- Major versions: Quarterly

---

## Documentation Required

- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Component Library (Storybook)
- [ ] User Guide
- [ ] Company Onboarding Guide
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] FAQ Section

---

*This roadmap is a living document and will be updated as priorities evolve.*

*Last Updated: February 2026*
