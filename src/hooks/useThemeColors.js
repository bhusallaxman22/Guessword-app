import { useState, useEffect, useCallback } from 'react';
import { THEME_COLORS } from '../constants';
import { storage } from '../utils/storage';

// Global theme state
let globalThemeState = THEME_COLORS;
let themeListeners = new Set();
let isThemeLoaded = false;

// Function to notify all listeners about theme changes
const notifyThemeChange = (newTheme) => {
    globalThemeState = newTheme;
    themeListeners.forEach(listener => listener(newTheme));
};

// Function to load initial theme from storage
const loadInitialTheme = async () => {
    if (isThemeLoaded) return globalThemeState;

    try {
        const savedSettings = await storage.getItem('gameSettings');
        const themeName = savedSettings?.theme || 'default';
        const newTheme = await updateGlobalTheme(themeName);
        isThemeLoaded = true;
        return newTheme;
    } catch (error) {
        console.warn('Error loading initial theme:', error);
        isThemeLoaded = true;
        return THEME_COLORS;
    }
};

// Function to update theme globally
export const updateGlobalTheme = async (themeName) => {
    try {
        const baseTheme = THEMES[themeName] || THEMES.default;

        // Better text contrast handling for each theme
        const getTextColors = (themeName, baseTheme) => {
            switch (themeName) {
                case 'dark':
                    return {
                        textPrimary: '#ffffff',
                        textSecondary: '#b2bec3',
                        textMuted: '#636e72',
                        textOnPrimary: '#ffffff',
                        textOnSecondary: '#000000',
                        textOnBackground: '#ffffff',
                        textOnSurface: '#ffffff',
                    };
                case 'forest':
                    return {
                        textPrimary: '#1a4037',
                        textSecondary: '#2d5a4d',
                        textMuted: '#6a9080',
                        textOnPrimary: '#ffffff',
                        textOnSecondary: '#000000',
                        textOnBackground: '#ffffff',
                        textOnSurface: '#1a4037',
                    };
                case 'sunset':
                    return {
                        textPrimary: '#2d1b14',
                        textSecondary: '#5d3a28',
                        textMuted: '#8d5a42',
                        textOnPrimary: '#ffffff',
                        textOnSecondary: '#000000',
                        textOnBackground: '#ffffff',
                        textOnSurface: '#2d1b14',
                    };
                case 'ocean':
                    return {
                        textPrimary: '#0d3b3f',
                        textSecondary: '#1a6b73',
                        textMuted: '#4a8b93',
                        textOnPrimary: '#ffffff',
                        textOnSecondary: '#000000',
                        textOnBackground: '#ffffff',
                        textOnSurface: '#0d3b3f',
                    };
                default: // default theme
                    return {
                        textPrimary: '#2d3436',
                        textSecondary: '#636e72',
                        textMuted: '#b2bec3',
                        textOnPrimary: '#ffffff',
                        textOnSecondary: '#000000',
                        textOnBackground: '#ffffff',
                        textOnSurface: '#2d3436',
                    };
            }
        };

        const textColors = getTextColors(themeName, baseTheme);

        const mergedTheme = {
            ...THEME_COLORS,
            ...baseTheme,
            ...textColors,

            // UI colors that depend on theme
            background: baseTheme.background,
            backgroundSolid: baseTheme.light,
            surface: baseTheme.white,
            border: themeName === 'dark' ? '#636e72' : '#e9ecef',

            // Card colors with better contrast
            cardBackground: themeName === 'dark' ? '#2d3436' : baseTheme.white,
            cardShadow: themeName === 'dark' ? '#000000' : 'rgba(0, 0, 0, 0.1)',

            // Game specific colors
            letterBoxBorder: themeName === 'dark' ? '#636e72' : '#ddd',
            letterBoxBackground: themeName === 'dark' ? '#2d3436' : baseTheme.white,
            scoreGreen: baseTheme.success,
            scoreYellow: baseTheme.warning,

            // Keyboard colors with better contrast
            keyboardDefault: themeName === 'dark' ? '#636e72' : baseTheme.dark,
            keyboardDisabled: themeName === 'dark' ? '#454f53' : '#b2bec3',
            keyboardSpecial: baseTheme.primary,
        };

        // Update global state and notify all listeners
        notifyThemeChange(mergedTheme);

        return mergedTheme;
    } catch (error) {
        console.warn('Error updating global theme:', error);
        return globalThemeState;
    }
};

/**
 * Theme configurations for different themes
 */
