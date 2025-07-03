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
    transparent: 'transparent',

    // UI colors
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundSolid: '#f8f9fc',
    surface: '#ffffff',
    border: '#e9ecef',
    textPrimary: '#2d3436',
    textSecondary: '#636e72',

    // Game specific colors
    letterBoxBorder: '#ddd',
    letterBoxBackground: '#ffffff',
    scoreGreen: '#4ecdc4',
    scoreYellow: '#ffeaa7',

    // Keyboard colors
    keyboardDefault: '#636e72',
    keyboardDisabled: '#b2bec3',
    keyboardSpecial: '#2d3436', // Darker color for ENTER/BACKSPACE

    // Gradient colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientAccent: '#f093fb',

    // New modern colors
    cardBackground: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
    accent: '#ff6b6b',
    muted: '#74b9ff',
};

/**
 * Spacing constants
 */
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
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
    API_ERROR: 'Server error. Please try again later.',
    DECRYPTION_ERROR: 'Could not decrypt word data.',
    USERNAME_ERROR: 'Could not get username from server. Using fallback.',
    RESULT_POST_ERROR: 'Could not save your score. Playing offline.',
    LEADERBOARD_ERROR: 'Could not load online leaderboard. Showing local scores.',
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

/**
 * API Configuration constants
 */
export const API_CONFIG = {
    baseUrl: 'https://guessword.bhusallaxman.com.np/.netlify/functions',
    timeout: 10000,
    retryAttempts: 2,
    retryDelay: 1000,
};
