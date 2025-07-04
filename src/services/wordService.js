import { generateUsername, generateId, fetchWithTimeout, isValidObjectId } from '../utils/gameUtils';
import { API_CONFIG } from '../constants';
import CryptoJS from 'react-native-crypto-js';
import { decode } from 'base-64';

/**
 * Word service for fetching words and handling game data from Netlify functions
 */

/**
 * Decryption key for word decryption
 */
const DECRYPTION_KEY = 'sZWs+NciBq/DOwBm+csybg22zeVZTxTmatVHs+0cats=';

/**
 * Fetch word for a specific level
 * @param {number} level - Game level
 * @returns {Promise<string>} Promise resolving to the word
 */
export const fetchWordForLevel = async (level) => {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}/getWordOfTheDay?level=${level}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            API_CONFIG.timeout
        );

        if (!response.ok) {
            if (response.status === 404) {
                return null; // No more levels
            }
            throw new Error(`Failed to fetch word for level ${level}: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        const encryptedWord = responseData.data;

        if (!encryptedWord) {
            throw new Error('No encrypted word data received from server');
        }

        // Decrypt the word using the provided key
        const plaintext = await decryptWord(encryptedWord);
        return plaintext.toUpperCase();

    } catch (error) {
        console.error('Error fetching word for level:', error);
        throw new Error(`Failed to fetch word: ${error.message}`);
    }
};

/**
 * Generate a new username and user ID from backend
 * @returns {Promise<Object>} Promise resolving to user data
 */
export const fetchUsername = async () => {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}/genUsername`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            API_CONFIG.timeout
        );

        if (!response.ok) {
            throw new Error(`Failed to get username: ${response.status} ${response.statusText}`);
        } const data = await response.json();

        // Use the exact userId from server - it's already in correct MongoDB ObjectId format
        const userId = data.userId;
        const username = data.username;

        if (!userId) {
            throw new Error('Server did not provide userId');
        }

        console.log('Received from server:', { userId, username });

        return {
            userId: userId,
            username: username || generateUsername()
        };

    } catch (error) {
        console.error('Error fetching username from server:', error);
        // Only generate fallback data when server is completely unavailable
        console.log('Server unavailable, generating local fallback user data');
        return {
            userId: generateId(),
            username: generateUsername(),
        };
    }
};

/**
 * Post game result to server
 * @param {string} userId - User ID
 * @param {number} attempts - Number of attempts
 * @param {number} timeMs - Time in milliseconds
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export const postResult = async (userId, attempts, timeMs) => {
    try {
        // Validate input parameters
        if (!userId || typeof userId !== 'string') {
            console.error('Invalid userId for postResult:', userId);
            return false;
        }

        if (!attempts || typeof attempts !== 'number' || attempts < 1) {
            console.error('Invalid attempts for postResult:', attempts);
            return false;
        }

        if (typeof timeMs !== 'number' || timeMs < 0) {
            console.error('Invalid timeMs for postResult:', timeMs);
            return false;
        }

        // Ensure userId is valid - if it's from the server, use it as-is
        // Only generate new ObjectId for fallback local userIds
        let validUserId = userId;
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            // This looks like a locally generated ID that's not in ObjectId format
            console.log('Converting local userId to ObjectId format. Original:', userId);
            validUserId = generateId();
            console.log('Generated ObjectId:', validUserId);
        } else {
            // This is already in ObjectId format (likely from server)
            console.log('Using server-provided userId:', validUserId);
        }

        const payload = {
            userId: validUserId,
            attempts: parseInt(attempts),
            timeMs: parseInt(timeMs)
        };

        console.log('Posting result to server:', payload);
        console.log('API endpoint:', `${API_CONFIG.baseUrl}/recordResult`);

        let response;

        try {
            // Try with fetchWithTimeout first
            response = await fetchWithTimeout(
                `${API_CONFIG.baseUrl}/recordResult`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                },
                API_CONFIG.timeout
            );
        } catch (fetchTimeoutError) {
            console.warn('fetchWithTimeout failed, trying standard fetch:', fetchTimeoutError.message);

            // Fallback to standard fetch
            response = await fetch(`${API_CONFIG.baseUrl}/recordResult`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        }

        console.log('Response status:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            // Try to get error details from response
            let errorDetails = '';
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorDetails = JSON.stringify(errorData);
                } else {
                    errorDetails = await response.text();
                }
                console.error('Server error response:', errorDetails);
            } catch (parseError) {
                console.error('Could not parse error response:', parseError.message);
            }

            console.error(`Failed to post result: ${response.status} ${response.statusText}`, errorDetails);
            return false;
        }

        const result = await response.json();
        console.log('Game result posted successfully:', result);
        return true;

    } catch (error) {
        console.error('Error posting result to server:', error.message);
        console.error('Full error:', error);
        return false;
    }
};

/**
 * Fetch leaderboard from server
 * @returns {Promise<Array>} Promise resolving to leaderboard array
 */
export const fetchLeaderboard = async () => {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}/getLeaderboard`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            API_CONFIG.timeout
        );

        if (!response.ok) {
            throw new Error(`Leaderboard fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.leaderboard || [];

    } catch (error) {
        console.error('Error fetching leaderboard from server:', error);
        return [];
    }
};

/**
 * Decrypt word from encrypted payload using AES decryption
 * @param {string} payloadBase64 - Base64 encrypted payload
 * @returns {Promise<string>} Promise resolving to decrypted word
 */
