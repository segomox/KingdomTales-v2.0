const VisualEffects = {
    elements: {},
    durations: {
        cardFade: 350,
        statChange: 1000,
        achievement: 2000
    },
    animationFrame: null,
    pendingStatUpdates: {},

    // Initialize the visual effects system
    init() {
        return new Promise((resolve, reject) => {
            try {
                this.initElements();
                this.startAnimationLoop();
                resolve();
            } catch (error) {
                console.error('VisualEffects initialization error:', error);
                reject(error);
            }
        });
    },

    // Initialize required elements
    initElements() {
        const requiredElements = {
            card: '#card',
            characterImage: '#character-image',
            cardText: '#card-text'
        };
        
        let missingElements = [];
        
        for (const [key, selector] of Object.entries(requiredElements)) {
            const element = document.querySelector(selector);
                
            if (element) {
                this.elements[key] = element;
                console.log(`${key} elementi başarıyla yüklendi`);
            } else {
                missingElements.push(key);
                console.error(`${key} elementi bulunamadı (Selector: ${selector})`);
            }
        }
        
        if (missingElements.length > 0) {
            throw new Error(`Eksik elementler: ${missingElements.join(', ')}`);
        }
    },
    
    // Animation frame loop for batching updates
    startAnimationLoop() {
        const updateLoop = () => {
            // Process any pending stat updates
            this.processPendingStatUpdates();
            
            // Continue the loop
            this.animationFrame = requestAnimationFrame(updateLoop);
        };
        
        // Start the loop
        this.animationFrame = requestAnimationFrame(updateLoop);
    },
    
    // Process all pending stat updates in a batch
    processPendingStatUpdates() {
        const stats = Object.keys(this.pendingStatUpdates);
        if (stats.length === 0) return;
        
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        stats.forEach(stat => {
            const update = this.pendingStatUpdates[stat];
            const statElement = document.getElementById(`${stat}-stat`);
            
            if (statElement) {
                // Update text content
                statElement.textContent = update.value;
                
                // Add change indicator if needed
                if (update.change !== 0 && !update.isAchievement) {
                    const changeIndicator = document.createElement('span');
                    changeIndicator.className = `change-indicator ${update.change > 0 ? 'positive' : 'negative'}`;
                    changeIndicator.textContent = update.change > 0 ? `+${update.change}` : update.change;
                    fragment.appendChild(changeIndicator.cloneNode(true));
                    
                    // Setup removal after animation
                    setTimeout(() => {
                        const indicator = statElement.querySelector('.change-indicator');
                        if (indicator) indicator.remove();
                    }, this.durations.statChange);
                }
                
                // Update stat classes
                this.updateStatClass(statElement, update.value);
            }
        });
        
        // Clear pending updates
        this.pendingStatUpdates = {};
    },
    
    // Update stat class based on value
    updateStatClass(element, value) {
        if (value <= 20) {
            element.classList.add('critical');
            element.classList.remove('warning', 'good');
        } else if (value <= 40) {
            element.classList.add('warning');
            element.classList.remove('critical', 'good');
        } else if (value >= 80) {
            element.classList.add('good');
            element.classList.remove('critical', 'warning');
        } else {
            element.classList.remove('critical', 'warning', 'good');
        }
    },

    // Kart gösterme fonksiyonu
    async showCard(cardData) {
        try {
            await this.hideCard();
            
            // Elementlerin varlığını kontrol et
            if (!this.elements.characterImage || !this.elements.cardText || !this.elements.card) {
                console.error('Gerekli DOM elementleri eksik, kart gösterilemedi!');
                return;
            }

            // Use requestAnimationFrame for better performance
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    // Kart içeriğini güncelle
                    this.elements.characterImage.src = cardData.image || 'assets/images/characters/default.png';
                    this.elements.cardText.textContent = cardData.text || '';
                    
                    // Kartı animasyonla göster - use transform for GPU acceleration
                    this.elements.card.style.opacity = '1';
                    this.elements.card.style.transform = 'translateY(0)'; // Reset transform
                    this.elements.card.style.transition = `opacity ${this.durations.cardFade / 1000}s ease-in, transform ${this.durations.cardFade / 1000}s ease-in`;
                    
                    // Kart gösterildikten sonra çözül
                    setTimeout(resolve, this.durations.cardFade);
                });
            });
        } catch (error) {
            console.error('Error showing card:', error);
            // Handle the error appropriately, perhaps by showing a fallback state
        }
    },

    // Kart gizleme fonksiyonu
    async hideCard() {
        // Use requestAnimationFrame for smooth fade-out
        return new Promise(resolve => {
            if (!this.elements.card) {
                resolve(); // Resolve immediately if card element doesn't exist
                return;
            }
            requestAnimationFrame(() => {
                this.elements.card.style.transition = `opacity ${this.durations.cardFade / 1000}s ease-out`;
                this.elements.card.style.opacity = '0';
                
                // Hide choices immediately to prevent interaction during fade-out
                // No longer needed as choices are removed
                
                setTimeout(resolve, this.durations.cardFade);
            });
        });
    },

    // Arka plan yükleme fonksiyonu
    async loadBackground(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                if (this.elements.card) {
                    this.elements.card.style.backgroundImage = `url(${url})`;
                }
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    },

    // İstatistik güncelleme fonksiyonu - batch updates for better performance
    updateStats(stat, value, change, isAchievement = false) {
        // Queue the update instead of immediately applying it
        this.pendingStatUpdates[stat] = { value, change, isAchievement };
        
        // If it's an achievement, play sound
        if (isAchievement && window.AudioManager) {
            AudioManager.play('achievement');
        } else if (window.AudioManager) {
            AudioManager.play('statChange');
        }
        
        // Apply class change for visual feedback
        const statElement = document.getElementById(`${stat}-stat`);
        if (statElement) {
            statElement.classList.add('stat-change');
            
            if (isAchievement) {
                statElement.classList.add('achievement-glow');
                setTimeout(() => {
                    statElement.classList.remove('achievement-glow');
                }, this.durations.achievement);
            } else {
                setTimeout(() => {
                    statElement.classList.remove('stat-change');
                }, this.durations.statChange);
            }
        }
    },

    // Başarı gösterimi fonksiyonu
    showAchievement(title, description) {
        try {
            // Don't create too many notifications
            const existingNotifications = document.querySelectorAll('.achievement-notification');
            if (existingNotifications.length >= 3) {
                // Remove the oldest notification if there are too many
                existingNotifications[0].remove();
            }
            
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <h3>${title}</h3>
                <p>${description}</p>
            `;
            
            // Tıklanabilir olmasını sağla
            notification.style.pointerEvents = 'auto';
            document.body.appendChild(notification);
            
            // Use animation frames for adding/removing
            requestAnimationFrame(() => {
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300); // Allow time for fade out
                }, 4000);
            });
        } catch (error) {
            console.error('Başarı gösterimi hatası:', error);
        }
    },

    // Bekleme fonksiyonu
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Clean up resources
    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.pendingStatUpdates = {};
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await VisualEffects.init();
        window.VisualEffects = VisualEffects;
        
        // Dispatch event to signal that VisualEffects is ready
        window.dispatchEvent(new Event('visualEffectsReady'));
    } catch (error) {
        console.error('VisualEffects initialization failed:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Oyun başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.';
        document.body.appendChild(errorDiv);
    }
});