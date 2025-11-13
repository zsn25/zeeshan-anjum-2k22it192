import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let parsedBody;
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = body;
        }
        resolve({
          statusCode: res.statusCode,
          body: parsedBody,
          rawBody: body,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Test data
const testStudents = [
  { studentId: 'STU001', name: 'Alice Johnson', email: 'alice@college.edu' },
  { studentId: 'STU002', name: 'Bob Smith', email: 'bob@college.edu' },
  { studentId: 'STU003', name: 'Charlie Brown', email: 'charlie@college.edu' },
];

let createdRecognitionId = null;
let createdEndorsementId = null;

const runTests = async () => {
  log(colors.cyan, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║          BOOSTLY API - CUSTOM TEST INPUT                    ║');
  log(colors.cyan, '╚══════════════════════════════════════════════════════════════╝\n');

  // Test 1: Root endpoint
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 1: Root Endpoint');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const response = await makeRequest('GET', '/');
    log(colors.green, `✅ Status: ${response.statusCode}`);
    log(colors.yellow, `Response: ${response.rawBody}`);
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 2: Create Students (Note: This would require a student creation endpoint)
  // For now, we'll assume students exist or need to be created manually
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 2: Create Recognition');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Sending: STU001 → STU002 (10 credits)`);
  try {
    const response = await makeRequest('POST', '/api/recognition', {
      senderId: 'STU001',
      receiverId: 'STU002',
      credits: 10,
      message: 'Great work on the project! Keep it up!',
    });
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Recognition created successfully!`);
      log(colors.yellow, `   Recognition ID: ${response.body.data?.recognition?.id || 'N/A'}`);
      log(colors.yellow, `   Sender Balance: ${response.body.data?.senderBalance || 'N/A'}`);
      log(colors.yellow, `   Receiver Balance: ${response.body.data?.receiverBalance || 'N/A'}`);
      createdRecognitionId = response.body.data?.recognition?.id;
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
      log(colors.yellow, JSON.stringify(response.body, null, 2));
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 3: Try self-recognition (should fail)
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 3: Self-Recognition (Should Fail)');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Sending: STU001 → STU001 (5 credits) - Should be rejected`);
  try {
    const response = await makeRequest('POST', '/api/recognition', {
      senderId: 'STU001',
      receiverId: 'STU001',
      credits: 5,
      message: 'Self-recognition test',
    });
    if (response.statusCode === 400) {
      log(colors.green, `✅ Correctly rejected self-recognition`);
      log(colors.yellow, `   Message: ${response.body.message}`);
    } else {
      log(colors.red, `❌ Should have been rejected (Status: ${response.statusCode})`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 4: Get Received Recognitions
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 4: Get Received Recognitions');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Fetching recognitions received by STU002`);
  try {
    const response = await makeRequest('GET', '/api/recognition/received/STU002?limit=10');
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Found ${response.body.data?.total || 0} recognition(s)`);
      if (response.body.data?.recognitions?.length > 0) {
        const rec = response.body.data.recognitions[0];
        log(colors.yellow, `   Latest: ${rec.credits} credits from ${rec.senderId}`);
        log(colors.yellow, `   Message: ${rec.message || 'No message'}`);
      }
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 5: Create Endorsement
  if (createdRecognitionId) {
    log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log(colors.blue, 'TEST 5: Create Endorsement');
    log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log(colors.yellow, `STU003 endorsing recognition ${createdRecognitionId}`);
    try {
      const response = await makeRequest('POST', '/api/endorsement', {
        recognitionId: createdRecognitionId,
        endorserId: 'STU003',
      });
      log(colors.green, `✅ Status: ${response.statusCode}`);
      if (response.body.success) {
        log(colors.green, `✅ Endorsement created successfully!`);
        createdEndorsementId = response.body.data?.endorsement?.id;
      } else {
        log(colors.red, `❌ ${response.body.message || 'Failed'}`);
      }
    } catch (error) {
      log(colors.red, `❌ Error: ${error.message}`);
    }
  } else {
    log(colors.yellow, '\n⚠️  Skipping endorsement test (no recognition ID available)');
  }

  // Test 6: Try duplicate endorsement (should fail)
  if (createdRecognitionId) {
    log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log(colors.blue, 'TEST 6: Duplicate Endorsement (Should Fail)');
    log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log(colors.yellow, `STU003 trying to endorse again - Should be rejected`);
    try {
      const response = await makeRequest('POST', '/api/endorsement', {
        recognitionId: createdRecognitionId,
        endorserId: 'STU003',
      });
      if (response.statusCode === 400) {
        log(colors.green, `✅ Correctly rejected duplicate endorsement`);
        log(colors.yellow, `   Message: ${response.body.message}`);
      } else {
        log(colors.red, `❌ Should have been rejected (Status: ${response.statusCode})`);
      }
    } catch (error) {
      log(colors.red, `❌ Error: ${error.message}`);
    }
  }

  // Test 7: Redemption
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 7: Redeem Credits');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `STU002 redeeming 20 credits (should get ₹100 voucher)`);
  try {
    const response = await makeRequest('POST', '/api/redemption', {
      studentId: 'STU002',
      creditsToRedeem: 20,
    });
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Credits redeemed successfully!`);
      log(colors.yellow, `   Credits Redeemed: ${response.body.data?.redemption?.creditsRedeemed || 'N/A'}`);
      log(colors.yellow, `   Voucher Value: ${response.body.data?.redemption?.voucherValueCurrency || 'N/A'}`);
      log(colors.yellow, `   Remaining Credits: ${response.body.data?.redemption?.remainingCredits || 'N/A'}`);
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 8: Get Redemption Info
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 8: Get Redemption Info');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Getting redemption info for STU002`);
  try {
    const response = await makeRequest('GET', '/api/redemption/info/STU002');
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Redemption info retrieved`);
      log(colors.yellow, `   Available Credits: ${response.body.data?.availableCredits || 'N/A'}`);
      log(colors.yellow, `   Potential Voucher: ${response.body.data?.potentialVoucherValueFormatted || 'N/A'}`);
      log(colors.yellow, `   Total Received: ${response.body.data?.totalCreditsReceived || 'N/A'}`);
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 9: Leaderboard
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 9: Get Leaderboard');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Fetching top 5 students`);
  try {
    const response = await makeRequest('GET', '/api/leaderboard?limit=5');
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Leaderboard retrieved`);
      const leaderboard = response.body.data?.leaderboard || [];
      if (leaderboard.length > 0) {
        log(colors.yellow, `\n   Rank | Student ID | Name | Credits | Recognitions | Endorsements`);
        log(colors.yellow, `   ${'-'.repeat(70)}`);
        leaderboard.forEach((student) => {
          log(colors.cyan, `   ${student.rank || 'N/A'} | ${student.studentId || 'N/A'} | ${student.name || 'N/A'} | ${student.totalCreditsReceived || 0} | ${student.recognitionCount || 0} | ${student.endorsementCount || 0}`);
        });
      } else {
        log(colors.yellow, `   No students in leaderboard yet`);
      }
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  // Test 10: Get Student Ranking
  log(colors.blue, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.blue, 'TEST 10: Get Student Ranking');
  log(colors.blue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log(colors.yellow, `Getting ranking for STU002`);
  try {
    const response = await makeRequest('GET', '/api/leaderboard/student/STU002');
    log(colors.green, `✅ Status: ${response.statusCode}`);
    if (response.body.success) {
      log(colors.green, `✅ Student ranking retrieved`);
      log(colors.yellow, `   Rank: ${response.body.data?.rank || 'N/A'}`);
      log(colors.yellow, `   Total Credits: ${response.body.data?.totalCreditsReceived || 0}`);
      log(colors.yellow, `   Recognitions: ${response.body.data?.recognitionCount || 0}`);
      log(colors.yellow, `   Endorsements: ${response.body.data?.endorsementCount || 0}`);
    } else {
      log(colors.red, `❌ ${response.body.message || 'Failed'}`);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
  }

  log(colors.cyan, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║                    TESTING COMPLETE                          ║');
  log(colors.cyan, '╚══════════════════════════════════════════════════════════════╝\n');
};

// Run tests
runTests().catch(console.error);

