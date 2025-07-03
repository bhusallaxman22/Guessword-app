import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

/**
 * Custom hook for managing game settings
 * @returns {Object} Settings state and methods
 */
export const useSettings = () => {
    const [settings, setSettings] = useState({
        difficulty: 'medium',
        theme: 'default',
        username: 'Player'
    });
    const [loading, setLoading] = useState(true);

    // Load settings on hook initialization
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const savedSettings = await storage.getItem('gameSettings');
            console.log('🎮 Loading settings:', savedSettings);
            if (savedSettings) {
                setSettings(prev => ({ ...prev, ...savedSettings }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            console.log('🎮 Saving settings:', updatedSettings);
            await storage.setItem('gameSettings', updatedSettings);
            setSettings(updatedSettings);
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    };

    const updateDifficulty = async (difficulty) => {
        return await updateSettings({ difficulty });
    };

    const updateTheme = async (theme) => {
        return await updateSettings({ theme });
    };

    const updateUsername = async (username) => {
        return await updateSettings({ username });
    };

    /**
     * Get keyboard feedback mode based on difficulty setting
     * @param {Object} guessResult - Result of the guess with correct/present/absent arrays
     * @returns {string} Feedback mode: 'full', 'limited', 'minimal', 'none'
     */
    const getKeyboardFeedbackMode = (guessResult) => {
        switch (settings.difficulty) {
            case 'easy':
                return 'full'; // Show green, yellow, grey
            case 'medium':
                return 'limited'; // Only grey out incorrect letters
            case 'hard':
                // Only grey out if all letters are wrong (0 green, 0 yellow)
                const hasCorrectOrPresent = guessResult.correct.some(Boolean) ||
                    guessResult.present.some(Boolean);
                return hasCorrectOrPresent ? 'none' : 'minimal';
            case 'raw':
                return 'none'; // No feedback at all
            default:
                return 'limited';
        }
    };

    /**
     * Process letter states based on difficulty mode
     * @param {Object} currentStates - Current letter states
     * @param {Object} guessResult - Result of the current guess
     * @param {string} guess - The guessed word
     * @returns {Object} Updated letter states
     */
    const processLetterStates = (currentStates, guessResult, guess) => {
        const feedbackMode = getKeyboardFeedbackMode(guessResult);
        const newStates = { ...currentStates };

        if (feedbackMode === 'none') {
            return newStates; // No changes to keyboard
        }

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i].toUpperCase();

            switch (feedbackMode) {
                case 'full':
                    // Easy mode: Show all feedback with proper priority
                    if (guessResult.correct[i]) {
                        newStates[letter] = 'correct';
                    } else if (guessResult.present[i]) {
                        // Only set to present if not already correct
                        if (newStates[letter] !== 'correct') {
                            newStates[letter] = 'present';
                        }
                    } else {
                        // Only set to absent if not already correct or present
                        if (!newStates[letter] || newStates[letter] === 'unused') {
                            newStates[letter] = 'absent';
                        }
                    }
                    break;

                case 'limited':
                    // Medium mode: Only grey out incorrect letters
                    if (!guessResult.correct[i] && !guessResult.present[i]) {
                        if (!newStates[letter] || newStates[letter] === 'unused') {
                            newStates[letter] = 'absent';
                        }
                    }
                    break;

                case 'minimal':
                    // Hard mode: Only grey out if all letters are wrong
                    if (!guessResult.correct[i] && !guessResult.present[i]) {
                        if (!newStates[letter] || newStates[letter] === 'unused') {
                            newStates[letter] = 'absent';
                        }
                    }
                    break;
            }
        }

        return newStates;
    };

    return {
        settings,
        loading,
        updateSettings,
        updateDifficulty,
        updateTheme,
        updateUsername,
        getKeyboardFeedbackMode,
        processLetterStates,
        loadSettings
    };
};
