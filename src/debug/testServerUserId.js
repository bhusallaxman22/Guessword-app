import { fetchUsername, postResult, debugPostResult } from '../services/wordService';

/**
 * Test the corrected user flow with server-provided userId
 */
export const testServerUserIdFlow = async () => {
    console.log('🧪 Testing Server UserId Flow...\n');

    try {
        // Step 1: Get username from server
        console.log('1. Fetching username from server...');
        const userInfo = await fetchUsername();
        console.log('✅ Received user info:', userInfo);

        if (!userInfo.userId || !userInfo.username) {
            console.error('❌ Invalid user info received');
            return;
        }

        // Step 2: Validate the received userId format
        const userIdPattern = /^[0-9a-fA-F]{24}$/;
        const isValidFormat = userIdPattern.test(userInfo.userId);
        console.log(`📋 UserId format check: ${isValidFormat ? '✅ Valid' : '❌ Invalid'}`);
        console.log(`📋 UserId: "${userInfo.userId}" (length: ${userInfo.userId.length})\n`);

        // Step 3: Test posting result with server-provided userId
        console.log('2. Testing result posting with server userId...');
        const testAttempts = 4;
        const testTimeMs = 32000;

        const postSuccess = await debugPostResult(userInfo.userId, testAttempts, testTimeMs);
        console.log(`✅ Post result: ${postSuccess ? 'SUCCESS' : 'FAILED'}\n`);

        if (postSuccess) {
            console.log('🎉 Server userId flow working correctly!');
        } else {
            console.log('❌ Server userId flow still has issues');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

/**
 * Compare server vs local userId behavior
 */
export const testUserIdComparison = async () => {
    console.log('🔍 Comparing Server vs Local UserId behavior...\n');

    try {
        // Test with server userId
        const serverUser = await fetchUsername();
        console.log('Server userId example:', serverUser.userId);
        console.log('Server userId length:', serverUser.userId.length);
        console.log('Server userId format valid:', /^[0-9a-fA-F]{24}$/.test(serverUser.userId));
        console.log('');

        // Test with local userId (from old format)
        const localUserId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log('Local userId example:', localUserId);
        console.log('Local userId length:', localUserId.length);
        console.log('Local userId format valid:', /^[0-9a-fA-F]{24}$/.test(localUserId));
        console.log('');

        console.log('💡 The server expects the exact userId it provided during genUsername');
        console.log('💡 Local userIds should only be used when server is unavailable');

    } catch (error) {
        console.error('❌ Comparison test failed:', error.message);
    }
};

export default {
    testServerUserIdFlow,
    testUserIdComparison,
};
