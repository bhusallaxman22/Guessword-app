import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MenuTemplate } from '../components/templates';
import { Text, Button, Card } from '../components/atoms';
import { useUserData } from '../hooks/useUserData';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { SPACING, THEME_COLORS } from '../constants';

/**
 * MenuScreen page component - Main menu
 * @param {Object} props - MenuScreen props
 * @param {Function} props.navigation - Navigation object
 */
const MenuScreen = ({ navigation }) => {
    const { username, userId } = useUserData();
    const { gameStats } = useLeaderboard();

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
        // TODO: Implement settings screen
        console.log('Settings not implemented yet');
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="h1" color="white" weight="700" align="center" style={styles.title}>
                GUESSWORD
            </Text>
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
                size="large"
                onPress={handleStartGame}
                style={styles.menuButton}
                fullWidth
            >
                🎮 Continue Game
            </Button>

            <Button
                mode="outlined"
                variant="secondary"
                size="large"
                onPress={handleInstructions}
                style={styles.menuButton}
                fullWidth
            >
                📖 How to Play
            </Button>

            <Button
                mode="outlined"
                variant="primary"
                size="large"
                onPress={handleLeaderboard}
                style={styles.menuButton}
                fullWidth
            >
                🏆 Leaderboard
            </Button>

            <Button
                mode="text"
                variant="secondary"
                size="medium"
                onPress={handleSettings}
                style={styles.menuButton}
                fullWidth
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

const styles = StyleSheet.create({
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: SPACING.sm,
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
    menuButton: {
        marginBottom: SPACING.xs,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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

export default MenuScreen;
