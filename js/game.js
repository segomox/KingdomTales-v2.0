// Create StoryManager stub if it doesn't exist
if (!window.StoryManager) {
    window.StoryManager = {
        cards: {
            intro: [
                {
                    id: 'intro_1',
                    character: 'Royal Advisor',
                    text: 'Welcome to your kingdom, Your Majesty. Your decisions will shape the future of your people.',
                    image: 'assets/images/characters/default.png',
                    leftChoice: {
                        text: 'Focus on the economy',
                        effects: { treasury: 5, people: 3, army: -2, religion: 0 }
                    },
                    rightChoice: {
                        text: 'Strengthen the military',
                        effects: { treasury: -3, people: -1, army: 5, religion: 0 }
                    }
                }
            ],
            general: [
                {
                    id: 'general_1',
                    character: 'General',
                    text: 'Your army needs more resources to defend the kingdom, Your Majesty.',
                    image: 'assets/images/characters/default.png',
                    leftChoice: {
                        text: 'Provide more funding',
                        effects: { treasury: -5, army: 7, people: -2, religion: 0 }
                    },
                    rightChoice: {
                        text: 'Maintain current funding',
                        effects: { treasury: 2, army: -3, people: 0, religion: 0 }
                    }
                }
            ]
        },
        findCardById: (id) => {
            // Search through all card categories
            for (const category in StoryManager.cards) {
                const foundCard = StoryManager.cards[category].find(card => card.id === id);
                if (foundCard) return foundCard;
            }
            return null;
        }
    };
    console.log('Story manager initialized successfully');
}

// Create VisualEffects stub if it doesn't exist
if (!window.VisualEffects) {
    window.VisualEffects = {
        showCard: async () => {},
        hideCard: async () => {},
        updateStats: (stat, value, change, highlight = false) => {
            console.log(`Stat update: ${stat} = ${value} (${change > 0 ? '+' : ''}${change})`);
            const statElement = document.getElementById(`${stat}-stat`);
            if (statElement) {
                statElement.textContent = value;
            }
        },
        showAchievement: (title, description) => {
            console.log(`Achievement: ${title} - ${description}`);
        },
        handleError: (error, context) => {
            console.error(`Error in ${context}:`, error);
        }
    };
    // Dispatch event to indicate VisualEffects is ready
    window.dispatchEvent(new Event('visualEffectsReady'));
    console.log('Visual effects initialized successfully');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Audio Manager
const AudioManager = {
    sounds: {},
    state: {
        enabled: false,
        isMusicPlaying: false,
        volume: {
            ambient: 0.5,
            sfx: 0.7
        }
    },
    
    async init() {
        try {
            // Check if the browser supports Audio API
            if (typeof Audio === 'undefined') {
                console.warn('Audio API not supported in this browser');
                this.state.enabled = false;
                return;
            }
            
            const audioFiles = {
                ambient: 'assets/audio/ambient.mp3',
                choice: 'assets/audio/choice.mp3',
                statChange: 'assets/audio/stat-change.mp3',
                achievement: 'assets/audio/achievement.mp3',
                gameOver: 'assets/audio/game-over.mp3'
            };
            
            // Check if audio directory exists
            const audioExists = await this.checkAudioFilesExist();
            if (!audioExists) {
                console.warn('Audio files not available, disabling audio');
                this.state.enabled = false;
                return;
            }
            
            for (const [name, path] of Object.entries(audioFiles)) {
                try {
                    const audio = new Audio();
                    audio.preload = 'auto';
                    audio.src = path;
                    this.sounds[name] = audio;
                    
                    if (name === 'ambient') {
                        audio.loop = true;
                        audio.volume = this.state.volume.ambient;
                    } else if (name === 'choice') {
                        audio.volume = this.state.volume.sfx * 0.3; // Lower volume for choice sound
                    } else {
                        audio.volume = this.state.volume.sfx;
                    }
                    
                    // Add error handling for each audio file
                    audio.onerror = (error) => {
                        console.error(`Audio load error (${name}):`, error);
                        this.handleAudioError(name, error);
                    };
                    
                } catch (error) {
                    console.error(`Audio initialization error (${name}):`, error);
                    this.handleAudioError(name, error);
                }
            }
            
            console.log('Audio manager initialized successfully');
        } catch (error) {
            console.error('Audio manager initialization error:', error);
            this.handleAudioError('init', error);
        }
    },
    
    async checkAudioFilesExist() {
        try {
            const testAudioFiles = [
                'assets/audio/ambient.mp3',
                'assets/audio/choice.mp3',
                'assets/audio/stat-change.mp3'
            ];

            // Create dummy audio elements for testing
            const testResults = await Promise.all(testAudioFiles.map(file => {
                return new Promise(resolve => {
                    const audio = new Audio();
                    audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
                    audio.addEventListener('error', () => resolve(false), { once: true });
                    audio.src = file;
                });
            }));

            // If any audio file is available, return true
            return testResults.some(result => result);
        } catch (error) {
            console.warn('Audio check warning:', error);
            return false;
        }
    },
    
    handleAudioError(soundName, error) {
        // Create a dummy audio object for failed sounds
        this.sounds[soundName] = {
            play: () => console.warn(`Audio playback skipped (${soundName}): Audio not available`),
            pause: () => {},
            currentTime: 0
        };
    },
    
    async unlock() {
        try {
            this.state.enabled = true;
            const ambient = this.sounds.ambient;
            if (ambient) {
                await ambient.play();
                ambient.pause();
                ambient.currentTime = 0;
            }
        } catch (error) {
            console.warn("Audio unlock warning:", error);
            this.state.enabled = false;
        }
    },
    
    async play(soundName) {
        if (!this.state.enabled) return;
        
        try {
            const sound = this.sounds[soundName];
            if (!sound) return;
            
            // If it's already playing, don't interrupt
            if (sound.currentTime > 0 && !sound.paused && !sound.ended) {
                return;
            }
            
            sound.currentTime = 0;
            const playPromise = sound.play();
            
            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name === 'NotAllowedError') {
                        // Autoplay was prevented, unlock on next user interaction
                        this.state.enabled = false;
                        const unlockAudio = () => {
                            this.unlock();
                            document.removeEventListener('click', unlockAudio);
                            document.removeEventListener('touchstart', unlockAudio);
                        };
                        document.addEventListener('click', unlockAudio);
                        document.addEventListener('touchstart', unlockAudio);
                    } else {
                        console.warn(`Audio play error (${soundName}):`, error);
                    }
                });
            }
        } catch (error) {
            console.warn(`Audio play error (${soundName}):`, error);
        }
    },
    
    stop(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        } catch (error) {
            console.warn(`Audio stop error (${soundName}):`, error);
        }
    },
    
    async toggleMusic() {
        if (!this.state.enabled) return;
        
        try {
            const ambient = this.sounds.ambient;
            if (!ambient) return;
            
            if (this.state.isMusicPlaying) {
                ambient.pause();
                this.state.isMusicPlaying = false;
            } else {
                await ambient.play();
                this.state.isMusicPlaying = true;
            }
            
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) {
                musicToggle.classList.toggle('playing', this.state.isMusicPlaying);
            }
        } catch (error) {
            console.warn("Music toggle error:", error);
            this.state.isMusicPlaying = false;
        }
    },
    
    setVolume(type, value) {
        try {
            const volume = Math.max(0, Math.min(1, value));
            if (type === 'ambient') {
                this.state.volume.ambient = volume;
                if (this.sounds.ambient) {
                    this.sounds.ambient.volume = volume;
                }
            } else {
                this.state.volume.sfx = volume;
                Object.values(this.sounds).forEach(sound => {
                    if (sound !== this.sounds.ambient) {
                        sound.volume = volume;
                    }
                });
            }
        } catch (error) {
            console.warn(`Volume set error (${type}):`, error);
        }
    }
};

