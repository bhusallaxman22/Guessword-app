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
}) => {
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text variant="body2" color="dark" align="center" style={styles.emptyText}>
                Your guesses will appear here
            </Text>
        </View>
    );

    const renderGuesses = () => (
        <ScrollView
            style={[styles.scrollContainer, { maxHeight }]}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
        >
            {guesses.map((guess, index) => (
                <GuessRow
                    key={`${guess.guess}-${index}`}
                    guess={guess.guess}
                    scores={guess.scores}
                    attempt={guess.attempt}
                    isLatest={index === guesses.length - 1}
                />
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            {guesses.length === 0 && showEmpty ? renderEmptyState() : renderGuesses()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default GuessHistory;
