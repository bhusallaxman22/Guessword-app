import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { LetterBox } from '../atoms';
import { SPACING, GAME_CONFIG } from '../../constants';

/**
 * WordInput molecule component for entering guesses
 * @param {Object} props - WordInput props
 * @param {Function} props.onWordChange - Callback when word changes
 * @param {Function} props.onSubmit - Callback when word is submitted
 * @param {Function} props.onFocusChange - Callback when focus changes
 * @param {Function} props.onVirtualKeyPress - Callback for virtual key press
 * @param {Function} props.onVirtualBackspace - Callback for virtual backspace
 * @param {Function} props.onVirtualEnter - Callback for virtual enter
 * @param {boolean} props.disabled - Whether inputs are disabled
 * @param {boolean} props.autoFocus - Whether to auto-focus first input
 * @param {Array} props.values - Array of letter values
 */
const WordInput = forwardRef(({
    onWordChange,
    onSubmit,
    onFocusChange,
    onVirtualKeyPress,
    onVirtualBackspace,
    onVirtualEnter,
    disabled = false,
    autoFocus = true,
    values = ['', '', '', ''],
}, ref) => {
    const [letters, setLetters] = useState(values);
    const [focusedIndex, setFocusedIndex] = useState(autoFocus ? 0 : -1);
    const [isComponentFocused, setIsComponentFocused] = useState(false);
    const inputRefs = useRef([]);
    const blurTimeoutRef = useRef(null);

    // Initialize refs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, GAME_CONFIG.WORD_LENGTH);
    }, []);

    // Auto-focus first input on mount
    useEffect(() => {
        if (autoFocus && inputRefs.current[0] && !disabled) {
            setTimeout(() => {
                inputRefs.current[0].focus();
            }, 100);
        }
    }, [autoFocus, disabled]);

    // Update letters when values prop changes
    useEffect(() => {
        if (values.join('') !== letters.join('')) {
            setLetters(values);
        }
    }, [values]);

    // Handle virtual keyboard input
    useEffect(() => {
        if (isComponentFocused && onVirtualKeyPress) {
            // Set up virtual keyboard handlers only when this component is focused
            const currentWordInputRef = ref;

            // Store the handlers on the parent ref for access from GameScreen
            if (currentWordInputRef && typeof currentWordInputRef === 'object') {
                currentWordInputRef.current = {
                    ...currentWordInputRef.current,
                    handleVirtualKey: (letter) => {
                        if (focusedIndex >= 0 && focusedIndex < GAME_CONFIG.WORD_LENGTH) {
                            handleLetterChange(focusedIndex, letter);
                        }
                    },
                    handleVirtualBackspace: () => {
                        if (focusedIndex >= 0) {
                            if (letters[focusedIndex]) {
                                handleLetterChange(focusedIndex, '');
                            } else if (focusedIndex > 0) {
                                const prevIndex = focusedIndex - 1;
                                setTimeout(() => {
                                    inputRefs.current[prevIndex]?.focus();
                                    setFocusedIndex(prevIndex);
                                    handleLetterChange(prevIndex, '');
                                }, 10);
                            }
                        }
                    },
                    handleVirtualEnter: () => {
                        const word = letters.join('');
                        if (word.length === GAME_CONFIG.WORD_LENGTH && onSubmit) {
                            onSubmit(word);
                        }
                    },
                };
            }
        }
    }, [isComponentFocused, focusedIndex, letters, onSubmit]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const handleLetterChange = (index, letter) => {
        // Only allow single character input
        const upperLetter = letter.slice(-1).toUpperCase();
        const newLetters = [...letters];
        newLetters[index] = upperLetter;
        setLetters(newLetters);

        // Notify parent of word change
        if (onWordChange) {
            onWordChange(newLetters.join(''));
        }

        // Auto-advance to next input if letter is entered and not at the last input
        if (upperLetter && index < GAME_CONFIG.WORD_LENGTH - 1) {
            // Small delay to ensure the change is processed first
            setTimeout(() => {
                const nextInput = inputRefs.current[index + 1];
                if (nextInput) {
                    nextInput.focus();
                    setFocusedIndex(index + 1);
                }
            }, 10);
        }
    };

    const handleKeyPress = (index, event) => {
        const { key } = event.nativeEvent;

        // Handle backspace
        if (key === 'Backspace') {
            if (!letters[index] && index > 0) {
                // If current box is empty, move to previous box
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                }, 50);
            }
        }

        // Handle Enter key for submission
        if (key === 'Enter' && onSubmit) {
            const word = letters.join('');
            if (word.length === GAME_CONFIG.WORD_LENGTH) {
                onSubmit(word);
            }
        }
    };

    const handleFocus = (index) => {
        // Clear any pending blur timeout
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }

        setFocusedIndex(index);

        // Only notify parent if component wasn't already focused
        if (!isComponentFocused) {
            setIsComponentFocused(true);
            if (onFocusChange) {
                onFocusChange(true);
            }
        }
    };

    const handleBlur = (index) => {
        // Delay blur handling to check if focus is moving to another input in this component
        blurTimeoutRef.current = setTimeout(() => {
            // Simple approach: check if any input in this component has the focused state
            const hasAnyFocus = focusedIndex >= 0;

            if (!hasAnyFocus) {
                setFocusedIndex(-1);
                setIsComponentFocused(false);
                if (onFocusChange) {
                    onFocusChange(false);
                }
            }
        }, 150); // Increased delay for better reliability
    };

    const clearInputs = () => {
        const emptyLetters = new Array(GAME_CONFIG.WORD_LENGTH).fill('');
        setLetters(emptyLetters);
        if (onWordChange) {
            onWordChange('');
        }
        // Focus first input after clearing
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 50);
    };

    // Expose clearInputs method to parent
    useImperativeHandle(ref, () => ({
        clearInputs,
        focusFirst: () => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
                setFocusedIndex(0);
                setIsComponentFocused(true);
                if (onFocusChange) {
                    onFocusChange(true);
                }
            }
        },
        focusIndex: (index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].focus();
                setFocusedIndex(index);
            }
        },
        insertLetter: (letter) => {
            if (focusedIndex >= 0 && focusedIndex < GAME_CONFIG.WORD_LENGTH) {
                handleLetterChange(focusedIndex, letter);
            }
        },
        backspace: () => {
            if (focusedIndex >= 0) {
                if (letters[focusedIndex]) {
                    // Clear current letter
                    handleLetterChange(focusedIndex, '');
                } else if (focusedIndex > 0) {
                    // Move to previous and clear
                    const prevIndex = focusedIndex - 1;
                    setTimeout(() => {
                        inputRefs.current[prevIndex]?.focus();
                        setFocusedIndex(prevIndex);
                        handleLetterChange(prevIndex, '');
                    }, 10);
                }
            }
        },
    }));

    return (
        <View style={styles.container}>
            {letters.map((letter, index) => (
                <LetterBox
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={letter}
                    onChangeText={(text) => handleLetterChange(index, text)}
                    onKeyPress={(event) => handleKeyPress(index, event)}
                    onFocus={() => handleFocus(index)}
                    onBlur={() => handleBlur(index)}
                    focused={focusedIndex === index}
                    disabled={disabled}
                    style={styles.letterBox}
                />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    letterBox: {
        // Additional styling if needed
    },
});

export default WordInput;
