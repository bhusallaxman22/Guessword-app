import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING } from '../../constants';

/**
 * BaseTemplate component providing the main app layout structure
 * @param {Object} props - BaseTemplate props
 * @param {ReactNode} props.children - Child components
 * @param {boolean} props.scrollable - Whether content should be scrollable
 * @param {boolean} props.gradient - Whether to show gradient background
 * @param {Object} props.style - Additional styles
 */
const BaseTemplate = ({
    children,
    scrollable = true,
    gradient = true,
    style,
}) => {
    const THEME_COLORS = useThemeColors();
    const ContentWrapper = scrollable ? ScrollView : View;
    const Background = gradient ? LinearGradient : View;

    const backgroundProps = gradient ? {
        colors: [THEME_COLORS.gradientStart, THEME_COLORS.gradientEnd],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        locations: [0.0, 1.0],
    } : {
        style: { backgroundColor: THEME_COLORS.backgroundSolid },
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Background {...backgroundProps} style={styles.background}>
                <ContentWrapper
                    style={[styles.container, style]}
                    contentContainerStyle={scrollable ? styles.scrollContent : undefined}
                    showsVerticalScrollIndicator={scrollable}
                >
                    {children}
                </ContentWrapper>
            </Background>
        </SafeAreaView>
    );
};

/**
 * GameTemplate component for game-related screens
 * @param {Object} props - GameTemplate props
 * @param {ReactNode} props.header - Header content
 * @param {ReactNode} props.gameArea - Game area content
 * @param {ReactNode} props.sidebar - Sidebar content (history, stats, etc.)
 * @param {ReactNode} props.footer - Footer content
 * @param {ReactNode} props.children - Additional children (like modals, overlays)
 * @param {boolean} props.sidebarVisible - Whether sidebar is visible
 * @param {boolean} props.keyboardVisible - Whether virtual keyboard is visible
 */
const GameTemplate = ({
    header,
    gameArea,
    sidebar,
    footer,
    children,
    sidebarVisible = true,
    keyboardVisible = false,
}) => {
    // Calculate bottom padding based on keyboard visibility
    const bottomPadding = keyboardVisible ? 200 : 0; // Approximate keyboard height

    return (
        <BaseTemplate scrollable={true} gradient={true} style={{ paddingBottom: bottomPadding }}>
            {header && (
                <View style={styles.headerSection}>
                    {header}
                </View>
            )}

            <View style={styles.mainContent}>
                <View style={styles.gameSection}>
                    {gameArea}
                </View>

                {sidebarVisible && sidebar && (
                    <View style={styles.sidebarSection}>
                        {sidebar}
                    </View>
                )}
            </View>

            {footer && (
                <View style={styles.footerSection}>
                    {footer}
                </View>
            )}

            {children}
        </BaseTemplate>
    );
};

/**
 * MenuTemplate component for menu and settings screens
 * @param {Object} props - MenuTemplate props
 * @param {ReactNode} props.header - Header content
 * @param {ReactNode} props.content - Main content
 * @param {ReactNode} props.footer - Footer content
 * @param {boolean} props.centered - Whether to center content
 */
const MenuTemplate = ({
    header,
    content,
    footer,
    centered = false,
}) => {
    return (
        <BaseTemplate scrollable={true} gradient={true}>
            {header && (
                <View style={styles.headerSection}>
                    {header}
                </View>
            )}

            <View style={[
                styles.menuContent,
                centered && styles.centeredContent,
            ]}>
                {content}
            </View>

            {footer && (
                <View style={styles.footerSection}>
                    {footer}
                </View>
            )}
        </BaseTemplate>
    );
};

/**
 * SplashTemplate component for splash screen
 * @param {Object} props - SplashTemplate props
 * @param {ReactNode} props.children - Child components
 * @param {boolean} props.fullScreen - Whether to use full screen
 */
const SplashTemplate = ({
    children,
    fullScreen = true,
}) => {
    return (
        <BaseTemplate scrollable={false} gradient={true}>
            <View style={[
                styles.splashContainer,
                fullScreen && styles.fullScreen,
            ]}>
                {children}
            </View>
        </BaseTemplate>
    );
};

export { BaseTemplate, GameTemplate, MenuTemplate, SplashTemplate };


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.lg,
    },
    headerSection: {
        marginBottom: SPACING.lg,
    },
    mainContent: {
        flex: 1,
        marginBottom: SPACING.lg,
    },
    gameSection: {
        marginBottom: SPACING.lg,
    },
    sidebarSection: {
        marginBottom: SPACING.lg,
    },
    footerSection: {
        marginTop: 'auto',
        paddingTop: SPACING.lg,
    },
    menuContent: {
        flex: 1,
        paddingVertical: SPACING.lg,
    },
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});