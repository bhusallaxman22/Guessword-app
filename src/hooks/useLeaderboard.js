import { useState, useEffect, useCallback } from 'react';
import { getLeaderboard, getGameStats } from '../utils/storage';
import { fetchLeaderboard } from '../services/wordService';

/**
 * Custom hook for managing leaderboard and statistics
 */
export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [gameStats, setGameStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load leaderboard from local storage
     */
    const loadLocalLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const localLeaderboard = await getLeaderboard();
            setLeaderboard(localLeaderboard);
        } catch (err) {
            console.error('Error loading local leaderboard:', err);
            setError('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load leaderboard from server (with fallback to local)
     */
    const loadServerLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const serverLeaderboard = await fetchLeaderboard();

            if (serverLeaderboard && serverLeaderboard.length > 0) {
                setLeaderboard(serverLeaderboard);
            } else {
                // Fallback to local leaderboard
                await loadLocalLeaderboard();
            }
        } catch (err) {
            console.error('Error loading server leaderboard:', err);
            // Fallback to local leaderboard
            await loadLocalLeaderboard();
        } finally {
            setLoading(false);
        }
    }, [loadLocalLeaderboard]);

    /**
     * Load game statistics
     */
    const loadGameStats = useCallback(async () => {
        try {
            const stats = await getGameStats();
            setGameStats(stats);
        } catch (err) {
            console.error('Error loading game stats:', err);
        }
    }, []);

    /**
     * Refresh all data
     */
    const refreshData = useCallback(async () => {
        await Promise.all([
            loadLocalLeaderboard(),
            loadGameStats(),
        ]);
    }, [loadLocalLeaderboard, loadGameStats]);

    /**
     * Get user's rank in leaderboard
     */
    const getUserRank = useCallback((userId) => {
        const index = leaderboard.findIndex(entry => entry.userId === userId);
        return index !== -1 ? index + 1 : null;
    }, [leaderboard]);

    /**
     * Get user's best score
     */
    const getUserBestScore = useCallback((userId) => {
        const userEntries = leaderboard.filter(entry => entry.userId === userId);
        if (userEntries.length === 0) return null;

        // Find best score (lowest attempts, then lowest time)
        return userEntries.reduce((best, current) => {
            if (current.attempts < best.attempts) return current;
            if (current.attempts === best.attempts && current.timeMs < best.timeMs) return current;
            return best;
        });
    }, [leaderboard]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load initial data
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return {
        leaderboard,
        gameStats,
        loading,
        error,
        loadLocalLeaderboard,
        loadServerLeaderboard,
        loadGameStats,
        refreshData,
        getUserRank,
        getUserBestScore,
        clearError,
    };
};
