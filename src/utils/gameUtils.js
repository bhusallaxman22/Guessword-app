/**
 * Calculate green and yellow scores for a guess against the target word
 * @param {string} guess - The guessed word
 * @param {string} target - The target word
 * @returns {Object} Object with green, yellow counts and detailed results
 */
export const calculateScores = (guess, target) => {
    let green = 0;
    let yellow = 0;
    const n = target.length;
    const guessChars = guess.split('');
    const targetChars = target.split('');
    const details = new Array(n).fill('gray'); // gray, yellow, green

    const usedTargetIndices = new Array(n).fill(false);
    const usedGuessIndices = new Array(n).fill(false);

    // Pass 1: Count greens (correct position)
    for (let i = 0; i < n; i++) {
        if (guessChars[i] === targetChars[i]) {
            green++;
            details[i] = 'green';
            usedTargetIndices[i] = true;
            usedGuessIndices[i] = true;
        }
    }

    // Pass 2: Count yellows (correct letter, wrong position)
    for (let i = 0; i < n; i++) {
        if (!usedGuessIndices[i]) {
            for (let j = 0; j < n; j++) {
                if (!usedTargetIndices[j] && guessChars[i] === targetChars[j]) {
                    yellow++;
                    details[i] = 'yellow';
                    usedTargetIndices[j] = true;
                    break;
                }
            }
        }
    }

    return { green, yellow, details };
};

/**
 * Validate if a guess is valid
 * @param {string} guess - The guessed word
 * @param {number} wordLength - Expected word length
 * @returns {Object} Validation result with isValid and error message
 */
export const validateGuess = (guess, wordLength) => {
    if (guess.length !== wordLength) {
        return {
            isValid: false,
            error: `Your guess must be ${wordLength} letters long. Please fill all boxes.`,
        };
    }

    if (!/^[A-Z]+$/.test(guess)) {
        return {
            isValid: false,
            error: 'Your guess must contain only letters.',
        };
    }

    return { isValid: true };
};

/**
 * Generate a random username
 * @returns {string} Random username
 */
export const generateUsername = () => {
    const adjectives = ['Quick', 'Smart', 'Clever', 'Swift', 'Bright', 'Sharp', 'Witty'];
    const nouns = ['Player', 'Gamer', 'Solver', 'Thinker', 'Master', 'Pro', 'Ace'];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);

    return `${adjective}${noun}${number}`;
};

/**
 * Format time in milliseconds to readable format
 * @param {number} timeMs - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTime = (timeMs) => {
    const seconds = (timeMs / 1000).toFixed(2);
    return `${seconds}s`;
};

/**
 * Convert base64 string to Uint8Array
 * @param {string} base64 - Base64 string
 * @returns {Uint8Array} Converted array
 */
export const base64ToUint8Array = (base64) => {
    // For React Native, we'll need to use a different approach
    // This is a placeholder - in real implementation, you'd use a library like base-64
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

/**
 * Check if device has internet connection
 * @returns {Promise<boolean>} Promise resolving to connection status
 */
export const checkInternetConnection = async () => {
    try {
        const response = await fetch('https://www.google.com', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
        });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
