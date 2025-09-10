// Main Application Controller for Enhanced Flashcard Frenzy

/**
 * Main Application Class
 */
class FlashcardFrenzyApp {
    constructor() {
        this.version = '2.0.0';
        this.uiController = null;
        this.gameEngine = null;
        this.multiplayerManager = null;
        this.isInitialized = false;
        this.debugMode = false;
        
        // Performance monitoring
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0
        };
        
        this.initialize();
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            const startTime = performance.now();
            
            // Check browser compatibility
            if (!this.checkBrowserCompatibility()) {
                this.showBrowserCompatibilityError();
                return;
            }

            // Initialize error handling
            this.setupErrorHandling();
            
            // Initialize performance monitoring
            this.setupPerformanceMonitoring();
            
            // Initialize service worker for offline support
            await this.initializeServiceWorker();
            
            // Initialize UI controller
            this.uiController = new UIController();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Initialize analytics (if enabled)
            this.initializeAnalytics();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Calculate load time
            this.performanceMetrics.loadTime = performance.now() - startTime;
            
            // Log initialization
            this.log('Application initialized successfully', {
                version: this.version,
                loadTime: this.performanceMetrics.loadTime,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
            
            // Show welcome message for first-time users
            this.checkFirstTimeUser();
            
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    /**
     * Check browser compatibility
     * @returns {boolean} True if browser is compatible
     */
    checkBrowserCompatibility() {
        const requiredFeatures = [
            'localStorage',
            'sessionStorage',
            'JSON',
            'addEventListener',
            'querySelector',
            'classList',
            'requestAnimationFrame'
        ];

        const missingFeatures = requiredFeatures.filter(feature => {
            switch (feature) {
                case 'localStorage':
                    return !window.localStorage;
                case 'sessionStorage':
                    return !window.sessionStorage;
                case 'JSON':
                    return !window.JSON;
                case 'addEventListener':
                    return !window.addEventListener;
                case 'querySelector':
                    return !document.querySelector;
                case 'classList':
                    return !document.createElement('div').classList;
                case 'requestAnimationFrame':
                    return !window.requestAnimationFrame;
                default:
                    return false;
            }
        });

        if (missingFeatures.length > 0) {
            console.error('Missing required browser features:', missingFeatures);
            return false;
        }

        return true;
    }

    /**
     * Show browser compatibility error
     */
    showBrowserCompatibilityError() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: Arial, sans-serif;
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div style="max-width: 500px;">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">
                        Browser Not Supported
                    </h1>
                    <p style="font-size: 1.1rem; margin-bottom: 2rem;">
                        Your browser doesn't support some features required by Flashcard Frenzy Enhanced.
                        Please update your browser or try a modern browser like Chrome, Firefox, Safari, or Edge.
                    </p>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <strong>Recommended Browsers:</strong><br>
                        Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Resource loading error handler
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError('Resource Loading Error', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Failed to load resource'
                });
            }
        }, true);
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
            }, 30000); // Check every 30 seconds
        }

        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);

        // Performance observer (if available)
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            this.performanceMetrics.navigationTiming = entry;
                        } else if (entry.entryType === 'paint') {
                            this.performanceMetrics[entry.name] = entry.startTime;
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['navigation', 'paint'] });
            } catch (error) {
                console.warn('Performance Observer not fully supported:', error);
            }
        }
    }

    /**
     * Initialize service worker for offline support
     */
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                this.log('Service Worker registered successfully', registration);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailableNotification();
                        }
                    });
                });
                
            } catch (error) {
                this.log('Service Worker registration failed', error);
            }
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Online/offline status
        window.addEventListener('online', () => {
            Utils.showNotification('Connection restored', 'success');
            this.handleConnectionChange(true);
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('Connection lost - Playing offline', 'warning');
            this.handleConnectionChange(false);
        });

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload warning
        window.addEventListener('beforeunload', (event) => {
            if (this.shouldWarnBeforeUnload()) {
                event.preventDefault();
                event.returnValue = 'Are you sure you want to leave? Your game progress will be lost.';
                return event.returnValue;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboardShortcuts(event);
        });

        // Context menu prevention (optional)
        if (Utils.Storage.get('preventContextMenu', false)) {
            document.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        }
    }

    /**
     * Initialize analytics
     */
    initializeAnalytics() {
        const analyticsEnabled = Utils.Storage.get('analyticsEnabled', true);
        
        if (analyticsEnabled && !this.debugMode) {
            // Initialize analytics service (placeholder)
            this.analytics = {
                track: (event, properties) => {
                    this.log('Analytics Event', { event, properties });
                },
                
                page: (name) => {
                    this.log('Analytics Page View', { page: name });
                },
                
                identify: (userId, traits) => {
                    this.log('Analytics Identify', { userId, traits });
                }
            };
            
            // Track app initialization
            this.analytics.track('App Initialized', {
                version: this.version,
                platform: navigator.platform,
                language: navigator.language,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Check if this is a first-time user
     */
    checkFirstTimeUser() {
        const isFirstTime = !Utils.Storage.get('hasVisited', false);
        
        if (isFirstTime) {
            Utils.Storage.set('hasVisited', true);
            Utils.Storage.set('firstVisit', Date.now());
            
            // Show welcome tutorial or onboarding
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 2000);
            
            if (this.analytics) {
                this.analytics.track('First Visit', {
                    timestamp: Date.now()
                });
            }
        }
    }

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Welcome to Flashcard Frenzy Enhanced!</h3>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 1rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <h4>Ready to test your knowledge?</h4>
                        <p>Challenge yourself or compete with friends in real-time multiplayer flashcard battles!</p>
                        <ul style="text-align: left; margin: 1rem 0;">
                            <li>🧠 Multiple categories: Science, History, Geography, and more</li>
                            <li>⚡ Real-time multiplayer gameplay</li>
                            <li>🎨 Beautiful themes and animations</li>
                            <li>🏆 Track your progress and achievements</li>
                            <li>💪 Power-ups and special abilities</li>
                        </ul>
                        <div class="modal-actions" style="margin-top: 2rem;">
                            <button class="btn primary" id="startTutorial">Take Tutorial</button>
                            <button class="btn secondary" id="skipTutorial">Skip & Play</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle tutorial
        modal.querySelector('#startTutorial').addEventListener('click', () => {
            this.startTutorial();
            modal.remove();
        });

        modal.querySelector('#skipTutorial').addEventListener('click', () => {
            modal.remove();
        });

        // Auto-close after 30 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 30000);
    }

    /**
     * Start interactive tutorial
     */
    startTutorial() {
        const tutorialSteps = [
            {
                target: '#createGameBtn',
                title: 'Create a Game',
                content: 'Click here to create a new multiplayer game and invite friends!'
            },
            {
                target: '#practiceBtn',
                title: 'Practice Mode',
                content: 'Want to practice alone? Use practice mode to sharpen your skills!'
            },
            {
                target: '#themeToggle',
                title: 'Customize Themes',
                content: 'Choose from 10+ beautiful themes to personalize your experience!'
            },
            {
                target: '.player-stats',
                title: 'Track Progress',
                content: 'Your game statistics and achievements are tracked here!'
            }
        ];

        this.showTutorialStep(tutorialSteps, 0);
    }

    /**
     * Show tutorial step
     * @param {Array} steps - Tutorial steps
     * @param {number} currentStep - Current step index
     */
    showTutorialStep(steps, currentStep) {
        if (currentStep >= steps.length) {
            Utils.showNotification('Tutorial complete! Enjoy playing!', 'success');
            return;
        }

        const step = steps[currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.showTutorialStep(steps, currentStep + 1);
            return;
        }

        // Create tutorial overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Highlight target element
        const rect = target.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.style.cssText = `
            position: fixed;
            top: ${rect.top - 10}px;
            left: ${rect.left - 10}px;
            width: ${rect.width + 20}px;
            height: ${rect.height + 20}px;
            border: 3px solid #6366f1;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
            z-index: 10001;
            pointer-events: none;
        `;

        // Create tutorial popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            color: black;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            margin: 2rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        
        popup.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #6366f1;">${step.title}</h3>
            <p style="margin-bottom: 2rem; line-height: 1.6;">${step.content}</p>
            <div>
                <button class="btn primary" id="nextStep">
                    ${currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
                <button class="btn secondary" id="skipTutorial" style="margin-left: 1rem;">
                    Skip Tutorial
                </button>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        document.body.appendChild(highlight);

        // Handle next step
        popup.querySelector('#nextStep').addEventListener('click', () => {
            overlay.remove();
            highlight.remove();
            this.showTutorialStep(steps, currentStep + 1);
        });

        // Handle skip
        popup.querySelector('#skipTutorial').addEventListener('click', () => {
            overlay.remove();
            highlight.remove();
        });

        // Auto-advance after 10 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
                highlight.remove();
                this.showTutorialStep(steps, currentStep + 1);
            }
        }, 10000);
    }

    /**
     * Handle connection change
     * @param {boolean} isOnline - Connection status
     */
    handleConnectionChange(isOnline) {
        if (this.multiplayerManager) {
            if (isOnline) {
                // Attempt to reconnect
                this.multiplayerManager.connect().catch(() => {
                    // Reconnection failed
                });
            } else {
                // Handle offline mode
                this.multiplayerManager.disconnect();
            }
        }

        // Update connection status indicator
        const statusIndicator = document.getElementById('connectionStatus');
        if (statusIndicator) {
            statusIndicator.innerHTML = isOnline ? 
                '<i class="fas fa-wifi"></i><span>Connected</span>' :
                '<i class="fas fa-wifi-slash"></i><span>Offline</span>';
            statusIndicator.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.pauseActiveGame();
            this.trackTimeAway = Date.now();
        } else {
            // Page is visible
            this.resumeActiveGame();
            
            if (this.trackTimeAway) {
                const timeAway = Date.now() - this.trackTimeAway;
                if (timeAway > 300000) { // 5 minutes
                    this.handleLongAbsence();
                }
            }
        }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleGlobalKeyboardShortcuts(event) {
        // Debug mode toggle (Ctrl+Shift+D)
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            this.toggleDebugMode();
            event.preventDefault();
        }

        // Performance stats (Ctrl+Shift+P)
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
            this.showPerformanceStats();
            event.preventDefault();
        }

        // Reset application (Ctrl+Shift+R)
        if (event.ctrlKey && event.shiftKey && event.key === 'R') {
            this.resetApplication();
            event.preventDefault();
        }
    }

    /**
     * Should warn before unload
     * @returns {boolean} True if should warn
     */
    shouldWarnBeforeUnload() {
        return this.gameEngine && 
               this.gameEngine.state.status === 'playing' &&
               this.gameEngine.state.players.length > 1;
    }

    /**
     * Pause active game
     */
    pauseActiveGame() {
        if (this.gameEngine && this.gameEngine.state.status === 'playing') {
            this.gameEngine.pauseGame();
        }
    }

    /**
     * Resume active game
     */
    resumeActiveGame() {
        if (this.gameEngine && this.gameEngine.state.status === 'paused') {
            this.gameEngine.resumeGame();
        }
    }

    /**
     * Handle long absence
     */
    handleLongAbsence() {
        Utils.showNotification('Welcome back! Your game has been paused.', 'info');
        
        if (this.analytics) {
            this.analytics.track('Long Absence Return', {
                timeAway: Date.now() - this.trackTimeAway
            });
        }
    }

    /**
     * Show update available notification
     */
    showUpdateAvailableNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-download"></i>
                <span>A new version is available!</span>
                <button class="btn primary" id="updateApp">Update</button>
                <button class="btn secondary" id="dismissUpdate">Later</button>
            </div>
        `;

        document.body.appendChild(notification);

        notification.querySelector('#updateApp').addEventListener('click', () => {
            window.location.reload();
        });

        notification.querySelector('#dismissUpdate').addEventListener('click', () => {
            notification.remove();
        });
    }

    /**
     * Toggle debug mode
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            this.enableDebugMode();
            Utils.showNotification('Debug mode enabled', 'info');
        } else {
            this.disableDebugMode();
            Utils.showNotification('Debug mode disabled', 'info');
        }
    }

    /**
     * Enable debug mode
     */
    enableDebugMode() {
        // Add debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
        `;

        document.body.appendChild(debugPanel);

        // Update debug info
        this.updateDebugInfo();
        this.debugInterval = setInterval(() => {
            this.updateDebugInfo();
        }, 1000);
    }

    /**
     * Disable debug mode
     */
    disableDebugMode() {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.remove();
        }

        if (this.debugInterval) {
            clearInterval(this.debugInterval);
            this.debugInterval = null;
        }
    }

    /**
     * Update debug information
     */
    updateDebugInfo() {
        const debugPanel = document.getElementById('debugPanel');
        if (!debugPanel) return;

        const info = {
            version: this.version,
            fps: this.performanceMetrics.fps || 0,
            memory: this.performanceMetrics.memoryUsage ? 
                Math.round(this.performanceMetrics.memoryUsage / 1024 / 1024) + ' MB' : 'N/A',
            gameState: this.gameEngine ? this.gameEngine.state.status : 'No game',
            players: this.gameEngine ? this.gameEngine.state.players.length : 0,
            connection: this.multiplayerManager ? 
                this.multiplayerManager.getConnectionStatus() : 'N/A'
        };

        debugPanel.innerHTML = `
            <strong>Debug Info</strong><br>
            Version: ${info.version}<br>
            FPS: ${info.fps}<br>
            Memory: ${info.memory}<br>
            Game: ${info.gameState}<br>
            Players: ${info.players}<br>
            Connection: ${info.connection}
        `;
    }

    /**
     * Show performance statistics
     */
    showPerformanceStats() {
        const stats = {
            ...this.performanceMetrics,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };

        console.table(stats);
        
        Utils.showNotification('Performance stats logged to console', 'info');
    }

    /**
     * Reset application
     */
    resetApplication() {
        if (confirm('Are you sure you want to reset the application? This will clear all data.')) {
            // Clear all storage
            Utils.Storage.clear();
            sessionStorage.clear();
            
            // Reload page
            window.location.reload();
        }
    }

    /**
     * Handle error
     * @param {string} context - Error context
     * @param {Error|Object} error - Error object
     */
    handleError(context, error) {
        const errorInfo = {
            context,
            message: error.message || error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            version: this.version
        };

        // Log error
        console.error(context, error);

        // Store error for debugging
        const errors = Utils.Storage.get('errorLog', []);
        errors.unshift(errorInfo);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(10);
        }
        
        Utils.Storage.set('errorLog', errors);

        // Show user-friendly error message
        if (!this.debugMode) {
            Utils.showNotification('Something went wrong. Please try again.', 'error');
        } else {
            Utils.showNotification(`Error: ${errorInfo.message}`, 'error');
        }

        // Track error in analytics
        if (this.analytics) {
            this.analytics.track('Error Occurred', errorInfo);
        }
    }

    /**
     * Log message
     * @param {string} message - Log message
     * @param {any} data - Additional data
     */
    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[FlashcardFrenzy] ${message}`, data);
        }

        // Store important logs
        const logs = Utils.Storage.get('appLogs', []);
        logs.unshift({
            message,
            data,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 logs
        if (logs.length > 50) {
            logs.splice(50);
        }

        Utils.Storage.set('appLogs', logs);
    }

    /**
     * Get application info
     * @returns {Object} Application information
     */
    getAppInfo() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            debugMode: this.debugMode,
            performance: this.performanceMetrics,
            browser: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            }
        };
    }

    /**
     * Destroy application
     */
    destroy() {
        // Clean up intervals
        if (this.debugInterval) {
            clearInterval(this.debugInterval);
        }

        // Destroy components
        if (this.uiController) {
            this.uiController.destroy();
        }

        if (this.multiplayerManager) {
            this.multiplayerManager.disconnect();
        }

        // Remove event listeners
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleError);

        this.log('Application destroyed');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.FlashcardFrenzyApp = new FlashcardFrenzyApp();
    
    // Expose app info to global scope for debugging
    window.getAppInfo = () => window.FlashcardFrenzyApp.getAppInfo();
    
    // Add version info to console
    console.log(
        '%cFlashcard Frenzy Enhanced v2.0.0',
        'color: #6366f1; font-size: 16px; font-weight: bold;'
    );
    console.log(
        '%cBuilt with ❤️ for educational gaming',
        'color: #10b981; font-size: 12px;'
    );
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardFrenzyApp;
}