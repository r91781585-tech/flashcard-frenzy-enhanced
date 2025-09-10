// Game Logic for Enhanced Flashcard Frenzy

/**
 * Game State Management
 */
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.gameId = null;
        this.roomId = null;
        this.players = [];
        this.currentPlayer = null;
        this.gameMode = 'classic';
        this.difficulty = 'medium';
        this.categories = ['science', 'history', 'geography', 'literature', 'math', 'sports'];
        this.status = 'waiting'; // waiting, playing, paused, finished
        this.round = 1;
        this.maxRounds = 10;
        this.timeLimit = 30;
        this.scores = {};
        this.streaks = {};
        this.powerups = {};
        this.currentQuestion = null;
        this.questionStartTime = null;
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.winner = null;
        this.statistics = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            averageResponseTime: 0,
            fastestAnswer: null,
            longestStreak: 0
        };
    }

    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            this.scores[player.id] = 0;
            this.streaks[player.id] = 0;
            this.powerups[player.id] = {
                skip: 3,
                hint: 2,
                freeze: 1
            };
            return true;
        }
        return false;
    }

    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
        delete this.scores[playerId];
        delete this.streaks[playerId];
        delete this.powerups[playerId];
    }

    updateScore(playerId, points) {
        if (this.scores[playerId] !== undefined) {
            this.scores[playerId] += points;
        }
    }

    updateStreak(playerId, correct) {
        if (this.streaks[playerId] !== undefined) {
            if (correct) {
                this.streaks[playerId]++;
                if (this.streaks[playerId] > this.statistics.longestStreak) {
                    this.statistics.longestStreak = this.streaks[playerId];
                }
            } else {
                this.streaks[playerId] = 0;
            }
        }
    }

    usePowerup(playerId, powerupType) {
        if (this.powerups[playerId] && this.powerups[playerId][powerupType] > 0) {
            this.powerups[playerId][powerupType]--;
            return true;
        }
        return false;
    }

    getLeader() {
        let leader = null;
        let maxScore = -1;
        
        for (const playerId in this.scores) {
            if (this.scores[playerId] > maxScore) {
                maxScore = this.scores[playerId];
                leader = this.players.find(p => p.id === playerId);
            }
        }
        
        return leader;
    }

    checkWinCondition() {
        switch (this.gameMode) {
            case 'classic':
                return Object.values(this.scores).some(score => score >= 10);
            case 'speed':
                return this.getElapsedTime() >= 120; // 2 minutes
            case 'survival':
                return this.players.some(player => this.getLives(player.id) <= 0);
            case 'tournament':
                return this.round > this.maxRounds;
            default:
                return false;
        }
    }

    getLives(playerId) {
        // For survival mode
        const wrongAnswers = this.statistics.wrongAnswers || 0;
        return Math.max(0, 3 - wrongAnswers);
    }

    getElapsedTime() {
        if (!this.gameStartTime) return 0;
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }

    getFormattedTime() {
        return Utils.formatTime(this.getElapsedTime());
    }
}

/**
 * Game Engine Class
 */
class GameEngine {
    constructor() {
        this.state = new GameState();
        this.flashcardManager = new FlashcardManager();
        this.timer = null;
        this.questionTimer = null;
        this.eventListeners = {};
        this.isMultiplayer = false;
        this.connection = null;
    }

    /**
     * Initialize the game
     * @param {Object} config - Game configuration
     */
    initialize(config = {}) {
        this.state.reset();
        this.state.gameMode = config.gameMode || 'classic';
        this.state.difficulty = config.difficulty || 'medium';
        this.state.categories = config.categories || this.state.categories;
        this.state.timeLimit = config.timeLimit || 30;
        this.state.maxRounds = config.maxRounds || 10;
        this.isMultiplayer = config.multiplayer || false;

        // Generate deck based on configuration
        this.flashcardManager.generateDeck({
            categories: this.state.categories,
            difficulty: this.state.difficulty,
            count: this.state.maxRounds
        });

        this.emit('gameInitialized', this.state);
    }

    /**
     * Start the game
     */
    startGame() {
        if (this.state.players.length === 0) {
            throw new Error('No players added to the game');
        }

        this.state.status = 'playing';
        this.state.gameStartTime = Date.now();
        this.state.round = 1;

        this.nextQuestion();
        this.emit('gameStarted', this.state);
    }

    /**
     * Load next question
     */
    nextQuestion() {
        if (this.state.checkWinCondition()) {
            this.endGame();
            return;
        }

        const question = this.flashcardManager.getCurrentQuestion();
        if (!question) {
            this.endGame();
            return;
        }

        this.state.currentQuestion = question;
        this.state.questionStartTime = Date.now();
        this.state.statistics.totalQuestions++;

        // Start question timer
        this.startQuestionTimer();

        this.emit('questionLoaded', {
            question: this.state.currentQuestion,
            round: this.state.round,
            timeLimit: this.state.timeLimit
        });
    }

