// Animation Controller for Enhanced Flashcard Frenzy

/**
 * Animation Controller Class
 */
class AnimationController {
    constructor() {
        this.animationsEnabled = Utils.Storage.get('animationsEnabled', true);
        this.activeAnimations = new Map();
        this.particleSystems = new Map();
        this.setupAnimationObserver();
    }

    /**
     * Setup intersection observer for scroll animations
     */
    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerScrollAnimation(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
        }
    }

    /**
     * Enable or disable animations
     * @param {boolean} enabled - Animation state
     */
    setAnimationsEnabled(enabled) {
        this.animationsEnabled = enabled;
        Utils.Storage.set('animationsEnabled', enabled);
        
        if (!enabled) {
            this.clearAllAnimations();
        }
    }

    /**
     * Animate element with specified animation
     * @param {HTMLElement} element - Target element
     * @param {string} animationType - Animation type
     * @param {Object} options - Animation options
     * @returns {Promise} Animation completion promise
     */
    animate(element, animationType, options = {}) {
        if (!this.animationsEnabled) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const {
                duration = 600,
                delay = 0,
                easing = 'ease-out',
                callback = null
            } = options;

            // Clear any existing animation
            this.clearAnimation(element);

            // Apply animation class
            element.classList.add(`animate-${animationType}`);
            
            // Set custom properties if provided
            if (duration !== 600) {
                element.style.animationDuration = `${duration}ms`;
            }
            if (delay > 0) {
                element.style.animationDelay = `${delay}ms`;
            }
            if (easing !== 'ease-out') {
                element.style.animationTimingFunction = easing;
            }

            // Handle animation end
            const handleAnimationEnd = () => {
                element.classList.remove(`animate-${animationType}`);
                element.style.animationDuration = '';
                element.style.animationDelay = '';
                element.style.animationTimingFunction = '';
                element.removeEventListener('animationend', handleAnimationEnd);
                
                this.activeAnimations.delete(element);
                
                if (callback) callback();
                resolve();
            };

            element.addEventListener('animationend', handleAnimationEnd);
            this.activeAnimations.set(element, handleAnimationEnd);
        });
    }

    /**
     * Animate screen transition
     * @param {HTMLElement} fromScreen - Current screen
     * @param {HTMLElement} toScreen - Target screen
     * @param {string} direction - Transition direction
     * @returns {Promise} Transition completion promise
     */
    async transitionScreen(fromScreen, toScreen, direction = 'fade') {
        if (!this.animationsEnabled) {
            fromScreen.classList.remove('active');
            toScreen.classList.add('active');
            return Promise.resolve();
        }

        const transitions = {
            fade: {
                out: 'fade-out',
                in: 'fade-in-up'
            },
            slide: {
                out: direction === 'left' ? 'slide-out-left' : 'slide-out-right',
                in: direction === 'left' ? 'slide-in-right' : 'slide-in-left'
            },
            zoom: {
                out: 'zoom-out',
                in: 'zoom-in'
            }
        };

        const transition = transitions[direction] || transitions.fade;

        // Animate out current screen
        await this.animate(fromScreen, transition.out, { duration: 300 });
        fromScreen.classList.remove('active');

        // Show and animate in new screen
        toScreen.classList.add('active');
        await this.animate(toScreen, transition.in, { duration: 400 });
    }

    /**
     * Animate card flip
     * @param {HTMLElement} card - Card element
     * @param {Function} contentCallback - Callback to change content
     * @returns {Promise} Flip completion promise
     */
    async flipCard(card, contentCallback) {
        if (!this.animationsEnabled) {
            if (contentCallback) contentCallback();
            return Promise.resolve();
        }

        // First half of flip
        await this.animate(card, 'flip-out-y', { duration: 300 });
        
        // Change content
        if (contentCallback) contentCallback();
        
        // Second half of flip
        await this.animate(card, 'flip-in-y', { duration: 300 });
    }

    /**
     * Animate answer selection
     * @param {HTMLElement} answerElement - Answer button
     * @param {boolean} isCorrect - Whether answer is correct
     * @returns {Promise} Animation completion promise
     */
    async animateAnswerSelection(answerElement, isCorrect) {
        if (!this.animationsEnabled) {
            return Promise.resolve();
        }

        // Add selection class
        answerElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Animate selection
        if (isCorrect) {
            await this.animate(answerElement, 'bounce', { duration: 600 });
            this.createSuccessParticles(answerElement);
        } else {
            await this.animate(answerElement, 'shake', { duration: 500 });
        }
    }

    /**
     * Animate score update
     * @param {HTMLElement} scoreElement - Score display element
     * @param {number} newScore - New score value
     * @param {number} pointsAdded - Points added
     */
    async animateScoreUpdate(scoreElement, newScore, pointsAdded) {
        if (!this.animationsEnabled) {
            scoreElement.textContent = newScore;
            return Promise.resolve();
        }

        // Create floating points animation
        if (pointsAdded > 0) {
            this.createFloatingPoints(scoreElement, pointsAdded);
        }

        // Animate score counter
        await this.animateCounter(scoreElement, parseInt(scoreElement.textContent) || 0, newScore);
        
        // Pulse effect
        await this.animate(scoreElement, 'pulse', { duration: 400 });
    }

    /**
     * Animate counter from start to end value
     * @param {HTMLElement} element - Counter element
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Animation duration
     */
    animateCounter(element, start, end, duration = 1000) {
        if (!this.animationsEnabled) {
            element.textContent = end;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startTime = performance.now();
            const difference = end - start;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(start + (difference * easeOut));
                
                element.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    /**
     * Animate timer countdown
     * @param {HTMLElement} timerElement - Timer element
     * @param {number} timeLeft - Time remaining
     * @param {number} totalTime - Total time
     */
    animateTimer(timerElement, timeLeft, totalTime) {
        if (!this.animationsEnabled) return;

        const percentage = (timeLeft / totalTime) * 100;
        const progressCircle = timerElement.querySelector('.timer-progress');
        
        if (progressCircle) {
            const circumference = 2 * Math.PI * 45; // radius = 45
            const offset = circumference - (percentage / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        // Add warning animation when time is low
        if (timeLeft <= 5 && timeLeft > 0) {
            timerElement.classList.add('timer-warning');
            this.animate(timerElement, 'pulse', { duration: 1000 });
        } else {
            timerElement.classList.remove('timer-warning');
        }
    }

    /**
     * Create success particle effect
     * @param {HTMLElement} element - Source element
     */
    createSuccessParticles(element) {
        if (!this.animationsEnabled) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            this.createParticle(centerX, centerY, {
                color: '#22c55e',
                size: Math.random() * 4 + 2,
                velocity: {
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200
                },
                life: 1000 + Math.random() * 500
            });
        }
    }

    /**
     * Create floating points animation
     * @param {HTMLElement} element - Source element
     * @param {number} points - Points to display
     */
    createFloatingPoints(element, points) {
        if (!this.animationsEnabled) return;

        const rect = element.getBoundingClientRect();
        const floatingElement = document.createElement('div');
        floatingElement.className = 'floating-points';
        floatingElement.textContent = `+${points}`;
        floatingElement.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            color: #22c55e;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            transform: translateX(-50%);
        `;

        document.body.appendChild(floatingElement);

        // Animate upward and fade out
        floatingElement.animate([
            { transform: 'translateX(-50%) translateY(0px)', opacity: 1 },
            { transform: 'translateX(-50%) translateY(-50px)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        }).onfinish = () => {
            floatingElement.remove();
        };
    }

    /**
     * Create individual particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Particle options
     */
    createParticle(x, y, options = {}) {
        const {
            color = '#6366f1',
            size = 3,
            velocity = { x: 0, y: -50 },
            life = 1000,
            gravity = 0.5
        } = options;

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;

        document.body.appendChild(particle);

        // Animate particle
        let currentX = x;
        let currentY = y;
        let velocityX = velocity.x;
        let velocityY = velocity.y;
        let opacity = 1;
        const startTime = performance.now();

        const animateParticle = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / life;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            // Update position
            currentX += velocityX * 0.016; // 60fps
            currentY += velocityY * 0.016;
            velocityY += gravity;

            // Update opacity
            opacity = 1 - progress;

            // Apply styles
            particle.style.left = `${currentX}px`;
            particle.style.top = `${currentY}px`;
            particle.style.opacity = opacity;

            requestAnimationFrame(animateParticle);
        };

        requestAnimationFrame(animateParticle);
    }

    /**
     * Create confetti effect
     * @param {HTMLElement} container - Container element
     */
    createConfetti(container) {
        if (!this.animationsEnabled) return;

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const rect = container.getBoundingClientRect();

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle(
                    rect.left + Math.random() * rect.width,
                    rect.top,
                    {
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * 6 + 3,
                        velocity: {
                            x: (Math.random() - 0.5) * 300,
                            y: Math.random() * -200 - 100
                        },
                        life: 3000 + Math.random() * 2000,
                        gravity: 0.3
                    }
                );
            }, i * 50);
        }
    }

    /**
     * Animate element entrance with stagger
     * @param {NodeList|Array} elements - Elements to animate
     * @param {string} animationType - Animation type
     * @param {number} staggerDelay - Delay between elements
     */
    staggerAnimation(elements, animationType = 'fade-in-up', staggerDelay = 100) {
        if (!this.animationsEnabled) return;

        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animate(element, animationType);
            }, index * staggerDelay);
        });
    }

    /**
     * Animate progress bar
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} percentage - Target percentage
     * @param {number} duration - Animation duration
     */
    animateProgressBar(progressBar, percentage, duration = 1000) {
        if (!this.animationsEnabled) {
            progressBar.style.width = `${percentage}%`;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startWidth = parseFloat(progressBar.style.width) || 0;
            const targetWidth = Math.max(0, Math.min(100, percentage));
            const difference = targetWidth - startWidth;
            const startTime = performance.now();

            const updateProgress = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentWidth = startWidth + (difference * easeOut);
                
                progressBar.style.width = `${currentWidth}%`;

                if (progress < 1) {
                    requestAnimationFrame(updateProgress);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(updateProgress);
        });
    }

    /**
     * Trigger scroll animation
     * @param {HTMLElement} element - Element to animate
     */
    triggerScrollAnimation(element) {
        if (!this.animationsEnabled) return;

        const animationType = element.dataset.scrollAnimation || 'fade-in-up';
        const delay = parseInt(element.dataset.scrollDelay) || 0;
        
        setTimeout(() => {
            this.animate(element, animationType);
        }, delay);

        // Remove from observer
        this.observer.unobserve(element);
    }

    /**
     * Add element to scroll animation observer
     * @param {HTMLElement} element - Element to observe
     */
    observeForScrollAnimation(element) {
        if (this.observer && this.animationsEnabled) {
            this.observer.observe(element);
        }
    }

    /**
     * Clear animation from element
     * @param {HTMLElement} element - Target element
     */
    clearAnimation(element) {
        const handler = this.activeAnimations.get(element);
        if (handler) {
            element.removeEventListener('animationend', handler);
            this.activeAnimations.delete(element);
        }

        // Remove all animation classes
        const animationClasses = Array.from(element.classList).filter(cls => cls.startsWith('animate-'));
        element.classList.remove(...animationClasses);
        
        // Reset animation styles
        element.style.animationDuration = '';
        element.style.animationDelay = '';
        element.style.animationTimingFunction = '';
    }

    /**
     * Clear all active animations
     */
    clearAllAnimations() {
        this.activeAnimations.forEach((handler, element) => {
            this.clearAnimation(element);
        });
        this.activeAnimations.clear();

        // Remove all particles
        document.querySelectorAll('.particle, .floating-points').forEach(el => el.remove());
    }

    /**
     * Create typewriter effect
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed (ms per character)
     */
    typewriter(element, text, speed = 50) {
        if (!this.animationsEnabled) {
            element.textContent = text;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            element.textContent = '';
            let index = 0;

            const typeChar = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeChar, speed);
                } else {
                    resolve();
                }
            };

            typeChar();
        });
    }

    /**
     * Create ripple effect
     * @param {HTMLElement} element - Target element
     * @param {Event} event - Click event
     */
    createRipple(element, event) {
        if (!this.animationsEnabled) return;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Animate ripple
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            ripple.remove();
        };
    }

    /**
     * Destroy animation controller
     */
    destroy() {
        this.clearAllAnimations();
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.particleSystems.clear();
    }
}

// Export for global use
window.AnimationController = AnimationController;