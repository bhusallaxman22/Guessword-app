import { generateUsername, generateId } from '../utils/gameUtils';

/**
 * Word service for fetching words and handling game data
 * Note: This is a mock implementation since we don't have the actual Netlify functions
 * In a real app, you would replace these with actual API calls
 */

// Mock word lists for different levels
const WORD_LISTS = {
    1: ['BIRD', 'FISH', 'TREE', 'STAR', 'MOON', 'FIRE', 'WIND', 'ROCK'],
    2: ['OCEAN', 'CLOUD', 'LIGHT', 'MAGIC', 'DANCE', 'MUSIC', 'HAPPY', 'BRAVE'],
    3: ['DREAM', 'PEACE', 'SMILE', 'HEART', 'GRACE', 'STORM', 'SHINE', 'SWIFT'],
    4: ['QUEST', 'POWER', 'CROWN', 'JEWEL', 'FLAME', 'KNIGHT', 'HONOR', 'GLORY'],
    5: ['WISDOM', 'TEMPLE', 'CASTLE', 'LEGEND', 'MYSTIC', 'FALCON', 'VIKING', 'DRAGON'],
};

/**
 * Base API configuration
 */
const API_CONFIG = {
    baseUrl: 'https://your-netlify-app.netlify.app/.netlify/functions',
    timeout: 10000,
};

/**
 * Fetch word for a specific level
 * @param {number} level - Game level
 * @returns {Promise<string>} Promise resolving to the word
 */
export const fetchWordForLevel = async (level) => {
    try {
        // Mock implementation - replace with actual API call
        const words = WORD_LISTS[level];
        if (!words || words.length === 0) {
            return null; // No more levels
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return random word from the level
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];

        /* Real implementation would be:
        const response = await fetch(`${API_CONFIG.baseUrl}/getWordOfTheDay?level=${level}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            return null; // No more levels
          }
          throw new Error(`Failed to fetch word for level ${level}`);
        }
        
        const { data } = await response.json();
        const plaintext = await decryptWord(data);
        return plaintext;
        */
    } catch (error) {
        console.error('Error fetching word for level:', error);
        throw error;
    }
};

/**
 * Generate a new username and user ID
 * @returns {Promise<Object>} Promise resolving to user data
 */
export const fetchUsername = async () => {
    try {
        // Mock implementation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));

        const userId = generateId();
        const username = generateUsername();

        return { userId, username };

        /* Real implementation would be:
        const response = await fetch(`${API_CONFIG.baseUrl}/genUsername`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to get username');
        }
        
        const data = await response.json();
        return { userId: data.userId, username: data.username };
        */
    } catch (error) {
        console.error('Error fetching username:', error);
        // Return fallback data
        return {
            userId: generateId(),
            username: 'Anonymous',
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
        // Mock implementation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log('Game result posted:', { userId, attempts, timeMs });
        return true;

        /* Real implementation would be:
        const response = await fetch(`${API_CONFIG.baseUrl}/recordResult`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, attempts, timeMs }),
        });
        
        return response.ok;
        */
    } catch (error) {
        console.error('Error posting result:', error);
        return false;
    }
};

/**
 * Fetch leaderboard from server
 * @returns {Promise<Array>} Promise resolving to leaderboard array
 */
export const fetchLeaderboard = async () => {
    try {
        // Mock implementation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return empty array for mock - real leaderboard would come from server
        return [];

        /* Real implementation would be:
        const response = await fetch(`${API_CONFIG.baseUrl}/getLeaderboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Leaderboard fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.leaderboard || [];
        */
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
};

/**
 * Decrypt word from encrypted payload
 * @param {string} payloadBase64 - Base64 encrypted payload
 * @returns {Promise<string>} Promise resolving to decrypted word
 */
export const decryptWord = async (payloadBase64) => {
    try {
        // This is a complex crypto operation that would need proper implementation
        // For now, return the payload as-is (assuming it's already decrypted in mock)
        return payloadBase64;

        /* Real implementation would use WebCrypto API:
        const combined = base64ToUint8Array(payloadBase64);
        const iv = combined.slice(0, 16);
        const ciphertext = combined.slice(16);
        
        const base64Key = "your-secret-key-here";
        const rawKeyBytes = base64ToUint8Array(base64Key);
        
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          rawKeyBytes.buffer,
          { name: 'AES-CBC', length: 256 },
          false,
          ['decrypt']
        );
        
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: iv.buffer },
          cryptoKey,
          ciphertext.buffer
        );
        
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(decryptedBuffer);
        */
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Cannot decrypt word');
    }
};
