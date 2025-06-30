import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, LetterBox } from '../atoms';
import { SPACING, BORDER_RADIUS, THEME_COLORS } from '../../constants';

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
}) => {
    const letters = guess.split('');

    return (
        <View style={[styles.container, isLatest && styles.latestRow]}>
            <View style={styles.attemptContainer}>
                <Badge variant="primary" size="small">
                    {attempt}
                </Badge>
            </View>

            <View style={styles.wordContainer}>
                {letters.map((letter, index) => (
                    <View key={index} style={styles.letterContainer}>
                        <LetterBox
                            value={letter}
                            disabled
                            style={styles.letterBox}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.scoresContainer}>
                <Badge variant="green" size="medium">
                    {scores.green}
                </Badge>
                <Badge variant="yellow" size="medium">
                    {scores.yellow}
                </Badge>
            </View>
        </View>
    );
};

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
    wordContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        gap: SPACING.sm, // Match WordInput spacing
        paddingHorizontal: SPACING.sm,
    },
    letterContainer: {
        // Container for individual letters
    },
    letterBox: {
        width: 50, // Match the LetterBox input dimensions
        height: 50,
        opacity: 0.9,
    },
    scoresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        minWidth: 80,
        justifyContent: 'flex-end',
    },
});

export default GuessRow;
