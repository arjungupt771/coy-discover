# Coy Discover — Testing Documentation & Strategy

This document describes the testing architecture, suites, and verification procedures implemented for Coy Discover.

---

## 1. Test Architecture Overview

Testing is structured across multiple complementary layers:

1. **Unit Tests (`tests/unit/`)**:
   - Pure logic verification.
   - User ID normalization (`normalizeMatchIds(A, B) === normalizeMatchIds(B, A)`).
   - Reciprocal matching truth tables.
   - Zod runtime schema validation (`swipeSchema`, `profileSchema`).
2. **Integration / Service Layer Tests (`tests/api/`)**:
   - Database persistence with SQLite & Prisma.
   - Feed isolation and exclusion of current user (`demo-user`).
   - Feed privacy check: strict absence of `hasLikedCurrentUser` or `incomingLike`.
   - Idempotency & duplicate swipe rejection (`409 Conflict` / `DUPLICATE_SWIPE`).
   - Mutual match detection against predetermined seed data.
   - Match list retrieval and sorting (newest first).
3. **Type Checking & Linting**:
   - TypeScript compiler validation (`tsc --noEmit`).
   - Zero compilation errors.

---

## 2. Test Suites Execution

Run all test suites:
```bash
npm run test
```

### Test Coverage Summary:

| Suite | Tests | Description |
|---|---|---|
| `tests/unit/match.test.ts` | 6 tests | ID normalization & matching truth tables |
| `tests/unit/validation.test.ts` | 7 tests | Zod schema validation (enums, bounds, empty strings) |
| `tests/api/services.test.ts` | 6 tests | DB queries, feed filtering, mutual match creation, persistence |
| **Total** | **19 tests** | **100% Passing** |

---

## 3. Key Test Scenarios Verified

### A. Mutual Match Logic
- User A likes User B + User B likes User A $\to$ **Match (`matched: true`)**
- User A likes User B + User B has not swiped $\to$ **No Match (`matched: false`)**
- User A passes User B + User B likes User A $\to$ **No Match (`matched: false`)**
- User A likes User B + User B passes User A $\to$ **No Match (`matched: false`)**

### B. Swipe Persistence & Feed Reload
1. User requests feed $\to$ gets 30 profiles.
2. User swipes `PASS` on `profile_001` $\to$ swipe persisted in DB.
3. User reloads feed $\to$ `profile_001` is absent, remaining count is 29.
4. Refreshing the browser preserves the exact state without relying on client memory.

### C. Duplicate Protection
- Attempting to swipe twice on the same profile throws `DUPLICATE_SWIPE` and is rejected at the API level with `409 Conflict`.

### D. Privacy Guarantees
- The feed endpoint is tested to verify that zero incoming like indicators are leaked to the client.