const THEMES = {
    default: {
        primary: '#667eea',
        primaryDark: '#5a6fd8',
        secondary: '#f093fb',
        success: '#4ecdc4',
        warning: '#ffeaa7',
        danger: '#fd79a8',
        info: '#74b9ff',
        light: '#f8f9fc',
        dark: '#2d3436',
        white: '#ffffff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradientStart: '#667eea',
        gradientEnd: '#764ba2',
        gradientAccent: '#f093fb',
    },
    ocean: {
        primary: '#4ecdc4',
        primaryDark: '#00b894',
        secondary: '#74b9ff',
        success: '#00cec9',
        warning: '#fdcb6e',
        danger: '#e84393',
        info: '#6c5ce7',
        light: '#f0f8ff',
        dark: '#2d3436',
        white: '#ffffff',
        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        gradientStart: '#4ecdc4',
        gradientEnd: '#44a08d',
        gradientAccent: '#74b9ff',
    },
    sunset: {
        primary: '#fd79a8',
        primaryDark: '#e84393',
        secondary: '#ffeaa7',
        success: '#55a3ff',
        warning: '#fdcb6e',
        danger: '#d63031',
        info: '#a29bfe',
        light: '#fef5f0',
        dark: '#2d3436',
        white: '#ffffff',
        background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
        gradientStart: '#fd79a8',
        gradientEnd: '#fdcb6e',
        gradientAccent: '#ffeaa7',
    },
    forest: {
        primary: '#00b894',
        primaryDark: '#00a085',
        secondary: '#55a3ff',
        success: '#2d3436',
        warning: '#fdcb6e',
        danger: '#e17055',
        info: '#74b9ff',
        light: '#f0fff0',
        dark: '#2d3436',
        white: '#ffffff',
        background: 'linear-gradient(135deg, #00b894 0%, #55a3ff 100%)',
        gradientStart: '#00b894',
        gradientEnd: '#55a3ff',
        gradientAccent: '#a3de83',
    },
    dark: {
        primary: '#2d3436',
        primaryDark: '#636e72',
        secondary: '#636e72',
        success: '#00b894',
        warning: '#fdcb6e',
        danger: '#e17055',
        info: '#74b9ff',
        light: '#2d3436',
        dark: '#ddd',
        white: '#1a1a1a',
        background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
        gradientStart: '#2d3436',
        gradientEnd: '#636e72',
        gradientAccent: '#b2bec3',
    },
};

/**
 * Hook to get theme colors - provides backward compatibility
 * Components can use this instead of importing THEME_COLORS directly
 * @returns {Object} Theme colors object and update function
 */
export const useThemeColors = () => {
    const [themeColors, setThemeColors] = useState(globalThemeState);

    useEffect(() => {
        // Add this component as a listener
        const listener = (newTheme) => {
            setThemeColors(newTheme);
        };

        themeListeners.add(listener);

        // Load initial theme if not already loaded
        loadInitialTheme().then(theme => {
            if (theme !== globalThemeState) {
                setThemeColors(theme);
            }
        });

        // Cleanup listener on unmount
        return () => {
            themeListeners.delete(listener);
        };
    }, []);

    return themeColors;
};

/**
 * Hook to get theme colors with update capability
 * @returns {Object} Object with themeColors and updateTheme function
 */
export const useThemeColorsWithUpdate = () => {
    const [themeColors, setThemeColors] = useState(THEME_COLORS);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedSettings = await storage.getItem('gameSettings');
                const themeName = savedSettings?.theme || 'default';

                const baseTheme = THEMES[themeName] || THEMES.default;
                const mergedTheme = {
                    ...THEME_COLORS,
                    ...baseTheme,
                    // UI colors that depend on theme
                    background: baseTheme.background,
                    backgroundSolid: baseTheme.light,
                    surface: baseTheme.white,
                    border: themeName === 'dark' ? '#636e72' : '#e9ecef',
                    textPrimary: baseTheme.dark,
                    textSecondary: themeName === 'dark' ? '#b2bec3' : '#636e72',

                    // Game specific colors
                    letterBoxBorder: themeName === 'dark' ? '#636e72' : '#ddd',
                    letterBoxBackground: baseTheme.white,
                    scoreGreen: baseTheme.success,
                    scoreYellow: baseTheme.warning,

                    // Keyboard colors
                    keyboardDefault: baseTheme.dark,
                    keyboardDisabled: themeName === 'dark' ? '#636e72' : '#b2bec3',
                    keyboardSpecial: baseTheme.primary,
                };

                setThemeColors(mergedTheme);
            } catch (error) {
                console.warn('Error loading theme, using default:', error);
                setThemeColors(THEME_COLORS);
            }
        };

        loadTheme();
    }, []);

    const updateTheme = async (themeName) => {
        try {
            const baseTheme = THEMES[themeName] || THEMES.default;
            const mergedTheme = {
                ...THEME_COLORS,
                ...baseTheme,
                // UI colors that depend on theme
                background: baseTheme.background,
                backgroundSolid: baseTheme.light,
                surface: baseTheme.white,
                border: themeName === 'dark' ? '#636e72' : '#e9ecef',
                textPrimary: baseTheme.dark,
                textSecondary: themeName === 'dark' ? '#b2bec3' : '#636e72',

                // Game specific colors
                letterBoxBorder: themeName === 'dark' ? '#636e72' : '#ddd',
                letterBoxBackground: baseTheme.white,
                scoreGreen: baseTheme.success,
                scoreYellow: baseTheme.warning,

                // Keyboard colors
                keyboardDefault: baseTheme.dark,
                keyboardDisabled: themeName === 'dark' ? '#636e72' : '#b2bec3',
                keyboardSpecial: baseTheme.primary,
            };

            setThemeColors(mergedTheme);
        } catch (error) {
            console.warn('Error updating theme:', error);
        }
    };

    return { themeColors, updateTheme };
};

/**
 * HOC to inject theme colors as THEME_COLORS prop
 * @param {Component} Component - Component to wrap
 * @returns {Component} Wrapped component with theme colors
 */
export const withThemeColors = (Component) => {
    return (props) => {
        const themeColors = useThemeColors();
        return <Component {...props} THEME_COLORS={themeColors} />;
    };
};
