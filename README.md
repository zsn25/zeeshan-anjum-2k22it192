# Boostly - Student Recognition Backend

A complete, production-ready backend API for a student recognition system built with Node.js, Express, Prisma ORM, and SQLite.

## 🎯 Overview

Boostly allows students to:
- Send credits to recognize other students
- Endorse recognitions
- Redeem credits for vouchers
- Compete on a leaderboard
- Automatic monthly credit reset with carry-forward

## 🚀 Quick Start

bash
# The project is already set up and ready to run!

# Start the server
npm start

# The API will be available at:
# http://localhost:3000


## 📋 What's Included

✅ Complete Express.js API  
✅ Prisma ORM with SQLite database  
✅ 4 Core Features + Leaderboard + Monthly Reset  
✅ Input validation and error handling  
✅ Transaction support for atomic operations  
✅ Comprehensive API documentation  
✅ Test cases and scenarios  
✅ Sample data seeding  

## 📁 Project Structure


boostly/
├── src/
│   ├── server.js                    # Server entry point
│   ├── app.js                       # Express app configuration
│   ├── prisma.js                    # Prisma client
│   ├── readme.md                    # Complete API documentation
│   ├── controllers/                 # Business logic
│   │   ├── studentController.js
│   │   ├── recognitionController.js
│   │   ├── endorsementController.js
│   │   ├── redemptionController.js
│   │   ├── leaderboardController.js
│   │   └── adminController.js
│   ├── routes/                      # API routes
│   │   ├── studentRoutes.js
│   │   ├── recognitionRoutes.js
│   │   ├── endorsementRoutes.js
│   │   ├── redemptionRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   └── adminRoutes.js
│   ├── middlewares/
│   │   └── errorHandler.js          # Centralized error handling
│   └── utils/
│       ├── AppError.js              # Custom error class
│       └── validation.js            # Input validation helpers
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Database migrations
├── prompt/
│   └── project-requirements.md      # Original requirements
├── test-cases/
│   ├── test-scenarios.md            # Comprehensive test cases
│   └── manual-test-runner.js        # Test helper script
├── seed.js                          # Database seeding script
├── .env                             # Environment variables
├── package.json                     # Dependencies and scripts
└── README.md                        # This file


## 🛠 Available Commands

bash
# Start the server
npm start

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database with test data
npm run db:seed

# View test commands
node test-cases/manual-test-runner.js


## 🔌 API Endpoints

### Health Check
- GET /health - Check if API is running

### Students
- POST /api/students - Create a new student
- GET /api/students - Get all students
- GET /api/students/:id - Get student by ID

### Recognitions
- POST /api/recognitions - Send credits to another student
- GET /api/recognitions - Get all recognitions
- GET /api/recognitions/:id - Get recognition by ID

### Endorsements
- POST /api/endorsements - Endorse a recognition
- GET /api/endorsements - Get all endorsements
- GET /api/endorsements/recognition/:recognitionId - Get endorsements for a recognition

### Redemptions
- POST /api/redemptions - Redeem credits for vouchers
- GET /api/redemptions - Get all redemptions
- GET /api/redemptions/student/:studentId - Get redemptions by student

### Leaderboard
- GET /api/leaderboard?limit=10 - Get top students

### Admin
- POST /api/admin/reset-month - Trigger monthly reset

📚 *Full API documentation with examples:* See src/readme.md

## 🎮 Quick Test

bash
# 1. Start the server (in one terminal)
npm start

# 2. In another terminal, create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Student", "email": "test@example.com"}'

# 3. Check health
curl http://localhost:3000/health

# 4. View all students
curl http://localhost:3000/api/students


## 🧪 Testing

### Option 1: Seed Test Data
bash
npm run db:seed


This creates 4 students with recognitions and endorsements.

### Option 2: Manual Testing
bash
node test-cases/manual-test-runner.js


This displays all test commands you can run.

### Option 3: Follow Test Scenarios
See test-cases/test-scenarios.md for comprehensive test cases including:
- Recognition flow
- Endorsement flow
- Redemption flow
- Monthly reset
- Leaderboard
- Validation tests
- Edge cases

## 🎯 Features Implemented

### 1. Recognition System ✅
- Send credits from one student to another
- Monthly limit of 100 credits
- Cannot send to self
- Validates available balance
- Atomic transactions

### 2. Endorsements ✅
- Students can endorse recognitions
- One endorsement per student per recognition
- No balance changes
- Unique constraint enforced

### 3. Redemption System ✅
- Redeem received credits for vouchers
- 1 credit = ₹5 voucher
- Only received credits can be redeemed
- Permanent deduction
- Atomic transactions

