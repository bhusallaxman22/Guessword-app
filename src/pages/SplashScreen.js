import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SplashTemplate } from '../components/templates';
import { Text, Button } from '../components/atoms';
import { useUserData } from '../hooks/useUserData';
import { useThemeColors } from '../hooks/useThemeColors';
import { SPACING, FONT_SIZES, ANIMATION_DURATION } from '../constants';

/**
 * SplashScreen page component
 * @param {Object} props - SplashScreen props
 * @param {Function} props.onComplete - Callback when splash is complete
 */
const SplashScreen = ({ onComplete }) => {
    const { firstLaunch, completeFirstLaunch, loading } = useUserData();
    const THEME_COLORS = useThemeColors();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

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
            paddingVertical: SPACING.xl,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.xl + SPACING.md,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
            width: '95%',
            maxWidth: 400,
        },
        titleAccent: {
            width: 80,
            height: 3,
            backgroundColor: THEME_COLORS.secondary,
            borderRadius: 2,
            marginVertical: SPACING.sm,
            shadowColor: THEME_COLORS.secondary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 3,
        },
        title: {
            fontSize: 48,
            letterSpacing: 2,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 3, height: 3 },
            textShadowRadius: 8,
            elevation: 5,
            textTransform: 'uppercase',
            fontWeight: '900',
            paddingTop: SPACING.md,
            paddingBottom: SPACING.sm,
            paddingHorizontal: SPACING.xs,
            textAlign: 'center',
            width: '100%',
            flexShrink: 0,
            // Add multiple shadow layers for depth
            shadowColor: THEME_COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
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
        ]).start(() => {
            // Start pulse animation after entrance
            startPulseAnimation();
        });

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

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

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
                    <View style={styles.titleAccent} />
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <Text
                            variant="h1"
                            color="white"
                            align="center"
                            weight="700"
                            style={styles.title}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.8}
                        >
                            GUESSWORD
                        </Text>
                    </Animated.View>
                    <View style={styles.titleAccent} />
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


export default SplashScreen;
