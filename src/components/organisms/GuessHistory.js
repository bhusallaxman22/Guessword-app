import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GuessRow } from '../molecules';
import { Text } from '../atoms';
import { SPACING } from '../../constants';

/**
 * GuessHistory organism component for displaying guess history
 * @param {Object} props - GuessHistory props
 * @param {Array} props.guesses - Array of guess objects
 * @param {number} props.maxHeight - Maximum height for scrollable area
 * @param {boolean} props.showEmpty - Whether to show empty state
 */
const GuessHistory = ({
    guesses = [],
    maxHeight = 300,
    showEmpty = true,
    compact = false,
}) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        compactContainer: {
            flex: 0,
            marginVertical: SPACING.xs,
        },
        emptyState: {
            paddingVertical: SPACING.lg,
            paddingHorizontal: SPACING.md,
            alignItems: 'center',
        },
        emptyText: {
            opacity: 0.6,
        },
        scrollContainer: {
            flexGrow: 0,
        },
        scrollContent: {
            paddingVertical: SPACING.xs,
        },
        compactGuess: {
            marginVertical: SPACING.xs / 2,
        },
    });

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text variant="body2" color="dark" align="center" style={styles.emptyText}>
                Your guesses will appear here
            </Text>
        </View>
    );

    const renderGuesses = () => {
        if (compact && guesses.length === 1) {
            // Render single guess in compact mode
            const guess = guesses[0];
            return (
                <View style={styles.compactGuess}>
                    <GuessRow
                        guess={guess.guess}
                        scores={guess.scores}
                        attempt={guess.attempt}
                        isLatest={true}
                        compact={true}
                    />
                </View>
            );
        }

        return (
            <ScrollView
                style={[styles.scrollContainer, { maxHeight }]}
                showsVerticalScrollIndicator={!compact}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={false}
            >
                {guesses.map((guess, index) => (
                    <GuessRow
                        key={`${guess.guess}-${index}`}
                        guess={guess.guess}
                        scores={guess.scores}
                        attempt={guess.attempt}
                        isLatest={index === guesses.length - 1}
                        compact={compact}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={[styles.container, compact && styles.compactContainer]}>
            {guesses.length === 0 && showEmpty ? renderEmptyState() : renderGuesses()}
        </View>
    );
};

export default GuessHistory;
