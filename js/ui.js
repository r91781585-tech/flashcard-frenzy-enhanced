// UI Controller for Enhanced Flashcard Frenzy

/**
 * UI Controller Class
 */
class UIController {
    constructor() {
        this.currentTheme = Utils.Storage.get('theme', 'default');
        this.currentScreen = 'mainMenu';
        this.gameEngine = null;
        this.multiplayerManager = null;
        this.animationController = new AnimationController();
        this.isFullscreen = false;
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        this.initializeUI();
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);

        // Setup theme dropdown
        this.setupThemeSelector();
        
        // Setup responsive design
        this.setupResponsiveDesign();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Setup touch gestures
        this.setupTouchGestures();
        
        // Load player stats
        this.updatePlayerStats();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Main menu buttons
        document.getElementById('createGameBtn')?.addEventListener('click', () => {
            this.showScreen('gameSetup');
        });

        document.getElementById('joinGameBtn')?.addEventListener('click', () => {
            this.showJoinGameModal();
        });

        document.getElementById('practiceBtn')?.addEventListener('click', () => {
            this.startPracticeMode();
        });

        document.getElementById('leaderboardBtn')?.addEventListener('click', () => {
            this.showLeaderboard();
        });

        // Game setup
        document.getElementById('startGameBtn')?.addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('backToMenuBtn')?.addEventListener('click', () => {
            this.showScreen('mainMenu');
        });

        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Settings
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettings')?.addEventListener('click', () => {
            this.hideSettings();
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleThemeDropdown();
        });

        // Copy room code
        document.getElementById('copyRoomCode')?.addEventListener('click', () => {
            this.copyRoomCode();
        });

        // Ready button
        document.getElementById('readyBtn')?.addEventListener('click', () => {
            this.setPlayerReady();
        });

        // Leave room
        document.getElementById('leaveRoomBtn')?.addEventListener('click', () => {
            this.leaveRoom();
        });

        // Game over actions
        document.getElementById('playAgainBtn')?.addEventListener('click', () => {
            this.playAgain();
        });

        document.getElementById('mainMenuBtn')?.addEventListener('click', () => {
            this.showScreen('mainMenu');
        });

        document.getElementById('shareResultBtn')?.addEventListener('click', () => {
            this.shareResult();
        });

        // Powerup buttons
        document.getElementById('skipPowerup')?.addEventListener('click', () => {
            this.usePowerup('skip');
        });

        document.getElementById('hintPowerup')?.addEventListener('click', () => {
            this.usePowerup('hint');
        });

        document.getElementById('freezePowerup')?.addEventListener('click', () => {
            this.usePowerup('freeze');
        });

        // Settings toggles
        document.getElementById('soundToggle')?.addEventListener('change', (e) => {
            Utils.Storage.set('soundEnabled', e.target.checked);
        });

        document.getElementById('musicToggle')?.addEventListener('change', (e) => {
            Utils.Storage.set('musicEnabled', e.target.checked);
            this.toggleBackgroundMusic(e.target.checked);
        });

        document.getElementById('animationsToggle')?.addEventListener('change', (e) => {
            this.animationController.setAnimationsEnabled(e.target.checked);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Click outside to close dropdowns
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const gameContainer = document.getElementById('gameContainer');
        
        if (loadingScreen && gameContainer) {
            this.animationController.animate(loadingScreen, 'fade-out', { duration: 500 })
                .then(() => {
                    loadingScreen.style.display = 'none';
                    gameContainer.classList.remove('hidden');
                    this.animationController.animate(gameContainer, 'fade-in', { duration: 500 });
                });
        }
    }

    /**
     * Show specific screen
     * @param {string} screenId - Screen ID to show
     */
    async showScreen(screenId) {
        const currentScreen = document.querySelector('.screen.active');
        const targetScreen = document.getElementById(screenId);
        
        if (!targetScreen || targetScreen === currentScreen) return;

        // Animate transition
        if (currentScreen) {
            await this.animationController.transitionScreen(currentScreen, targetScreen, 'fade');
        } else {
            targetScreen.classList.add('active');
            await this.animationController.animate(targetScreen, 'fade-in-up');
        }

        this.currentScreen = screenId;
        this.updateScreenAccessibility(screenId);
    }

    /**
     * Setup theme selector
     */
    setupThemeSelector() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Create theme dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'theme-dropdown';
        dropdown.innerHTML = `
            <div class="theme-option ${this.currentTheme === 'default' ? 'active' : ''}" data-theme="default">
                <div class="theme-preview default"></div>
                <span>Default</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                <div class="theme-preview light"></div>
                <span>Light</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'neon' ? 'active' : ''}" data-theme="neon">
                <div class="theme-preview neon"></div>
                <span>Neon</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'ocean' ? 'active' : ''}" data-theme="ocean">
                <div class="theme-preview ocean"></div>
                <span>Ocean</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'forest' ? 'active' : ''}" data-theme="forest">
                <div class="theme-preview forest"></div>
                <span>Forest</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'sunset' ? 'active' : ''}" data-theme="sunset">
                <div class="theme-preview sunset"></div>
                <span>Sunset</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'purple' ? 'active' : ''}" data-theme="purple">
                <div class="theme-preview purple"></div>
                <span>Purple</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'cyberpunk' ? 'active' : ''}" data-theme="cyberpunk">
                <div class="theme-preview cyberpunk"></div>
                <span>Cyberpunk</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'retro' ? 'active' : ''}" data-theme="retro">
                <div class="theme-preview retro"></div>
                <span>Retro</span>
            </div>
            <div class="theme-option ${this.currentTheme === 'minimal' ? 'active' : ''}" data-theme="minimal">
                <div class="theme-preview minimal"></div>
                <span>Minimal</span>
            </div>
        `;

        themeToggle.parentElement.appendChild(dropdown);

        // Add click listeners to theme options
        dropdown.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.hideThemeDropdown();
            });
        });
    }

    /**
     * Toggle theme dropdown
     */
    toggleThemeDropdown() {
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    /**
     * Hide theme dropdown
     */
    hideThemeDropdown() {
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    /**
     * Apply theme
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        Utils.Storage.set('theme', theme);

        // Update active theme option
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });

        Utils.showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`, 'success', 2000);
    }

    /**
     * Setup responsive design
     */
    setupResponsiveDesign() {
        // Add device class to body
        document.body.classList.add(`device-${Utils.getDeviceType()}`);
        
        if (Utils.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }

        // Setup viewport meta tag for mobile
        if (Utils.isMobile()) {
            let viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                document.head.appendChild(viewport);
            }
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels
        this.updateAriaLabels();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // Setup high contrast mode detection
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Setup reduced motion detection
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.animationController.setAnimationsEnabled(false);
        }
    }

    /**
     * Setup touch gestures
     */
    setupTouchGestures() {
        if (!Utils.isTouchDevice()) return;

        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.touchStartY || !this.touchStartX) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const diffY = this.touchStartY - touchEndY;
            const diffX = this.touchStartX - touchEndX;

            // Swipe gestures
            if (Math.abs(diffY) > Math.abs(diffX)) {
                if (Math.abs(diffY) > 50) {
                    if (diffY > 0) {
                        this.handleSwipeUp();
                    } else {
                        this.handleSwipeDown();
                    }
                }
            } else {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.handleSwipeLeft();
                    } else {
                        this.handleSwipeRight();
                    }
                }
            }

            this.touchStartY = 0;
            this.touchStartX = 0;
        }, { passive: true });
    }

    /**
     * Update player statistics display
     */
    updatePlayerStats() {
        const stats = Utils.Storage.get('playerStats', {
            gamesPlayed: 0,
            gamesWon: 0,
            bestStreak: 0
        });

        const gamesPlayedEl = document.getElementById('gamesPlayed');
        const winRateEl = document.getElementById('winRate');
        const bestStreakEl = document.getElementById('bestStreak');

        if (gamesPlayedEl) gamesPlayedEl.textContent = stats.gamesPlayed;
        if (bestStreakEl) bestStreakEl.textContent = stats.bestStreak;
        
        if (winRateEl) {
            const winRate = stats.gamesPlayed > 0 ? 
                Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
            winRateEl.textContent = `${winRate}%`;
        }
    }

    /**
     * Show join game modal
     */
    showJoinGameModal() {
        const modal = this.createModal('Join Game', `
            <div class="join-game-form">
                <label for="joinRoomCode">Room Code:</label>
                <input type="text" id="joinRoomCode" placeholder="Enter 6-character room code" maxlength="6" style="text-transform: uppercase;">
                <label for="joinPlayerName">Your Name:</label>
                <input type="text" id="joinPlayerName" placeholder="Enter your name" maxlength="20">
                <div class="modal-actions">
                    <button class="btn primary" id="confirmJoinGame">Join Game</button>
                    <button class="btn secondary" id="cancelJoinGame">Cancel</button>
                </div>
            </div>
        `);

        // Auto-format room code input
        const roomCodeInput = modal.querySelector('#joinRoomCode');
        roomCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });

        // Handle join
        modal.querySelector('#confirmJoinGame').addEventListener('click', () => {
            const roomCode = roomCodeInput.value.trim();
            const playerName = modal.querySelector('#joinPlayerName').value.trim();

            if (roomCode.length !== 6) {
                Utils.showNotification('Please enter a valid 6-character room code', 'error');
                return;
            }

            if (!playerName) {
                Utils.showNotification('Please enter your name', 'error');
                return;
            }

            this.joinMultiplayerGame(roomCode, playerName);
            this.closeModal(modal);
        });

        // Handle cancel
        modal.querySelector('#cancelJoinGame').addEventListener('click', () => {
            this.closeModal(modal);
        });
    }

    /**
     * Start practice mode
     */
    startPracticeMode() {
        // Initialize single-player game
        this.gameEngine = new GameEngine();
        this.gameEngine.initialize({
            gameMode: 'classic',
            difficulty: 'medium',
            categories: ['science', 'history', 'geography', 'literature', 'math', 'sports'],
            multiplayer: false
        });

        // Add player
        this.gameEngine.addPlayer({
            id: 'practice_player',
            name: 'You',
            isHost: true
        });

        this.setupGameEventListeners();
        this.showScreen('gameScreen');
        this.gameEngine.startGame();
    }

    /**
     * Start game from setup
     */
    startGame() {
        const playerName = document.getElementById('playerName').value.trim();
        const gameMode = document.getElementById('gameMode').value;
        const difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
        const categories = Array.from(document.querySelectorAll('.category-item input:checked'))
            .map(input => input.value);

        if (!playerName) {
            Utils.showNotification('Please enter your name', 'error');
            return;
        }

        if (categories.length === 0) {
            Utils.showNotification('Please select at least one category', 'error');
            return;
        }

        // Initialize multiplayer
        this.multiplayerManager = new MultiplayerManager(this.gameEngine);
        this.gameEngine = new GameEngine();
        
        this.gameEngine.initialize({
            gameMode,
            difficulty,
            categories,
            multiplayer: true
        });

        this.setupGameEventListeners();
        this.setupMultiplayerEventListeners();

        // Connect and create room
        this.multiplayerManager.connect()
            .then(() => {
                return this.multiplayerManager.createRoom({
                    name: playerName,
                    gameConfig: { gameMode, difficulty, categories }
                });
            })
            .then((roomId) => {
                this.showWaitingRoom(roomId);
            })
            .catch((error) => {
                Utils.showNotification('Failed to create game: ' + error.message, 'error');
            });
    }

    /**
     * Show waiting room
     * @param {string} roomId - Room ID
     */
    showWaitingRoom(roomId) {
        document.getElementById('roomCodeDisplay').textContent = roomId;
        this.showScreen('waitingRoom');
    }

    /**
     * Setup game event listeners
     */
    setupGameEventListeners() {
        if (!this.gameEngine) return;

        this.gameEngine.on('questionLoaded', (data) => {
            this.displayQuestion(data.question);
            this.updateGameHUD(data);
        });

        this.gameEngine.on('answerSubmitted', (data) => {
            this.handleAnswerResult(data);
        });

        this.gameEngine.on('timerUpdate', (data) => {
            this.updateTimer(data);
        });

        this.gameEngine.on('gameEnded', (data) => {
            this.showGameOver(data);
        });

        this.gameEngine.on('powerupUsed', (data) => {
            this.updatePowerups(data);
        });
    }

    /**
     * Setup multiplayer event listeners
     */
    setupMultiplayerEventListeners() {
        if (!this.multiplayerManager) return;

        this.multiplayerManager.on('playerJoined', (data) => {
            this.updatePlayersList(data.players);
        });

        this.multiplayerManager.on('gameStart', () => {
            this.showScreen('gameScreen');
        });

        this.multiplayerManager.on('opponentAnswered', (data) => {
            this.showOpponentAnswer(data);
        });
    }

    /**
     * Display question
     * @param {Object} question - Question data
     */
    displayQuestion(question) {
        const questionText = document.getElementById('questionText');
        const categoryBadge = document.getElementById('categoryBadge');
        const difficultyBadge = document.getElementById('difficultyBadge');
        const answersGrid = document.getElementById('answersGrid');

        if (questionText) {
            this.animationController.typewriter(questionText, question.question, 30);
        }

        if (categoryBadge) {
            categoryBadge.textContent = question.category.charAt(0).toUpperCase() + question.category.slice(1);
        }

        if (difficultyBadge) {
            difficultyBadge.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
        }

        if (answersGrid) {
            answersGrid.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = option;
                button.addEventListener('click', () => this.selectAnswer(index));
                
                // Add ripple effect
                button.addEventListener('click', (e) => {
                    this.animationController.createRipple(button, e);
                });

                answersGrid.appendChild(button);
            });

            // Animate answers in
            this.animationController.staggerAnimation(
                answersGrid.children, 
                'fade-in-up', 
                100
            );
        }
    }

    /**
     * Select answer
     * @param {number} answerIndex - Selected answer index
     */
    selectAnswer(answerIndex) {
        if (this.multiplayerManager) {
            this.multiplayerManager.submitAnswer(answerIndex);
        } else {
            this.gameEngine.submitAnswer('practice_player', answerIndex);
        }

        // Disable all answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * Handle answer result
     * @param {Object} data - Answer result data
     */
    async handleAnswerResult(data) {
        const answerButtons = document.querySelectorAll('.answer-btn');
        const selectedButton = answerButtons[data.answerIndex];
        const correctButton = answerButtons[this.gameEngine.state.currentQuestion.correct];

        // Animate selected answer
        if (selectedButton) {
            await this.animationController.animateAnswerSelection(selectedButton, data.isCorrect);
        }

        // Show correct answer if wrong
        if (!data.isCorrect && correctButton) {
            correctButton.classList.add('correct');
            await this.animationController.animate(correctButton, 'pulse');
        }

        // Update scores
        this.updateScores(data.scores);

        // Play sound
        Utils.SoundUtils.play(data.isCorrect ? 'correctSound' : 'wrongSound');

        // Show explanation
        if (data.explanation) {
            this.showExplanation(data.explanation);
        }
    }

    /**
     * Update timer display
     * @param {Object} data - Timer data
     */
    updateTimer(data) {
        const timerText = document.getElementById('timerText');
        const timerProgress = document.getElementById('timerProgress');

        if (timerText) {
            timerText.textContent = data.timeLeft;
        }

        this.animationController.animateTimer(
            document.querySelector('.timer-container'),
            data.timeLeft,
            data.total
        );
    }

    /**
     * Update game HUD
     * @param {Object} data - Game data
     */
    updateGameHUD(data) {
        const currentRound = document.getElementById('currentRound');
        const questionNumber = document.getElementById('questionNumber');
        const totalQuestions = document.getElementById('totalQuestions');

        if (currentRound) currentRound.textContent = data.round;
        if (questionNumber) questionNumber.textContent = data.round;
        if (totalQuestions) totalQuestions.textContent = this.gameEngine.state.maxRounds;
    }

    /**
     * Update scores display
     * @param {Object} scores - Player scores
     */
    updateScores(scores) {
        Object.entries(scores).forEach(([playerId, score]) => {
            const scoreElement = document.getElementById(`${playerId}Score`) || 
                                document.getElementById('player1Score');
            
            if (scoreElement) {
                const oldScore = parseInt(scoreElement.textContent) || 0;
                this.animationController.animateScoreUpdate(scoreElement, score, score - oldScore);
            }
        });
    }

    /**
     * Show explanation
     * @param {string} explanation - Question explanation
     */
    showExplanation(explanation) {
        const modal = this.createModal('Explanation', `
            <div class="explanation-content">
                <p>${explanation}</p>
            </div>
        `, false);

        setTimeout(() => {
            this.closeModal(modal);
        }, 3000);
    }

    /**
     * Show game over screen
     * @param {Object} data - Game over data
     */
    showGameOver(data) {
        const gameResult = document.getElementById('gameResult');
        const winnerName = document.getElementById('winnerName');
        const finalScore = document.getElementById('finalScore');
        const gameDuration = document.getElementById('gameDuration');
        const accuracy = document.getElementById('accuracy');

        if (gameResult) {
            gameResult.textContent = data.winner ? 
                (data.winner.name === 'You' ? 'Victory!' : 'Game Over!') : 
                'Game Complete!';
        }

        if (winnerName && data.winner) {
            winnerName.textContent = data.winner.name;
        }

        if (finalScore) {
            const scores = Object.values(data.scores);
            finalScore.textContent = scores.join(' - ');
        }

        if (gameDuration && data.statistics) {
            gameDuration.textContent = Utils.formatTime(data.statistics.gameDuration);
        }

        if (accuracy && data.statistics) {
            accuracy.textContent = `${data.statistics.accuracy}%`;
        }

        // Create confetti for winner
        if (data.winner && data.winner.name === 'You') {
            this.animationController.createConfetti(document.getElementById('gameOverScreen'));
        }

        this.showScreen('gameOverScreen');
        this.updatePlayerStats();
    }

    /**
     * Use powerup
     * @param {string} powerupType - Powerup type
     */
    usePowerup(powerupType) {
        if (this.gameEngine) {
            const playerId = this.multiplayerManager ? 
                this.multiplayerManager.getPlayerId() : 'practice_player';
            
            if (this.gameEngine.usePowerup(playerId, powerupType)) {
                Utils.showNotification(`${powerupType.charAt(0).toUpperCase() + powerupType.slice(1)} used!`, 'info');
            } else {
                Utils.showNotification('No powerups remaining!', 'warning');
            }
        }
    }

    /**
     * Update powerups display
     * @param {Object} data - Powerup data
     */
    updatePowerups(data) {
        const powerups = data.powerups[data.playerId];
        if (!powerups) return;

        Object.entries(powerups).forEach(([type, count]) => {
            const button = document.getElementById(`${type}Powerup`);
            const countElement = button?.querySelector('.powerup-count');
            
            if (countElement) {
                countElement.textContent = count;
            }
            
            if (button) {
                button.disabled = count <= 0;
            }
        });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Answer selection (1-4 keys)
        if (e.key >= '1' && e.key <= '4' && this.currentScreen === 'gameScreen') {
            const answerIndex = parseInt(e.key) - 1;
            const answerButtons = document.querySelectorAll('.answer-btn');
            if (answerButtons[answerIndex] && !answerButtons[answerIndex].disabled) {
                this.selectAnswer(answerIndex);
            }
        }

        // Escape key to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Space for powerups
        if (e.key === ' ' && this.currentScreen === 'gameScreen') {
            e.preventDefault();
            this.usePowerup('skip');
        }

        // Theme switching (T key)
        if (e.key === 't' || e.key === 'T') {
            this.toggleThemeDropdown();
        }

        // Fullscreen (F key)
        if (e.key === 'f' || e.key === 'F') {
            this.toggleFullscreen();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update device type class
        document.body.className = document.body.className.replace(/device-\w+/, `device-${Utils.getDeviceType()}`);
        
        // Adjust UI for new size
        this.adjustUIForScreenSize();
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause game if playing
            if (this.gameEngine && this.gameEngine.state.status === 'playing') {
                this.gameEngine.pauseGame();
            }
            
            // Pause background music
            this.toggleBackgroundMusic(false);
        } else {
            // Resume game if paused
            if (this.gameEngine && this.gameEngine.state.status === 'paused') {
                this.gameEngine.resumeGame();
            }
            
            // Resume background music
            const musicEnabled = Utils.Storage.get('musicEnabled', true);
            this.toggleBackgroundMusic(musicEnabled);
        }
    }

    /**
     * Handle outside clicks
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
        // Close theme dropdown if clicking outside
        const themeDropdown = document.querySelector('.theme-dropdown');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeDropdown && themeDropdown.classList.contains('active') && 
            !themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
            this.hideThemeDropdown();
        }
    }

    /**
     * Create modal
     * @param {string} title - Modal title
     * @param {string} content - Modal content
     * @param {boolean} closable - Whether modal can be closed
     * @returns {HTMLElement} Modal element
     */
    createModal(title, content, closable = true) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    ${closable ? '<button class="modal-close"><i class="fas fa-times"></i></button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        if (closable) {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.closeModal(modal));
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
        }

        this.animationController.animate(modal, 'fade-in');
        return modal;
    }

    /**
     * Close modal
     * @param {HTMLElement} modal - Modal element
     */
    closeModal(modal) {
        this.animationController.animate(modal, 'fade-out')
            .then(() => modal.remove());
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal);
        });
    }

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Toggle background music
     * @param {boolean} enabled - Music state
     */
    toggleBackgroundMusic(enabled) {
        const music = document.getElementById('backgroundMusic');
        if (music) {
            if (enabled) {
                music.play().catch(() => {
                    // Autoplay prevented
                });
            } else {
                music.pause();
            }
        }
    }

    /**
     * Show settings modal
     */
    showSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('active');
            this.animationController.animate(modal, 'fade-in');
        }
    }

    /**
     * Hide settings modal
     */
    hideSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            this.animationController.animate(modal, 'fade-out')
                .then(() => modal.classList.remove('active'));
        }
    }

    /**
     * Copy room code to clipboard
     */
    async copyRoomCode() {
        const roomCode = document.getElementById('roomCodeDisplay').textContent;
        const success = await Utils.copyToClipboard(roomCode);
        
        if (success) {
            Utils.showNotification('Room code copied to clipboard!', 'success');
        } else {
            Utils.showNotification('Failed to copy room code', 'error');
        }
    }

    /**
     * Set player ready
     */
    setPlayerReady() {
        if (this.multiplayerManager) {
            this.multiplayerManager.setPlayerReady();
            document.getElementById('readyBtn').disabled = true;
            document.getElementById('readyBtn').textContent = 'Ready!';
        }
    }

    /**
     * Leave room
     */
    leaveRoom() {
        if (this.multiplayerManager) {
            this.multiplayerManager.leaveRoom();
            this.multiplayerManager.disconnect();
        }
        this.showScreen('mainMenu');
    }

    /**
     * Play again
     */
    playAgain() {
        if (this.gameEngine) {
            this.gameEngine.reset();
        }
        this.showScreen('gameSetup');
    }

    /**
     * Share result
     */
    shareResult() {
        const gameData = this.gameEngine.getState();
        const text = `I just played Flashcard Frenzy! Score: ${Object.values(gameData.scores)[0] || 0}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Flashcard Frenzy Result',
                text: text,
                url: window.location.href
            });
        } else {
            Utils.copyToClipboard(text + ' - ' + window.location.href);
            Utils.showNotification('Result copied to clipboard!', 'success');
        }
    }

    /**
     * Handle swipe gestures
     */
    handleSwipeUp() {
        // Implement swipe up action
    }

    handleSwipeDown() {
        // Implement swipe down action
    }

    handleSwipeLeft() {
        // Implement swipe left action
    }

    handleSwipeRight() {
        // Implement swipe right action
    }

    /**
     * Update ARIA labels for accessibility
     */
    updateAriaLabels() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    this.trapFocus(modal, e);
                }
            }
        });
    }

    /**
     * Setup screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }

    /**
     * Announce to screen readers
     * @param {string} message - Message to announce
     */
    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    /**
     * Update screen accessibility
     * @param {string} screenId - Current screen ID
     */
    updateScreenAccessibility(screenId) {
        // Update page title
        const titles = {
            mainMenu: 'Flashcard Frenzy - Main Menu',
            gameSetup: 'Flashcard Frenzy - Game Setup',
            waitingRoom: 'Flashcard Frenzy - Waiting Room',
            gameScreen: 'Flashcard Frenzy - Playing',
            gameOverScreen: 'Flashcard Frenzy - Game Over'
        };
        
        document.title = titles[screenId] || 'Flashcard Frenzy';
        
        // Announce screen change
        this.announce(`Navigated to ${titles[screenId] || screenId}`);
    }

    /**
     * Trap focus within element
     * @param {HTMLElement} element - Container element
     * @param {KeyboardEvent} e - Tab event
     */
    trapFocus(element, e) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Adjust UI for screen size
     */
    adjustUIForScreenSize() {
        const deviceType = Utils.getDeviceType();
        
        // Adjust font sizes for mobile
        if (deviceType === 'mobile') {
            document.documentElement.style.fontSize = '14px';
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    }

    /**
     * Destroy UI controller
     */
    destroy() {
        this.animationController.destroy();
        this.closeAllModals();
        
        if (this.multiplayerManager) {
            this.multiplayerManager.disconnect();
        }
    }
}

// Export for global use
window.UIController = UIController;