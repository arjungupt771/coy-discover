# Coy Discover — API Documentation

This document describes all API endpoints provided by Coy Discover.

All endpoints adhere to JSON request and response conventions and standard HTTP status codes.

---

## 1. GET /api/feed

Fetches the swipe feed for the active user.

### Description
Returns a list of unswiped profiles. Excludes:
1. The currently logged-in user (`demo-user`).
2. Any profile the user has already swiped on (`LIKE` or `PASS`).

### Privacy Rule
**Critical**: This endpoint never reveals whether another user has already liked the current user. Fields such as `hasLikedCurrentUser`, `incomingLike`, or hidden matching metadata are strictly prohibited and never returned.

### Request
```http
GET /api/feed HTTP/1.1
Accept: application/json
```

### Response (200 OK)
```json
{
  "profiles": [
    {
      "id": "profile_001",
      "name": "Aarav Sharma",
      "age": 22,
      "photo": "/profiles/profile-01.svg",
      "bio": "Coffee enthusiast, amateur photographer and always looking for a new street food joint to explore.",
      "city": "Delhi",
      "college": "University of Delhi",
      "interests": [
        "Photography",
        "Travel",
        "Music",
        "Coffee"
      ]
    }
  ],
  "totalRemaining": 30
}
```

### Error Responses
- `500 Internal Server Error`: Returned when a database or server failure occurs.
```json
{
  "error": "Something went wrong"
}
```

---

## 2. POST /api/swipe

Records a swipe decision (`LIKE` or `PASS`) on a profile.

### Description
- Validates the request using Zod (`profileId` is a non-empty string, `direction` is `"LIKE"` or `"PASS"`).
- Confirms the target profile exists in the database.
- Confirms the target profile has not already been swiped on by the user (enforces idempotency).
- If the swipe is `PASS`, records the swipe and returns `matched: false`.
- If the swipe is `LIKE`, checks if the target user has already swiped `LIKE` on the current user.
  - If mutual `LIKE` exists: Creates a unique `Match` record (with lexicographically normalized user IDs) and returns `matched: true` along with matched profile information.
  - If no mutual `LIKE` exists: Records the swipe and returns `matched: false`.

### Request
```http
POST /api/swipe HTTP/1.1
Content-Type: application/json

{
  "profileId": "profile_003",
  "direction": "LIKE"
}
```

### Responses

#### 200 OK — Successful PASS
```json
{
  "success": true,
  "swipe": {
    "direction": "PASS"
  },
  "matched": false
}
```

#### 200 OK — Successful One-sided LIKE
```json
{
  "success": true,
  "swipe": {
    "direction": "LIKE"
  },
  "matched": false
}
```

#### 200 OK — Successful Mutual Match
```json
{
  "success": true,
  "swipe": {
    "direction": "LIKE"
  },
  "matched": true,
  "match": {
    "id": "cm..._match_id",
    "profile": {
      "id": "profile_003",
      "name": "Rohan Gupta",
      "age": 24,
      "photo": "/profiles/profile-03.svg"
    }
  }
}
```

### Error Responses
- `400 Bad Request`: Invalid payload or invalid swipe direction.
```json
{
  "error": "Invalid swipe request"
}
```
- `404 Not Found`: Target profile does not exist.
```json
{
  "error": "Profile not found"
}
```
- `409 Conflict`: Target profile has already been swiped on.
```json
{
  "error": "Profile has already been swiped on"
}
```

---

## 3. GET /api/matches

Retrieves all mutual matches for the active user.

### Description
Queries all `Match` records where the current user is either `user1Id` or `user2Id`. Looks up the corresponding matched partner profile and returns matches sorted with the newest match first.

### Request
```http
GET /api/matches HTTP/1.1
Accept: application/json
```

### Response (200 OK)
```json
{
  "matches": [
    {
      "id": "cm...",
      "matchedAt": "2026-11-19T16:15:00.000Z",
      "profile": {
        "id": "profile_003",
        "name": "Rohan Gupta",
        "age": 24,
        "photo": "/profiles/profile-03.svg",
        "city": "Delhi",
        "bio": "Tech nerd by day, indie-rock guitarist by night.",
        "interests": ["Music", "Coding", "Concerts", "Gaming"]
      }
    }
  ]
}
```

---

## 4. GET /api/health

Health check endpoint for operational monitoring.

### Request
```http
GET /api/health HTTP/1.1
```

### Response (200 OK)
```json
{
  "status": "healthy",
  "timestamp": "2026-11-19T16:15:00.000Z"
}
```
