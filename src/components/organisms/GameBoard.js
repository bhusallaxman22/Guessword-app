import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { WordInput } from '../molecules';
import GuessHistory from './GuessHistory';
import { Button, Text } from '../atoms';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS, GAME_CONFIG } from '../../constants';

/**
 * GameBoard organism component for the main game interface
 * @param {Object} props - GameBoard props
 * @param {Function} props.onGuessSubmit - Callback when guess is submitted
 * @param {boolean} props.disabled - Whether game board is disabled
 * @param {boolean} props.loading - Whether game is in loading state
 * @param {string} props.currentGuess - Current guess value
 * @param {Function} props.onGuessChange - Callback when guess changes
 * @param {Function} props.onFocusChange - Callback when input focus changes
 * @param {Object} props.letterStates - Object mapping letters to their states
 * @param {Array} props.guessHistory - Array of previous guesses
 * @param {Function} props.onVirtualKeyPress - Callback for virtual key press
 * @param {Function} props.onVirtualBackspace - Callback for virtual backspace
 * @param {Function} props.onVirtualEnter - Callback for virtual enter
 * @param {Function} props.startTimer - Function to start the timer
 * @param {boolean} props.timerStarted - Whether timer has started
 */
const GameBoard = ({
    onGuessSubmit,
    disabled = false,
    loading = false,
    currentGuess = '',
    onGuessChange,
    onFocusChange,
    guessHistory = [],
    onVirtualKeyPress,
    onVirtualBackspace,
    onVirtualEnter,
    startTimer,
    timerStarted,
}) => {
    const [guess, setGuess] = useState('');
    const wordInputRef = useRef();
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.md,
            backgroundColor: THEME_COLORS.white,
            borderRadius: BORDER_RADIUS.lg,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            flex: 1,
        },
        inputSection: {
            alignItems: 'center',
            marginBottom: SPACING.md,
        },
        instruction: {
            marginBottom: SPACING.sm,
            opacity: 0.7,
        },
        inputContainer: {
            marginBottom: SPACING.sm,
        },
        submitButton: {
            minWidth: 100,
            marginTop: SPACING.xs,
        },
        compactHistorySection: {
            flex: 1,
            marginTop: SPACING.sm,
            paddingTop: SPACING.sm,
            borderTopWidth: 1,
            borderTopColor: THEME_COLORS.border,
        },
        historyTitle: {
            marginBottom: SPACING.sm,
            textAlign: 'center',
        },
        emptyText: {
            opacity: 0.6,
            paddingVertical: SPACING.lg,
        },
        compactHistory: {
            flex: 1,
            gap: SPACING.xs,
        },
    });

    // Sync internal guess with prop
    useEffect(() => {
        if (currentGuess !== guess) {
            setGuess(currentGuess);
        }
    }, [currentGuess]);

    const handleWordChange = useCallback((word) => {
        // Start timer on first letter input
        if (!timerStarted && word.length === 1 && guess.length === 0) {
            startTimer?.();
        }

        setGuess(word);
        if (onGuessChange) {
            onGuessChange(word);
        }
    }, [onGuessChange, guess.length, timerStarted, startTimer]);

    const handleSubmit = useCallback(() => {
        if (guess.length !== GAME_CONFIG.WORD_LENGTH) {
            // Trigger shake animation for invalid input
            triggerShakeAnimation();
            return;
        }

        if (onGuessSubmit) {
            onGuessSubmit(guess);
        }

        // Clear inputs after successful submission
        clearInputs();
    }, [guess, onGuessSubmit]);

    const clearInputs = useCallback(() => {
        setGuess('');
        if (onGuessChange) {
            onGuessChange('');
        }
        if (wordInputRef.current) {
            wordInputRef.current.clearInputs();
        }
    }, [onGuessChange]);

    const triggerShakeAnimation = useCallback(() => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [shakeAnimation]);

    const isSubmitDisabled = guess.length !== GAME_CONFIG.WORD_LENGTH || disabled || loading;

    return (
        <View style={styles.container}>
            <View style={styles.inputSection}>
                <Text variant="body2" color="dark" align="center" style={styles.instruction}>
                    Enter a {GAME_CONFIG.WORD_LENGTH}-letter word
                </Text>

                <Animated.View
                    style={[
                        styles.inputContainer,
                        { transform: [{ translateX: shakeAnimation }] }
                    ]}
                >
                    <WordInput
                        ref={wordInputRef}
                        onWordChange={handleWordChange}
                        onSubmit={handleSubmit}
                        onFocusChange={onFocusChange}
                        onVirtualKeyPress={onVirtualKeyPress}
                        onVirtualBackspace={onVirtualBackspace}
                        onVirtualEnter={onVirtualEnter}
                        disabled={disabled}
                        autoFocus={!disabled}
                        values={guess.split('').concat(Array(GAME_CONFIG.WORD_LENGTH - guess.length).fill(''))}
                    />
                </Animated.View>

                <Button
                    mode="contained"
                    variant="primary"
                    size="small"
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                    loading={loading}
                    style={styles.submitButton}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </View>

            {/* Compact Guess History - Always Visible */}
            <View style={styles.compactHistorySection}>
                <Text variant="body2" color="textPrimary" weight="600" style={styles.historyTitle}>
                    Previous Guesses ({guessHistory.length}/{GAME_CONFIG.MAX_ATTEMPTS})
                </Text>

                {guessHistory.length === 0 ? (
                    <Text variant="caption" color="textSecondary" align="center" style={styles.emptyText}>
                        Your guesses will appear here
                    </Text>
                ) : (
                    <View style={styles.compactHistory}>
                        {guessHistory.slice(-4).map((guess, index) => (
                            <GuessHistory
                                key={`${guess.guess}-${index}`}
                                guesses={[guess]}
                                maxHeight={35}
                                showEmpty={false}
                                compact={true}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export default GameBoard;
