# Boostly API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 1. Recognition Routes (`/api/recognition`)

### Create Recognition
**POST** `/api/recognition`

Create a new recognition and transfer credits from sender to receiver.

**Request Body:**
```json
{
  "senderId": "STU001",
  "receiverId": "STU002",
  "credits": 10,
  "message": "Great work on the project!" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Recognition created successfully",
  "data": {
    "recognition": {
      "id": "...",
      "senderId": "STU001",
      "receiverId": "STU002",
      "credits": 10,
      "message": "Great work on the project!",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "senderBalance": 90,
    "receiverBalance": 110
  }
}
```

**Validations:**
- Cannot send credits to yourself
- Must have sufficient credits
- Cannot exceed monthly sending limit (100 credits/month)
- Credits must be greater than 0

---

### Get Received Recognitions
**GET** `/api/recognition/received/:studentId`

Get all recognitions received by a student.

**Query Parameters:**
- `limit` (optional, default: 50): Number of results to return
- `offset` (optional, default: 0): Number of results to skip

**Example:**
```
GET /api/recognition/received/STU002?limit=20&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recognitions": [...],
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

---

### Get Sent Recognitions
**GET** `/api/recognition/sent/:studentId`

Get all recognitions sent by a student.

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Example:**
```
GET /api/recognition/sent/STU001?limit=10
```

---

### Get Recognition by ID
**GET** `/api/recognition/:id`

Get a specific recognition by its ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recognition": {
      "_id": "...",
      "senderId": {...},
      "receiverId": {...},
      "credits": 10,
      "message": "...",
      "createdAt": "..."
    }
  }
}
```

---

## 2. Endorsement Routes (`/api/endorsement`)

### Create Endorsement
**POST** `/api/endorsement`

Create a new endorsement (like/cheer) for a recognition.

**Request Body:**
```json
{
  "recognitionId": "507f1f77bcf86cd799439011",
  "endorserId": "STU003"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Endorsement created successfully",
  "data": {
    "endorsement": {
      "id": "...",
      "recognitionId": "...",
      "endorserId": "STU003",
      "createdAt": "..."
    }
  }
}
```

**Validations:**
- Each user can endorse a recognition only once
- Recognition must exist

---

### Delete Endorsement
**DELETE** `/api/endorsement/:id`

Remove an endorsement.

**Response (200):**
```json
{
  "success": true,
  "message": "Endorsement removed successfully"
}
```

---

### Get Endorsements by Recognition
**GET** `/api/endorsement/recognition/:recognitionId`

Get all endorsements for a specific recognition.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "endorsements": [...],
    "count": 5
  }
}
```

---

### Check Endorsement
**GET** `/api/endorsement/check/:recognitionId/:endorserId`

Check if a user has endorsed a specific recognition.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hasEndorsed": true,
    "endorsement": {...}
  }
}
```

---

## 3. Redemption Routes (`/api/redemption`)

### Redeem Credits
**POST** `/api/redemption`

Redeem credits for vouchers at ₹5 per credit.

**Request Body:**
```json
{
  "studentId": "STU002",
  "creditsToRedeem": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Credits redeemed successfully",
  "data": {
    "redemption": {
      "studentId": "STU002",
      "creditsRedeemed": 20,
      "voucherValue": 100,
      "voucherValueCurrency": "₹100",
      "remainingCredits": 80,
      "redeemedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Validations:**
- Must have sufficient credits
- Can only redeem credits that have been received
- Credits are permanently deducted

**Conversion Rate:** ₹5 per credit

---

### Get Redemption Info
**GET** `/api/redemption/info/:studentId`

Get redemption information for a student.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "STU002",
    "availableCredits": 80,
    "conversionRate": 5,
    "currency": "INR",
    "potentialVoucherValue": 400,
    "potentialVoucherValueFormatted": "₹400",
    "totalCreditsReceived": 150
  }
}
```

---

### Get Redemption History
**GET** `/api/redemption/history/:studentId`

Get redemption history for a student (placeholder - requires Redemption model).

---

## 4. Leaderboard Routes (`/api/leaderboard`)

### Get Leaderboard
**GET** `/api/leaderboard`

Get leaderboard of top recipients ranked by total credits received.

**Query Parameters:**
- `limit` (optional, default: 10): Number of top students to return

**Example:**
```
GET /api/leaderboard?limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "studentId": "STU002",
        "name": "John Doe",
        "totalCreditsReceived": 250,
        "recognitionCount": 15,
        "endorsementCount": 45
      },
      {
        "rank": 2,
        "studentId": "STU005",
        "name": "Jane Smith",
        "totalCreditsReceived": 200,
        "recognitionCount": 12,
        "endorsementCount": 30
      }
    ],
    "limit": 20,
    "total": 2
  }
}
```

**Ranking Rules:**
- Primary: Total credits received (descending)
- Secondary: Student ID (ascending) for ties

---

### Get Optimized Leaderboard
**GET** `/api/leaderboard/optimized`

Get leaderboard using optimized MongoDB aggregation (better performance for large datasets).

**Query Parameters:**
- `limit` (optional, default: 10)

---

### Get Student Ranking
**GET** `/api/leaderboard/student/:studentId`

Get a specific student's ranking and statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rank": 5,
    "studentId": "STU002",
    "name": "John Doe",
    "totalCreditsReceived": 150,
    "recognitionCount": 10,
    "endorsementCount": 25
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Monthly Credit Reset

Credits automatically reset at the start of each calendar month:
- Each student receives 100 credits
- Up to 50 unused credits can be carried forward
- Monthly sending limit resets to 100 credits
- Reset is checked automatically on each recognition transaction

---

## Business Rules Summary

1. **Recognition:**
   - 100 credits per month (resets monthly)
   - Cannot send to yourself
   - Monthly sending limit: 100 credits
   - Must have sufficient balance

2. **Endorsement:**
   - One endorsement per user per recognition
   - No credit impact

3. **Redemption:**
   - ₹5 per credit
   - Permanent deduction
   - Only redeemable credits that were received

4. **Leaderboard:**
   - Ranked by total credits received
   - Includes recognition and endorsement counts

