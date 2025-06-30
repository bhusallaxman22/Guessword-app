import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Badge } from '../atoms';
import { SPACING, THEME_COLORS } from '../../constants';

/**
 * ScoreDisplay molecule component for showing game scores
 * @param {Object} props - ScoreDisplay props
 * @param {number} props.green - Number of green (correct position) letters
 * @param {number} props.yellow - Number of yellow (wrong position) letters
 * @param {string} props.size - Size variant (small, medium, large)
 * @param {boolean} props.showLabels - Whether to show text labels
 */
const ScoreDisplay = ({
    green = 0,
    yellow = 0,
    size = 'medium',
    showLabels = false,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.scoreItem}>
                <Badge variant="green" size={size}>
                    {green}
                </Badge>
                {showLabels && (
                    <Text variant="caption" color="dark" style={styles.label}>
                        Correct
                    </Text>
                )}
            </View>

            <View style={styles.scoreItem}>
                <Badge variant="yellow" size={size}>
                    {yellow}
                </Badge>
                {showLabels && (
                    <Text variant="caption" color="dark" style={styles.label}>
                        Present
                    </Text>
                )}
            </View>
        </View>
    );
};

/**
 * GameStats molecule component for showing overall game statistics
 * @param {Object} props - GameStats props
 * @param {number} props.currentLevel - Current game level
 * @param {number} props.remainingAttempts - Remaining attempts
 * @param {number} props.totalAttempts - Total attempts made
 * @param {string} props.timeElapsed - Time elapsed in current game
 */
const GameStats = ({
    currentLevel = 1,
    remainingAttempts = 8,
    totalAttempts = 0,
    timeElapsed = '0:00',
}) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text variant="caption" color="dark" style={styles.statLabel}>
                    Level
                </Text>
                <Badge variant="primary" size="medium">
                    {currentLevel}
                </Badge>
            </View>

            <View style={styles.statItem}>
                <Text variant="caption" color="dark" style={styles.statLabel}>
                    Attempts Left
                </Text>
                <Badge
                    variant={remainingAttempts <= 2 ? 'danger' : remainingAttempts <= 4 ? 'warning' : 'success'}
                    size="medium"
                >
                    {remainingAttempts}
                </Badge>
            </View>

            <View style={styles.statItem}>
                <Text variant="caption" color="dark" style={styles.statLabel}>
                    Time
                </Text>
                <Text variant="body2" weight="600" color="primary">
                    {timeElapsed}
                </Text>
            </View>
        </View>
    );
};

/**
 * LevelDisplay molecule component for showing current level info
 * @param {Object} props - LevelDisplay props
 * @param {number} props.level - Current level
 * @param {string} props.title - Level title or description
 * @param {boolean} props.showProgress - Whether to show progress indicator
 * @param {number} props.totalLevels - Total number of levels
 */
const LevelDisplay = ({
    level = 1,
    title,
    showProgress = false,
    totalLevels = 5,
}) => {
    return (
        <View style={styles.levelContainer}>
            <View style={styles.levelHeader}>
                <Text variant="h4" color="primary" weight="600">
                    Level {level}
                </Text>
                {title && (
                    <Text variant="body2" color="dark" style={styles.levelTitle}>
                        {title}
                    </Text>
                )}
            </View>

            {showProgress && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(level / totalLevels) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text variant="caption" color="dark">
                        {level} / {totalLevels}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    scoreItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    label: {
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: THEME_COLORS.light,
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    statLabel: {
        textAlign: 'center',
    },
    levelContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    levelHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    levelTitle: {
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    progressContainer: {
        alignItems: 'center',
        gap: SPACING.xs,
        width: '100%',
    },
    progressBar: {
        width: '80%',
        height: 4,
        backgroundColor: THEME_COLORS.letterBoxBorder,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: THEME_COLORS.primary,
        borderRadius: 2,
    },
});

export { ScoreDisplay, GameStats, LevelDisplay };
