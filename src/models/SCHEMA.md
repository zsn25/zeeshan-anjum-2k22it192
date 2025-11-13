# Boostly Database Schema Documentation

## Overview
This document describes the database schema for the Boostly student recognition platform.

## Models

### 1. Student Model
**Collection:** `students`

**Fields:**
- `studentId` (String, required, unique, indexed): Unique identifier for the student
- `name` (String, required): Student's full name
- `email` (String, required, unique): Student's email address
- `credits` (Number, default: 100, min: 0): Current available credits for sending
- `monthlySendingLimit` (Number, default: 100, min: 0): Monthly limit for sending credits
- `creditsSentThisMonth` (Number, default: 0, min: 0): Credits sent in current month
- `totalCreditsReceived` (Number, default: 0, min: 0): Lifetime total credits received (for leaderboard)
- `lastResetMonth` (String, nullable): Last month when credits were reset (format: "YYYY-MM")
- `previousMonthUnusedCredits` (Number, default: 0): Unused credits from previous month (for carry-forward)
- `createdAt` (Date, auto): Document creation timestamp
- `updatedAt` (Date, auto): Document last update timestamp

**Indexes:**
- `studentId` (unique)
- `totalCreditsReceived + studentId` (compound, for leaderboard sorting)

**Business Rules:**
- Each student starts with 100 credits
- Credits reset to 100 at the start of each calendar month
- Up to 50 unused credits can be carried forward
- Monthly sending limit resets to 100 each month

---

### 2. Recognition Model
**Collection:** `recognitions`

**Fields:**
- `senderId` (String, required, indexed): Student ID of the sender
- `receiverId` (String, required, indexed): Student ID of the receiver
- `credits` (Number, required, min: 1): Number of credits transferred
- `message` (String, optional, max: 500): Optional message with recognition
- `recognitionMonth` (String, required, indexed): Month of recognition (format: "YYYY-MM")
- `createdAt` (Date, auto): Recognition timestamp
- `updatedAt` (Date, auto): Last update timestamp

**Indexes:**
- `senderId`
- `receiverId`
- `recognitionMonth`
- `receiverId + createdAt` (compound, for recent recognitions)
- `senderId + recognitionMonth` (compound, for monthly sending tracking)

**Validations:**
- Pre-save hook prevents self-recognition (senderId ≠ receiverId)
- Credits must be greater than 0

**Business Rules:**
- Cannot send credits to yourself
- Cannot send more credits than current balance
- Cannot exceed monthly sending limit
- Credits are deducted from sender and added to receiver

---

### 3. Endorsement Model
**Collection:** `endorsements`

**Fields:**
- `recognitionId` (ObjectId, required, ref: "Recognition", indexed): Reference to recognition
- `endorserId` (String, required, ref: "Student", indexed): Student ID of endorser
- `createdAt` (Date, auto): Endorsement timestamp
- `updatedAt` (Date, auto): Last update timestamp

**Indexes:**
- `recognitionId`
- `endorserId`
- `recognitionId + endorserId` (compound, unique): Ensures one endorsement per user per recognition

**Validations:**
- Unique constraint on (recognitionId, endorserId) prevents duplicate endorsements

**Business Rules:**
- Each user can endorse a recognition only once
- Endorsements are just counts (no credit impact)
- Used for leaderboard statistics

---

## Relationships

```
Student (1) ──< Recognition (many) ──> (1) Student
                    │
                    │ (1)
                    │
                    └──< Endorsement (many) ──> (1) Student
```

- One Student can send many Recognitions
- One Student can receive many Recognitions
- One Recognition can have many Endorsements
- One Student can create many Endorsements

---

## Monthly Reset Logic

The monthly reset process should:
1. Check if current month is different from `lastResetMonth`
2. Calculate carry-forward (min of 50 and `previousMonthUnusedCredits`)
3. Reset `credits` to 100 + carry-forward
4. Reset `monthlySendingLimit` to 100
5. Reset `creditsSentThisMonth` to 0
6. Update `lastResetMonth` to current month
7. Store current unused credits in `previousMonthUnusedCredits`

---

## Leaderboard Query Strategy

To get top recipients:
1. Sort by `totalCreditsReceived` (descending)
2. Secondary sort by `studentId` (ascending) for ties
3. Count recognitions: `COUNT(recognitions WHERE receiverId = studentId)`
4. Count endorsements: `COUNT(endorsements WHERE recognitionId IN (student's recognitions))`

---

## Notes

- All monetary values are stored as Numbers (credits, not currency)
- Timestamps are automatically managed by Mongoose
- Indexes are optimized for common query patterns
- Validation happens at the schema level and application level

