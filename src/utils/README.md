# Boostly Utilities Documentation

This directory contains utility functions organized by functionality.

## 📁 Utility Modules

### 1. `monthlyReset.js` - Monthly Credit Reset
Functions for managing monthly credit resets and carry-forward logic.

**Exports:**
- `checkAndResetMonthlyCredits(studentId)` - Check and reset credits for a single student
- `resetStudentCreditsIfNeeded(student)` - Reset credits if new month detected
- `batchResetAllStudents()` - Batch reset all students (for scheduled jobs)
- `getResetStatistics()` - Get statistics about reset status

**Usage:**
```javascript
import { checkAndResetMonthlyCredits, batchResetAllStudents } from './utils/monthlyReset.js';

// Reset single student
const student = await checkAndResetMonthlyCredits('STU001');

// Batch reset all students
const result = await batchResetAllStudents();
```

---

### 2. `dateHelpers.js` - Date and Time Utilities
Helper functions for date formatting and validation.

**Exports:**
- `getCurrentMonth()` - Get current month in YYYY-MM format
- `getCurrentYear()` - Get current year
- `getCurrentMonthNumber()` - Get current month number (1-12)
- `formatDate(date)` - Format date to YYYY-MM-DD
- `formatDateReadable(date)` - Format date to readable string
- `isValidMonthFormat(monthString)` - Validate month format
- `getFirstDayOfMonth()` - Get first day of current month
- `getLastDayOfMonth()` - Get last day of current month
- `isFirstDayOfMonth()` - Check if today is first day of month

**Usage:**
```javascript
import { getCurrentMonth, formatDate } from './utils/dateHelpers.js';

const month = getCurrentMonth(); // "2024-01"
const formatted = formatDate(new Date()); // "2024-01-15"
```

---

### 3. `validators.js` - Input Validation
Validation functions for request data.

**Exports:**
- `validateStudentId(studentId)` - Validate student ID format
- `validateEmail(email)` - Validate email format
- `validateCredits(credits, min, max)` - Validate credit amount
- `validateMessage(message, maxLength)` - Validate message length
- `validateObjectId(id)` - Validate MongoDB ObjectId
- `validatePagination(limit, offset, maxLimit)` - Validate pagination params
- `validateDifferentStudents(senderId, receiverId)` - Ensure different students

**Usage:**
```javascript
import { validateStudentId, validateCredits } from './utils/validators.js';

const result = validateStudentId('STU001');
if (!result.isValid) {
  // Handle error
}
```

---

### 4. `responseHelpers.js` - API Response Formatting
Consistent response formatting for API endpoints.

**Exports:**
- `sendSuccess(res, data, message, statusCode)` - Send success response
- `sendError(res, message, statusCode, errors)` - Send error response
- `sendValidationError(res, message, validationErrors)` - Send validation error
- `sendNotFound(res, resource)` - Send not found response
- `sendUnauthorized(res, message)` - Send unauthorized response
- `sendForbidden(res, message)` - Send forbidden response
- `sendPaginated(res, items, total, limit, offset, message)` - Send paginated response

**Usage:**
```javascript
import { sendSuccess, sendError } from './utils/responseHelpers.js';

// Success response
sendSuccess(res, { student }, 'Student found', 200);

// Error response
sendError(res, 'Student not found', 404);
```

---

### 5. `creditHelpers.js` - Credit Calculations
Functions for credit calculations and validations.

**Exports:**
- `CREDIT_TO_RUPEE_RATE` - Constant: 5 (₹5 per credit)
- `MONTHLY_CREDIT_ALLOCATION` - Constant: 100
- `MONTHLY_SENDING_LIMIT` - Constant: 100
- `MAX_CARRY_FORWARD_CREDITS` - Constant: 50
- `creditsToRupees(credits)` - Convert credits to rupees
- `formatVoucherValue(credits)` - Format as currency string
- `calculateCarryForward(unusedCredits)` - Calculate carry-forward
- `calculateNewMonthCredits(unusedCredits)` - Calculate new month credits
- `checkSufficientCredits(available, requested)` - Check if sufficient credits
- `checkMonthlySendingLimit(sent, requested, limit)` - Check monthly limit
- `getRemainingMonthlyCapacity(sent, limit)` - Get remaining capacity
- `validateRedemptionEligibility(available, requested, received)` - Validate redemption

**Usage:**
```javascript
import { creditsToRupees, formatVoucherValue, checkSufficientCredits } from './utils/creditHelpers.js';

const rupees = creditsToRupees(20); // 100
const formatted = formatVoucherValue(20); // "₹100"

const check = checkSufficientCredits(100, 50);
if (!check.hasSufficient) {
  // Handle insufficient credits
}
```

---

### 6. `errorHandler.js` - Error Handling
Error handling utilities and middleware.

**Exports:**
- `AppError` - Custom error class
- `errorHandler(err, req, res, next)` - Express error middleware
- `asyncHandler(fn)` - Wrapper for async route handlers
- `createError(message, statusCode)` - Create custom error
- `notFoundError(resource)` - Create not found error
- `validationError(message)` - Create validation error
- `unauthorizedError(message)` - Create unauthorized error
- `forbiddenError(message)` - Create forbidden error

**Usage:**
```javascript
import { asyncHandler, notFoundError, errorHandler } from './utils/errorHandler.js';

// Wrap async route handlers
router.get('/:id', asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw notFoundError('Student');
  res.json({ student });
}));

// Use in app.js
app.use(errorHandler);
```

---

### 7. `index.js` - Central Export
Central export file for all utilities (convenience import).

**Usage:**
```javascript
// Import from central index
import { 
  getCurrentMonth, 
  validateStudentId, 
  sendSuccess,
  creditsToRupees 
} from './utils/index.js';

// Or import from specific modules
import { getCurrentMonth } from './utils/dateHelpers.js';
```

---

## 🎯 Best Practices

1. **Use validators** before processing requests
2. **Use response helpers** for consistent API responses
3. **Wrap async handlers** with `asyncHandler` to catch errors
4. **Use credit helpers** for all credit calculations
5. **Use date helpers** for consistent date formatting

---

## 📝 Example: Complete Controller Using Utilities

```javascript
import { asyncHandler, sendSuccess, sendError } from '../utils/errorHandler.js';
import { validateStudentId, validateCredits } from '../utils/validators.js';
import { checkSufficientCredits } from '../utils/creditHelpers.js';
import { checkAndResetMonthlyCredits } from '../utils/monthlyReset.js';

export const createRecognition = asyncHandler(async (req, res) => {
  const { senderId, receiverId, credits } = req.body;

  // Validate inputs
  const studentIdCheck = validateStudentId(senderId);
  if (!studentIdCheck.isValid) {
    return sendError(res, studentIdCheck.message, 400);
  }

  const creditsCheck = validateCredits(credits);
  if (!creditsCheck.isValid) {
    return sendError(res, creditsCheck.message, 400);
  }

  // Check and reset monthly credits
  const sender = await checkAndResetMonthlyCredits(senderId);

  // Check sufficient credits
  const sufficientCheck = checkSufficientCredits(sender.credits, credits);
  if (!sufficientCheck.hasSufficient) {
    return sendError(res, sufficientCheck.message, 400);
  }

  // Process recognition...
  
  sendSuccess(res, { recognition }, 'Recognition created', 201);
});
```

---

## 🔧 Integration with Express App

Add error handler middleware to `app.js`:

```javascript
import { errorHandler } from './utils/errorHandler.js';

// ... other middleware

// Error handler must be last
app.use(errorHandler);
```

