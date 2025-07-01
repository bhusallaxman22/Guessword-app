import { useState, useEffect, useCallback } from 'react';
import { calculateScores, validateGuess } from '../utils/gameUtils';
import { fetchWordForLevel, postResult } from '../services/wordService';
import { getCurrentLevel, storeCurrentLevel, addToLeaderboard, updateGameStats } from '../utils/storage';
import { GAME_CONFIG, MESSAGES } from '../constants';

/**
 * Custom hook for managing game state and logic
 */
export const useGameLogic = () => {
    const [targetWord, setTargetWord] = useState('');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentAttempts, setCurrentAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const [guessHistory, setGuessHistory] = useState([]);
    const [letterStates, setLetterStates] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cheatModeActive, setCheatModeActive] = useState(false);

    /**
     * Initialize game for a specific level
     */
    const initGame = useCallback(async (advanceLevel = false) => {
        try {
            setLoading(true);
            setError(null);

            let newLevel = currentLevel;
            if (advanceLevel) {
                newLevel = currentLevel + 1;
                setCurrentLevel(newLevel);
                await storeCurrentLevel(newLevel);
            }

            // Reset cheat mode
            setCheatModeActive(false);

            const word = await fetchWordForLevel(newLevel);

            if (!word) {
                // No more levels available
                setError(MESSAGES.ALL_LEVELS_CLEARED);
                return false;
            }

            setTargetWord(word.toUpperCase());
            setCurrentAttempts(0);
            setGameOver(false);
            setGameWon(false);
            setGuessHistory([]);
            setLetterStates({});
            setStartTime(null);
            setTimerStarted(false);

            return true;
        } catch (err) {
            console.error('Error initializing game:', err);
            setError(MESSAGES.ERROR_LOADING_WORD);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentLevel]);

    /**
     * Load game from saved state
     */
    const loadGame = useCallback(async () => {
        try {
            const savedLevel = await getCurrentLevel();
            setCurrentLevel(savedLevel);
            await initGame(false);
        } catch (err) {
            console.error('Error loading game:', err);
            await initGame(false);
        }
    }, [initGame]);

    /**
     * Start the timer on first letter input
     */
    const startTimer = useCallback(() => {
        if (!timerStarted && !gameOver) {
            setStartTime(Date.now());
            setTimerStarted(true);
        }
    }, [timerStarted, gameOver]);

    /**
     * Make a guess
     */
    const makeGuess = useCallback(async (guess, userId, username) => {
        if (gameOver || loading) return null;

        // Validate guess
        const validation = validateGuess(guess, GAME_CONFIG.WORD_LENGTH);
        if (!validation.isValid) {
            setError(validation.error);
            return null;
        }

        setError(null);
        const upperGuess = guess.toUpperCase();
        const newAttempts = currentAttempts + 1;
        setCurrentAttempts(newAttempts);

        // Calculate scores
        const scores = calculateScores(upperGuess, targetWord);

        // Update letter states for virtual keyboard
        const newLetterStates = { ...letterStates };
        for (let i = 0; i < upperGuess.length; i++) {
            const letter = upperGuess[i];
            const currentScore = scores.details[i];

            // Priority: correct > present > absent
            // Don't downgrade a letter's state
            if (currentScore === 'green' || !newLetterStates[letter]) {
                newLetterStates[letter] = currentScore === 'green' ? 'correct' :
                    currentScore === 'yellow' ? 'present' : 'absent';
            } else if (currentScore === 'yellow' && newLetterStates[letter] === 'absent') {
                newLetterStates[letter] = 'present';
            }
        }
        setLetterStates(newLetterStates);

        // Add to history
        const newGuessEntry = {
            guess: upperGuess,
            scores,
            attempt: newAttempts,
        };

        setGuessHistory(prev => [...prev, newGuessEntry]);

        // Check win condition
        if (scores.green === GAME_CONFIG.WORD_LENGTH) {
            const timeMs = startTime ? Date.now() - startTime : 0;
            setGameOver(true);
            setGameWon(true);

            // Record result
            try {
                console.log('🎯 Game won! Posting result to server...');
                console.log('Result data:', { userId, attempts: newAttempts, timeMs, level: currentLevel });

                const postSuccess = await postResult(userId, newAttempts, timeMs);
                console.log('Post result success:', postSuccess);

                await addToLeaderboard({
                    userId,
                    username,
                    attempts: newAttempts,
                    timeMs,
                    level: currentLevel,
                });
                await updateGameStats({
                    won: true,
                    attempts: newAttempts,
                    timeMs,
                });
            } catch (err) {
                console.error('Error recording result:', err);
                console.error('Result data that failed:', { userId, attempts: newAttempts, timeMs });
            }

            return { won: true, attempts: newAttempts, timeMs };
        }

        // Check lose condition
        if (newAttempts >= GAME_CONFIG.MAX_ATTEMPTS) {
            setGameOver(true);
            setGameWon(false);

            await updateGameStats({
                won: false,
                attempts: newAttempts,
                timeMs: startTime ? Date.now() - startTime : 0,
            });

            return { won: false, attempts: newAttempts, word: targetWord };
        }

        return { won: null, attempts: newAttempts };
    }, [gameOver, loading, currentAttempts, targetWord, startTime, currentLevel]);

    /**
     * Activate cheat mode (show current word)
     */
    const activateCheatMode = useCallback(() => {
        setCheatModeActive(true);
    }, []);

    /**
     * Deactivate cheat mode
     */
    const deactivateCheatMode = useCallback(() => {
        setCheatModeActive(false);
    }, []);

    /**
     * Reset error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Get remaining attempts
     */
    const remainingAttempts = GAME_CONFIG.MAX_ATTEMPTS - currentAttempts; return {
        // State
        targetWord,
        currentLevel,
        currentAttempts,
        remainingAttempts,
        gameOver,
        gameWon,
        guessHistory,
        letterStates,
        loading,
        error,
        cheatModeActive,
        startTime,
        timerStarted,

        // Actions
        initGame,
        loadGame,
        makeGuess,
        activateCheatMode,
        deactivateCheatMode,
        clearError,
        startTimer,
    };
};