// Game Class (Düzeltmeler burada)
class Game {
    constructor() {
        console.log('Game initializing...');
        this.imageCache = new Map(); // Add image cache
        this.initializeState();
        this.initializeElements();
        this.initializeGame();
        
        // No longer using the performance monitoring system
    }

    async initializeAudio() {
        try {
            // Initialize audio manager with fallback behavior
            await AudioManager.init();
            
            // Even if audio files aren't available, we'll set up the controls
            // Setup initial volume (will be ignored if audio is disabled)
            AudioManager.setVolume('ambient', 0.5);
            AudioManager.setVolume('sfx', 0.7);
            
            // Add audio unlocking on first user interaction
            const unlockAudio = async () => {
                await AudioManager.unlock();
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
            };
            
            document.addEventListener('click', unlockAudio);
            document.addEventListener('touchstart', unlockAudio);
            
            // Setup music toggle button with fallback behavior
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) {
                musicToggle.addEventListener('click', () => {
                    AudioManager.toggleMusic();
                });
                // Add initial state class
                musicToggle.classList.toggle('playing', AudioManager.state.isMusicPlaying);
            }
            
            return true;
        } catch (error) {
            console.warn('Audio initialization warning:', error);
            // Return true to allow game to continue without audio
            return true;
        }
    }

    initializeState() {
        // Try to load saved state
        const savedState = this.loadSavedState();
        this.state = savedState || {
            stats: {
                people: 50,
                army: 50,
                treasury: 50,
                religion: 50
            },
            usedCardIds: [], // Initialize as empty array
            achievements: new Set(),
            isThroneConflict: false,
            isSpecialEvent: false,
            gameOver: false,
            endingType: null,
            currentCard: null,
            lastSaved: null
        };

        // Ensure usedCardIds is always an array
        if (!Array.isArray(this.state.usedCardIds)) {
            this.state.usedCardIds = [];
        }
    }

    initializeElements() {
        this.elements = {
            gameContainer: document.getElementById('game-container'),
            card: document.getElementById('card'),
            characterImage: document.getElementById('character-image'),
            characterName: document.getElementById('character-name'),
            cardText: document.getElementById('card-text'),
            leftChoice: document.getElementById('left-choice'),
            rightChoice: document.getElementById('right-choice'),
            stats: {
                people: document.getElementById('people-stat'),
                army: document.getElementById('army-stat'),
                treasury: document.getElementById('treasury-stat'),
                religion: document.getElementById('religion-stat')
            },
            gameOverElement: document.getElementById('game-over'),
            loadingScreen: document.getElementById('loading-screen'),
            progressBar: document.getElementById('progress-bar'),
            loadingText: document.getElementById('loading-text'),
            resetButton: document.getElementById('reset-button')
        };
        
        // Log missing elements
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                console.warn(`Missing element: ${key}`);
            }
        });
    }
    
    showErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '50%';
        errorElement.style.left = '50%';
        errorElement.style.transform = 'translate(-50%, -50%)';
        errorElement.style.background = 'rgba(0, 0, 0, 0.8)';
        errorElement.style.color = 'white';
        errorElement.style.padding = '20px';
        errorElement.style.borderRadius = '10px';
        errorElement.style.zIndex = '9999';
        errorElement.style.maxWidth = '80%';
        errorElement.style.textAlign = 'center';
        
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
    }

    async initializeGame() {
        try {
            // Show loading screen immediately
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.style.display = 'flex';
                this.elements.loadingScreen.style.opacity = '1';
            }
            
            // Update loading progress
            this.updateLoadingProgress(10, 'Oyun sistemleri başlatılıyor...');
            
            // Initialize systems in sequence for better progress tracking
            await this.initializeAudio();
            this.updateLoadingProgress(30, 'Ses sistemi hazır...');
            
            // Initialize story manager
            if (!window.StoryManager) {
                throw new Error('Story manager not initialized');
            }
            this.updateLoadingProgress(50, 'Hikaye sistemi hazır...');
            
            // Initialize visual effects
            if (!window.VisualEffects) {
                throw new Error('Visual effects not initialized');
            }
            this.updateLoadingProgress(70, 'Görsel efektler hazır...');
            
            // Setup event handlers
            this.setupEventListeners();
            this.updateLoadingProgress(80, 'Kontroller hazırlanıyor...');
            
            // Initialize accessibility features
            this.initializeAccessibility();
            this.updateLoadingProgress(90, 'Erişilebilirlik özellikleri hazır...');
            
            // Start game loop with first card
            await this.loadRandomCard();
            
            // Complete loading
            this.updateLoadingProgress(100, 'Oyun hazır!');
            
            // Hide loading screen with animation after a short delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
            
            // Start auto-save interval
            this.startAutoSave();
            
            console.log('Game initialization completed successfully');
            
        } catch (error) {
            console.error('Game initialization error:', error);
            // Show error to user but allow game to continue
            this.showError('Oyun başlatılırken bir hata oluştu. Bazı özellikler devre dışı olabilir.');
            
            // Try to continue with minimal features
            await this.initializeMinimal();
        }
    }
    
    updateLoadingProgress(percentage, message) {
        try {
            if (this.elements.progressBar) {
                this.elements.progressBar.style.width = `${percentage}%`;
                this.elements.progressBar.style.transition = 'width 0.3s ease-out';
            }
            
            if (this.elements.loadingText) {
                this.elements.loadingText.textContent = message;
                this.elements.loadingText.style.opacity = '1';
            }
            
            // Log progress for debugging
            console.log(`Loading progress: ${percentage}% - ${message}`);
        } catch (error) {
            console.warn('Error updating loading progress:', error);
        }
    }
    
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            // Fade out loading screen
            this.elements.loadingScreen.style.opacity = '0';
            this.elements.loadingScreen.style.transition = 'opacity 0.5s ease-out';
            
            // After fade out, hide completely and show game container
            setTimeout(() => {
                if (this.elements.loadingScreen) {
                    this.elements.loadingScreen.style.display = 'none';
                }
                if (this.elements.gameContainer) {
                    this.elements.gameContainer.style.opacity = '1';
                    this.elements.gameContainer.style.transition = 'opacity 0.5s ease-in';
                }
            }, 500);
        }
        
        // Show game container even if loading screen doesn't exist
        if (this.elements.gameContainer) {
            this.elements.gameContainer.style.opacity = '1';
            this.elements.gameContainer.style.transition = 'opacity 0.5s ease-in';
        }
    }
    
    setupEventListeners() {
        // Add choice button listeners
        if (this.elements.leftChoice) {
            this.elements.leftChoice.addEventListener('click', () => {
                this.handleChoice(0);
            });
        }

        if (this.elements.rightChoice) {
            this.elements.rightChoice.addEventListener('click', () => {
                this.handleChoice(1);
            });
        }

        // Add reset button listener
        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => {
                this.resetGame();
            });
        }
    }

    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = `An error occurred${context ? ` while ${context}` : ''}. Please try again.`;
        
        // Position the error message
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translateX(-50%)';
        errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '10px 20px';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.zIndex = '9999';
        
        document.body.appendChild(errorMessage);
        
        // Remove the error message after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        }, 5000);
    }

    async showCard(card) {
        try {
            if (!card) {
                console.error('Invalid card data');
                return false;
            }
            
            console.log('Showing card:', card);
            
            // Update character image
            if (this.elements.characterImage) {
                this.elements.characterImage.src = card.image || 'assets/images/characters/default.png';
            }
            
            // Update card text
            if (this.elements.cardText) {
                this.elements.cardText.textContent = card.text || '';
            }
            
            // Update character name if available
            if (this.elements.characterName) {
                this.elements.characterName.textContent = card.character || '';
            }
            
            // Update choice buttons
            if (this.elements.leftChoice && card.leftChoice) {
                this.elements.leftChoice.textContent = card.leftChoice.text || '';
                this.elements.leftChoice.disabled = false;
            }
            
            if (this.elements.rightChoice && card.rightChoice) {
                this.elements.rightChoice.textContent = card.rightChoice.text || '';
                this.elements.rightChoice.disabled = false;
            }
            
            // Play card change sound
            if (AudioManager && AudioManager.state.enabled) {
                AudioManager.play('choice');
            }
            
            return true;
        } catch (error) {
            console.error('Error showing card:', error);
            return false;
        }
    }
    
    updateAriaLabels() {
        // Update ARIA labels for better accessibility
        if (this.elements.card) {
            this.elements.card.setAttribute('aria-label', 'Oyun kartı');
        }
        
        if (this.elements.cardText) {
            this.elements.cardText.setAttribute('role', 'article');
            this.elements.cardText.setAttribute('aria-label', 'Kart metni');
        }
        
        if (this.elements.characterImage) {
            this.elements.characterImage.setAttribute('alt', 'Karakter görseli');
        }
    }
    
    autoSave() {
        try {
            // Convert Set to Array for JSON serialization
            const stateToSave = {
                ...this.state,
                achievements: Array.from(this.state.achievements)
            };
            
            this.state.lastSaved = new Date().toISOString();
            localStorage.setItem('gameState', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }

    async preloadAssets() {
        try {
            const assetsToPreload = {
                images: [],
                audio: []
            };
            
            // Collect initial card images
            const initialCards = [
                StoryManager.findCardById('intro1'),
                ...Object.values(StoryManager.cards)
                    .slice(0, 2)
                    .flatMap(category => category.slice(0, 2))
            ];
            
            // Collect all image paths from these cards
            for (const card of initialCards) {
                if (card?.image) assetsToPreload.images.push(card.image);
            }
            
            // Add essential audio
            assetsToPreload.audio = [
                'assets/audio/ambient.mp3',
                'assets/audio/choice.mp3',
                'assets/audio/stat-change.mp3'
            ];
            
            // Add default/fallback images
            assetsToPreload.images.push(
                'assets/images/characters/default.png',
                'assets/images/backgrounds/default-bg.jpg',
                'assets/images/events/default-event.png'
            );
            
            // Load the essential assets first
            await this.loadEssentialAssets(assetsToPreload);
            
            // Continue with non-essential preloading in the background
            this.preloadNonEssentialAssets();
            
            return true;
        } catch (error) {
            console.error('Error preloading assets:', error);
            return false;
        }
    }
    
    async loadEssentialAssets(assets) {
        const totalAssets = assets.images.length + assets.audio.length;
        let loadedAssets = 0;
        
        const loadWithProgress = async (loader, src) => {
            await loader(src);
            loadedAssets++;
            const progress = Math.floor((loadedAssets / totalAssets) * 100);
            this.updateLoadingProgress(progress, `Yükleniyor... ${progress}%`);
        };
        
        // First load images in parallel with a limit
        const concurrentLimit = 3;
        for (let i = 0; i < assets.images.length; i += concurrentLimit) {
            const batch = assets.images.slice(i, i + concurrentLimit);
            await Promise.all(batch.map(src => loadWithProgress(this.loadImage.bind(this), src)));
        }
        
        // Then load audio files with limited concurrency
        for (let i = 0; i < assets.audio.length; i += 2) {
            const batch = assets.audio.slice(i, i + 2);
            await Promise.all(batch.map(src => loadWithProgress(this.loadAudio.bind(this), src)));
        }
    }
    
    preloadNonEssentialAssets() {
        // This runs in the background after the game has started
        setTimeout(async () => {
            try {
                // Collect all remaining cards
                const remainingCards = Object.values(StoryManager.cards)
                    .flatMap(category => category)
                    .filter(card => card?.image);
                
                // Load their images in small batches
                const batchSize = 2;
                for (let i = 0; i < remainingCards.length; i += batchSize) {
                    const batch = remainingCards.slice(i, i + batchSize);
                    await Promise.all(batch.map(card => this.loadImage(card.image)));
                    
                    // Brief pause between batches to not affect main thread
                    await new Promise(r => setTimeout(r, 100));
                }
            } catch (error) {
                console.warn('Non-essential asset preloading error:', error);
            }
        }, 2000);
    }

    loadImage(src, timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (!src || typeof src !== 'string') {
                console.warn('Invalid image source:', src);
                return resolve(this.getFallbackImage('invalid'));
            }
            
            const img = new Image();
            let timeoutId;
            
            img.onload = () => {
                if (timeoutId) clearTimeout(timeoutId);
                resolve(img);
            };
            
            img.onerror = () => {
                if (timeoutId) clearTimeout(timeoutId);
                console.warn(`Failed to load image: ${src}`);
                resolve(this.getFallbackImage(src));
            };
            
            // Set a timeout to prevent hanging
            timeoutId = setTimeout(() => {
                console.warn(`Image load timeout: ${src}`);
                resolve(this.getFallbackImage(src));
            }, timeout);
            
            // Start loading
            img.src = src;
            
            // For cached images, the onload event might have already fired
            if (img.complete) {
                if (timeoutId) clearTimeout(timeoutId);
                resolve(img);
            }
        });
    }
    
    getFallbackImage(failedSrc) {
        // Create a reusable fallback image based on the type of image that failed
        const img = new Image();
        
        if (failedSrc.includes('characters')) {
            img.src = 'assets/images/characters/default.png';
        } else if (failedSrc.includes('backgrounds')) {
            img.src = 'assets/images/backgrounds/default-bg.jpg';
        } else if (failedSrc.includes('events')) {
            img.src = 'assets/images/events/default-event.png';
        } else {
            // Create a canvas fallback if no appropriate image
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#f4d03f';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Image Not Found', 100, 100);
            
            img.src = canvas.toDataURL();
        }
        
        return img;
    }
    
    loadAudio(src, timeout = 5000) {
        return new Promise((resolve) => {
            const audio = new Audio();
            
            // Setup timeout
            const timeoutId = setTimeout(() => {
                console.warn(`Audio load timeout: ${src}, using silent fallback`);
                resolve(this.getFallbackAudio());
            }, timeout);
            
            audio.oncanplaythrough = () => {
                clearTimeout(timeoutId);
                resolve(audio);
            };
            
            audio.onerror = () => {
                clearTimeout(timeoutId);
                console.warn(`Failed to load audio: ${src}, using silent fallback`);
                resolve(this.getFallbackAudio());
            };
            
            audio.src = src;
        });
    }
    
    getFallbackAudio() {
        // Return a non-functional audio object
        return {
            play: () => {}, 
            pause: () => {},
            currentTime: 0,
            volume: 0,
            loop: false
        };
    }
    
    startThroneConflictTimer() {
        // Clear existing timer if any
        if (this.throneConflictTimer) {
            clearTimeout(this.throneConflictTimer);
        }
        
        const turnsUntilConflict = Math.floor(Math.random() * 20) + 20;
        this.throneConflictTimer = setTimeout(() => {
            if (!this.state.gameOver) this.triggerThroneConflict();
        }, turnsUntilConflict * 2000);
    }
    
    async loadCard(cardId) {
        try {
            if (!cardId) {
                console.warn('No card ID provided, loading random card');
                return this.loadRandomCard();
            }

            // Check if card exists before loading
            const card = StoryManager.findCardById(cardId);
            if (!card) {
                console.warn(`Card not found: ${cardId}, loading random card`);
                return this.loadRandomCard();
            }

            // Add to used cards only if successfully loaded
            this.state.usedCardIds.push(cardId);
            
            // Show card and return success
            const success = await this.showCard(card);
            if (!success) {
                throw new Error('Failed to show card');
            }
            
            return card;
        } catch (error) {
            console.error('Error loading card:', error);
            this.handleError(error, 'loadCard');
            return null;
        }
    }
    
    async loadRandomCard() {
        try {
            // Check if StoryManager exists and has cards
            if (!window.StoryManager || !StoryManager.cards) {
                console.error('StoryManager or cards not available');
                return this.loadFallbackCard();
            }
            
            // Initialize usedCardIds if needed
            if (!Array.isArray(this.state.usedCardIds)) {
                this.state.usedCardIds = [];
            }
            
            // Get all available cards
            const allCards = [];
            for (const category in StoryManager.cards) {
                if (Array.isArray(StoryManager.cards[category])) {
                    allCards.push(...StoryManager.cards[category]);
                }
            }
            
            // Filter out used cards
            const availableCards = allCards.filter(card => 
                card && card.id && !this.state.usedCardIds.includes(card.id)
            );
            
            // If no cards available, reset used cards and try again
            if (availableCards.length === 0) {
                console.log('All cards used, resetting card pool');
                this.state.usedCardIds = [];
                return this.loadRandomCard();
            }
            
            // Select random card
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const selectedCard = availableCards[randomIndex];
            
            // Store the current card before showing new one
            this.state.currentCard = selectedCard;
            
            // Show card
            const success = await this.showCard(selectedCard);
            if (!success) {
                throw new Error('Failed to show card');
            }
            
            // Mark card as used
            if (selectedCard.id) {
                this.state.usedCardIds.push(selectedCard.id);
            }
            
            return selectedCard;
        } catch (error) {
            console.error('Error loading random card:', error);
            return this.loadFallbackCard();
        }
    }
    
    triggerThroneConflict() {
        if (this.state.gameOver || this.state.isThroneConflict) return;
        this.state.isThroneConflict = true;
        AudioManager.play('gameOver');
        
        const conflict = {
            id: 'throne_conflict',
            title: 'Taht Çatışması',
            description: 'Krallığınızda bir taht çatışması başladı! Güçlü bir rakip, tahtınızı ele geçirmek istiyor.',
            image: 'assets/images/events/throne-conflict.png',
            choices: [
                { text: 'Savaş ve diren', effects: { army: -20, people: -10, treasury: -15, religion: -5 } },
                { text: 'Tahttan çekil', effects: { army: -5, people: 10, treasury: -5, religion: 5 } }
            ]
        };
        this.loadThroneConflict(conflict);
    }
    
    async loadThroneConflict(conflict) {
        try {
            await VisualEffects.hideCard();
            if (this.elements.characterImage) 
                this.elements.characterImage.src = conflict.image;
            if (this.elements.cardText)
                this.elements.cardText.textContent = conflict.description;
            if (this.elements.card) {
                this.elements.card.classList.add('throne-conflict');
                this.elements.card.classList.remove('special-event');
            }
            this.state.currentCard = {
                id: conflict.id,
                choices: [
                    { text: conflict.choices[0].text, effects: conflict.choices[0].effects },
                    { text: conflict.choices[1].text, effects: conflict.choices[1].effects }
                ]
            };
            await this.showCard();
        } catch (error) {
            console.error('Error loading throne conflict:', error);
        }
    }
    
    checkAchievements() {
        const achievements = {
            'happy_people': {
                title: 'Mutlu Halk',
                description: 'Halkın mutluluğu %80\'in üzerine çıktı!',
                condition: () => this.state.stats.people >= 80
            },
            'strong_army': {
                title: 'Güçlü Ordu',
                description: 'Ordunun gücü %80\'in üzerine çıktı!',
                condition: () => this.state.stats.army >= 80
            },
            'rich_treasury': {
                title: 'Zengin Hazine',
                description: 'Hazine %80\'in üzerine çıktı!',
                condition: () => this.state.stats.treasury >= 80
            },
            'religious_harmony': {
                title: 'Dini Uyum',
                description: 'Dini uyum %80\'in üzerine çıktı!',
                condition: () => this.state.stats.religion >= 80
            },
            'balanced_kingdom': {
                title: 'Dengeli Krallık',
                description: 'Tüm istatistikler %60\'ın üzerine çıktı!',
                condition: () => Object.values(this.state.stats).every(stat => stat >= 60)
            }
        };
        
        for (const [id, achievement] of Object.entries(achievements)) {
            if (!this.state.achievements.has(id) && achievement.condition()) {
                this.state.achievements.add(id);
                VisualEffects.showAchievement(achievement.title, achievement.description);
                AudioManager.play('achievement');
                if (id.includes('people')) {
                    VisualEffects.updateStats('people', this.state.stats.people, 0, true);
                } else if (id.includes('army')) {
                    VisualEffects.updateStats('army', this.state.stats.army, 0, true);
                } else if (id.includes('treasury')) {
                    VisualEffects.updateStats('treasury', this.state.stats.treasury, 0, true);
                } else if (id.includes('religion')) {
                    VisualEffects.updateStats('religion', this.state.stats.religion, 0, true);
                }
            }
        }
    }
    
    async handleChoice(choice) {
        try {
            if (!this.state.currentCard) {
                console.error('No current card to make choice for');
                return;
            }
            
            // Play choice sound
            if (AudioManager && AudioManager.state.enabled) {
                AudioManager.play('choice');
            }
            
            // Disable buttons to prevent multiple clicks
            if (this.elements.leftChoice) {
                this.elements.leftChoice.disabled = true;
            }
            if (this.elements.rightChoice) {
                this.elements.rightChoice.disabled = true;
            }
            
            // Process the choice
            const choiceData = choice === 'left' ? 
                this.state.currentCard.leftChoice : 
                this.state.currentCard.rightChoice;
            
            if (!choiceData) {
                console.error('Invalid choice data');
                return;
            }
            
            // Apply effects
            await this.processChoice(choiceData);
            
            // Load next card
            await this.loadRandomCard();
            
        } catch (error) {
            console.error('Error handling choice:', error);
            this.handleError(error, 'handleChoice');
        }
    }
    
    async processChoice(choiceData) {
        try {
            if (!choiceData || !choiceData.effects) {
                console.error('Invalid choice data:', choiceData);
                return;
            }

            // Apply effects to stats
            Object.entries(choiceData.effects).forEach(([stat, change]) => {
                if (this.state.stats[stat] !== undefined) {
                    // Update the stat value
                    this.state.stats[stat] = clamp(
                        this.state.stats[stat] + change,
                        0,
                        100
                    );

                    // Update the UI
                    if (this.elements.stats[stat]) {
                        this.elements.stats[stat].textContent = this.state.stats[stat];
                        
                        // Add visual feedback
                        this.elements.stats[stat].classList.add('stat-updated');
                        setTimeout(() => {
                            this.elements.stats[stat].classList.remove('stat-updated');
                        }, 1000);
                    }
                }
            });

            // Check for game over conditions
            if (this.checkGameOver()) {
                return;
            }

            // Check for achievements
            this.checkAchievements();

            // Save game state
            this.autoSave();

            // Load next card
            await this.loadRandomCard();

        } catch (error) {
            console.error('Error processing choice:', error);
            this.handleError(error, 'processChoice');
        }
    }
    
    updateAllStats() {
        try {
            const { people, army, treasury, religion } = this.state.stats;
            
            // Update people stat
            if (this.elements.stats.people) {
                this.elements.stats.people.textContent = people;
                this.updateStatClass(this.elements.stats.people, people);
            }
            
            // Update army stat
            if (this.elements.stats.army) {
                this.elements.stats.army.textContent = army;
                this.updateStatClass(this.elements.stats.army, army);
            }
            
            // Update treasury stat
            if (this.elements.stats.treasury) {
                this.elements.stats.treasury.textContent = treasury;
                this.updateStatClass(this.elements.stats.treasury, treasury);
            }
            
            // Update religion stat
            if (this.elements.stats.religion) {
                this.elements.stats.religion.textContent = religion;
                this.updateStatClass(this.elements.stats.religion, religion);
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
    
    updateStatClass(element, value) {
        // Remove existing classes
        element.classList.remove('critical', 'warning', 'good');
        
        // Add appropriate class based on value
        if (value <= 20) {
            element.classList.add('critical');
        } else if (value <= 40) {
            element.classList.add('warning');
        } else if (value >= 80) {
            element.classList.add('good');
        }
    }
    
    checkGameOver() {
        // Check if any stat has reached zero or if all stats are over 90
        const { people, army, treasury, religion } = this.state.stats;
        let gameOverReason = null;
        let endingType = null;
        
        // Check for losing conditions
        if (people <= 0) {
            gameOverReason = "👥 Halkınız sizi terk etti! Kimsenin yaşamadığı bir krallığa hükmetmenin bir anlamı yok.";
            endingType = "people_revolt";
        } else if (army <= 0) {
            gameOverReason = "⚔️ Ordunuz dağıldı ve ülkeniz savunmasız kaldı. Komşu krallıklar topraklarınızı işgal etti.";
            endingType = "army_defeat";
        } else if (treasury <= 0) {
            gameOverReason = "💰 Hazine boşaldı ve borçlarınızı ödeyemez hale geldiniz. Soylular sizi devirerek yeni bir kral seçti.";
            endingType = "treasury_bankruptcy";
        } else if (religion <= 0) {
            gameOverReason = "⛪ Dinî kurumların desteğini tamamen kaybettiniz. Halk arasında dinsiz bir hükümdar olarak anıldınız ve tahtınızı kaybettiniz.";
            endingType = "religion_loss";
        }
        
        // Check for winning condition (all stats above 90)
        if (people >= 90 && army >= 90 && treasury >= 90 && religion >= 90) {
            gameOverReason = "👑 Muhteşem yönetiminiz sayesinde krallığınız altın çağını yaşıyor! Adınız tarihe en büyük hükümdarlardan biri olarak geçecek.";
            endingType = "golden_age";
        }
        
        // If game over condition is met
        if (gameOverReason) {
            this.state.gameOver = true;
            this.state.endingType = endingType;
            this.showGameOver(gameOverReason);
            return true;
        }
        
        return false;
    }
    
    showGameOver(reason) {
        try {
            // Stop ambient music
            if (AudioManager) {
                AudioManager.stop('ambient');
                AudioManager.state.isMusicPlaying = false;
                
                // Update music toggle button state if it exists
                const musicToggle = document.getElementById('music-toggle');
                if (musicToggle) {
                    musicToggle.classList.remove('playing');
                }
            }
            
            // Play game over sound
            if (AudioManager && AudioManager.state.enabled) {
                AudioManager.play('gameOver');
            }
            
            // Get the game over screen element
            const gameOverScreen = this.elements.gameOverElement || document.getElementById('game-over');
            if (!gameOverScreen) {
                console.error('Game over screen element not found');
                return;
            }
            
            // Update the game over message
            const messageElement = this.elements.cardText || document.getElementById('game-over-message');
            if (messageElement) {
                // Türkçe mesajları ve emojileri ekle
                let turkishReason = reason;
                
                // İngilizce mesajları Türkçeye çevir
                if (reason.includes("Your people have revolted")) {
                    turkishReason = "Halkınız isyan etti! 👥 Halkınızın güvenini kaybettiniz.";
                } else if (reason.includes("Your army has been defeated")) {
                    turkishReason = "Ordunuz yenildi! ⚔️ Krallığınızı koruyamadınız.";
                } else if (reason.includes("Your treasury is empty")) {
                    turkishReason = "Hazineniz boşaldı! 💰 Krallığınız iflas etti.";
                } else if (reason.includes("Your religious influence has waned")) {
                    turkishReason = "Dini etkiniz azaldı! ⛪ Halkınızın inancını kaybettiniz.";
                } else if (reason.includes("Congratulations")) {
                    turkishReason = "Tebrikler! 👑 Krallığınız altın çağını yaşıyor!";
                }
                
                messageElement.textContent = turkishReason;
            }
            
            // Update final stats
            const statNames = ['people', 'army', 'treasury', 'religion'];
            statNames.forEach(stat => {
                const finalStatElement = document.getElementById(`final-${stat}-stat`);
                if (finalStatElement) {
                    finalStatElement.textContent = this.state.stats[stat];
                }
            });
            
            // Show the ending title based on the ending type
            const titleElement = document.getElementById('game-over-title');
            if (titleElement) {
                switch (this.state.endingType) {
                    case 'people_revolt':
                        titleElement.textContent = 'Halk İsyanı! 👥';
                        break;
                    case 'army_defeat':
                        titleElement.textContent = 'Askeri Çöküş! ⚔️';
                        break;
                    case 'treasury_bankruptcy':
                        titleElement.textContent = 'İflas! 💰';
                        break;
                    case 'religion_loss':
                        titleElement.textContent = 'Dini Çöküş! ⛪';
                        break;
                    case 'golden_age':
                        titleElement.textContent = 'Altın Çağ! 👑';
                        break;
                    default:
                        titleElement.textContent = 'Oyun Bitti! 👑';
                }
            }
            
            // Make the game over screen visible with slower transition
            gameOverScreen.style.transition = 'opacity 1s ease-in-out';
            gameOverScreen.style.display = 'flex';
            
            // Add animation
            setTimeout(() => {
                gameOverScreen.classList.add('visible');
            }, 100);
            
            // Save final game state with ending
            this.autoSave();
            
            console.log('Game over shown:', this.state.endingType);
        } catch (error) {
            console.error('Error showing game over screen:', error);
        }
    }
    
    async resetGame() {
        try {
            console.log('Resetting game...');
            
            // Clear saved state
            localStorage.removeItem('gameState');
            
            // Reset stats
            this.state = {
                stats: {
                    people: 50,
                    army: 50,
                    treasury: 50,
                    religion: 50
                },
                usedCardIds: [], // Initialize as empty array
                achievements: new Set(),
                isGameOver: false,
                currentCard: null
            };
            
            // Update UI stats
            Object.entries(this.state.stats).forEach(([stat, value]) => {
                const element = document.getElementById(`${stat}-stat`);
                if (element) {
                    element.textContent = value;
                }
            });
            
            // Hide game over screen
            if (this.elements.gameOverElement) {
                this.elements.gameOverElement.style.display = 'none';
            }
            
            // Reset card content
            if (this.elements.characterImage) {
                this.elements.characterImage.src = 'assets/images/characters/default.png';
            }
            if (this.elements.cardText) {
                this.elements.cardText.textContent = '';
            }
            
            // Enable buttons
            if (this.elements.leftChoice) {
                this.elements.leftChoice.disabled = false;
            }
            if (this.elements.rightChoice) {
                this.elements.rightChoice.disabled = false;
            }
            
            // Start new game
            this.loadRandomCard();
            console.log('Game reset successful');
            
        } catch (error) {
            console.error('Error resetting game:', error);
            this.handleError(error, 'resetGame');
        }
    }
    
    triggerSpecialEvent() {
        if (this.state.gameOver || this.state.isSpecialEvent) return;
        this.state.isSpecialEvent = true;
        AudioManager.play('achievement');
        
        const events = [
            {
                id: 'plague',
                title: 'Büyük Salgın',
                description: 'Krallığınızda bir salgın başladı! Halkınız tehlikede.',
                image: 'assets/images/events/plague.png',
                choices: [
                    { text: 'Halkı karantinaya al', effects: { people: -10, treasury: -5, religion: 3 } },
                    { text: 'Salgını görmezden gel', effects: { people: -15, army: -5, religion: -8 } }
                ]
            },
            {
                id: 'merchant',
                title: 'Ticaret Kervanı',
                description: 'Zengin bir ticaret kervanı krallığınıza geldi!',
                image: 'assets/images/events/merchant.png',
                choices: [
                    { text: 'Ticaret anlaşması yap', effects: { treasury: 10, people: 3 } },
                    { text: 'Vergi al', effects: { treasury: 5, people: -5, religion: -3 } }
                ]
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.loadSpecialEvent(event);
    }
    
    async loadSpecialEvent(event) {
        try {
            await VisualEffects.hideCard();
            if (this.elements.characterImage) 
                this.elements.characterImage.src = event.image;
            if (this.elements.cardText)
                this.elements.cardText.textContent = event.description;
            if (this.elements.card) {
                this.elements.card.classList.add('special-event');
                this.elements.card.classList.remove('throne-conflict');
            }
            this.state.currentCard = {
                id: event.id,
                choices: [
                    { text: event.choices[0].text, effects: event.choices[0].effects },
                    { text: event.choices[1].text, effects: event.choices[1].effects }
                ]
            };
            await this.showCard();
        } catch (error) {
            console.error('Error loading special event:', error);
        }
    }

    // Add cleanup method to the Game class
    cleanup() {
        try {
            // Clear intervals
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = null;
            }
            
            if (this.throneConflictTimer) {
                clearTimeout(this.throneConflictTimer);
                this.throneConflictTimer = null;
            }
            
            // Clear audio
            AudioManager.stop('ambient');
            
            // Clear image cache
            this.imageCache = new Map();
            
            // Clear DOM references
            this.elements = {};
            
            console.log('Game cleanup completed');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    // Add error recovery method
    async recoverFromError(error, context) {
        console.error(`Error in ${context}:`, error);
        
        try {
            // Show user-friendly error message
            this.showError(`An error occurred while ${context}. Attempting to recover...`);
            
            // Try to save current state before recovery
            this.autoSave();
            
            // Different recovery strategies based on context
            switch (context) {
                case 'game initialization':
                    // Try to initialize with minimal features
                    await this.initializeMinimal();
                    break;
                    
                case 'loadCard':
                    // Try to load a fallback card
                    await this.loadFallbackCard();
                    break;
                    
                case 'handleChoice':
                    // Revert to previous state if possible
                    await this.revertToLastValidState();
                    break;
                    
                case 'showCard':
                    // Try to show a simplified card
                    await this.showSimplifiedCard();
                    break;
                    
                default:
                    // Generic recovery - restart the game
                    this.resetGame();
                    break;
            }
            
            console.log(`Recovery from ${context} completed`);
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            this.showError('Game recovery failed. Please refresh the page.');
        }
    }
    
    // Add fallback card loading
    async loadFallbackCard() {
        try {
            // Create a simple fallback card
            const fallbackCard = {
                id: 'fallback',
                character: 'Royal Advisor',
                text: 'Your kingdom faces many challenges, but you must lead your people through these difficult times.',
                image: 'assets/images/characters/default.png',
                leftChoice: {
                    text: 'Focus on the economy',
                    effects: { treasury: 5, people: 3, army: -2, religion: 0 }
                },
                rightChoice: {
                    text: 'Strengthen the military',
                    effects: { treasury: -3, people: -1, army: 5, religion: 0 }
                }
            };
            
            // Show the fallback card
            await this.showCard(fallbackCard);
            console.log('Fallback card loaded due to missing story data');
            
            return fallbackCard;
        } catch (error) {
            console.error('Error loading fallback card:', error);
            
            // Last resort - create a very basic UI update without using showCard
            if (this.elements.cardText) {
                this.elements.cardText.textContent = 'Your kingdom awaits your leadership...';
            }
            
            return null;
        }
    }
    
    // Add state reversion
    async revertToLastValidState() {
        try {
            // Try to load the last saved state
            const savedState = this.loadSavedState();
            if (savedState) {
                this.state = savedState;
                this.updateAllStats();
                await this.loadCard(this.state.currentCard?.id);
                return;
            }
            
            // If no saved state, reset the game
            this.resetGame();
        } catch (error) {
            console.error('State reversion failed:', error);
            throw error;
        }
    }
    
    // Add simplified card display
    async showSimplifiedCard() {
        try {
            // Create a simplified card display
            const simplifiedCard = {
                text: 'Krallığınızda bir sorun oluştu, ancak hikaye devam ediyor...',
                image: 'assets/images/characters/default.png',
                leftChoice: {
                    text: 'Devam et',
                    effects: {}
                },
                rightChoice: {
                    text: 'Devam et',
                    effects: {}
                }
            };
            
            // Update only essential elements
            if (this.elements.cardText) {
                this.elements.cardText.textContent = simplifiedCard.text;
            }
            
            if (this.elements.characterImage) {
                this.elements.characterImage.src = simplifiedCard.image;
            }
            
            // Show the card
            if (this.elements.card) {
                this.elements.card.style.display = 'flex';
                this.elements.card.style.opacity = '1';
            }
        } catch (error) {
            console.error('Simplified card display failed:', error);
            throw error;
        }
    }

    // Add accessibility features
    initializeAccessibility() {
        try {
            // Add ARIA labels to elements
            this.addAriaLabels();
            
            // Add keyboard navigation
            this.setupKeyboardNavigation();
            
            // Add high contrast mode toggle
            this.setupHighContrastMode();
            
            // Add screen reader announcements
            this.setupScreenReaderAnnouncements();
            
            console.log('Accessibility features initialized');
        } catch (error) {
            console.error('Error initializing accessibility:', error);
        }
    }
    
    // Add ARIA labels to elements
    addAriaLabels() {
        try {
            // Card elements
            if (this.elements.card) {
                this.elements.card.setAttribute('role', 'region');
                this.elements.card.setAttribute('aria-label', 'Oyun kartı');
            }
            
            if (this.elements.cardText) {
                this.elements.cardText.setAttribute('role', 'article');
                this.elements.cardText.setAttribute('aria-label', 'Kart metni');
            }
            
            if (this.elements.characterImage) {
                this.elements.characterImage.setAttribute('alt', 'Karakter görseli');
            }
            
            // Stats
            const stats = ['people', 'army', 'treasury', 'religion'];
            stats.forEach(stat => {
                const element = document.getElementById(`${stat}-stat`);
                if (element) {
                    element.setAttribute('role', 'status');
                    element.setAttribute('aria-label', `${stat} istatistiği`);
                }
            });
        } catch (error) {
            console.error('Error adding ARIA labels:', error);
        }
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        try {
            // Add keyboard event listeners
            document.addEventListener('keydown', (event) => {
                // Left arrow or '1' key for left choice
                if (event.key === 'ArrowLeft' || event.key === '1') {
                    this.handleChoice(0);
                }
                // Right arrow or '2' key for right choice
                else if (event.key === 'ArrowRight' || event.key === '2') {
                    this.handleChoice(1);
                }
                // 'R' key to reset game
                else if (event.key === 'r' || event.key === 'R') {
                    this.resetGame();
                }
                // 'M' key to toggle music
                else if (event.key === 'm' || event.key === 'M') {
                    AudioManager.toggleMusic();
                }
            });
            
            // Make buttons focusable
            if (this.elements.card) {
                this.elements.card.setAttribute('tabindex', '0');
            }
        } catch (error) {
            console.error('Error setting up keyboard navigation:', error);
        }
    }
    
    // Setup high contrast mode
    setupHighContrastMode() {
        try {
            // Create high contrast toggle button
            const highContrastToggle = document.createElement('button');
            highContrastToggle.id = 'high-contrast-toggle';
            highContrastToggle.className = 'accessibility-toggle';
            highContrastToggle.setAttribute('aria-label', 'Yüksek kontrast modu');
            highContrastToggle.innerHTML = '🔍';
            
            // Add toggle functionality
            highContrastToggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                highContrastToggle.setAttribute('aria-pressed', isHighContrast);
                
                // Announce change to screen readers
                this.announceToScreenReader(
                    isHighContrast ? 'Yüksek kontrast modu açık' : 'Yüksek kontrast modu kapalı'
                );
            });
            
            // Add to DOM
            document.body.appendChild(highContrastToggle);
        } catch (error) {
            console.error('Error setting up high contrast mode:', error);
        }
    }
    
    // Setup screen reader announcements
    setupScreenReaderAnnouncements() {
        try {
            // Create announcement element
            this.announcementElement = document.createElement('div');
            this.announcementElement.setAttribute('role', 'status');
            this.announcementElement.setAttribute('aria-live', 'polite');
            this.announcementElement.className = 'sr-only';
            document.body.appendChild(this.announcementElement);
        } catch (error) {
            console.error('Error setting up screen reader announcements:', error);
        }
    }
    
    // Announce to screen readers
    announceToScreenReader(message) {
        try {
            if (this.announcementElement) {
                this.announcementElement.textContent = message;
                
                // Clear after a delay
                setTimeout(() => {
                    this.announcementElement.textContent = '';
                }, 3000);
            }
        } catch (error) {
            console.error('Error announcing to screen reader:', error);
        }
    }

    // Initialize mobile support features
    initializeMobileSupport() {
        this.ensureViewportMeta();
        this.setupTouchEvents();
        this.setupMobileUI();
        
        // Create bound functions to use for event listeners
        this.boundHandleOrientationChange = this.adjustLayoutForOrientation.bind(this);
        this.boundHandleResize = this.handleResize.bind(this);
        
        // Handle orientation changes
        window.addEventListener('orientationchange', this.boundHandleOrientationChange);
        
        // Handle resize events for better responsive behavior
        window.addEventListener('resize', this.debounce(this.boundHandleResize, 250));
        
        // Initial orientation adjustment
        this.adjustLayoutForOrientation();
    }
    
    ensureViewportMeta() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
            
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // Set proper content for responsive design
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
    
    adjustLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        
        // Adjust game container layout
        const gameContainer = this.elements.card.parentElement;
        if (isLandscape) {
            gameContainer.style.flexDirection = 'row';
            gameContainer.style.alignItems = 'center';
        } else {
            gameContainer.style.flexDirection = 'column';
            gameContainer.style.alignItems = 'stretch';
        }
        
        this.updateCardSize();
    }
    
    updateCardSize() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const card = this.elements.card;
        
        if (isLandscape) {
            card.style.width = '45vw';
            card.style.maxHeight = '80vh';
        } else {
            card.style.width = '90vw';
            card.style.maxHeight = '60vh';
        }
        
        // Adjust image size
        const image = this.elements.characterImage;
        if (image) {
            const size = isLandscape ? '30vh' : '25vh';
            image.style.width = size;
            image.style.height = size;
        }
    }

    adjustFontSizes() {
        const width = window.innerWidth;
        const baseSize = width < 768 ? 14 : width < 1024 ? 16 : 18;
        
        document.documentElement.style.fontSize = `${baseSize}px`;
        
        // Adjust specific elements
        if (this.elements.cardText) {
            this.elements.cardText.style.fontSize = `${baseSize * 1.2}px`;
        }
        if (this.elements.characterImage) {
            this.elements.characterImage.style.fontSize = `${baseSize * 1.5}px`;
        }
    }

    setupTouchEvents() {
        let touchStartX = null;
        let touchStartY = null;
        
        this.boundHandleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };
        
        this.boundHandleTouchEnd = (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only handle horizontal swipes if the vertical movement is less than half the horizontal
            if (Math.abs(deltaY) < Math.abs(deltaX) / 2) {
                this.handleSwipeGesture(deltaX);
            }
            
            touchStartX = null;
            touchStartY = null;
        };
        
        document.addEventListener('touchstart', this.boundHandleTouchStart);
        document.addEventListener('touchend', this.boundHandleTouchEnd);
        
        // Add touch feedback
        const choices = [this.elements.card];
        choices.forEach(choice => {
            if (!choice) return;
            
            choice.addEventListener('touchstart', () => {
                choice.classList.add('touch-active');
            });
            
            choice.addEventListener('touchend', () => {
                choice.classList.remove('touch-active');
            });
            
            choice.addEventListener('touchcancel', () => {
                choice.classList.remove('touch-active');
            });
        });
    }

    handleSwipeGesture(deltaX) {
        const SWIPE_THRESHOLD = 50;
        
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
        
        if (deltaX > 0) {
            // Swipe right - choose right option
            this.handleChoice(1);
        } else {
            // Swipe left - choose left option
            this.handleChoice(0);
        }
    }

    setupMobileUI() {
        // Add mobile menu button
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        document.body.appendChild(mobileMenuButton);
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-item" id="mobile-reset">New Game</div>
            <div class="mobile-menu-item" id="mobile-music">Toggle Music</div>
            <div class="mobile-menu-item" id="mobile-high-contrast">High Contrast Mode</div>
        `;
        document.body.appendChild(mobileMenu);
        
        // Setup menu event listeners
        mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
        
        document.getElementById('mobile-reset').addEventListener('click', () => {
            this.resetGame();
            this.toggleMobileMenu();
        });
        
        document.getElementById('mobile-music').addEventListener('click', () => {
            AudioManager.toggleMusic();
            this.toggleMobileMenu();
        });
        
        document.getElementById('mobile-high-contrast').addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (mobileMenu.classList.contains('visible') && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target)) {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('visible');
        }
    }

    loadSavedState() {
        try {
            const savedState = localStorage.getItem('gameState');
            if (!savedState) return null;

            const parsed = JSON.parse(savedState);
            
            // Validate the loaded state
            if (!this.isValidGameState(parsed)) {
                console.warn('Invalid saved state detected, starting fresh');
                localStorage.removeItem('gameState');
                return null;
            }

            // Convert achievements array to Set (handle both array and null cases)
            if (parsed.achievements) {
                parsed.achievements = new Set(Array.isArray(parsed.achievements) ? 
                    parsed.achievements : []);
            } else {
                parsed.achievements = new Set();
            }
            
            return parsed;
        } catch (error) {
            console.error('Error loading saved state:', error);
            return null;
        }
    }

    isValidGameState(state) {
        // Basic structure validation
        if (!state || typeof state !== 'object') return false;
        if (!state.stats || typeof state.stats !== 'object') return false;

        // Required stats validation
        const requiredStats = ['people', 'army', 'treasury', 'religion'];
        for (const stat of requiredStats) {
            if (typeof state.stats[stat] !== 'number' || 
                state.stats[stat] < 0 || 
                state.stats[stat] > 100) {
                return false;
            }
        }

        // Array validations
        if (!Array.isArray(state.usedCardIds)) return false;
        
        return true;
    }

    startAutoSave() {
        // Clear any existing interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    cleanupUnusedResources() {
        try {
            // Clear any timeout or interval
            if (this.throneConflictTimerId) {
                clearTimeout(this.throneConflictTimerId);
                this.throneConflictTimerId = null;
            }
            
            if (this.autoSaveTimerId) {
                clearInterval(this.autoSaveTimerId);
                this.autoSaveTimerId = null;
            }
            
            // Remove any detached DOM elements
            const notifications = document.querySelectorAll('.achievement-notification');
            notifications.forEach(notification => notification.remove());
            
            // Clear image caches if they're too large (more than 50 items)
            if (this.imageCache && this.imageCache.size > 50) {
                this.imageCache.clear();
            }
            
            // Clear any references to unused cards
            this.currentCard = null;
            this.previousCards = this.previousCards?.slice(-10) || [];
            
            // Force garbage collection in some browsers
            if (window.gc) {
                window.gc();
            }
            
            console.log('Resources cleaned up');
        } catch (error) {
            console.warn('Error during resource cleanup:', error);
        }
    }

    async initializeMinimal() {
        try {
            // Initialize only critical components
            this.initializeState();
            this.initializeElements();
            
            // Setup basic event listeners
            this.setupEventListeners();
            
            // Load a basic card
            await this.loadFallbackCard();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            return true;
        } catch (error) {
            console.error('Minimal initialization failed:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
            return false;
        }
    }

    showError(message, duration = 5000) {
        try {
            // Remove any existing error messages
            const existingErrors = document.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            
            // Style the error message
            Object.assign(errorElement.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '5px',
                zIndex: '9999',
                textAlign: 'center',
                maxWidth: '80%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            });
            
            // Add to DOM
            document.body.appendChild(errorElement);
            
            // Animate in
            errorElement.animate([
                { opacity: 0, transform: 'translate(-50%, -20px)' },
                { opacity: 1, transform: 'translate(-50%, 0)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            
            // Remove after duration
            setTimeout(() => {
                if (errorElement.parentNode) {
                    // Animate out
                    errorElement.animate([
                        { opacity: 1, transform: 'translate(-50%, 0)' },
                        { opacity: 0, transform: 'translate(-50%, -20px)' }
                    ], {
                        duration: 300,
                        easing: 'ease-in'
                    }).onfinish = () => errorElement.remove();
                }
            }, duration);
            
        } catch (error) {
            console.error('Error showing error message:', error);
        }
    }

    // Add the missing handleResize method
    handleResize() {
        this.adjustLayoutForOrientation();
        this.updateCardSize();
        this.adjustFontSizes();
    }

    // Add the missing debounce method
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Wait for VisualEffects to be ready
    const initGame = () => {
        window.game = new Game();
    };

    if (window.VisualEffects) {
        initGame();
    } else {
        window.addEventListener('visualEffectsReady', initGame, { once: true });
    }
});

// Music Control
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
let isMusicPlaying = false;
let isAudioLoaded = false;

// Ses yükleme işleyicisi
backgroundMusic.addEventListener('loadeddata', () => {
    isAudioLoaded = true;
    console.log('Audio loaded successfully');
});

// Ses hata işleyicisi
backgroundMusic.addEventListener('error', (e) => {
    console.error('Audio loading error:', e);
    musicToggle.style.display = 'none'; // Ses yüklenemezse butonu gizle
});

// Mobil cihazlar için ses kontrolü
function initAudio() {
    // Mobil cihazlarda otomatik oynatmayı engelle
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        backgroundMusic.preload = 'none';
    }
}

function toggleMusic() {
    if (!isAudioLoaded && !isMusicPlaying) {
        backgroundMusic.load(); // İlk tıklamada sesi yükle
    }

    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicToggle.classList.add('playing');
            }).catch(error => {
                console.log('Playback failed:', error);
                // Kullanıcı etkileşimi gerektiğinde tekrar dene
                if (error.name === 'NotAllowedError') {
                    console.log('User interaction required for playback');
                }
            });
        }
    }
    isMusicPlaying = !isMusicPlaying;
}

// Mobil dokunma olayları
musicToggle.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Varsayılan dokunma davranışını engelle
    toggleMusic();
}, { passive: false });

musicToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMusic();
});

// Sayfa yüklendiğinde ses sistemini başlat
document.addEventListener('DOMContentLoaded', initAudio);

// İstatistik çubuklarını güncelleme
function updateProgressBars() {
    // Sadece mobil cihazlarda çalış
    if (window.innerWidth <= 768) {
        const stats = {
            people: document.getElementById('people-stat').textContent,
            army: document.getElementById('army-stat').textContent,
            treasury: document.getElementById('treasury-stat').textContent,
            religion: document.getElementById('religion-stat').textContent
        };

        Object.entries(stats).forEach(([stat, value]) => {
            const progressBar = document.getElementById(`${stat}-progress`);
            if (progressBar) {
                const percentage = Math.min(Math.max(parseInt(value), 0), 100);
                progressBar.style.width = `${percentage}%`;
                
                // Değere göre renk belirleme
                if (percentage < 30) {
                    progressBar.style.backgroundColor = '#e74c3c'; // Kırmızı
                } else if (percentage < 70) {
                    progressBar.style.backgroundColor = '#f1c40f'; // Sarı
                } else {
                    progressBar.style.backgroundColor = '#2ecc71'; // Yeşil
                }
            }
        });
    }
}

// Mevcut updateStats fonksiyonunu güncelle
function updateStats(stat, value) {
    const statElement = document.getElementById(`${stat}-stat`);
    if (statElement) {
        statElement.textContent = value;
        updateProgressBars(); // İstatistik güncellendiğinde çubukları da güncelle
    }
}

// Pencere boyutu değiştiğinde çubukları güncelle
window.addEventListener('resize', updateProgressBars);
