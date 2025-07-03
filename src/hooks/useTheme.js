import { useState, useEffect, useMemo } from 'react';
import { THEME_COLORS } from '../constants';

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
 * Custom hook for managing theme state
 * @param {string} selectedTheme - Currently selected theme name
 * @returns {Object} Theme colors and utilities
 */
export const useTheme = (selectedTheme = 'default') => {
    const [currentTheme, setCurrentTheme] = useState(selectedTheme);

    useEffect(() => {
        setCurrentTheme(selectedTheme);
    }, [selectedTheme]);

    const themeColors = useMemo(() => {
        const baseTheme = THEMES[currentTheme] || THEMES.default;

        return {
            ...THEME_COLORS,
            ...baseTheme,
            // UI colors that depend on theme
            background: baseTheme.background,
            backgroundSolid: baseTheme.light,
            surface: baseTheme.white,
            border: currentTheme === 'dark' ? '#636e72' : '#e9ecef',
            textPrimary: baseTheme.dark,
            textSecondary: currentTheme === 'dark' ? '#b2bec3' : '#636e72',

            // Game specific colors
            letterBoxBorder: currentTheme === 'dark' ? '#636e72' : '#ddd',
            letterBoxBackground: baseTheme.white,
            scoreGreen: baseTheme.success,
            scoreYellow: baseTheme.warning,

            // Keyboard colors
            keyboardDefault: baseTheme.dark,
            keyboardDisabled: currentTheme === 'dark' ? '#636e72' : '#b2bec3',
            keyboardSpecial: baseTheme.primary,
        };
    }, [currentTheme]);

    const getThemeConfig = () => ({
        name: currentTheme,
        colors: themeColors,
        isDark: currentTheme === 'dark',
    });

    return {
        currentTheme,
        themeColors,
        THEME_COLORS,
        getThemeConfig,
        availableThemes: Object.keys(THEMES),
    };
};
