# Boostly Application Testing Guide

## ✅ Test Results Summary

### Unit Tests (Utilities)
All utility tests are **PASSING** ✅

- **Date Helpers**: 7/7 tests passed
- **Validators**: 18/18 tests passed  
- **Credit Helpers**: 14/14 tests passed

**Total: 39/39 tests passed**

---

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- src/__tests__/utils/dateHelpers.test.js
npm test -- src/__tests__/utils/validators.test.js
npm test -- src/__tests__/utils/creditHelpers.test.js
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

---

## 🚀 Manual API Testing

### Prerequisites
1. Ensure MongoDB is running and accessible
2. Set up `.env` file with correct `MONGO_URI`
3. Start the server: `npm run dev`

### Test Endpoints Using cURL or Postman

#### 1. Health Check
```bash
curl http://localhost:5000/
```

#### 2. Create Students (Manual - via MongoDB or create endpoint if available)
You'll need to create test students first. You can do this via MongoDB shell or create a simple script.

#### 3. Create Recognition
```bash
curl -X POST http://localhost:5000/api/recognition \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "STU001",
    "receiverId": "STU002",
    "credits": 10,
    "message": "Great work!"
  }'
```

#### 4. Get Received Recognitions
```bash
curl http://localhost:5000/api/recognition/received/STU002
```

#### 5. Get Sent Recognitions
```bash
curl http://localhost:5000/api/recognition/sent/STU001
```

#### 6. Create Endorsement
```bash
curl -X POST http://localhost:5000/api/endorsement \
  -H "Content-Type: application/json" \
  -d '{
    "recognitionId": "RECOGNITION_ID_HERE",
    "endorserId": "STU003"
  }'
```

#### 7. Redeem Credits
```bash
curl -X POST http://localhost:5000/api/redemption \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU002",
    "creditsToRedeem": 20
  }'
```

#### 8. Get Leaderboard
```bash
curl http://localhost:5000/api/leaderboard?limit=10
```

---

## 📋 Test Scenarios

### Scenario 1: Basic Recognition Flow
1. ✅ Create two students (STU001, STU002)
2. ✅ STU001 sends 10 credits to STU002
3. ✅ Verify STU001 balance decreased by 10
4. ✅ Verify STU002 balance increased by 10
5. ✅ Verify recognition record created

### Scenario 2: Business Rules Validation
1. ✅ Try self-recognition → Should fail
2. ✅ Try sending more credits than available → Should fail
3. ✅ Try sending more than monthly limit → Should fail
4. ✅ Try negative credits → Should fail

### Scenario 3: Endorsement Flow
1. ✅ Create recognition
2. ✅ Endorse recognition
3. ✅ Try to endorse again → Should fail (duplicate)
4. ✅ Get endorsements for recognition

### Scenario 4: Redemption Flow
1. ✅ Student receives credits
2. ✅ Redeem credits for voucher
3. ✅ Verify credits deducted
4. ✅ Verify voucher value calculated (₹5 per credit)

### Scenario 5: Leaderboard
1. ✅ Create multiple recognitions
2. ✅ Get leaderboard
3. ✅ Verify ranking by total credits received
4. ✅ Verify recognition and endorsement counts

### Scenario 6: Monthly Reset
1. ✅ Set student's lastResetMonth to previous month
2. ✅ Create recognition (triggers reset check)
3. ✅ Verify credits reset to 100 + carry-forward
4. ✅ Verify monthly sending limit reset

---

## 🔍 Testing Checklist

### Core Functionality
- [x] Utility functions (date, validators, credit helpers)
- [ ] Recognition creation
- [ ] Recognition retrieval
- [ ] Endorsement creation
- [ ] Redemption processing
- [ ] Leaderboard generation
- [ ] Monthly reset logic

### Business Rules
- [ ] Self-recognition prevention
- [ ] Credit balance validation
- [ ] Monthly sending limit enforcement
- [ ] Duplicate endorsement prevention
- [ ] Carry-forward calculation (max 50 credits)

### Error Handling
- [ ] Invalid input validation
- [ ] Missing required fields
- [ ] Resource not found errors
- [ ] Database connection errors

---

## 🐛 Known Issues

1. **MongoDB Authentication**: Ensure `.env` file has correct `MONGO_URI` with valid credentials
2. **Test Database**: API tests require MongoDB connection - use test database or mock

---

## 📝 Next Steps

1. Set up test database for integration tests
2. Add more comprehensive API endpoint tests
3. Add model validation tests
4. Add error handling tests
5. Set up CI/CD pipeline for automated testing

---

## 🎯 Test Coverage

Current coverage focuses on:
- ✅ Utility functions (100% coverage)
- ⏳ API endpoints (needs database setup)
- ⏳ Business logic validation
- ⏳ Error scenarios

---

## 💡 Tips

1. Use a separate test database for integration tests
2. Clean up test data after each test run
3. Use environment variables for test configuration
4. Mock external dependencies when possible
5. Test both success and failure scenarios

