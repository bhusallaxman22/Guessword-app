
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { Appbar, Button, Card, Text, ProgressBar, Badge, Surface } from 'react-native-paper';
import { useScribbleGame } from '../hooks/useScribbleGame';
import { BaseTemplate } from '../components/templates';
import { LetterBox } from '../components/atoms';
import { VirtualKeyboard } from '../components/molecules';
import { useThemeColors } from '../hooks/useThemeColors';
import { SPACING } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

const ScribbleScreen = ({ navigation }) => {
    const { gameState, gameActions } = useScribbleGame();
    const { currentWord, guess, pastGuesses, score, isLoading, error, isCorrect, words, currentWordIndex, attemptsLeft, gameOver } = gameState;
    const { setGuess, submitGuess, nextWord } = gameActions;
    const THEME_COLORS = useThemeColors();

    // Animation references
    const scrambleAnim = useRef(new Animated.Value(0)).current;
    const scoreAnim = useRef(new Animated.Value(1)).current;
    const correctAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // State for scrambled word animation
    const [scrambledWord, setScrambledWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per word
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [currentGuessLetters, setCurrentGuessLetters] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const letterRefs = useRef([]);

    // Initialize letter boxes when word changes
    useEffect(() => {
        if (currentWord) {
            const wordLength = currentWord.length;
            setCurrentGuessLetters(new Array(wordLength).fill(''));
            setFocusedIndex(0);
            letterRefs.current = new Array(wordLength).fill(null);
        }
    }, [currentWord]);

    // Update the guess in the game state when letters change
    useEffect(() => {
        const newGuess = currentGuessLetters.join('');
        if (newGuess !== guess) {
            setGuess(newGuess);
        }
    }, [currentGuessLetters]);

    useEffect(() => {
        if (currentWord && !isCorrect) {
            const cleanup = startScrambleAnimation();
            setTimeLeft(60);
            setIsTimerActive(true);

            return cleanup;
        }
    }, [currentWord, isCorrect]);

    useEffect(() => {
        if (isCorrect) {
            animateCorrectAnswer();
            setIsTimerActive(false);
        }
    }, [isCorrect]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
            // Auto skip to next word when time runs out
            setTimeout(() => {
                nextWord();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]); const startScrambleAnimation = () => {
        // Stop any existing animation
        scrambleAnim.stopAnimation();

        const scrambleWord = () => {
            const shuffled = currentWord.split('').sort(() => 0.5 - Math.random()).join('');
            setScrambledWord(shuffled);
        };

        // Initial scramble
        scrambleWord();

        // Start animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(scrambleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scrambleAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Update scrambled word every 2 seconds
        const scrambleInterval = setInterval(() => {
            if (!isCorrect && currentWord) {
                scrambleWord();
            } else {
                clearInterval(scrambleInterval);
            }
        }, 2000);

        // Cleanup function
        return () => clearInterval(scrambleInterval);
    };

    const animateCorrectAnswer = () => {
        Animated.sequence([
            Animated.timing(correctAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scoreAnim, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scoreAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateWrongAnswer = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSubmitGuess = () => {
        if (guess.toLowerCase() === currentWord.toLowerCase()) {
            submitGuess();
        } else {
            animateWrongAnswer();
            // Add wrong guess to past guesses
            submitGuess();
            // Clear input boxes after wrong guess
            setTimeout(() => {
                setCurrentGuessLetters(new Array(currentWord.length).fill(''));
                setFocusedIndex(0);
            }, 500); // Small delay to show the shake animation
        }
    };

    const handleNextWord = () => {
        // Stop current animations
        scrambleAnim.stopAnimation();

        // Reset states first
        setScrambledWord('');
        setCurrentGuessLetters([]);
        setFocusedIndex(0);
        correctAnim.setValue(0);
        scrambleAnim.setValue(0);

        // Move to next word
        nextWord();
    };

    const handleLetterChange = (index, letter) => {
        const newLetters = [...currentGuessLetters];
        newLetters[index] = letter.toUpperCase();
        setCurrentGuessLetters(newLetters);

        // Move to next box if letter was entered
        if (letter && index < currentWord.length - 1) {
            setFocusedIndex(index + 1);
            setTimeout(() => {
                letterRefs.current[index + 1]?.focus();
            }, 50);
        }
    };

    const handleKeyPress = (index, { nativeEvent }) => {
        if (nativeEvent.key === 'Backspace') {
            const newLetters = [...currentGuessLetters];
            if (newLetters[index] === '' && index > 0) {
                // If current box is empty, move to previous box and clear it
                setFocusedIndex(index - 1);
                newLetters[index - 1] = '';
                setCurrentGuessLetters(newLetters);
                setTimeout(() => {
                    letterRefs.current[index - 1]?.focus();
                }, 50);
            } else {
                // Clear current box
                newLetters[index] = '';
                setCurrentGuessLetters(newLetters);
            }
        }
    };

    const handleLetterFocus = (index) => {
        setFocusedIndex(index);
    };

    const handleVirtualKeyPress = (key) => {
        if (key === 'BACKSPACE') {
            handleVirtualBackspace();
        } else if (key === 'ENTER') {
            handleSubmitGuess();
        } else {
            handleVirtualLetterPress(key);
        }
    };

    const handleVirtualLetterPress = (letter) => {
        const currentIndex = focusedIndex;
        if (currentIndex < currentWord.length) {
            handleLetterChange(currentIndex, letter);
        }
    };

    const handleVirtualBackspace = () => {
        const currentIndex = focusedIndex;
        const newLetters = [...currentGuessLetters];

        if (newLetters[currentIndex] === '' && currentIndex > 0) {
            // If current box is empty, move to previous box and clear it
            setFocusedIndex(currentIndex - 1);
            newLetters[currentIndex - 1] = '';
            setCurrentGuessLetters(newLetters);
        } else {
            // Clear current box
            newLetters[currentIndex] = '';
            setCurrentGuessLetters(newLetters);
        }
    };

    const getLetterStates = () => {
        const letterStates = {};

        // Mark letters from past guesses
        pastGuesses.forEach(guess => {
            guess.split('').forEach((letter, index) => {
                const currentWordLetters = currentWord.split('');
                if (currentWordLetters[index] === letter) {
                    letterStates[letter] = 'correct';
                } else if (currentWordLetters.includes(letter)) {
                    if (letterStates[letter] !== 'correct') {
                        letterStates[letter] = 'present';
                    }
                } else {
                    if (!letterStates[letter]) {
                        letterStates[letter] = 'absent';
                    }
                }
            });
        });

        return letterStates;
    };

    const getTimerColor = () => {
        if (timeLeft > 40) return THEME_COLORS.success;
        if (timeLeft > 20) return THEME_COLORS.warning;
        return THEME_COLORS.danger;
    };

    const renderLoadingState = () => (
        <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>🎮 Loading Scribble Words...</Text>
            <ProgressBar indeterminate color={THEME_COLORS.primary} style={styles.progressBar} />
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>😞 Oops! Something went wrong</Text>
            <Button mode="contained" onPress={() => navigation.goBack()}>
                Go Back
            </Button>
        </View>
    );

    const renderGameHeader = () => (
        <Surface style={styles.headerSurface}>
            <View style={styles.headerContent}>
                <View style={styles.scoreContainer}>
                    <Animated.View style={{ transform: [{ scale: scoreAnim }] }}>
                        <Badge size={40} style={[styles.scoreBadge, { backgroundColor: THEME_COLORS.primary }]}>
                            {score}
                        </Badge>
                    </Animated.View>
                    <Text style={styles.scoreLabel}>Score</Text>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Word {currentWordIndex + 1} of {words.length}
                    </Text>
                    <ProgressBar
                        progress={(currentWordIndex + 1) / words.length}
                        color={THEME_COLORS.primary}
                        style={styles.wordProgress}
                    />
                </View>

                <View style={styles.attemptsContainer}>
                    <Text style={[styles.attemptsText, { color: attemptsLeft <= 1 ? THEME_COLORS.danger : THEME_COLORS.success }]}>
                        {attemptsLeft} left
                    </Text>
                    <View style={styles.attemptsIndicator}>
                        {[...Array(3)].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.attemptDot,
                                    {
                                        backgroundColor: index < attemptsLeft
                                            ? (attemptsLeft <= 1 ? THEME_COLORS.danger : THEME_COLORS.success)
                                            : THEME_COLORS.light
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.timerContainer}>
                    <Text style={[styles.timerText, { color: getTimerColor() }]}>
                        {timeLeft}s
                    </Text>
                    <ProgressBar
                        progress={timeLeft / 60}
                        color={getTimerColor()}
                        style={styles.timerProgress}
                    />
                </View>
            </View>
        </Surface>
    );

    const renderScrambledWord = () => (
        <Card style={styles.wordCard}>
            <Card.Content>
                <Text style={styles.wordPrompt}>Unscramble this word:</Text>
                <Animated.View
                    style={[
                        styles.scrambledWordContainer,
                        {
                            transform: [
                                {
                                    rotateZ: scrambleAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '2deg']
                                    })
                                },
                                { translateX: shakeAnim }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.scrambledWord}>
                        {isCorrect ? currentWord : (scrambledWord || currentWord)}
                    </Text>
                </Animated.View>

                {isCorrect && (
                    <Animated.View
                        style={[
                            styles.correctIndicator,
                            {
                                opacity: correctAnim,
                                transform: [{
                                    scale: correctAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1]
                                    })
                                }]
                            }
                        ]}
                    >
                        <Text style={styles.correctText}>🎉 Correct!</Text>
                    </Animated.View>
                )}

                {gameOver && !isCorrect && (
                    <View style={styles.gameOverIndicator}>
                        <Text style={styles.gameOverText}>😔 Out of attempts!</Text>
                        <Text style={styles.correctAnswerText}>The word was: {currentWord}</Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    const renderInputSection = () => (
        <Card style={styles.inputCard}>
            <Card.Content>
                <Text style={styles.inputLabel}>Enter your guess:</Text>
                <View style={styles.letterBoxContainer}>
                    {currentGuessLetters.map((letter, index) => (
                        <LetterBox
                            key={index}
                            ref={(ref) => (letterRefs.current[index] = ref)}
                            value={letter}
                            onChangeText={() => { }} // Disable text input since we're using virtual keyboard
                            onKeyPress={() => { }} // Disable key press since we're using virtual keyboard
                            onFocus={() => handleLetterFocus(index)}
                            focused={focusedIndex === index}
                            disabled={isCorrect}
                            style={styles.letterBox}
                            showSoftInputOnFocus={false}
                            caretHidden={true}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSubmitGuess}
                        disabled={isCorrect || gameOver || attemptsLeft === 0 || currentGuessLetters.some(letter => letter === '')}
                        style={styles.submitButton}
                        icon="check"
                    >
                        Submit
                    </Button>

                    {(isCorrect || gameOver) && (
                        <Button
                            mode="contained"
                            onPress={handleNextWord}
                            style={[styles.nextButton, { backgroundColor: isCorrect ? THEME_COLORS.success : THEME_COLORS.primary }]}
                            icon="arrow-right"
                        >
                            {gameOver && !isCorrect ? 'Skip Word' : 'Next Word'}
                        </Button>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    const renderPastGuesses = () => {
        if (pastGuesses.length === 0) return null;

        return (
            <Card style={styles.pastGuessesCard}>
                <Card.Content>
                    <Text style={styles.pastGuessesTitle}>Previous Guesses:</Text>
                    <ScrollView
                        style={styles.pastGuessesScrollView}
                        contentContainerStyle={styles.pastGuessesContainer}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                    >
                        {pastGuesses.map((guessWord, index) => (
                            <View key={index} style={styles.pastGuessRow}>
                                <Badge
                                    size={20}
                                    style={[styles.attemptBadge, { backgroundColor: THEME_COLORS.secondary }]}
                                >
                                    {index + 1}
                                </Badge>
                                <View style={styles.pastGuessLetters}>
                                    {guessWord.split('').map((letter, letterIndex) => (
                                        <LetterBox
                                            key={letterIndex}
                                            value={letter}
                                            disabled
                                            error={guessWord.toLowerCase() !== currentWord.toLowerCase()}
                                            style={styles.pastGuessLetterBox}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </Card.Content>
            </Card>
        );
    };

    const renderContent = () => {
        if (isLoading) return renderLoadingState();
        if (error) return renderErrorState();

        return (
            <View style={styles.mainContainer}>
                <ScrollView
                    style={styles.gameContentScrollView}
                    contentContainerStyle={styles.gameContentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderGameHeader()}
                    {renderScrambledWord()}
                    {renderInputSection()}
                    {renderPastGuesses()}
                </ScrollView>
            </View>
        );
    };

    return (
        <BaseTemplate>
            <Appbar.Header style={{ backgroundColor: THEME_COLORS.primary }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="✏️ Scribble Mode" />
            </Appbar.Header>
            {renderContent()}
            <VirtualKeyboard
                onLetterPress={handleVirtualLetterPress}
                onBackspace={handleVirtualBackspace}
                onEnter={handleSubmitGuess}
                letterStates={getLetterStates()}
                disabled={isCorrect || gameOver || attemptsLeft === 0}
                visible={true}
                themeColors={THEME_COLORS}
            />
        </BaseTemplate>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    gameContentScrollView: {
        flex: 1,
        paddingBottom: 200, // Space for virtual keyboard
    },
    gameContentContainer: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    container: {
        flex: 1,
        padding: SPACING.md,
        paddingBottom: 200, // Add space for virtual keyboard
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        fontSize: 18,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        marginBottom: SPACING.lg,
        textAlign: 'center',
        color: '#f44336',
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
    },
    headerSurface: {
        elevation: 4,
        borderRadius: 12,
        marginBottom: SPACING.md,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    scoreContainer: {
        alignItems: 'center',
        flex: 1,
    },
    scoreBadge: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 12,
        marginTop: SPACING.xs,
        opacity: 0.7,
    },
    progressContainer: {
        flex: 2,
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
    },
    progressText: {
        fontSize: 12,
        marginBottom: SPACING.xs,
        opacity: 0.7,
    },
    wordProgress: {
        width: '100%',
        height: 6,
        borderRadius: 3,
    },
    timerContainer: {
        alignItems: 'center',
        flex: 1,
    },
    attemptsContainer: {
        alignItems: 'center',
        flex: 1,
    },
    attemptsText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    attemptsIndicator: {
        flexDirection: 'row',
        gap: 4,
        marginTop: SPACING.xs,
    },
    attemptDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerProgress: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginTop: SPACING.xs,
    },
    wordCard: {
        marginBottom: SPACING.md,
        elevation: 2,
    },
    wordPrompt: {
        fontSize: 16,
        marginBottom: SPACING.md,
        textAlign: 'center',
        opacity: 0.8,
    },
    scrambledWordContainer: {
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        borderRadius: 12,
        marginBottom: SPACING.md,
    },
    scrambledWord: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 4,
        textAlign: 'center',
        color: '#5e72e4',
    },
    correctIndicator: {
        alignItems: 'center',
        padding: SPACING.md,
    },
    correctText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2dce89',
    },
    gameOverIndicator: {
        alignItems: 'center',
        padding: SPACING.md,
    },
    gameOverText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f5365c',
        marginBottom: SPACING.xs,
    },
    correctAnswerText: {
        fontSize: 16,
        color: '#6c757d',
        fontStyle: 'italic',
    },
    inputCard: {
        marginBottom: SPACING.md,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        textAlign: 'center',
        opacity: 0.8,
    },
    letterBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
        flexWrap: 'wrap',
    },
    letterBox: {
        marginHorizontal: 2,
    },
    input: {
        marginBottom: SPACING.md,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    submitButton: {
        flex: 1,
    },
    nextButton: {
        flex: 1,
    },
    pastGuessesCard: {
        marginBottom: SPACING.md,
        elevation: 2,
    },
    pastGuessesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
    },
    pastGuessesScrollView: {
        maxHeight: 150, // Fixed height for scrollable area
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    pastGuessesContainer: {
        gap: SPACING.sm,
        paddingBottom: SPACING.sm,
        paddingTop: SPACING.xs,
    },
    pastGuessRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.xs,
    },
    attemptBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
    },
    pastGuessLetters: {
        flexDirection: 'row',
        gap: SPACING.xs,
        flex: 1,
    },
    pastGuessLetterBox: {
        width: 32,
        height: 32,
        marginHorizontal: 1,
    },
});

export default ScribbleScreen;