export const decryptWord = async (payloadBase64) => {
    try {
        // The payload contains IV + encrypted data as base64
        const combined = decode(payloadBase64);

        // Convert base64 combined data to bytes
        const combinedBytes = new Uint8Array(combined.length);
        for (let i = 0; i < combined.length; i++) {
            combinedBytes[i] = combined.charCodeAt(i);
        }

        // Extract IV (first 16 bytes) and ciphertext (rest)
        const iv = combinedBytes.slice(0, 16);
        const ciphertext = combinedBytes.slice(16);        // Convert to hex strings for CryptoJS
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        const ciphertextHex = Array.from(ciphertext).map(b => b.toString(16).padStart(2, '0')).join('');

        // Create CryptoJS objects
        const ivWords = CryptoJS.enc.Hex.parse(ivHex);
        const ciphertextWords = CryptoJS.enc.Hex.parse(ciphertextHex);
        const keyWords = CryptoJS.enc.Base64.parse(DECRYPTION_KEY);

        // Decrypt using AES-CBC
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertextWords },
            keyWords,
            {
                iv: ivWords,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        // Convert back to string
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error('Decryption resulted in empty string');
        }

        return decryptedText;

    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error(`Cannot decrypt word: ${error.message}`);
    }
};

/**
 * Check backend health and connectivity
 * @returns {Promise<boolean>} Promise resolving to health status
 */
export const checkBackendHealth = async () => {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}/health`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            5000 // Shorter timeout for health check
        );

        return response.ok;

    } catch (error) {
        console.log('Backend health check failed:', error.message);
        return false;
    }
};

/**
 * Debug function to test posting with actual game data
 * @param {string} userId - Actual user ID from game
 * @param {number} attempts - Actual attempts from game
 * @param {number} timeMs - Actual time from game
 */
export const debugPostResult = async (userId, attempts, timeMs) => {
    console.log('🔍 Debug posting result with actual game data:');
    console.log('Input parameters:');
    console.log('  userId:', userId, '(type:', typeof userId, ')');
    console.log('  attempts:', attempts, '(type:', typeof attempts, ')');
    console.log('  timeMs:', timeMs, '(type:', typeof timeMs, ')');

    // Check ObjectId format
    const isValidObjId = isValidObjectId(userId);
    const looksLikeServerUserId = userId.match(/^[0-9a-fA-F]{24}$/);

    console.log('  userId ObjectId format:', isValidObjId ? '✅ Valid' : '❌ Invalid');
    console.log('  Looks like server userId:', looksLikeServerUserId ? '✅ Yes' : '❌ No (local fallback)');

    if (!looksLikeServerUserId) {
        console.log('  Note: Will convert to valid ObjectId format before sending');
    }

    // Check parameter validity
    const issues = [];
    if (!userId || typeof userId !== 'string') issues.push('Invalid userId');
    if (!attempts || typeof attempts !== 'number' || attempts < 1) issues.push('Invalid attempts');
    if (typeof timeMs !== 'number' || timeMs < 0) issues.push('Invalid timeMs');

    if (issues.length > 0) {
        console.error('❌ Parameter issues:', issues.join(', '));
        return false;
    }

    console.log('✅ Parameters look valid, attempting to post...');

    try {
        const result = await postResult(userId, attempts, timeMs);
        console.log('✅ Debug post result:', result);
        return result;
    } catch (error) {
        console.error('❌ Debug post failed:', error.message);
        return false;
    }
};

/**
 * Fetch a list of words for the Scribble game by making multiple calls to getWordOfTheDay with random levels.
 * @param {number} wordCount - Number of words to fetch (default: 20)
 * @returns {Promise<string[]>} A promise that resolves to an array of words.
 */
export const getScribbleWords = async (wordCount = 20) => {
    try {
        const words = [];
        const usedLevels = new Set();
        const maxLevel = 100; // Assuming levels go up to 100, adjust as needed

        // Generate random levels and fetch words
        for (let i = 0; i < wordCount; i++) {
            let level;
            let attempts = 0;

            // Generate a unique random level (avoid duplicates)
            do {
                level = Math.floor(Math.random() * maxLevel) + 1;
                attempts++;
            } while (usedLevels.has(level) && attempts < 50); // Prevent infinite loop

            usedLevels.add(level);

            try {
                const word = await fetchWordForLevel(level);
                if (word) {
                    words.push(word);
                }
            } catch (error) {
                console.warn(`Failed to fetch word for level ${level}:`, error.message);
                // Continue fetching other words even if one fails
            }
        }

        if (words.length === 0) {
            throw new Error('No words could be fetched for Scribble game');
        }

        console.log(`Fetched ${words.length} words for Scribble game`);
        return words;
    } catch (error) {
        console.error('Error fetching scribble words:', error);
        throw new Error(`Failed to fetch scribble words: ${error.message}`);
    }
};

/**
 * Record game results to the backend
 * @param {Object} resultData - Game result data
 * @param {string} resultData.userId - User ID
 * @param {number} resultData.attempts - Number of attempts
 * @param {number} resultData.timeMs - Time in milliseconds
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export const recordGameResults = async ({ userId, attempts, timeMs }) => {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}/recordResult`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, attempts, timeMs }),
            },
            API_CONFIG.timeout
        );

        if (!response.ok) {
            throw new Error(`Failed to record game result: ${response.status} ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error recording game result:', error);
        return false;
    }
};