    /**
     * Submit an answer
     * @param {string} playerId - Player ID
     * @param {number} answerIndex - Selected answer index
     */
    submitAnswer(playerId, answerIndex) {
        if (this.state.status !== 'playing' || !this.state.currentQuestion) {
            return;
        }

        const responseTime = Date.now() - this.state.questionStartTime;
        const isCorrect = this.flashcardManager.checkAnswer(answerIndex);
        
        // Update statistics
        if (isCorrect) {
            this.state.statistics.correctAnswers++;
            this.state.updateScore(playerId, this.calculatePoints(responseTime, isCorrect));
            this.state.updateStreak(playerId, true);
        } else {
            this.state.statistics.wrongAnswers++;
            this.state.updateStreak(playerId, false);
        }

        // Update fastest answer
        if (!this.state.statistics.fastestAnswer || responseTime < this.state.statistics.fastestAnswer) {
            this.state.statistics.fastestAnswer = responseTime;
        }

        // Calculate average response time
        this.state.statistics.averageResponseTime = 
            (this.state.statistics.averageResponseTime * (this.state.statistics.totalQuestions - 1) + responseTime) / 
            this.state.statistics.totalQuestions;

        this.clearQuestionTimer();

        this.emit('answerSubmitted', {
            playerId,
            answerIndex,
            isCorrect,
            responseTime,
            explanation: this.state.currentQuestion.explanation,
            scores: this.state.scores,
            streaks: this.state.streaks
        });

        // Move to next question after a delay
        setTimeout(() => {
            this.state.round++;
            this.flashcardManager.nextQuestion();
            this.nextQuestion();
        }, 3000);
    }

    /**
     * Calculate points based on response time and correctness
     * @param {number} responseTime - Response time in milliseconds
     * @param {boolean} isCorrect - Whether answer is correct
     * @returns {number} Points earned
     */
    calculatePoints(responseTime, isCorrect) {
        if (!isCorrect) return 0;

        const basePoints = 100;
        const timeBonus = Math.max(0, (this.state.timeLimit * 1000 - responseTime) / 1000);
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2
        }[this.state.difficulty] || 1;

