import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SplashTemplate } from '../components/templates';
import { Text, Button } from '../components/atoms';
import { useUserData } from '../hooks/useUserData';
import { SPACING, FONT_SIZES, THEME_COLORS, ANIMATION_DURATION } from '../constants';

/**
 * SplashScreen page component
 * @param {Object} props - SplashScreen props
 * @param {Function} props.onComplete - Callback when splash is complete
 */
const SplashScreen = ({ onComplete }) => {
    const { firstLaunch, completeFirstLaunch, loading } = useUserData();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Start entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: ANIMATION_DURATION.long,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto-skip splash if not first launch
        if (!loading && !firstLaunch) {
            const timer = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [fadeAnim, scaleAnim, firstLaunch, loading, onComplete]);

    const handleStart = async () => {
        if (firstLaunch) {
            await completeFirstLaunch();
        }
        if (onComplete) {
            onComplete();
        }
    };

    if (loading) {
        return (
            <SplashTemplate>
                <View style={styles.loadingContainer}>
                    <Text variant="h2" color="white" align="center">
                        Loading...
                    </Text>
                </View>
            </SplashTemplate>
        );
    }

    return (
        <SplashTemplate>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.titleContainer}>
                    <Text variant="h1" color="white" align="center" weight="700" style={styles.title}>
                        GUESSWORD
                    </Text>
                    <Text variant="subtitle" color="white" align="center" style={styles.subtitle}>
                        Challenge your word skills!
                    </Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text variant="body1" color="white" align="center" style={styles.description}>
                        Find hidden 4-letter words in 8 tries or less.
                        Progress through levels and compete with others!
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    {firstLaunch ? (
                        <Button
                            mode="contained"
                            variant="secondary"
                            size="large"
                            onPress={handleStart}
                            style={styles.startButton}
                        >
                            Start Playing
                        </Button>
                    ) : (
                        <View style={styles.autoStartContainer}>
                            <Text variant="body2" color="white" align="center" style={styles.autoStartText}>
                                Welcome back! Starting game...
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Text variant="body2" color="white" align="center" style={styles.featureText}>
                            🎯 Multiple Levels
                        </Text>
                    </View>
                    <View style={styles.feature}>
                        <Text variant="body2" color="white" align="center" style={styles.featureText}>
                            🏆 Leaderboards
                        </Text>
                    </View>
                    <View style={styles.feature}>
                        <Text variant="body2" color="white" align="center" style={styles.featureText}>
                            📱 Offline Play
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </SplashTemplate>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    titleContainer: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        marginTop: SPACING.sm,
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    descriptionContainer: {
        marginBottom: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    description: {
        opacity: 0.9,
        lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        marginBottom: SPACING.xl,
        width: '100%',
        alignItems: 'center',
    },
    startButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.sm,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    autoStartContainer: {
        paddingVertical: SPACING.md,
    },
    autoStartText: {
        opacity: 0.8,
        fontStyle: 'italic',
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: SPACING.lg,
    },
    feature: {
        alignItems: 'center',
        flex: 1,
    },
    featureText: {
        opacity: 0.8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default SplashScreen;
