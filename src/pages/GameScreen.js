import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { GameTemplate } from '../components/templates';
import { GameBoard, GuessHistory } from '../components/organisms';
import { GameStats, LevelDisplay, AlertModal, LoadingModal, VirtualKeyboard } from '../components/molecules';
import { Text, Button } from '../components/atoms';
import { useGameLogic } from '../hooks/useGameLogic';
import { useUserData } from '../hooks/useUserData';
import { SPACING, THEME_COLORS, MESSAGES, GAME_CONFIG } from '../constants';

/**
 * GameScreen page component - Main game interface
 * @param {Object} props - GameScreen props
 * @param {Function} props.navigation - Navigation object
 */
const GameScreen = ({ navigation }) => {
    const { userId, username } = useUserData();
    const {
        targetWord,
        currentLevel,
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
        initGame,
        loadGame,
        makeGuess,
        clearError,
        activateCheatMode,
        startTimer,
    } = useGameLogic();

    const [currentGuess, setCurrentGuess] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [showCheat, setShowCheat] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState('0:00');

    // Timer for elapsed time display
    useEffect(() => {
        if (timerStarted && !gameOver && startTime) {
            const interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                setTimeElapsed(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timerStarted, gameOver, startTime]);

    // Load game on component mount
    useEffect(() => {
        if (userId && username) {
            loadGame();
        }
    }, [userId, username, loadGame]);

    // Show cheat mode when activated
    useEffect(() => {
        if (cheatModeActive) {
            setShowCheat(true);
            // Auto-hide after 3 seconds
            const timer = setTimeout(() => {
                setShowCheat(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [cheatModeActive]);

    const handleGuessSubmit = useCallback(async (guess) => {
        if (!userId || !username) return;

        try {
            const result = await makeGuess(guess, userId, username);

            if (result) {
                setCurrentGuess('');

                if (result.won === true) {
                    // Game won
                    setResultData({
                        type: 'success',
                        title: '🎉 Congratulations!',
                        message: `You guessed "${targetWord}" in ${result.attempts} tries! Level ${currentLevel} completed!`,
                        actions: [
                            {
                                label: 'Next Level',
                                onPress: () => {
                                    setShowResult(false);
                                    handleNextLevel();
                                },
                                primary: true,
                                variant: 'success',
                            },
                        ],
                    });
                    setShowResult(true);
                } else if (result.won === false) {
                    // Game lost
                    setResultData({
                        type: 'error',
                        title: '😞 Game Over',
                        message: `The word was "${result.word}". Better luck next time!`,
                        actions: [
                            {
                                label: 'Try Again',
                                onPress: () => {
                                    setShowResult(false);
                                    handleRetry();
                                },
                                primary: true,
                                variant: 'primary',
                            },
                            {
                                label: 'Main Menu',
                                onPress: () => {
                                    setShowResult(false);
                                    navigation.navigate('Menu');
                                },
                                variant: 'secondary',
                            },
                        ],
                    });
                    setShowResult(true);
                }
            }
        } catch (err) {
            console.error('Error submitting guess:', err);
        }
    }, [makeGuess, userId, username, targetWord, currentLevel, navigation]);

    const handleVirtualKeyPress = useCallback((letter) => {
        // Start timer on first letter input
        if (!timerStarted && currentGuess.length === 0) {
            startTimer();
        }

        if (currentGuess.length < GAME_CONFIG.WORD_LENGTH) {
            const newGuess = currentGuess + letter;
            setCurrentGuess(newGuess);
        }
    }, [currentGuess, timerStarted, startTimer]);

    const handleVirtualBackspace = useCallback(() => {
        if (currentGuess.length > 0) {
            const newGuess = currentGuess.slice(0, -1);
            setCurrentGuess(newGuess);
        }
    }, [currentGuess]);

    const handleVirtualEnter = useCallback(() => {
        if (currentGuess.length === GAME_CONFIG.WORD_LENGTH) {
            handleGuessSubmit(currentGuess);
        }
    }, [currentGuess, handleGuessSubmit]);

    const handleNextLevel = useCallback(async () => {
        const success = await initGame(true);
        if (!success) {
            // All levels completed
            Alert.alert(
                '🏆 All Levels Completed!',
                'Congratulations! You have completed all available levels!',
                [
                    { text: 'View Leaderboard', onPress: () => navigation.navigate('Leaderboard') },
                    { text: 'Play Again', onPress: () => initGame(false) },
                ]
            );
        }
    }, [initGame, navigation]);

    const handleRetry = useCallback(() => {
        initGame(false);
    }, [initGame]);

    const handleShowInstructions = useCallback(() => {
        // Check for cheat code
        if (currentGuess.toUpperCase() === GAME_CONFIG.CHEAT_CODE) {
            activateCheatMode();
            navigation.navigate('Instructions', {
                cheatModeActive: true,
                targetWord: targetWord,
            });
        } else {
            navigation.navigate('Instructions');
        }
    }, [currentGuess, activateCheatMode, navigation, targetWord]);

    const handleShowLeaderboard = useCallback(() => {
        navigation.navigate('Leaderboard');
    }, [navigation]);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.titleRow}>
                <Text variant="h2" color="white" weight="700" align="center" style={styles.title}>
                    GUESSWORD
                </Text>
                <Button
                    mode="outlined"
                    variant="secondary"
                    size="small"
                    onPress={handleShowInstructions}
                    style={styles.helpButton}
                >
                    How to Play
                </Button>
            </View>

            <LevelDisplay
                level={currentLevel}
                showProgress={true}
                totalLevels={5}
            />

            <GameStats
                currentLevel={currentLevel}
                remainingAttempts={remainingAttempts}
                timeElapsed={timeElapsed}
            />
        </View>
    );

    const renderGameArea = () => (
        <View style={styles.gameArea}>
            {showCheat && cheatModeActive && (
                <View style={styles.cheatBox}>
                    <Text variant="body2" color="danger" weight="600" align="center">
                        🔍 Cheat Mode: {targetWord}
                    </Text>
                </View>
            )}

            <GameBoard
                onGuessSubmit={handleGuessSubmit}
                disabled={gameOver || loading}
                loading={loading}
                currentGuess={currentGuess}
                onGuessChange={setCurrentGuess}
                onFocusChange={setIsInputFocused}
                letterStates={letterStates}
                guessHistory={guessHistory}
                onVirtualKeyPress={handleVirtualKeyPress}
                onVirtualBackspace={handleVirtualBackspace}
                onVirtualEnter={handleVirtualEnter}
                startTimer={startTimer}
                timerStarted={timerStarted}
            />
        </View>
    );

    const renderSidebar = () => (
        <View style={styles.sidebar}>
            {/* Sidebar content if needed */}
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <View style={styles.footerButtons}>
                <Button
                    mode="outlined"
                    variant="primary"
                    onPress={handleShowLeaderboard}
                    style={styles.footerButton}
                >
                    Leaderboard
                </Button>

                {gameOver && (
                    <Button
                        mode="contained"
                        variant={gameWon ? 'success' : 'primary'}
                        onPress={gameWon ? handleNextLevel : handleRetry}
                        style={styles.footerButton}
                    >
                        {gameWon ? 'Next Level' : 'Try Again'}
                    </Button>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.screenContainer}>
            <GameTemplate
                header={renderHeader()}
                gameArea={renderGameArea()}
                sidebar={renderSidebar()}
                footer={renderFooter()}
                keyboardVisible={isInputFocused}
            >
                {/* Loading Modal */}
                <LoadingModal
                    visible={loading}
                    message="Loading game..."
                />

                {/* Result Modal */}
                {resultData && (
                    <AlertModal
                        visible={showResult}
                        onDismiss={() => setShowResult(false)}
                        title={resultData.title}
                        message={resultData.message}
                        type={resultData.type}
                        actions={resultData.actions}
                    />
                )}

                {/* Error Modal */}
                {error && (
                    <AlertModal
                        visible={!!error}
                        onDismiss={clearError}
                        title="Error"
                        message={error}
                        type="error"
                    />
                )}
            </GameTemplate>

            {/* Virtual Keyboard - positioned absolutely at bottom of screen */}
            <VirtualKeyboard
                onLetterPress={handleVirtualKeyPress}
                onBackspace={handleVirtualBackspace}
                onEnter={handleVirtualEnter}
                letterStates={letterStates}
                disabled={gameOver || loading}
                visible={isInputFocused}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        position: 'relative',
    },
    header: {
        marginBottom: SPACING.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        flex: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    helpButton: {
        marginLeft: SPACING.md,
    },
    gameArea: {
        marginBottom: SPACING.lg,
    },
    cheatBox: {
        backgroundColor: THEME_COLORS.warning,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: THEME_COLORS.danger,
    },
    sidebar: {
        marginBottom: SPACING.lg,
    },
    footer: {
        marginTop: 'auto',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: SPACING.md,
    },
    footerButton: {
        flex: 1,
    },
});

export default GameScreen;
