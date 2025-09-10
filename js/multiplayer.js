// Multiplayer System for Enhanced Flashcard Frenzy

/**
 * Simulated WebSocket Connection for Demo Purposes
 * In a real implementation, this would connect to a WebSocket server
 */
class SimulatedWebSocket {
    constructor(url) {
        this.url = url;
        this.readyState = WebSocket.CONNECTING;
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        
        // Simulate connection delay
        setTimeout(() => {
            this.readyState = WebSocket.OPEN;
            if (this.onopen) this.onopen();
        }, 1000);
    }

    send(data) {
        if (this.readyState === WebSocket.OPEN) {
            // Simulate network delay
            setTimeout(() => {
                this.simulateResponse(JSON.parse(data));
            }, 100 + Math.random() * 200);
        }
    }

    close() {
        this.readyState = WebSocket.CLOSED;
        if (this.onclose) this.onclose();
    }

    simulateResponse(message) {
        // Simulate server responses for demo
        const response = this.generateResponse(message);
        if (response && this.onmessage) {
            this.onmessage({ data: JSON.stringify(response) });
        }
    }

    generateResponse(message) {
        switch (message.type) {
            case 'join-room':
                return {
                    type: 'room-joined',
                    roomId: message.roomId,
                    playerId: message.playerId,
                    players: [
                        { id: message.playerId, name: message.playerName, ready: false },
                        { id: 'bot_player', name: 'AI Opponent', ready: true }
                    ]
                };
            
            case 'create-room':
                return {
                    type: 'room-created',
                    roomId: message.roomId,
                    playerId: message.playerId
                };
            
            case 'player-ready':
                return {
                    type: 'game-start',
                    players: [
                        { id: message.playerId, name: 'You', ready: true },
                        { id: 'bot_player', name: 'AI Opponent', ready: true }
                    ]
                };
            
            case 'submit-answer':
                // Simulate AI opponent answer
                setTimeout(() => {
                    if (this.onmessage) {
                        this.onmessage({
                            data: JSON.stringify({
                                type: 'answer-submitted',
                                playerId: 'bot_player',
                                answerIndex: Math.floor(Math.random() * 4),
                                responseTime: 2000 + Math.random() * 3000,
                                isCorrect: Math.random() > 0.3 // 70% chance of correct answer
                            })
                        });
                    }
                }, 1000 + Math.random() * 4000);
                
                return {
                    type: 'answer-received',
                    playerId: message.playerId,
                    answerIndex: message.answerIndex
                };
            
            default:
                return null;
        }
    }
}

/**
 * Multiplayer Manager Class
 */
class MultiplayerManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.connection = null;
        this.isHost = false;
        this.roomId = null;
        this.playerId = null;
        this.playerName = null;
        this.connectedPlayers = [];
        this.connectionStatus = 'disconnected';
        this.messageQueue = [];
        this.heartbeatInterval = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for game engine
     */
    setupEventListeners() {
        this.gameEngine.on('answerSubmitted', (data) => {
            this.broadcastMessage({
                type: 'answer-submitted',
                playerId: data.playerId,
                answerIndex: data.answerIndex,
                responseTime: data.responseTime,
                isCorrect: data.isCorrect
            });
        });

        this.gameEngine.on('powerupUsed', (data) => {
            this.broadcastMessage({
                type: 'powerup-used',
                playerId: data.playerId,
                powerupType: data.powerupType
            });
        });

        this.gameEngine.on('gameStarted', () => {
            this.broadcastMessage({
                type: 'game-started',
                gameState: this.gameEngine.getState()
            });
        });

        this.gameEngine.on('questionLoaded', (data) => {
            this.broadcastMessage({
                type: 'question-loaded',
                question: data.question,
                round: data.round,
                timeLimit: data.timeLimit
            });
        });
    }

    /**
     * Connect to multiplayer server
     * @param {string} serverUrl - WebSocket server URL
     * @returns {Promise} Connection promise
     */
    connect(serverUrl = 'ws://localhost:3001') {
        return new Promise((resolve, reject) => {
            try {
                // Use simulated WebSocket for demo
                this.connection = new SimulatedWebSocket(serverUrl);
                
                this.connection.onopen = () => {
                    this.connectionStatus = 'connected';
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    Utils.showNotification('Connected to multiplayer server', 'success');
                    resolve();
                };

                this.connection.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };

                this.connection.onclose = () => {
                    this.connectionStatus = 'disconnected';
                    this.stopHeartbeat();
                    Utils.showNotification('Disconnected from server', 'warning');
                    this.attemptReconnect();
                };

                this.connection.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    Utils.showNotification('Connection error', 'error');
                    reject(error);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
        this.connectionStatus = 'disconnected';
        this.stopHeartbeat();
    }

    /**
     * Create a new game room
     * @param {Object} playerInfo - Player information
     * @returns {Promise<string>} Room ID
     */
    createRoom(playerInfo) {
        return new Promise((resolve, reject) => {
            if (this.connectionStatus !== 'connected') {
                reject(new Error('Not connected to server'));
                return;
            }

            this.roomId = Utils.generateRoomId();
            this.playerId = Utils.generatePlayerId();
            this.playerName = playerInfo.name;
            this.isHost = true;

            const message = {
                type: 'create-room',
                roomId: this.roomId,
                playerId: this.playerId,
                playerName: this.playerName,
                gameConfig: playerInfo.gameConfig
            };

            this.sendMessage(message);

            // Set up temporary listener for room creation response
            const handleRoomCreated = (data) => {
                if (data.type === 'room-created' && data.roomId === this.roomId) {
                    this.gameEngine.addPlayer({
                        id: this.playerId,
                        name: this.playerName,
                        isHost: true
                    });
                    resolve(this.roomId);
                }
            };

            this.once('message', handleRoomCreated);
        });
    }

    /**
     * Join an existing game room
     * @param {string} roomId - Room ID to join
     * @param {Object} playerInfo - Player information
     * @returns {Promise} Join promise
     */
    joinRoom(roomId, playerInfo) {
        return new Promise((resolve, reject) => {
            if (this.connectionStatus !== 'connected') {
                reject(new Error('Not connected to server'));
                return;
            }

            this.roomId = roomId;
            this.playerId = Utils.generatePlayerId();
            this.playerName = playerInfo.name;
            this.isHost = false;

            const message = {
                type: 'join-room',
                roomId: this.roomId,
                playerId: this.playerId,
                playerName: this.playerName
            };

            this.sendMessage(message);

            // Set up temporary listener for join response
            const handleRoomJoined = (data) => {
                if (data.type === 'room-joined' && data.roomId === this.roomId) {
                    this.connectedPlayers = data.players;
                    data.players.forEach(player => {
                        this.gameEngine.addPlayer(player);
                    });
                    resolve(data);
                } else if (data.type === 'room-error') {
                    reject(new Error(data.message));
                }
            };

            this.once('message', handleRoomJoined);
        });
    }

    /**
     * Leave current room
     */
    leaveRoom() {
        if (this.roomId) {
            this.sendMessage({
                type: 'leave-room',
                roomId: this.roomId,
                playerId: this.playerId
            });

            this.roomId = null;
            this.isHost = false;
            this.connectedPlayers = [];
        }
    }

    /**
     * Mark player as ready
     */
    setPlayerReady() {
        if (this.roomId && this.playerId) {
            this.sendMessage({
                type: 'player-ready',
                roomId: this.roomId,
                playerId: this.playerId
            });
        }
    }

    /**
     * Start the game (host only)
     */
    startGame() {
        if (this.isHost && this.roomId) {
            this.sendMessage({
                type: 'start-game',
                roomId: this.roomId
            });
        }
    }

    /**
     * Submit answer in multiplayer game
     * @param {number} answerIndex - Selected answer index
     */
    submitAnswer(answerIndex) {
        if (this.roomId && this.playerId) {
            const responseTime = Date.now() - this.gameEngine.state.questionStartTime;
            
            this.sendMessage({
                type: 'submit-answer',
                roomId: this.roomId,
                playerId: this.playerId,
                answerIndex: answerIndex,
                responseTime: responseTime
            });
        }
    }

    /**
     * Use powerup in multiplayer game
     * @param {string} powerupType - Type of powerup
     */
    usePowerup(powerupType) {
        if (this.roomId && this.playerId) {
            this.sendMessage({
                type: 'use-powerup',
                roomId: this.roomId,
                playerId: this.playerId,
                powerupType: powerupType
            });
        }
    }

    /**
     * Send chat message
     * @param {string} message - Chat message
     */
    sendChatMessage(message) {
        if (this.roomId && this.playerId) {
            this.sendMessage({
                type: 'chat-message',
                roomId: this.roomId,
                playerId: this.playerId,
                playerName: this.playerName,
                message: message,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle incoming messages
     * @param {Object} data - Message data
     */
    handleMessage(data) {
        switch (data.type) {
            case 'player-joined':
                this.handlePlayerJoined(data);
                break;
            
            case 'player-left':
                this.handlePlayerLeft(data);
                break;
            
            case 'player-ready':
                this.handlePlayerReady(data);
                break;
            
            case 'game-start':
                this.handleGameStart(data);
                break;
            
            case 'question-loaded':
                this.handleQuestionLoaded(data);
                break;
            
            case 'answer-submitted':
                this.handleAnswerSubmitted(data);
                break;
            
            case 'powerup-used':
                this.handlePowerupUsed(data);
                break;
            
            case 'game-ended':
                this.handleGameEnded(data);
                break;
            
            case 'chat-message':
                this.handleChatMessage(data);
                break;
            
            case 'player-disconnected':
                this.handlePlayerDisconnected(data);
                break;
            
            case 'room-error':
                this.handleRoomError(data);
                break;
            
            default:
                console.log('Unknown message type:', data.type);
        }

        // Emit generic message event for temporary listeners
        this.emit('message', data);
    }

    /**
     * Handle player joined
     * @param {Object} data - Player data
     */
    handlePlayerJoined(data) {
        this.connectedPlayers.push(data.player);
        this.gameEngine.addPlayer(data.player);
        Utils.showNotification(`${data.player.name} joined the game`, 'info');
        this.emit('playerJoined', data);
    }

    /**
     * Handle player left
     * @param {Object} data - Player data
     */
    handlePlayerLeft(data) {
        this.connectedPlayers = this.connectedPlayers.filter(p => p.id !== data.playerId);
        this.gameEngine.removePlayer(data.playerId);
        Utils.showNotification(`Player left the game`, 'warning');
        this.emit('playerLeft', data);
    }

    /**
     * Handle player ready
     * @param {Object} data - Ready data
     */
    handlePlayerReady(data) {
        const player = this.connectedPlayers.find(p => p.id === data.playerId);
        if (player) {
            player.ready = true;
        }
        this.emit('playerReady', data);
    }

    /**
     * Handle game start
     * @param {Object} data - Game start data
     */
    handleGameStart(data) {
        this.gameEngine.startGame();
        this.emit('gameStart', data);
    }

    /**
     * Handle question loaded
     * @param {Object} data - Question data
     */
    handleQuestionLoaded(data) {
        // Sync question with other players
        this.emit('questionLoaded', data);
    }

    /**
     * Handle answer submitted
     * @param {Object} data - Answer data
     */
    handleAnswerSubmitted(data) {
        if (data.playerId !== this.playerId) {
            // Update UI for opponent's answer
            this.emit('opponentAnswered', data);
        }
    }

    /**
     * Handle powerup used
     * @param {Object} data - Powerup data
     */
    handlePowerupUsed(data) {
        if (data.playerId !== this.playerId) {
            // Apply powerup effects
            this.emit('opponentPowerup', data);
        }
    }

    /**
     * Handle game ended
     * @param {Object} data - Game end data
     */
    handleGameEnded(data) {
        this.emit('gameEnded', data);
    }

    /**
     * Handle chat message
     * @param {Object} data - Chat data
     */
    handleChatMessage(data) {
        this.emit('chatMessage', data);
    }

    /**
     * Handle player disconnected
     * @param {Object} data - Disconnect data
     */
    handlePlayerDisconnected(data) {
        Utils.showNotification(`${data.playerName} disconnected`, 'warning');
        this.emit('playerDisconnected', data);
    }

    /**
     * Handle room error
     * @param {Object} data - Error data
     */
    handleRoomError(data) {
        Utils.showNotification(data.message, 'error');
        this.emit('roomError', data);
    }

    /**
     * Send message to server
     * @param {Object} message - Message to send
     */
    sendMessage(message) {
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify(message));
        } else {
            // Queue message if not connected
            this.messageQueue.push(message);
        }
    }

    /**
     * Broadcast message to all players
     * @param {Object} message - Message to broadcast
     */
    broadcastMessage(message) {
        if (this.roomId) {
            this.sendMessage({
                ...message,
                roomId: this.roomId,
                broadcast: true
            });
        }
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.connection && this.connection.readyState === WebSocket.OPEN) {
                this.sendMessage({ type: 'ping' });
            }
        }, 30000); // Send ping every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            
            Utils.showNotification(`Reconnecting in ${delay/1000} seconds...`, 'info');
            
            setTimeout(() => {
                this.connect().catch(() => {
                    // Reconnection failed, will try again
                });
            }, delay);
        } else {
            Utils.showNotification('Failed to reconnect. Please refresh the page.', 'error');
        }
    }

    /**
     * Process queued messages
     */
    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }

    /**
     * Get connection status
     * @returns {string} Connection status
     */
    getConnectionStatus() {
        return this.connectionStatus;
    }

    /**
     * Get connected players
     * @returns {Array} Connected players
     */
    getConnectedPlayers() {
        return this.connectedPlayers;
    }

    /**
     * Check if player is host
     * @returns {boolean} True if host
     */
    isPlayerHost() {
        return this.isHost;
    }

    /**
     * Get current room ID
     * @returns {string|null} Room ID
     */
    getRoomId() {
        return this.roomId;
    }

    /**
     * Get player ID
     * @returns {string|null} Player ID
     */
    getPlayerId() {
        return this.playerId;
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.eventListeners) {
            this.eventListeners = {};
        }
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    /**
     * Add one-time event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this.eventListeners && this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data) {
        if (this.eventListeners && this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in multiplayer event listener for ${event}:`, error);
                }
            });
        }
    }
}

// Export for global use
window.MultiplayerManager = MultiplayerManager;
window.SimulatedWebSocket = SimulatedWebSocket;