### 4. Monthly Reset ✅
- Resets sending limit to 100
- Carries forward up to 50 unused credits
- Resets monthly_sent counter
- Updates all students

### 5. Leaderboard ✅
- Ranked by total credits received
- Includes total recognitions
- Includes total endorsements
- Supports limit parameter
- Tie-breaker by student ID

## 🏗 Database Schema

prisma
model Student {
  id                Int
  name              String
  email             String (unique)
  available_to_send Int (default: 100)
  monthly_sent      Int (default: 0)
  received_balance  Int (default: 0)
  createdAt         DateTime
  updatedAt         DateTime
}

model Recognition {
  id         Int
  senderId   Int
  receiverId Int
  credits    Int
  message    String?
  createdAt  DateTime
}

model Endorsement {
  id            Int
  recognitionId Int
  endorserId    Int
  createdAt     DateTime
  
  @@unique([recognitionId, endorserId])
}

model Redemption {
  id           Int
  studentId    Int
  credits      Int
  voucherValue Float
  createdAt    DateTime
}


## 📊 Business Rules

### Recognition Rules
- ✓ Each student gets 100 credits per month
- ✓ Cannot send to themselves
- ✓ Cannot exceed monthly limit
- ✓ Must have sufficient available credits

### Endorsement Rules
- ✓ One endorsement per student per recognition
- ✓ Endorsements don't affect balances

### Redemption Rules
- ✓ 1 credit = ₹5 voucher
- ✓ Can only redeem received credits
- ✓ Deduction is permanent

### Monthly Reset Rules
- ✓ Limit resets to 100
- ✓ Carry forward up to 50 unused credits
- ✓ Monthly sent resets to 0

## 🔒 Validation & Error Handling

- ✓ Input validation on all endpoints
- ✓ Proper HTTP status codes
- ✓ Descriptive error messages
- ✓ Centralized error handling
- ✓ Transaction rollback on errors

## 📖 Documentation

- *API Documentation*: src/readme.md - Complete API reference with curl examples
- *Test Cases*: test-cases/test-scenarios.md - Comprehensive testing guide
- *Requirements*: prompt/project-requirements.md - Original specifications

## 🐛 Troubleshooting

### Port already in use
bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>


### Database issues
bash
# Reset database
rm dev.db
npx prisma migrate dev --name init


### Prisma Client issues
bash
# Regenerate client
npx prisma generate


## 🔄 Reset Everything

bash
# Stop the server
# Delete database
rm dev.db

# Recreate database
npx prisma migrate dev --name init

# Seed with test data
npm run db:seed

# Start server
npm start


## 📝 Example Usage Flow

bash
# 1. Create students
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@test.com"}'

curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob", "email": "bob@test.com"}'

# 2. Send recognition
curl -X POST http://localhost:3000/api/recognitions \
  -H "Content-Type: application/json" \
  -d '{"senderId": 1, "receiverId": 2, "credits": 10, "message": "Great job!"}'

# 3. Endorse recognition
curl -X POST http://localhost:3000/api/endorsements \
  -H "Content-Type: application/json" \
  -d '{"recognitionId": 1, "endorserId": 3}'

# 4. Redeem credits
curl -X POST http://localhost:3000/api/redemptions \
  -H "Content-Type: application/json" \
  -d '{"studentId": 2, "credits": 5}'

# 5. Check leaderboard
curl http://localhost:3000/api/leaderboard?limit=10

# 6. Monthly reset
curl -X POST http://localhost:3000/api/admin/reset-month


## 🎓 Tech Stack

- *Node.js* - JavaScript runtime
- *Express.js* - Web framework
- *Prisma* - ORM (Object-Relational Mapping)
- *SQLite* - Database
- *JavaScript* - Programming language

## ✨ Code Quality

- ✓ Modular architecture
- ✓ Separation of concerns
- ✓ Clean code practices
- ✓ Error handling
- ✓ Input validation
- ✓ Transaction safety
- ✓ Consistent responses

## 📦 Dependencies

json
{
  "express": "^5.1.0",
  "prisma": "^6.19.0",
  "@prisma/client": "^6.19.0"
}


## 🎉 Ready to Use!

The project is *100% complete* and ready to run:

1. ✅ All features implemented
2. ✅ Database set up and migrated
3. ✅ All endpoints working
4. ✅ Validation and error handling
5. ✅ Documentation complete
6. ✅ Test cases provided
7. ✅ Sample data seeder included

Just run npm start and start testing!

## 📞 Support

- Check src/readme.md for detailed API documentation
- See test-cases/test-scenarios.md for testing guide
- Run node test-cases/manual-test-runner.js for test commands

---

*Built for coding rounds and production use* 🚀