        return Math.round((basePoints + timeBonus * 10) * difficultyMultiplier);
    }

    /**
     * Use a powerup
     * @param {string} playerId - Player ID
     * @param {string} powerupType - Type of powerup
     */
    usePowerup(playerId, powerupType) {
        if (!this.state.usePowerup(playerId, powerupType)) {
            return false;
        }

        switch (powerupType) {
            case 'skip':
                this.skipQuestion();
                break;
            case 'hint':
                this.showHint();
                break;
            case 'freeze':
                this.freezeOpponent(playerId);
                break;
        }

        this.emit('powerupUsed', {
            playerId,
            powerupType,
            powerups: this.state.powerups
        });

        return true;
    }

    /**
     * Skip current question
     */
    skipQuestion() {
        this.clearQuestionTimer();
        this.state.round++;
        this.flashcardManager.nextQuestion();
        this.nextQuestion();
    }

    /**
     * Show hint for current question
     */
    showHint() {
        if (!this.state.currentQuestion) return;

        // Remove one incorrect option
        const correctIndex = this.state.currentQuestion.correct;
        const incorrectIndices = [];
        
        for (let i = 0; i < this.state.currentQuestion.options.length; i++) {
            if (i !== correctIndex) {
                incorrectIndices.push(i);
            }
        }

        const removeIndex = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
        
        this.emit('hintShown', { removeIndex });
    }

    /**
     * Freeze opponent (multiplayer)
     * @param {string} playerId - Player who used the powerup
     */
    freezeOpponent(playerId) {
        const opponent = this.state.players.find(p => p.id !== playerId);
        if (opponent) {
            this.emit('playerFrozen', { playerId: opponent.id, duration: 5000 });
        }
    }

    /**
     * Start question timer
     */
    startQuestionTimer() {
        this.clearQuestionTimer();
        
        let timeLeft = this.state.timeLimit;
        this.questionTimer = setInterval(() => {
            timeLeft--;
            this.emit('timerUpdate', { timeLeft, total: this.state.timeLimit });
            
            if (timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    /**
     * Clear question timer
     */
    clearQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    /**
     * Handle time up
     */
    timeUp() {
        this.clearQuestionTimer();
        
        // In multiplayer, check if any player answered
        if (this.isMultiplayer) {
            // Auto-submit wrong answer for players who didn't respond
            this.state.players.forEach(player => {
                // This would be handled by the multiplayer system
            });
        } else {
            // Single player - treat as wrong answer
            this.state.statistics.wrongAnswers++;
            this.state.updateStreak(this.state.players[0].id, false);
        }

        this.emit('timeUp', {
            explanation: this.state.currentQuestion.explanation,
            correctAnswer: this.state.currentQuestion.correct
        });

        // Move to next question
        setTimeout(() => {
            this.state.round++;
            this.flashcardManager.nextQuestion();
            this.nextQuestion();
        }, 3000);
    }

    /**
     * Pause the game
     */
    pauseGame() {
        if (this.state.status === 'playing') {
            this.state.status = 'paused';
            this.clearQuestionTimer();
            this.emit('gamePaused', this.state);
        }
    }

    /**
     * Resume the game
     */
    resumeGame() {
        if (this.state.status === 'paused') {
            this.state.status = 'playing';
            this.startQuestionTimer();
            this.emit('gameResumed', this.state);
        }
    }

    /**
     * End the game
     */
    endGame() {
        this.state.status = 'finished';
        this.state.gameEndTime = Date.now();
        this.state.winner = this.state.getLeader();
        
        this.clearQuestionTimer();

        // Calculate final statistics
        const finalStats = {
            ...this.state.statistics,
            gameDuration: this.state.getElapsedTime(),
            accuracy: this.state.statistics.totalQuestions > 0 ? 
                Math.round((this.state.statistics.correctAnswers / this.state.statistics.totalQuestions) * 100) : 0,
            averageResponseTime: Math.round(this.state.statistics.averageResponseTime),
            fastestAnswer: this.state.statistics.fastestAnswer,
            finalScores: { ...this.state.scores },
            winner: this.state.winner
        };

        // Save game to history
        this.saveGameToHistory(finalStats);

        this.emit('gameEnded', {
            winner: this.state.winner,
            scores: this.state.scores,
            statistics: finalStats
        });
    }

    /**
     * Save game to local storage history
     * @param {Object} gameData - Game statistics and results
     */
    saveGameToHistory(gameData) {
        const history = Utils.Storage.get('gameHistory', []);
        const gameRecord = {
            id: Utils.generateRoomId(),
            timestamp: Date.now(),
            gameMode: this.state.gameMode,
            difficulty: this.state.difficulty,
            categories: this.state.categories,
            players: this.state.players.map(p => ({ id: p.id, name: p.name })),
            ...gameData
        };

        history.unshift(gameRecord);
        
        // Keep only last 50 games
        if (history.length > 50) {
            history.splice(50);
        }

        Utils.Storage.set('gameHistory', history);
        
        // Update player statistics
        this.updatePlayerStats(gameRecord);
    }

    /**
     * Update player statistics
     * @param {Object} gameRecord - Game record
     */
    updatePlayerStats(gameRecord) {
        const stats = Utils.Storage.get('playerStats', {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            bestStreak: 0,
            averageAccuracy: 0,
            totalQuestions: 0,
            totalCorrect: 0
        });

        stats.gamesPlayed++;
        stats.totalScore += Object.values(gameRecord.finalScores).reduce((a, b) => a + b, 0);
        stats.bestStreak = Math.max(stats.bestStreak, gameRecord.longestStreak);
        stats.totalQuestions += gameRecord.totalQuestions;
        stats.totalCorrect += gameRecord.correctAnswers;
        stats.averageAccuracy = stats.totalQuestions > 0 ? 
            Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

        if (gameRecord.winner && this.state.players.length > 0 && 
            gameRecord.winner.id === this.state.players[0].id) {
            stats.gamesWon++;
        }

        Utils.Storage.set('playerStats', stats);
    }

    /**
     * Get game history
     * @param {number} limit - Number of games to return
     * @returns {Array} Game history
     */
    getGameHistory(limit = 10) {
        const history = Utils.Storage.get('gameHistory', []);
        return history.slice(0, limit);
    }

    /**
     * Get player statistics
     * @returns {Object} Player statistics
     */
    getPlayerStats() {
        return Utils.Storage.get('playerStats', {
            gamesPlayed: 0,
            gamesWon: 0,
            winRate: 0,
            totalScore: 0,
            bestStreak: 0,
            averageAccuracy: 0
        });
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get current game state
     * @returns {Object} Current game state
     */
    getState() {
        return {
            ...this.state,
            flashcardStats: this.flashcardManager.getStats()
        };
    }

    /**
     * Add player to game
     * @param {Object} player - Player object
     * @returns {boolean} Success status
     */
    addPlayer(player) {
        const success = this.state.addPlayer(player);
        if (success) {
            this.emit('playerAdded', { player, players: this.state.players });
        }
        return success;
    }

    /**
     * Remove player from game
     * @param {string} playerId - Player ID
     */
    removePlayer(playerId) {
        this.state.removePlayer(playerId);
        this.emit('playerRemoved', { playerId, players: this.state.players });
    }

    /**
     * Reset game
     */
    reset() {
        this.clearQuestionTimer();
        this.state.reset();
        this.flashcardManager.reset();
        this.emit('gameReset');
    }
}

// Export for global use
window.GameEngine = GameEngine;
window.GameState = GameState;