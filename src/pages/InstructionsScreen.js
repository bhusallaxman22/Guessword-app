import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MenuTemplate } from '../components/templates';
import { Card, Text, Button } from '../components/atoms';
import { ScoreDisplay } from '../components/molecules';
import { useThemeColors } from '../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS, GAME_CONFIG } from '../constants';

/**
 * InstructionsScreen page component
 * @param {Object} props - InstructionsScreen props
 * @param {Function} props.navigation - Navigation object
 * @param {Object} props.route - Route params
 */
const InstructionsScreen = ({ navigation, route }) => {
    const { cheatModeActive, targetWord } = route.params || {};
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            marginBottom: SPACING.xl,
        },
        title: {
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        subtitle: {
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
            marginTop: SPACING.sm,
        },
        cheatBox: {
            backgroundColor: THEME_COLORS.warning,
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            marginTop: SPACING.md,
            borderWidth: 2,
            borderColor: THEME_COLORS.danger,
        },
        contentContainer: {
            paddingBottom: SPACING.xl,
        },
        instructionCard: {
            marginBottom: SPACING.lg,
        },
        sectionTitle: {
            marginBottom: SPACING.md,
        },
        instruction: {
            marginBottom: SPACING.sm,
        },
        exampleContainer: {
            marginVertical: SPACING.md,
        },
        exampleTitle: {
            marginBottom: SPACING.sm,
        },
        exampleRow: {
            marginBottom: SPACING.md,
        },
        scoreDetails: {
            marginTop: SPACING.md,
        },
        scoreDetail: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.md,
        },
        scoreIcon: {
            marginRight: SPACING.md,
            minWidth: 30,
            alignItems: 'center',
        },
        scoreText: {
            flex: 1,
        },
        difficultySection: {
            marginTop: SPACING.lg,
        },
        difficultyItem: {
            marginBottom: SPACING.md,
        },
        difficultyTitle: {
            marginBottom: SPACING.xs,
        },
        footer: {
            marginTop: SPACING.xl,
        },
        greenDot: {
            color: THEME_COLORS.scoreGreen,
        },
        yellowDot: {
            color: THEME_COLORS.scoreYellow,
        },
    });

    const handleBackToGame = () => {
        navigation.goBack();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="h2" color="white" weight="700" align="center" style={styles.title}>
                How to Play
            </Text>
            <Text variant="body1" color="white" align="center" style={styles.subtitle}>
                Learn the rules and start winning!
            </Text>
            {cheatModeActive && targetWord && (
                <View style={styles.cheatBox}>
                    <Text variant="body1" color="danger" weight="600" align="center">
                        🔍 Cheat Mode Active: The answer is "{targetWord}"
                    </Text>
                </View>
            )}
        </View>
    );

    const renderBasicRules = () => (
        <Card variant="elevated" padding="large" style={styles.instructionCard}>
            <Text variant="h3" color="primary" weight="600" style={styles.sectionTitle}>
                🎯 Basic Rules
            </Text>

            <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                    <Text variant="body1" color="dark">
                        • Find the hidden <Text weight="600">{GAME_CONFIG.WORD_LENGTH}-letter word</Text> in{' '}
                        <Text weight="600">{GAME_CONFIG.MAX_ATTEMPTS} tries</Text> or less
                    </Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text variant="body1" color="dark">
                        • Each guess must be a valid {GAME_CONFIG.WORD_LENGTH}-letter word
                    </Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text variant="body1" color="dark">
                        • After each guess, you'll see scores showing how close you are
                    </Text>
                </View>

                <View style={styles.ruleItem}>
                    <Text variant="body1" color="dark">
                        • Complete levels to progress and compete on the leaderboard
                    </Text>
                </View>
            </View>
        </Card>
    );

    const renderScoring = () => (
        <Card variant="elevated" padding="large" style={styles.instructionCard}>
            <Text variant="h3" color="primary" weight="600" style={styles.sectionTitle}>
                📊 Scoring System
            </Text>

            <View style={styles.scoringExplanation}>
                <Text variant="body1" color="dark" style={styles.scoringText}>
                    After each guess, you'll see two numbers:
                </Text>

                <View style={styles.scoreExample}>
                    <ScoreDisplay green={2} yellow={1} size="large" showLabels={true} />
                </View>

                <View style={styles.scoreDetails}>
                    <View style={styles.scoreDetail}>
                        <View style={styles.scoreIcon}>
                            <Text variant="h4" style={styles.greenDot}>●</Text>
                        </View>
                        <View style={styles.scoreText}>
                            <Text variant="body2" weight="600" color="dark">Green (Correct)</Text>
                            <Text variant="body2" color="dark">
                                Number of letters in the correct position
                            </Text>
                        </View>
                    </View>

                    <View style={styles.scoreDetail}>
                        <View style={styles.scoreIcon}>
                            <Text variant="h4" style={styles.yellowDot}>●</Text>
                        </View>
                        <View style={styles.scoreText}>
                            <Text variant="body2" weight="600" color="dark">Yellow (Present)</Text>
                            <Text variant="body2" color="dark">
                                Number of letters in the word but wrong position
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );

    const renderExamples = () => (
        <Card variant="elevated" padding="large" style={styles.instructionCard}>
            <Text variant="h3" color="primary" weight="600" style={styles.sectionTitle}>
                💡 Examples
            </Text>

            <View style={styles.exampleContainer}>
                <View style={styles.example}>
                    <Text variant="body2" weight="600" color="dark" style={styles.exampleTitle}>
                        If the hidden word is "BIRD":
                    </Text>

                    <View style={styles.exampleRow}>
                        <View style={styles.exampleGuess}>
                            <Text variant="body1" weight="600" color="dark">Guess: WORD</Text>
                            <ScoreDisplay green={1} yellow={1} size="medium" />
                        </View>
                        <Text variant="body2" color="dark" style={styles.exampleExplanation}>
                            R is in correct position (green), B is present but wrong position (yellow)
                        </Text>
                    </View>

                    <View style={styles.exampleRow}>
                        <View style={styles.exampleGuess}>
                            <Text variant="body1" weight="600" color="dark">Guess: BIRD</Text>
                            <ScoreDisplay green={4} yellow={0} size="medium" />
                        </View>
                        <Text variant="body2" color="dark" style={styles.exampleExplanation}>
                            Perfect! All letters in correct positions - You win! 🎉
                        </Text>
                    </View>
                </View>
            </View>
        </Card>
    );

    const renderTips = () => (
        <Card variant="elevated" padding="large" style={styles.instructionCard}>
            <Text variant="h3" color="primary" weight="600" style={styles.sectionTitle}>
                💭 Tips & Strategies
            </Text>

            <View style={styles.tipsList}>
                <View style={styles.tip}>
                    <Text variant="body2" color="dark">
                        <Text weight="600">🔤 Start with common letters:</Text> Try words with vowels (A, E, I, O, U) and common consonants (R, S, T, L, N)
                    </Text>
                </View>

                <View style={styles.tip}>
                    <Text variant="body2" color="dark">
                        <Text weight="600">📝 Use elimination:</Text> Pay attention to which letters are not in the word
                    </Text>
                </View>

                <View style={styles.tip}>
                    <Text variant="body2" color="dark">
                        <Text weight="600">🎯 Position matters:</Text> Yellow letters are in the word but need to be moved
                    </Text>
                </View>

                <View style={styles.tip}>
                    <Text variant="body2" color="dark">
                        <Text weight="600">⏱️ Think before guessing:</Text> You only have {GAME_CONFIG.MAX_ATTEMPTS} attempts!
                    </Text>
                </View>
            </View>
        </Card>
    );

    const renderContent = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderBasicRules()}
            {renderScoring()}
            {renderExamples()}
            {renderTips()}
        </ScrollView>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <Button
                mode="contained"
                variant="primary"
                size="large"
                onPress={handleBackToGame}
                fullWidth
            >
                Start Playing!
            </Button>
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

export default InstructionsScreen;
