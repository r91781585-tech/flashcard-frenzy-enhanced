// Utility Functions for Flashcard Frenzy Enhanced

/**
 * Generate a unique room ID
 * @returns {string} 6-character room ID
 */
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a unique player ID
 * @returns {string} Unique player ID
 */
function generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random elements from an array
 * @param {Array} array - Source array
 * @param {number} count - Number of elements to get
 * @returns {Array} Random elements
 */
function getRandomElements(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 * @returns {boolean} True if touch is supported
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device type
 * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
 */
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error('Failed to copy text:', error);
        return false;
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitize HTML string
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Get random color
 * @returns {string} Random hex color
 */
function getRandomColor() {
    const colors = [
        '#6366f1', '#ec4899', '#10b981', '#f59e0b', 
        '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Calculate reading time
 * @param {string} text - Text to analyze
 * @param {number} wpm - Words per minute (default: 200)
 * @returns {number} Reading time in minutes
 */
function calculateReadingTime(text, wpm = 200) {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
}

/**
 * Get contrast color (black or white) for a given background color
 * @param {string} hexColor - Background color in hex format
 * @returns {string} 'black' or 'white'
 */
function getContrastColor(hexColor) {
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Local Storage utilities
 */
const Storage = {
    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }
};

/**
 * URL utilities
 */
const URLUtils = {
    /**
     * Get URL parameters as object
     * @returns {Object} URL parameters
     */
    getParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    },

    /**
     * Set URL parameter
     * @param {string} key - Parameter key
     * @param {string} value - Parameter value
     */
    setParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    },

    /**
     * Remove URL parameter
     * @param {string} key - Parameter key
     */
    removeParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }
};

/**
 * Animation utilities
 */
const AnimationUtils = {
    /**
     * Add animation class and remove after completion
     * @param {HTMLElement} element - Target element
     * @param {string} animationClass - Animation class name
     * @param {Function} callback - Callback after animation
     */
    animate(element, animationClass, callback = null) {
        element.classList.add(animationClass);
        
        const handleAnimationEnd = () => {
            element.classList.remove(animationClass);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (callback) callback();
        };
        
        element.addEventListener('animationend', handleAnimationEnd);
    },

    /**
     * Fade in element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Duration in milliseconds
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    /**
     * Fade out element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Duration in milliseconds
     */
    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

/**
 * Sound utilities
 */
const SoundUtils = {
    /**
     * Play sound with volume control
     * @param {string} soundId - Audio element ID
     * @param {number} volume - Volume (0-1)
     */
    play(soundId, volume = 1) {
        const audio = document.getElementById(soundId);
        if (audio && Storage.get('soundEnabled', true)) {
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.warn('Failed to play sound:', error);
            });
        }
    },

    /**
     * Stop sound
     * @param {string} soundId - Audio element ID
     */
    stop(soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    },

    /**
     * Set volume for all sounds
     * @param {number} volume - Volume (0-1)
     */
    setGlobalVolume(volume) {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.volume = volume;
        });
    }
};

/**
 * Performance utilities
 */
const PerformanceUtils = {
    /**
     * Measure function execution time
     * @param {Function} func - Function to measure
     * @param {string} label - Label for measurement
     * @returns {any} Function result
     */
    measure(func, label = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${label} took ${end - start} milliseconds`);
        return result;
    },

    /**
     * Request idle callback with fallback
     * @param {Function} callback - Callback function
     * @param {Object} options - Options object
     */
    requestIdleCallback(callback, options = {}) {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(callback, options);
        } else {
            setTimeout(callback, 1);
        }
    }
};

// Export utilities for use in other modules
window.Utils = {
    generateRoomId,
    generatePlayerId,
    shuffleArray,
    getRandomElements,
    formatTime,
    calculatePercentage,
    debounce,
    throttle,
    deepClone,
    isMobile,
    isTouchDevice,
    getDeviceType,
    copyToClipboard,
    showNotification,
    isValidEmail,
    sanitizeHTML,
    getRandomColor,
    calculateReadingTime,
    getContrastColor,
    Storage,
    URLUtils,
    AnimationUtils,
    SoundUtils,
    PerformanceUtils
};