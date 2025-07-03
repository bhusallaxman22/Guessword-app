import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, LetterBox } from '../atoms';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS } from '../../constants';

/**
 * GuessRow molecule component for displaying a guess with its scores
 * @param {Object} props - GuessRow props
 * @param {string} props.guess - The guessed word
 * @param {Object} props.scores - Scores object with green and yellow counts
 * @param {number} props.attempt - Attempt number
 * @param {boolean} props.isLatest - Whether this is the latest guess
 */
const GuessRow = ({
    guess,
    scores,
    attempt,
    isLatest = false,
    compact = false,
}) => {
    const letters = guess.split('');
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.xs,
            marginBottom: SPACING.xs,
            backgroundColor: THEME_COLORS.light,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: THEME_COLORS.letterBoxBorder,
        },
        compactRow: {
            paddingVertical: SPACING.xs,
            paddingHorizontal: SPACING.xs / 2,
            marginBottom: SPACING.xs / 2,
            borderRadius: BORDER_RADIUS.sm,
        },
        latestRow: {
            backgroundColor: THEME_COLORS.white,
            borderColor: THEME_COLORS.primary,
            borderWidth: 2,
            shadowColor: THEME_COLORS.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        attemptContainer: {
            minWidth: 30,
            alignItems: 'center',
        },
        compactAttempt: {
            minWidth: 20,
        },
        wordContainer: {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            gap: SPACING.sm,
            paddingHorizontal: SPACING.sm,
        },
        letterContainer: {
            // Container for individual letters
        },
        letterBox: {
            width: 50,
            height: 50,
            opacity: 0.9,
        },
        compactLetterBox: {
            width: 32,
            height: 32,
        },
        scoresContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.xs,
            minWidth: 80,
            justifyContent: 'flex-end',
        },
        compactScores: {
            gap: SPACING.xs / 2,
            minWidth: 50,
        },
    });

    return (
        <View style={[
            styles.container,
            isLatest && styles.latestRow,
            compact && styles.compactRow
        ]}>
            <View style={[styles.attemptContainer, compact && styles.compactAttempt]}>
                <Badge variant="primary" size={compact ? "tiny" : "small"}>
                    {attempt}
                </Badge>
            </View>

            <View style={styles.wordContainer}>
                {letters.map((letter, index) => (
                    <View key={index} style={styles.letterContainer}>
                        <LetterBox
                            value={letter}
                            disabled
                            style={[
                                styles.letterBox,
                                compact && styles.compactLetterBox
                            ]}
                        />
                    </View>
                ))}
            </View>

            <View style={[styles.scoresContainer, compact && styles.compactScores]}>
                <Badge variant="green" size={compact ? "tiny" : "medium"}>
                    {scores.green}
                </Badge>
                <Badge variant="yellow" size={compact ? "tiny" : "medium"}>
                    {scores.yellow}
                </Badge>
            </View>
        </View>
    );
};

export default GuessRow;
