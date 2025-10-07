// API 테스트 스크립트
// 실행: node test-api.js

const baseUrl = 'http://localhost:3000';

async function testHealthCheck() {
  console.log('🔍 Testing API health check...');
  try {
    const response = await fetch(`${baseUrl}/api/create-battle`);
    const data = await response.json();
    console.log('✅ Health check response:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testBattleCreation() {
  console.log('🚀 Testing battle creation...');
  try {
    const response = await fetch(`${baseUrl}/api/create-battle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Battle created successfully:', data);
    } else {
      console.error('❌ Battle creation failed:', data);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Starting API tests...\n');

  await testHealthCheck();
  console.log('');
  await testBattleCreation();

  console.log('\n✨ Tests completed!');
}

runTests();