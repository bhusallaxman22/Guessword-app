import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MenuTemplate } from '../components/templates';
import { Leaderboard } from '../components/organisms';
import { Text, Button } from '../components/atoms';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useUserData } from '../hooks/useUserData';
import { SPACING } from '../constants';

/**
 * LeaderboardScreen page component
 * @param {Object} props - LeaderboardScreen props
 * @param {Function} props.navigation - Navigation object
 */
const LeaderboardScreen = ({ navigation }) => {
    const { userId } = useUserData();
    const {
        leaderboard,
        gameStats,
        loading,
        refreshData,
    } = useLeaderboard();

    const handleRefresh = async () => {
        await refreshData();
    };

    const handleBackToGame = () => {
        navigation.navigate('Game');
    };

    const handleMainMenu = () => {
        navigation.navigate('Menu');
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="h2" color="white" weight="700" align="center" style={styles.title}>
                🏆 Leaderboard
            </Text>
            <Text variant="body1" color="white" align="center" style={styles.subtitle}>
                Top players and your statistics
            </Text>
        </View>
    );

    const renderStats = () => {
        if (!gameStats) return null;

        return (
            <View style={styles.statsContainer}>
                <Text variant="h4" color="white" weight="600" align="center" style={styles.statsTitle}>
                    Your Statistics
                </Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text variant="h3" color="white" weight="700" align="center">
                            {gameStats.gamesPlayed}
                        </Text>
                        <Text variant="caption" color="white" align="center">
                            Games Played
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text variant="h3" color="white" weight="700" align="center">
                            {gameStats.gamesWon}
                        </Text>
                        <Text variant="caption" color="white" align="center">
                            Games Won
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text variant="h3" color="white" weight="700" align="center">
                            {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%
                        </Text>
                        <Text variant="caption" color="white" align="center">
                            Win Rate
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text variant="h3" color="white" weight="700" align="center">
                            {gameStats.currentStreak}
                        </Text>
                        <Text variant="caption" color="white" align="center">
                            Current Streak
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderContent = () => (
        <View style={styles.content}>
            {renderStats()}

            <View style={styles.leaderboardContainer}>
                <Leaderboard
                    data={leaderboard}
                    loading={loading}
                    onRefresh={handleRefresh}
                    currentUserId={userId}
                    maxEntries={10}
                />
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <View style={styles.footerButtons}>
                <Button
                    mode="outlined"
                    variant="secondary"
                    onPress={handleMainMenu}
                    style={styles.footerButton}
                >
                    Main Menu
                </Button>

                <Button
                    mode="contained"
                    variant="primary"
                    onPress={handleBackToGame}
                    style={styles.footerButton}
                >
                    Back to Game
                </Button>
            </View>
        </View>
    );

    return (
        <MenuTemplate
            header={renderHeader()}
            content={renderContent()}
            footer={renderFooter()}
        />
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        marginTop: SPACING.sm,
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.md,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        backdropFilter: 'blur(8px)',
    },
    statsTitle: {
        marginBottom: SPACING.lg,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: SPACING.md,
    },
    statItem: {
        alignItems: 'center',
        minWidth: '20%',
        paddingVertical: SPACING.sm,
    },
    leaderboardContainer: {
        flex: 1,
        marginBottom: SPACING.lg,
    },
    footer: {
        marginTop: 'auto',
    },
    footerButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    footerButton: {
        flex: 1,
    },
});

export default LeaderboardScreen;
