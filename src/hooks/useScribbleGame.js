
import { useState, useEffect, useCallback } from 'react';
import { getScribbleWords } from '../services/wordService';

/**
 * @typedef {Object} ScribbleGameState
 * @property {string[]} words - The list of words for the current game.
 * @property {string} currentWord - The current word to be guessed.
 * @property {string} guess - The player's current guess.
 * @property {string[]} pastGuesses - An array of past guesses.
 * @property {number} score - The player's score.
 * @property {boolean} isLoading - Whether the game is currently loading.
 * @property {boolean} error - Whether an error has occurred.
 * @property {boolean} isCorrect - Whether the current guess is correct.
 */

/**
 * @typedef {Object} ScribbleGameActions
 * @property {(text: string) => void} setGuess - Function to set the player's guess.
 * @property {() => void} submitGuess - Function to submit the player's guess.
 * @property {() => void} nextWord - Function to move to the next word.
 */

/**
 * Custom hook to manage the Scribble game logic.
 * @returns {{gameState: ScribbleGameState, gameActions: ScribbleGameActions}}
 */
export const useScribbleGame = () => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [guess, setGuess] = useState('');
    const [pastGuesses, setPastGuesses] = useState([]);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [gameOver, setGameOver] = useState(false);

    const fetchWords = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(false);
            const words = await getScribbleWords(20); // Fetch 20 words
            setWords(words);
            setCurrentWord(words[0] || '');
        } catch (err) {
            setError(true);
            console.error("Failed to fetch scribble words:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const submitGuess = () => {
        if (guess.toLowerCase() === currentWord.toLowerCase()) {
            setScore(prev => prev + 1);
            setIsCorrect(true);
        } else {
            setAttemptsLeft(prev => prev - 1);
        }
        setPastGuesses(prev => [...prev, guess]);

        // Check if game over (no attempts left and not correct)
        if (attemptsLeft <= 1 && guess.toLowerCase() !== currentWord.toLowerCase()) {
            setGameOver(true);
        }
    };

    const nextWord = () => {
        if (currentWordIndex < words.length - 1) {
            const nextIndex = currentWordIndex + 1;
            setCurrentWordIndex(nextIndex);
            setCurrentWord(words[nextIndex]);
            setGuess('');
            setPastGuesses([]);
            setIsCorrect(false);
            setAttemptsLeft(3); // Reset attempts for new word
            setGameOver(false);
        } else {
            // End of game
            setGameOver(true);
        }
    };

    const gameState = {
        words,
        currentWord,
        currentWordIndex,
        guess,
        pastGuesses,
        score,
        isLoading,
        error,
        isCorrect,
        attemptsLeft,
        gameOver
    };
    const gameActions = {
        setGuess,
        submitGuess,
        nextWord
    };

    return {
        gameState,
        gameActions
    };
};
