import React, { createContext, useContext } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { THEME_COLORS } from '../constants';

/**
 * Theme Context for providing theme colors throughout the app
 */
const ThemeContext = createContext();

/**
 * Theme Provider component
 * @param {Object} props - ThemeProvider props
 * @param {ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
    try {
        const { settings } = useSettings();
        const { themeColors, currentTheme, getThemeConfig, availableThemes } = useTheme(settings.theme);

        const value = {
            themeColors,
            currentTheme,
            getThemeConfig,
            availableThemes,
            // Legacy compatibility - provide THEME_COLORS with dynamic values
            THEME_COLORS: themeColors
        };

        return (
            <ThemeContext.Provider value={value}>
                {children}
            </ThemeContext.Provider>
        );
    } catch (error) {
        console.warn('ThemeProvider initialization error, using fallback:', error.message);
        // Fallback value with static theme colors
        const fallbackValue = {
            themeColors: THEME_COLORS,
            currentTheme: 'default',
            getThemeConfig: () => ({ name: 'default', colors: THEME_COLORS, isDark: false }),
            availableThemes: ['default'],
            THEME_COLORS: THEME_COLORS
        };

        return (
            <ThemeContext.Provider value={fallbackValue}>
                {children}
            </ThemeContext.Provider>
        );
    }
};

/**
 * Hook to use theme context
 * @returns {Object} Theme context value
 */
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        console.warn('useThemeContext must be used within a ThemeProvider, using fallback');
        // Return fallback context
        return {
            themeColors: THEME_COLORS,
            currentTheme: 'default',
            getThemeConfig: () => ({ name: 'default', colors: THEME_COLORS, isDark: false }),
            availableThemes: ['default'],
            THEME_COLORS: THEME_COLORS
        };
    }
    return context;
};
