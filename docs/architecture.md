# Coy Discover — System Architecture & Design Documentation

## 1. Overview
Coy Discover is a standalone, mobile-first, swipe-based social discovery application built using modern web technologies: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Prisma ORM, and SQLite.

The application allows users to discover profiles, like or pass via touch gestures or desktop controls, detects mutual matches, and displays matches in real time.

---

## 2. High-Level Architectural Flow
```
┌────────────────────────────────────────────────────────┐
│                   React User Interface                 │
│  (DiscoverView / SwipeCard / SwipeStack / MatchesView) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                      Client Hooks                      │
│      (useFeed / useSwipeActions / useMatches)          │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP JSON Requests
                           ▼
┌────────────────────────────────────────────────────────┐
│             Next.js App Router API Routes              │
│       (/api/feed, /api/swipe, /api/matches)            │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                     Service Layer                      │
│    (feed.service, swipe.service, match.service)        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                       Prisma ORM                       │
│                   (SQLite Database)                    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Separation of Concerns & Clean Architecture
- **Presentation Layer**: Pure React functional components. They consume custom React hooks and display UI states (Loading, Empty, Error, Success). They contain zero direct database access.
- **Hook Layer**: Encapsulates state management (profiles feed, processing states, match modals, error handling).
- **API Layer**: Validates input using Zod schemas (`swipeSchema`, `profileSchema`), maps HTTP error codes (`400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Server Error`), and delegates business logic to services.
- **Service Layer**: Implements core business logic:
  - Feed generation: excludes current user and prior swipes.
  - Swipe processing: validates profile existence, enforces unique swipe constraints, performs mutual like lookup.
  - Match generation: normalizes user ID pairs (`user1Id < user2Id`) to guarantee uniqueness regardless of who swiped first.
- **Data Layer**: Prisma ORM with SQLite database enforcing relational constraints and indexes.

---

## 4. Database Schema Design

### User Model
Represents both the logged-in demo user (`demo-user`) and discoverable profiles:
- `id`: Unique identifier (CUID)
- `name`: Full name
- `age`: Age in years (20–25)
- `photo`: Relative URL to local SVG/image asset
- `bio`: Profile summary
- `city`: Location (Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, etc.)
- `college`: Educational institution (optional)
- `interests`: Many-to-many relation via `UserInterest`

### Interest & UserInterest Model
Normalized taxonomy of user interests (e.g., Photography, Travel, Music, Technology, Baking).

### Swipe Model
Records user decisions:
- `fromUserId`: Swiping user ID
- `toUserId`: Target user ID
- `direction`: Enum (`LIKE` | `PASS`)
- `createdAt`: Timestamp
- **Unique Constraint**: `@@unique([fromUserId, toUserId])` prevents swiping twice on the same profile.
- **Indexes**: `@@index([fromUserId])` and `@@index([toUserId])` for rapid feed filtering.

### Match Model
Records mutual likes:
- `id`: Unique identifier
- `user1Id`: Normalized lexicographically smaller user ID
- `user2Id`: Normalized lexicographically larger user ID
- `createdAt`: Timestamp
- **Unique Constraint**: `@@unique([user1Id, user2Id])` guarantees that `A + B` and `B + A` produce exactly one match entry.

---

## 5. Security & Privacy Guarantees
1. **Zero Incoming Like Leaks**: The `/api/feed` endpoint only queries unswiped profiles and explicitly excludes any incoming swipe flags. The frontend has zero knowledge of who liked the current user.
2. **Mutual Match Secrecy**: Matches are only revealed when both users have independently swiped `LIKE`.
3. **Idempotency & Deduplication**: Database unique constraints reject duplicate swipe submissions with HTTP 409 Conflict.
4. **Input Validation**: Strict runtime schema parsing with Zod on all incoming JSON payloads.
