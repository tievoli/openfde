#!/usr/bin/env node
/**
 * OpenFDE API Test Script
 * Tests the engagement/create API endpoint
 */

const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4517,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testAPI() {
  console.log('=== Testing OpenFDE API ===\n');

  try {
    // Test 1: List engagements
    console.log('Test 1: GET /api/engagements');
    const listResult = await makeRequest('GET', '/api/engagements');
    console.log('Status:', listResult.status);
    console.log('Response:', JSON.stringify(listResult.body, null, 2));
    console.log('✅ Success\n');

    // Test 2: Create engagement
    console.log('Test 2: POST /api/engagement/create');
    const createResult = await makeRequest('POST', '/api/engagement/create', {
      name: 'Test Project 中文'
    });
    console.log('Status:', createResult.status);
    console.log('Response:', JSON.stringify(createResult.body, null, 2));
    if (createResult.status === 200) {
      console.log('✅ Success - Created engagement:', createResult.body.slug);
    } else {
      console.log('⚠️  Unexpected status');
    }
    console.log('');

    // Test 3: Try to create duplicate (should fail)
    console.log('Test 3: POST /api/engagement/create (duplicate)');
    const dupResult = await makeRequest('POST', '/api/engagement/create', {
      name: 'Test Project 中文'
    });
    console.log('Status:', dupResult.status);
    console.log('Response:', JSON.stringify(dupResult.body, null, 2));
    if (dupResult.status === 500) {
      console.log('✅ Success - Duplicate detected');
    } else {
      console.log('⚠️  Unexpected status');
    }
    console.log('');

    // Test 4: Create without name (should fail)
    console.log('Test 4: POST /api/engagement/create (no name)');
    const noNameResult = await makeRequest('POST', '/api/engagement/create', {});
    console.log('Status:', noNameResult.status);
    console.log('Response:', JSON.stringify(noNameResult.body, null, 2));
    if (noNameResult.status === 400) {
      console.log('✅ Success - Validation working');
    } else {
      console.log('⚠️  Unexpected status');
    }
    console.log('');

    // Test 5: List engagements again
    console.log('Test 5: GET /api/engagements (after create)');
    const listAgain = await makeRequest('GET', '/api/engagements');
    console.log('Status:', listAgain.status);
    console.log('Response:', JSON.stringify(listAgain.body, null, 2));
    console.log('✅ Success\n');

    console.log('=== All tests completed ===');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running on port 4517');
    console.log('Run: pnpm openfde serve');
    process.exit(1);
  }
}

testAPI();