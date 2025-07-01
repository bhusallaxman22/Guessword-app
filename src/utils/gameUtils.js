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
 * Convert base64 string to Uint8Array for React Native
 * @param {string} base64 - Base64 string
 * @returns {Uint8Array} Converted array
 */
export const base64ToUint8Array = (base64) => {
    try {
        // Use the base-64 library for proper decoding in React Native
        const { decode } = require('base-64');
        const binary = decode(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        console.error('Error converting base64 to Uint8Array:', error);
        throw new Error('Failed to decode base64 data');
    }
};

/**
 * Check if device has internet connection
 * @returns {Promise<boolean>} Promise resolving to connection status
 */
export const checkInternetConnection = async () => {
    try {
        const response = await fetch('https://guessword.bhusallaxman.com.np/.netlify/functions/health', {
            method: 'HEAD',
            cache: 'no-cache',
            timeout: 5000,
        });
        return response.ok;
    } catch (error) {
        // Fallback to a more general check
        try {
            const fallbackResponse = await fetch('https://www.google.com', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
            });
            return true;
        } catch (fallbackError) {
            return false;
        }
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
 * Generate unique ID in MongoDB ObjectId format (24 character hex string)
 * @returns {string} Unique ID in ObjectId format
 */
export const generateId = () => {
    // Generate a 24 character hex string (12 bytes = 24 hex chars)
    // First 4 bytes: timestamp (seconds since epoch)
    const timestamp = Math.floor(Date.now() / 1000);

    // Remaining 8 bytes: random data
    const randomBytes = new Array(8);
    for (let i = 0; i < 8; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
    }

    // Convert to hex
    const timestampHex = timestamp.toString(16).padStart(8, '0');
    const randomHex = randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');

    return timestampHex + randomHex;
};

/**
 * Validate if a string is a valid MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise resolving to function result
 */
export const retryWithBackoff = async (fn, maxAttempts = 3, baseDelay = 1000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxAttempts) {
                throw error;
            }

            // Exponential backoff with jitter
            const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
};

/**
 * Create a timeout promise
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that rejects after timeout
 */
export const createTimeout = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), ms);
    });
};

/**
 * Fetch with timeout and retry
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} retries - Number of retries
 * @returns {Promise<Response>} Promise resolving to fetch response
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000, retries = 2) => {
    const fetchFn = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    return retryWithBackoff(fetchFn, retries + 1, 1000);
};

/**
 * Handle API errors gracefully
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error, operation) => {
    console.error(`${operation} failed:`, error);

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return 'Connection timeout. Please check your internet and try again.';
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        return 'No internet connection. Please check your network.';
    }

    if (error.message.includes('404')) {
        return 'Requested data not found.';
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        return 'Server error. Please try again later.';
    }

    return 'Something went wrong. Please try again.';
};
