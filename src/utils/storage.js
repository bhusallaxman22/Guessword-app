import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Storage utility functions for AsyncStorage operations
 */

/**
 * Store data in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {Promise<boolean>} Success status
 */
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error storing data:', error);
        return false;
    }
};

/**
 * Retrieve data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any>} Retrieved value or null
 */
export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data:', error);
        return false;
    }
};

/**
 * Clear all stored data
 * @returns {Promise<boolean>} Success status
 */
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
};

/**
 * Get user data (ID and username)
 * @returns {Promise<Object>} User data object
 */
export const getUserData = async () => {
    const userId = await getData(STORAGE_KEYS.USER_ID);
    const username = await getData(STORAGE_KEYS.USERNAME);
    return { userId, username };
};

/**
 * Store user data (ID and username)
 * @param {string} userId - User ID
 * @param {string} username - Username
 * @returns {Promise<boolean>} Success status
 */
export const storeUserData = async (userId, username) => {
    const userIdStored = await storeData(STORAGE_KEYS.USER_ID, userId);
    const usernameStored = await storeData(STORAGE_KEYS.USERNAME, username);
    return userIdStored && usernameStored;
};

/**
 * Get current game level
 * @returns {Promise<number>} Current level (defaults to 1)
 */
export const getCurrentLevel = async () => {
    const level = await getData(STORAGE_KEYS.CURRENT_LEVEL);
    return level || 1;
};

/**
 * Store current game level
 * @param {number} level - Level to store
 * @returns {Promise<boolean>} Success status
 */
export const storeCurrentLevel = async (level) => {
    return await storeData(STORAGE_KEYS.CURRENT_LEVEL, level);
};

/**
 * Check if this is the first launch
 * @returns {Promise<boolean>} True if first launch
 */
export const isFirstLaunch = async () => {
    const firstLaunch = await getData(STORAGE_KEYS.FIRST_LAUNCH);
    return !firstLaunch;
};

/**
 * Mark first launch as completed
 * @returns {Promise<boolean>} Success status
 */
export const setFirstLaunchCompleted = async () => {
    return await storeData(STORAGE_KEYS.FIRST_LAUNCH, true);
};

/**
 * Get leaderboard data
 * @returns {Promise<Array>} Leaderboard array
 */
export const getLeaderboard = async () => {
    const leaderboard = await getData(STORAGE_KEYS.LEADERBOARD);
    return leaderboard || [];
};

/**
 * Store leaderboard data
 * @param {Array} leaderboard - Leaderboard array
 * @returns {Promise<boolean>} Success status
 */
export const storeLeaderboard = async (leaderboard) => {
    return await storeData(STORAGE_KEYS.LEADERBOARD, leaderboard);
};

/**
 * Add entry to leaderboard
 * @param {Object} entry - Leaderboard entry
 * @returns {Promise<boolean>} Success status
 */
export const addToLeaderboard = async (entry) => {
    try {
        const leaderboard = await getLeaderboard();
        leaderboard.push({
            ...entry,
            createdAt: new Date().toISOString(),
        });

        // Sort by attempts (ascending) then by time (ascending)
        leaderboard.sort((a, b) => {
            if (a.attempts !== b.attempts) {
                return a.attempts - b.attempts;
            }
            return a.timeMs - b.timeMs;
        });

        // Keep only top 10
        const topLeaderboard = leaderboard.slice(0, 10);

        return await storeLeaderboard(topLeaderboard);
    } catch (error) {
        console.error('Error adding to leaderboard:', error);
        return false;
    }
};

/**
 * Get game statistics
 * @returns {Promise<Object>} Game statistics
 */
export const getGameStats = async () => {
    const stats = await getData(STORAGE_KEYS.GAME_STATS);
    return stats || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        totalTime: 0,
        averageAttempts: 0,
    };
};

/**
 * Update game statistics
 * @param {Object} gameResult - Game result data
 * @returns {Promise<boolean>} Success status
 */
export const updateGameStats = async (gameResult) => {
    try {
        const stats = await getGameStats();

        stats.gamesPlayed += 1;
        stats.totalTime += gameResult.timeMs;

        if (gameResult.won) {
            stats.gamesWon += 1;
            stats.currentStreak += 1;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        } else {
            stats.currentStreak = 0;
        }

        stats.averageAttempts = stats.gamesWon > 0
            ? (stats.averageAttempts * (stats.gamesWon - 1) + gameResult.attempts) / stats.gamesWon
            : gameResult.attempts;

        return await storeData(STORAGE_KEYS.GAME_STATS, stats);
    } catch (error) {
        console.error('Error updating game stats:', error);
        return false;
    }
};

/**
 * Check if stored user data needs to be refreshed from server
 * @returns {Promise<boolean>} True if user data needs refresh
 */
export const needsUserDataRefresh = async () => {
    const { userId } = await getUserData();
    if (!userId) {
        return true; // No user data, needs refresh
    }

    // Check if userId is in MongoDB ObjectId format (24 hex chars)
    const isValidFormat = /^[0-9a-fA-F]{24}$/.test(userId);
    if (!isValidFormat) {
        console.log('Stored userId is in old format, needs refresh:', userId);
        return true;
    }

    return false; // UserId is valid
};

/**
 * Clear old user data to force refresh from server
 * @returns {Promise<boolean>} Success status
 */
export const clearUserData = async () => {
    try {
        await removeData(STORAGE_KEYS.USER_ID);
        await removeData(STORAGE_KEYS.USERNAME);
        console.log('User data cleared, will fetch fresh from server');
        return true;
    } catch (error) {
        console.error('Error clearing user data:', error);
        return false;
    }
};

/**
 * Storage object for general-purpose storage operations
 */
export const storage = {
    setItem: async (key, value) => {
        return await storeData(key, value);
    },
    getItem: async (key) => {
        return await getData(key);
    },
    removeItem: async (key) => {
        return await removeData(key);
    }
};
