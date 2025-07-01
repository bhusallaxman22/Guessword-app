import { postResult, debugPostResult, checkBackendHealth } from '../services/wordService';

/**
 * Quick debug script to test the postResult endpoint
 * Run this to debug the 500 error
 */

export const runQuickDebug = async () => {
    console.log('🔍 QUICK DEBUG - Post Result 500 Error\n');

    // Test 1: Backend health
    console.log('1. Checking backend health...');
    const isHealthy = await checkBackendHealth();
    console.log(`Backend health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`);

    // Test 2: Simple valid data
    console.log('2. Testing with simple valid data...');
    const testUserId = 'debug-user-' + Date.now();
    const testAttempts = 4;
    const testTimeMs = 30000;

    await debugPostResult(testUserId, testAttempts, testTimeMs);
    console.log('');

    // Test 3: Minimal data
    console.log('3. Testing with minimal data...');
    await debugPostResult('u1', 1, 1000);
    console.log('');

    // Test 4: Check what actual game data looks like
    console.log('4. Instructions for debugging actual game data:');
    console.log('   In your game logic, add this line when posting results:');
    console.log('   console.log("Game data:", { userId, attempts, timeMs });');
    console.log('   Then call debugPostResult(userId, attempts, timeMs); to test');
    console.log('');

    console.log('🔍 Debug complete. Check the console logs above for details.');
};

// You can also import and call this directly:
// import { runQuickDebug } from './src/debug/quickDebug';
// runQuickDebug();

export default { runQuickDebug };
