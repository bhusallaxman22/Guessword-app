import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MenuTemplate } from '../components/templates';
import { Text, Button, Card } from '../components/atoms';
import { useUserData } from '../hooks/useUserData';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useThemeColors } from '../hooks/useThemeColors';
import { SPACING } from '../constants';

/**
 * MenuScreen page component - Main menu
 * @param {Object} props - MenuScreen props
 * @param {Function} props.navigation - Navigation object
 */
const MenuScreen = ({ navigation }) => {
    const { username, userId } = useUserData();
    const { gameStats } = useLeaderboard();
    const THEME_COLORS = useThemeColors();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const styles = StyleSheet.create({
        header: {
            marginBottom: SPACING.xl,
            alignItems: 'center',
            paddingVertical: SPACING.xl,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.xl + SPACING.md,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
            width: '95%',
            maxWidth: 400,
        },
        titleAccent: {
            width: 80,
            height: 3,
            backgroundColor: THEME_COLORS.secondary,
            borderRadius: 2,
            marginVertical: SPACING.sm,
            shadowColor: THEME_COLORS.secondary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 3,
        },
        title: {
            fontSize: 48,
            letterSpacing: 2,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 3, height: 3 },
            textShadowRadius: 8,
            marginBottom: SPACING.sm,
            elevation: 5,
            textTransform: 'uppercase',
            fontWeight: '900',
            paddingTop: SPACING.md,
            paddingBottom: SPACING.sm,
            paddingHorizontal: SPACING.xs,
            textAlign: 'center',
            width: '100%',
            flexShrink: 0,
            // Add multiple shadow layers for depth
            shadowColor: THEME_COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        subtitle: {
            opacity: 0.9,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        content: {
            flex: 1,
            gap: SPACING.lg,
        },
        statsCard: {
            marginBottom: SPACING.md,
        },
        statsTitle: {
            marginBottom: SPACING.lg,
        },
        statsText: {
            marginTop: SPACING.sm,
            opacity: 0.8,
        },
        statsGrid: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: SPACING.md,
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        menuButtons: {
            gap: SPACING.md,
        },
        playButton: {
            marginBottom: SPACING.sm,
            elevation: 4,
            shadowColor: THEME_COLORS.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            borderRadius: 16,
        },
        secondaryButtons: {
            flexDirection: 'row',
            gap: SPACING.sm,
            justifyContent: 'space-between',
        },
        secondaryButton: {
            flex: 1,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderRadius: 12,
        },
        settingsButton: {
            marginTop: SPACING.xs,
            alignSelf: 'center',
        },
        featuresCard: {
            marginTop: SPACING.md,
        },
        featuresTitle: {
            marginBottom: SPACING.lg,
        },
        featuresList: {
            gap: SPACING.md,
        },
        featureItem: {
            paddingLeft: SPACING.sm,
        },
    });
    useEffect(() => {
        // Start subtle pulse animation for title
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleStartGame = () => {
        navigation.navigate('Game');
    };

    const handleInstructions = () => {
        navigation.navigate('Instructions');
    };

    const handleLeaderboard = () => {
        navigation.navigate('Leaderboard');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleScribble = () => {
        navigation.navigate('Scribble');
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.titleAccent} />
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text
                    variant="h1"
                    color="white"
                    weight="700"
                    align="center"
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                >
                    GUESSWORD
                </Text>
            </Animated.View>
            <View style={styles.titleAccent} />
            <Text variant="subtitle" color="white" align="center" style={styles.subtitle}>
                Welcome back, {username}!
            </Text>
        </View>
    );

    const renderStats = () => {
        if (!gameStats || gameStats.gamesPlayed === 0) {
            return (
                <Card variant="elevated" padding="large" style={styles.statsCard}>
                    <Text variant="h4" color="primary" weight="600" align="center">
                        🎮 Ready to Start?
                    </Text>
                    <Text variant="body1" color="dark" align="center" style={styles.statsText}>
                        Play your first game and start building your statistics!
                    </Text>
                </Card>
            );
        }

        return (
            <Card variant="elevated" padding="large" style={styles.statsCard}>
                <Text variant="h4" color="primary" weight="600" align="center" style={styles.statsTitle}>
                    📊 Your Stats
                </Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text variant="h3" color="primary" weight="700" align="center">
                            {gameStats.gamesWon}
                        </Text>
                        <Text variant="caption" color="dark" align="center">
                            Games Won
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text variant="h3" color="primary" weight="700" align="center">
                            {gameStats.currentStreak}
                        </Text>
                        <Text variant="caption" color="dark" align="center">
                            Current Streak
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text variant="h3" color="primary" weight="700" align="center">
                            {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%
                        </Text>
                        <Text variant="caption" color="dark" align="center">
                            Win Rate
                        </Text>
                    </View>
                </View>
            </Card>
        );
    };

    const renderMenuButtons = () => (
        <View style={styles.menuButtons}>
            <Button
                mode="contained"
                variant="primary"
                size="medium"
                onPress={handleStartGame}
                style={styles.playButton}
                fullWidth
            >
                🎮 Start Game
            </Button>

            <Button
                mode="contained"
                variant="secondary"
                size="medium"
                onPress={handleScribble}
                style={styles.playButton}
                fullWidth
            >
                ✏️ Scribble Mode
            </Button>

            <View style={styles.secondaryButtons}>
                <Button
                    mode="outlined"
                    variant="secondary"
                    size="small"
                    onPress={handleInstructions}
                    style={styles.secondaryButton}
                >
                    📖 How to Play
                </Button>

                <Button
                    mode="outlined"
                    variant="primary"
                    size="small"
                    onPress={handleLeaderboard}
                    style={styles.secondaryButton}
                >
                    🏆 Leaderboard
                </Button>
            </View>

            <Button
                mode="outlined"
                variant="danger"
                size="small"
                onPress={handleSettings}
                style={styles.settingsButton}
            >
                ⚙️ Settings
            </Button>
        </View>
    );

    const renderGameFeatures = () => (
        <Card variant="outlined" padding="large" style={styles.featuresCard}>
            <Text variant="h4" color="primary" weight="600" align="center" style={styles.featuresTitle}>
                🌟 Game Features
            </Text>

            <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                    <Text variant="body2" color="dark">
                        🎯 <Text weight="600">Multiple Levels:</Text> Progress through challenging word puzzles
                    </Text>
                </View>

                <View style={styles.featureItem}>
                    <Text variant="body2" color="dark">
                        🏆 <Text weight="600">Leaderboards:</Text> Compete with other players worldwide
                    </Text>
                </View>

                <View style={styles.featureItem}>
                    <Text variant="body2" color="dark">
                        📱 <Text weight="600">Offline Play:</Text> Play anytime, even without internet
                    </Text>
                </View>

                <View style={styles.featureItem}>
                    <Text variant="body2" color="dark">
                        📊 <Text weight="600">Statistics:</Text> Track your progress and improvement
                    </Text>
                </View>
            </View>
        </Card>
    );

    const renderContent = () => (
        <View style={styles.content}>
            {renderStats()}
            {renderMenuButtons()}
            {renderGameFeatures()}
        </View>
    );

    return (
        <MenuTemplate
            header={renderHeader()}
            content={renderContent()}
            centered={false}
        />
    );
};

export default MenuScreen;
