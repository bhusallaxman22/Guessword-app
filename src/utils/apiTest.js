import { fetchWordForLevel, fetchUsername, fetchLeaderboard, postResult, checkBackendHealth } from '../services/wordService';

/**
 * Test the backend integration
 * This file can be used to test the API endpoints manually
 */

export const testBackendIntegration = async () => {
    console.log('🧪 Testing GUESSWORD Backend Integration...\n');

    // Test 1: Backend Health Check
    console.log('1. Testing backend health...');
    try {
        const isHealthy = await checkBackendHealth();
        console.log(`✅ Backend health: ${isHealthy ? 'Healthy' : 'Unhealthy'}\n`);
    } catch (error) {
        console.error('❌ Health check failed:', error.message, '\n');
    }

    // Test 2: Username Generation
    console.log('2. Testing username generation...');
    try {
        const userInfo = await fetchUsername();
        console.log('✅ Username generated:', userInfo, '\n');
    } catch (error) {
        console.error('❌ Username generation failed:', error.message, '\n');
    }

    // Test 3: Word Fetching (Level 1)
    console.log('3. Testing word fetching for level 1...');
    try {
        const word = await fetchWordForLevel(1);
        console.log('✅ Word fetched for level 1:', word, '\n');
    } catch (error) {
        console.error('❌ Word fetching failed:', error.message, '\n');
    }

    // Test 4: Leaderboard Fetching
    console.log('4. Testing leaderboard fetching...');
    try {
        const leaderboard = await fetchLeaderboard();
        console.log('✅ Leaderboard fetched:', leaderboard.length, 'entries\n');
    } catch (error) {
        console.error('❌ Leaderboard fetching failed:', error.message, '\n');
    }

    // Test 5: Result Posting (with test data)
    console.log('5. Testing result posting...');
    try {
        const success = await postResult('test-user-id', 3, 45000);
        console.log('✅ Result posting:', success ? 'Success' : 'Failed', '\n');
    } catch (error) {
        console.error('❌ Result posting failed:', error.message, '\n');
    }

    console.log('🧪 Backend integration tests completed!');
};

// Function to test specific level
export const testWordForLevel = async (level) => {
    console.log(`🔍 Testing word fetch for level ${level}...`);
    try {
        const word = await fetchWordForLevel(level);
        if (word) {
            console.log(`✅ Level ${level} word:`, word);
        } else {
            console.log(`ℹ️ No more words available at level ${level}`);
        }
        return word;
    } catch (error) {
        console.error(`❌ Failed to fetch word for level ${level}:`, error.message);
        return null;
    }
};

// Function to test multiple levels
export const testMultipleLevels = async (maxLevel = 5) => {
    console.log(`🎯 Testing word fetching for levels 1-${maxLevel}...`);
    const results = {};

    for (let level = 1; level <= maxLevel; level++) {
        results[level] = await testWordForLevel(level);
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
};

/**
 * Test result posting with different data types
 */
export const testResultPosting = async () => {
    console.log('🧪 Testing result posting with various scenarios...\n');

    const testCases = [
        {
            name: 'Valid data',
            userId: 'test-user-' + Date.now(),
            attempts: 4,
            timeMs: 32000
        },
        {
            name: 'Short userId',
            userId: 'usr1',
            attempts: 2,
            timeMs: 15000
        },
        {
            name: 'Max attempts',
            userId: 'test-max-' + Date.now(),
            attempts: 8,
            timeMs: 120000
        }
    ];

    for (const testCase of testCases) {
        console.log(`Testing: ${testCase.name}`);
        console.log(`Data: userId="${testCase.userId}", attempts=${testCase.attempts}, timeMs=${testCase.timeMs}`);

        try {
            const success = await postResult(testCase.userId, testCase.attempts, testCase.timeMs);
            console.log(`Result: ${success ? '✅ Success' : '❌ Failed'}\n`);
        } catch (error) {
            console.error(`❌ Error: ${error.message}\n`);
        }

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

// Export test utilities
export default {
    testBackendIntegration,
    testWordForLevel,
    testMultipleLevels,
    testResultPosting,
};
