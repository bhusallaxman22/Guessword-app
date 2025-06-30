import { useState, useEffect, useCallback } from 'react';
import { getUserData, storeUserData, isFirstLaunch, setFirstLaunchCompleted } from '../utils/storage';
import { fetchUsername } from '../services/wordService';

/**
 * Custom hook for managing user data and authentication
 */
export const useUserData = () => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstLaunch, setFirstLaunch] = useState(false);

    /**
     * Load user data from storage or create new user
     */
    const loadUserData = useCallback(async () => {
        try {
            setLoading(true);

            // Check if this is first launch
            const isFirst = await isFirstLaunch();
            setFirstLaunch(isFirst);

            // Try to load existing user data
            const { userId: storedUserId, username: storedUsername } = await getUserData();

            if (storedUserId && storedUsername) {
                setUserId(storedUserId);
                setUsername(storedUsername);
            } else {
                // Create new user
                await createNewUser();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Fallback to creating new user
            await createNewUser();
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create new user with generated username
     */
    const createNewUser = useCallback(async () => {
        try {
            const { userId: newUserId, username: newUsername } = await fetchUsername();

            setUserId(newUserId);
            setUsername(newUsername);

            await storeUserData(newUserId, newUsername);
        } catch (error) {
            console.error('Error creating new user:', error);
            // Set fallback values
            setUserId('anonymous');
            setUsername('Anonymous Player');
        }
    }, []);

    /**
     * Complete first launch setup
     */
    const completeFirstLaunch = useCallback(async () => {
        try {
            await setFirstLaunchCompleted();
            setFirstLaunch(false);
        } catch (error) {
            console.error('Error completing first launch:', error);
        }
    }, []);

    /**
     * Update username
     */
    const updateUsername = useCallback(async (newUsername) => {
        try {
            setUsername(newUsername);
            await storeUserData(userId, newUsername);
            return true;
        } catch (error) {
            console.error('Error updating username:', error);
            return false;
        }
    }, [userId]);

    /**
     * Reset user data (for testing or logout)
     */
    const resetUserData = useCallback(async () => {
        try {
            setUserId(null);
            setUsername(null);
            await createNewUser();
        } catch (error) {
            console.error('Error resetting user data:', error);
        }
    }, [createNewUser]);

    // Load user data on mount
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    return {
        userId,
        username,
        loading,
        firstLaunch,
        loadUserData,
        createNewUser,
        completeFirstLaunch,
        updateUsername,
        resetUserData,
        isAuthenticated: !!(userId && username),
    };
};
