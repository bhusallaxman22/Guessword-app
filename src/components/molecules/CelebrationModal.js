import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { Text, Button, Card } from '../atoms';
import { SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * CelebrationModal component with confetti animation for game wins
 * @param {Object} props - CelebrationModal props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Function} props.onDismiss - Callback when modal is dismissed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {Array} props.actions - Array of action buttons
 * @param {number} props.level - Current level for display
 * @param {string} props.word - The guessed word
 * @param {number} props.attempts - Number of attempts taken
 */
const CelebrationModal = ({
    visible = false,
    onDismiss,
    title = "🎉 Congratulations!",
    message,
    actions = [],
    level = 1,
    word = "",
    attempts = 1,
}) => {
    const THEME_COLORS = useThemeColors();
    const confettiAnimations = useRef(Array.from({ length: 20 }, () => new Animated.Value(0))).current;
    const modalAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(0)).current;

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        confettiContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
        },
        confetti: {
            position: 'absolute',
            borderRadius: 4,
        },
        celebrationCard: {
            width: '90%',
            maxWidth: 400,
        },
        card: {
            backgroundColor: THEME_COLORS.white,
            borderRadius: BORDER_RADIUS.xl,
            elevation: 10,
            shadowColor: THEME_COLORS.primary,
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 15,
        },
        header: {
            alignItems: 'center',
            marginBottom: SPACING.lg,
        },
        trophy: {
            fontSize: 60,
            marginBottom: SPACING.sm,
        },
        title: {
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        levelBadge: {
            backgroundColor: THEME_COLORS.primary,
            borderRadius: BORDER_RADIUS.round,
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.lg,
            alignItems: 'center',
            marginBottom: SPACING.lg,
            elevation: 3,
            shadowColor: THEME_COLORS.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
        },
        wordDisplay: {
            alignItems: 'center',
            marginBottom: SPACING.lg,
            paddingVertical: SPACING.md,
            backgroundColor: THEME_COLORS.light,
            borderRadius: BORDER_RADIUS.md,
        },
        word: {
            letterSpacing: 3,
            marginTop: SPACING.xs,
        },
        stats: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.lg,
            backgroundColor: THEME_COLORS.backgroundSolid,
            borderRadius: BORDER_RADIUS.md,
            paddingVertical: SPACING.md,
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statDivider: {
            width: 1,
            height: 40,
            backgroundColor: THEME_COLORS.border,
            marginHorizontal: SPACING.md,
        },
        message: {
            marginBottom: SPACING.lg,
            lineHeight: 22,
        },
        actions: {
            flexDirection: 'row',
            gap: SPACING.md,
        },
        actionButton: {
            flex: 1,
            elevation: 2,
        },
        primaryButton: {
            elevation: 4,
            shadowColor: THEME_COLORS.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
    });

    useEffect(() => {
        if (visible) {
            // Start modal entrance animation
            Animated.parallel([
                Animated.timing(modalAnimation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnimation, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            // Start confetti animation
            startConfettiAnimation();
        } else {
            // Reset animations
            modalAnimation.setValue(0);
            scaleAnimation.setValue(0);
            confettiAnimations.forEach(anim => anim.setValue(0));
        }
    }, [visible]);

    const startConfettiAnimation = () => {
        const animations = confettiAnimations.map((animation, index) => {
            return Animated.timing(animation, {
                toValue: 1,
                duration: 2000 + Math.random() * 1000,
                delay: Math.random() * 500,
                useNativeDriver: true,
            });
        });

        Animated.stagger(100, animations).start(() => {
            // Loop the confetti animation
            if (visible) {
                confettiAnimations.forEach(anim => anim.setValue(0));
                setTimeout(startConfettiAnimation, 1000);
            }
        });
    };

    const renderConfetti = () => {
        const colors = [
            THEME_COLORS.primary,
            THEME_COLORS.secondary,
            THEME_COLORS.success,
            THEME_COLORS.warning,
            THEME_COLORS.accent,
            THEME_COLORS.muted,
        ];

        return confettiAnimations.map((animation, index) => {
            const randomColor = colors[index % colors.length];
            const randomX = Math.random() * screenWidth;
            const randomRotation = Math.random() * 360;
            const randomSize = 6 + Math.random() * 8;

            const translateY = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, screenHeight + 50],
            });

            const rotate = animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', `${randomRotation * 4}deg`],
            });

            const opacity = animation.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
            });

            return (
                <Animated.View
                    key={index}
                    style={[
                        styles.confetti,
                        {
                            left: randomX,
                            width: randomSize,
                            height: randomSize,
                            backgroundColor: randomColor,
                            transform: [
                                { translateY },
                                { rotate },
                            ],
                            opacity,
                        },
                    ]}
                />
            );
        });
    };

    const modalOpacity = modalAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const modalScale = scaleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                {/* Confetti Background */}
                <View style={styles.confettiContainer}>
                    {renderConfetti()}
                </View>

                {/* Celebration Modal */}
                <Animated.View
                    style={[
                        styles.celebrationCard,
                        {
                            opacity: modalOpacity,
                            transform: [{ scale: modalScale }],
                        },
                    ]}
                >
                    <Card variant="elevated" padding="large" style={styles.card}>
                        {/* Trophy and Title */}
                        <View style={styles.header}>
                            <Text style={styles.trophy}>🏆</Text>
                            <Text variant="h3" color="primary" weight="700" align="center" style={styles.title}>
                                {title}
                            </Text>
                        </View>

                        {/* Level Badge */}
                        <View style={styles.levelBadge}>
                            <Text variant="h4" color="white" weight="600">
                                Level {level} Complete!
                            </Text>
                        </View>

                        {/* Word Display */}
                        <View style={styles.wordDisplay}>
                            <Text variant="body1" color="textSecondary" align="center">
                                The word was:
                            </Text>
                            <Text variant="h2" color="primary" weight="700" align="center" style={styles.word}>
                                {word.toUpperCase()}
                            </Text>
                        </View>

                        {/* Stats */}
                        <View style={styles.stats}>
                            <View style={styles.statItem}>
                                <Text variant="h3" color="success" weight="600">
                                    {attempts}
                                </Text>
                                <Text variant="caption" color="textSecondary">
                                    Attempts
                                </Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text variant="h3" color="accent" weight="600">
                                    {Math.max(1, 9 - attempts)}
                                </Text>
                                <Text variant="caption" color="textSecondary">
                                    Score
                                </Text>
                            </View>
                        </View>

                        {/* Message */}
                        {message && (
                            <Text variant="body1" color="textPrimary" align="center" style={styles.message}>
                                {message}
                            </Text>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            {actions.map((action, index) => (
                                <Button
                                    key={index}
                                    mode={index === 0 ? "contained" : "outlined"}
                                    variant={index === 0 ? "primary" : "secondary"}
                                    size="medium"
                                    onPress={action.onPress}
                                    style={[styles.actionButton, index === 0 && styles.primaryButton]}
                                    fullWidth={actions.length === 1}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </View>
                    </Card>
                </Animated.View>
            </Modal>
        </Portal>
    );
};

export default CelebrationModal;
