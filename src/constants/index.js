/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
    MAX_ATTEMPTS: 8,
    WORD_LENGTH: 4,
    CHEAT_CODE: 'DALI',
};

/**
 * Theme colors for the application
 */
export const THEME_COLORS = {
    primary: '#5e72e4',
    primaryDark: '#4a5cc0',
    secondary: '#f5365c',
    success: '#2dce89',
    warning: '#fbcf33',
    danger: '#f5365c',
    info: '#5e72e4',
    light: '#f8f9fc',
    dark: '#32325d',
    white: '#ffffff',
    transparent: 'transparent',

    // UI colors
    background: '#f8f9fc',
    surface: '#ffffff',
    border: '#e9ecef',
    textPrimary: '#32325d',
    textSecondary: '#6c757d',

    // Game specific colors
    letterBoxBorder: '#d1d8e0',
    letterBoxBackground: '#ffffff',
    scoreGreen: '#2dce89',
    scoreYellow: '#fbcf33',

    // Keyboard colors
    keyboardDefault: '#6c757d',
    keyboardDisabled: '#495057',
    keyboardSpecial: '#343a40', // Darker color for ENTER/BACKSPACE

    // Gradient colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
};

/**
 * Spacing constants
 */
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

/**
 * Font sizes
 */
export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    header: 36,
};

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 50,
};

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
    USER_ID: 'guessword_USER_ID',
    USERNAME: 'guessword_USERNAME',
    CURRENT_LEVEL: 'guessword_currentLevel',
    FIRST_LAUNCH: 'guessword_firstLaunchDone',
    LEADERBOARD: 'guessword_leaderboard',
    GAME_STATS: 'guessword_gameStats',
};

/**
 * Game messages
 */
export const MESSAGES = {
    INVALID_LENGTH: `Your guess must be ${GAME_CONFIG.WORD_LENGTH} letters long. Please fill all boxes.`,
    INVALID_CHARACTERS: 'Your guess must contain only letters.',
    GAME_OVER: 'Game Over! The word was',
    CONGRATULATIONS: 'Congratulations! You guessed the word',
    LEVEL_COMPLETED: 'Level completed!',
    ALL_LEVELS_CLEARED: 'You have completed all available levels!',
    LOADING: 'Loading...',
    NO_INTERNET: 'No internet connection. Please check your network.',
    ERROR_LOADING_WORD: 'Could not load the next word. Please try refreshing.',
};

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
    short: 200,
    medium: 400,
    long: 800,
    graffiti: 2800,
};
