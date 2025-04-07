const StoryCards = {
    intro: [
      {
        id: 'intro1',
        character: 'Yaşlı Kral',
        image: 'assets/images/characters/old-king.png',
        text: 'Evladım, artık krallığı yönetme vaktin geldi. Tahtı sana bırakıyorum...',
        leftChoice: {
          text: 'Hazırım babacığım',
          effects: { people: 8, army: 5, treasury: -8, religion: 5 },
          nextCard: 'intro2a'
        },
        rightChoice: {
          text: 'Bana bir yıl daha süre ver',
          effects: { people: -8, army: -5, treasury: 8, religion: -5 },
          nextCard: 'intro2b'
        }
      },
      {
        id: 'intro2a',
        character: 'Taht Odası',
        image: 'assets/images/backgrounds/throne-room.jpg',
        text: 'Halkın seni selamlıyor! İlk kararın ne olacak?',
        leftChoice: {
          text: 'Halka buğday dağıt',
          effects: { people: 10, treasury: -15 },
          nextCard: 'peace1'
        },
        rightChoice: {
          text: 'Sınır kalelerini güçlendir',
          effects: { army: 12, treasury: -20 },
          nextCard: 'war1'
        }
      },
      {
        id: 'intro2b',
        character: 'Yaşlı Kral',
        image: 'assets/images/characters/old-king.png',
        text: 'Anlıyorum evladım. Bir yıl daha sana süre veriyorum, ama bu sürede krallığı öğrenmelisin.',
        leftChoice: {
          text: 'Danışmanlardan ders al',
          effects: { people: 5, army: 5, treasury: 5, religion: 5 },
          nextCard: 'intro2a'
        },
        rightChoice: {
          text: 'Halkı gözlemle',
          effects: { people: 10, army: -5, treasury: 0, religion: 0 },
          nextCard: 'intro2a'
        }
      }
    ],
  
    peacetime: [
      {
        id: 'peace1',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'Majesteleri, komşu krallıktan evlilik teklifi var!',
        leftChoice: {
          text: 'Prensesle evlen',
          effects: { people: 12, religion: -8, treasury: 25 },
          nextCard: 'peace2a'
        },
        rightChoice: {
          text: 'Ticaret anlaşması öner',
          effects: { treasury: 15, army: -5 },
          nextCard: 'peace2b'
        }
      },
      {
        id: 'peace2a',
        character: 'Prenses Elenor',
        image: 'assets/images/characters/princess.png',
        text: 'Düğün hazırlıkları başlasın mı?',
        leftChoice: {
          text: 'Görkemli bir tören düzenle',
          effects: { people: 15, treasury: -30 },
          nextCard: 'event1'
        },
        rightChoice: {
          text: 'Kaynakları orduya aktar',
          effects: { army: 20, people: -10 },
          nextCard: 'war1'
        }
      },
      {
        id: 'peace2b',
        character: 'Tüccar Kervanı',
        image: 'assets/images/events/merchant.png',
        text: 'Ticaret anlaşması başarılı oldu! Zengin bir tüccar kervanı krallığınıza geldi.',
        leftChoice: {
          text: 'Tüccarlara özel haklar ver',
          effects: { treasury: 20, people: -5 },
          nextCard: 'peace3a'
        },
        rightChoice: {
          text: 'Yerel tüccarları koru',
          effects: { people: 15, treasury: -5 },
          nextCard: 'peace3b'
        }
      },
      {
        id: 'peace3a',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'Tüccarlar krallığınızı zenginleştiriyor, ancak yerel tüccarlar şikayet ediyor.',
        leftChoice: {
          text: 'Yerel tüccarları destekle',
          effects: { people: 10, treasury: -10 },
          nextCard: 'peace4'
        },
        rightChoice: {
          text: 'Yabancı tüccarları destekle',
          effects: { treasury: 15, people: -10 },
          nextCard: 'peace4'
        }
      },
      {
        id: 'peace3b',
        character: 'Yerel Tüccar',
        image: 'assets/images/characters/peasant.png',
        text: 'Yerel tüccarlar teşekkür ediyor ve krallığınıza sadakat yemini ediyor.',
        leftChoice: {
          text: 'Tüccarlara vergi indirimi ver',
          effects: { people: 10, treasury: -10 },
          nextCard: 'peace4'
        },
        rightChoice: {
          text: 'Ticaret yollarını genişlet',
          effects: { treasury: 10, army: -5 },
          nextCard: 'peace4'
        }
      },
      {
        id: 'peace4',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'Krallığınızda barış ve refah hüküm sürüyor. Ancak sınırlarınızda gerginlik artıyor.',
        leftChoice: {
          text: 'Diplomatik ilişkileri güçlendir',
          effects: { people: 5, treasury: -10, religion: 5 },
          nextCard: 'war1'
        },
        rightChoice: {
          text: 'Ordunu güçlendir',
          effects: { army: 15, treasury: -15 },
          nextCard: 'war1'
        }
      }
    ],
  
    war: [
      {
        id: 'war1',
        character: 'General Godric',
        image: 'assets/images/characters/general.png',
        text: 'Kuzeyde isyancılar köyleri yağmalıyor!',
        leftChoice: {
          text: 'Asker gönder',
          effects: { army: -15, people: 10 },
          nextCard: 'war2a'
        },
        rightChoice: {
          text: 'Diplomat gönder',
          effects: { religion: -10, treasury: -15 },
          nextCard: 'war2b'
        }
      },
      {
        id: 'war2a',
        character: 'General Godric',
        image: 'assets/images/characters/general.png',
        text: 'Ordumuz isyancıları yenilgiye uğrattı, ancak kayıplarımız ağır oldu.',
        leftChoice: {
          text: 'Yeni askerler topla',
          effects: { army: 10, treasury: -20, people: -5 },
          nextCard: 'war3a'
        },
        rightChoice: {
          text: 'Askerlere ödül ver',
          effects: { army: 5, treasury: -15 },
          nextCard: 'war3a'
        }
      },
      {
        id: 'war2b',
        character: 'Diplomat',
        image: 'assets/images/characters/advisor.png',
        text: 'Diplomatlarımız isyancılarla anlaşma yaptı, ancak bazı soylular buna karşı çıkıyor.',
        leftChoice: {
          text: 'Anlaşmayı destekle',
          effects: { people: 10, army: -5, religion: 5 },
          nextCard: 'war3b'
        },
        rightChoice: {
          text: 'Soyluları dinle',
          effects: { army: 5, people: -10, religion: -5 },
          nextCard: 'war3b'
        }
      },
      {
        id: 'war3a',
        character: 'General Godric',
        image: 'assets/images/characters/general.png',
        text: 'Ordumuz güçlendi, ancak komşu krallıklar endişeleniyor ve sınırlarını güçlendiriyor.',
        leftChoice: {
          text: 'Diplomatik ilişkileri güçlendir',
          effects: { people: 5, treasury: -10, army: -5 },
          nextCard: 'war4'
        },
        rightChoice: {
          text: 'Sınır kalelerini güçlendir',
          effects: { army: 10, treasury: -15 },
          nextCard: 'war4'
        }
      },
      {
        id: 'war3b',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'İsyancılarla yapılan anlaşma başarılı oldu, ancak diğer bölgelerde de benzer istekler artıyor.',
        leftChoice: {
          text: 'Diğer bölgelere de özerklik ver',
          effects: { people: 15, army: -10, religion: 5 },
          nextCard: 'war4'
        },
        rightChoice: {
          text: 'Sıkı bir yönetim uygula',
          effects: { army: 10, people: -10, religion: -5 },
          nextCard: 'war4'
        }
      },
      {
        id: 'war4',
        character: 'Sınır Muhafızı',
        image: 'assets/images/characters/guard.png',
        text: 'Sınırlarınızda ticaret kervanları artıyor, ancak bazıları kaçakçılık yapıyor.',
        leftChoice: {
          text: 'Sınır kontrollerini sıkılaştır',
          effects: { treasury: 10, people: -5, army: 5 },
          nextCard: 'religion1'
        },
        rightChoice: {
          text: 'Ticareti serbest bırak',
          effects: { treasury: 15, army: -5, people: 5 },
          nextCard: 'religion1'
        }
      }
    ],
  
    religion: [
      {
        id: 'religion1',
        character: 'Başrahip Malachi',
        image: 'assets/images/characters/priest.png',
        text: 'Yeni bir tarikat tapınaklarımıza saldırıyor!',
        leftChoice: {
          text: 'Hoşgörülü ol',
          effects: { religion: -12, people: 15 },
          nextCard: 'religion2a'
        },
        rightChoice: {
          text: 'Engizisyon gönder',
          effects: { religion: 20, people: -15 },
          nextCard: 'religion2b'
        }
      },
      {
        id: 'religion2a',
        character: 'Başrahip Malachi',
        image: 'assets/images/characters/priest.png',
        text: 'Hoşgörünüz halk arasında takdir topladı, ancak bazı dini liderler endişeleniyor.',
        leftChoice: {
          text: 'Dini liderleri destekle',
          effects: { religion: 10, people: -5 },
          nextCard: 'religion3a'
        },
        rightChoice: {
          text: 'Halkın desteğini sürdür',
          effects: { people: 10, religion: -5 },
          nextCard: 'religion3a'
        }
      },
      {
        id: 'religion2b',
        character: 'Engizisyon Şefi',
        image: 'assets/images/characters/guard.png',
        text: 'Engizisyon tarikatı bastırdı, ancak halk arasında korku ve nefret yayıldı.',
        leftChoice: {
          text: 'Engizisyonu güçlendir',
          effects: { religion: 15, people: -15, army: 5 },
          nextCard: 'religion3b'
        },
        rightChoice: {
          text: 'Engizisyonu yumuşat',
          effects: { religion: -5, people: 10 },
          nextCard: 'religion3b'
        }
      },
      {
        id: 'religion3a',
        character: 'Başrahip Malachi',
        image: 'assets/images/characters/priest.png',
        text: 'Krallığınızda farklı inançlar barış içinde yaşıyor, ancak bazı soylular endişeleniyor.',
        leftChoice: {
          text: 'Soyluları destekle',
          effects: { religion: 5, treasury: 10, people: -5 },
          nextCard: 'religion4'
        },
        rightChoice: {
          text: 'Halkın desteğini sürdür',
          effects: { people: 10, treasury: -5, religion: 0 },
          nextCard: 'religion4'
        }
      },
      {
        id: 'religion3b',
        character: 'Başrahip Malachi',
        image: 'assets/images/characters/priest.png',
        text: 'Dini kurumlar güçlendi, ancak halk arasında hoşnutsuzluk artıyor.',
        leftChoice: {
          text: 'Halka yardım et',
          effects: { people: 10, treasury: -15, religion: 0 },
          nextCard: 'religion4'
        },
        rightChoice: {
          text: 'Dini kurumları destekle',
          effects: { religion: 10, treasury: -10, people: -5 },
          nextCard: 'religion4'
        }
      },
      {
        id: 'religion4',
        character: 'Başrahip Malachi',
        image: 'assets/images/characters/priest.png',
        text: 'Krallığınızda dini barış hüküm sürüyor, ancak komşu krallıklarda dini çatışmalar artıyor.',
        leftChoice: {
          text: 'Mültecilere sığınak ver',
          effects: { people: 15, treasury: -10, religion: 5 },
          nextCard: 'event1'
        },
        rightChoice: {
          text: 'Sınırları kapat',
          effects: { treasury: 5, people: -5, religion: 0 },
          nextCard: 'event1'
        }
      }
    ],
  
    events: [
      {
        id: 'event1',
        character: 'Köylü Kadın',
        image: 'assets/images/characters/peasant.png',
        text: 'Kıtlık kapıda! Çocuklarım açlıktan ölüyor!',
        leftChoice: {
          text: 'Ambarları aç',
          effects: { people: 20, treasury: -25 },
          nextCard: 'event2a'
        },
        rightChoice: {
          text: 'Askerlere öncelik ver',
          effects: { army: 15, people: -20 },
          nextCard: 'event2b'
        }
      },
      {
        id: 'event2a',
        character: 'Köylü Kadın',
        image: 'assets/images/characters/peasant.png',
        text: 'Halk teşekkür ediyor, ancak ambarlar boşaldı ve kış yaklaşıyor.',
        leftChoice: {
          text: 'Komşu krallıklardan tahıl satın al',
          effects: { people: 10, treasury: -20 },
          nextCard: 'event3a'
        },
        rightChoice: {
          text: 'Halkın kendi çözüm bulmasını bekle',
          effects: { treasury: 0, people: -10 },
          nextCard: 'event3a'
        }
      },
      {
        id: 'event2b',
        character: 'General Godric',
        image: 'assets/images/characters/general.png',
        text: 'Askerler teşekkür ediyor, ancak halk arasında hoşnutsuzluk artıyor.',
        leftChoice: {
          text: 'Halka yardım et',
          effects: { people: 10, treasury: -15, army: -5 },
          nextCard: 'event3b'
        },
        rightChoice: {
          text: 'Ordunun gücünü koru',
          effects: { army: 10, people: -10 },
          nextCard: 'event3b'
        }
      },
      {
        id: 'event3a',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'Kış yaklaşıyor ve krallığınızda barış hüküm sürüyor. Ancak sınırlarınızda gerginlik artıyor.',
        leftChoice: {
          text: 'Diplomatik ilişkileri güçlendir',
          effects: { people: 5, treasury: -10, religion: 5 },
          nextCard: 'event4'
        },
        rightChoice: {
          text: 'Ordunu güçlendir',
          effects: { army: 15, treasury: -15 },
          nextCard: 'event4'
        }
      },
      {
        id: 'event3b',
        character: 'Baş Danışman',
        image: 'assets/images/characters/advisor.png',
        text: 'Krallığınızda düzen sağlandı, ancak komşu krallıklar endişeleniyor.',
        leftChoice: {
          text: 'Diplomatik ilişkileri güçlendir',
          effects: { people: 5, treasury: -10, religion: 5 },
          nextCard: 'event4'
        },
        rightChoice: {
          text: 'Ordunu güçlendir',
          effects: { army: 15, treasury: -15 },
          nextCard: 'event4'
        }
      },
      {
        id: 'event4',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Bir yabancı, krallığınızın geleceği hakkında kehanetlerde bulunuyor.',
        leftChoice: {
          text: 'Kehanetleri dinle',
          effects: { religion: 10, people: 5, treasury: -5 },
          nextCard: 'special1'
        },
        rightChoice: {
          text: 'Yabancıyı kov',
          effects: { religion: -5, people: -5, army: 5 },
          nextCard: 'special1'
        }
      }
    ],
  
    special: [
      {
        id: 'special1',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Bu kılıç size kadim bir güç verecek...',
        leftChoice: {
          text: 'Kabul et',
          effects: { army: 25, religion: -15 },
          nextCard: 'special2a'
        },
        rightChoice: {
          text: 'Reddet',
          effects: { religion: 10, people: -10 },
          nextCard: 'special2b'
        }
      },
      {
        id: 'special2a',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Kılıcın gücü krallığınızı koruyacak, ancak bedeli ağır olacak...',
        leftChoice: {
          text: 'Gücü kullan',
          effects: { army: 15, religion: -10, people: -5 },
          nextCard: 'special3a'
        },
        rightChoice: {
          text: 'Kılıcı sakla',
          effects: { religion: 5, people: 5, army: -5 },
          nextCard: 'special3a'
        }
      },
      {
        id: 'special2b',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Bilgelik gösterdiniz. Krallığınızın geleceği parlak olacak...',
        leftChoice: {
          text: 'Bilgeliği paylaş',
          effects: { religion: 10, people: 10, treasury: -5 },
          nextCard: 'special3b'
        },
        rightChoice: {
          text: 'Bilgeliği sakla',
          effects: { religion: 5, people: 5, treasury: 5 },
          nextCard: 'special3b'
        }
      },
      {
        id: 'special3a',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Kılıcın gücü krallığınızı koruyor, ancak halk arasında korku yayılıyor...',
        leftChoice: {
          text: 'Gücü sınırla',
          effects: { army: -5, people: 10, religion: 5 },
          nextCard: 'special4'
        },
        rightChoice: {
          text: 'Gücü artır',
          effects: { army: 10, people: -10, religion: -5 },
          nextCard: 'special4'
        }
      },
      {
        id: 'special3b',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Bilgeliğiniz krallığınızı güçlendiriyor, ancak bazıları bunu tehdit olarak görüyor...',
        leftChoice: {
          text: 'Bilgeliği paylaşmaya devam et',
          effects: { religion: 10, people: 10, army: -5 },
          nextCard: 'special4'
        },
        rightChoice: {
          text: 'Bilgeliği sınırla',
          effects: { religion: 5, people: 5, army: 5 },
          nextCard: 'special4'
        }
      },
      {
        id: 'special4',
        character: 'Gizemli Yabancı',
        image: 'assets/images/characters/stranger.png',
        text: 'Krallığınızın geleceği sizin ellerinizde. Seçimleriniz sonuçlarını doğuracak...',
        leftChoice: {
          text: 'Dengeli bir yönetim sürdür',
          effects: { people: 5, army: 5, treasury: 5, religion: 5 },
          nextCard: 'peace1'
        },
        rightChoice: {
          text: 'Güçlü bir yönetim sürdür',
          effects: { army: 10, treasury: 10, people: -5, religion: -5 },
          nextCard: 'peace1'
        }
      }
    ],
    
    validateCard(card) {
        if (!card) {
            console.error('Invalid card: Card is null or undefined');
            return false;
        }
        
        if (!card.id) {
            console.error('Invalid card: Missing ID');
            return false;
        }
        
        if (!card.text) {
            console.warn(`Card ${card.id} is missing text content`);
        }
        
        if (!card.image) {
            console.warn(`Card ${card.id} is missing image path`);
        }
        
        // Validate left choice
        if (!card.leftChoice) {
            console.error(`Card ${card.id} is missing left choice`);
            return false;
        }
        
        if (!card.leftChoice.text) {
            console.warn(`Card ${card.id} left choice is missing text`);
        }
        
        // Validate right choice
        if (!card.rightChoice) {
            console.error(`Card ${card.id} is missing right choice`);
            return false;
        }
        
        if (!card.rightChoice.text) {
            console.warn(`Card ${card.id} right choice is missing text`);
        }
        
        // Check nextCard references
        const checkNextCard = (nextCardId, choiceSide) => {
            if (!nextCardId) {
                console.warn(`Card ${card.id} ${choiceSide} choice is missing nextCard reference`);
                return;
            }
            
            const cardExists = this.findCardById(nextCardId);
            if (!cardExists) {
                console.error(`Card ${card.id} ${choiceSide} choice references non-existent card: ${nextCardId}`);
            }
        };
        
        if (card.leftChoice.nextCard) {
            checkNextCard(card.leftChoice.nextCard, 'left');
        }
        
        if (card.rightChoice.nextCard) {
            checkNextCard(card.rightChoice.nextCard, 'right');
        }
        
        return true;
    },
    
    getNextCard(currentCardId, choice, usedCardIds = new Set()) {
        try {
            const currentCard = this.findCardById(currentCardId);
            if (!currentCard) {
                console.error(`Could not find card with ID: ${currentCardId}`);
                return this.getRandomCard(usedCardIds);
            }
            
            const nextCardId = choice === 0 
                ? currentCard.leftChoice?.nextCard 
                : currentCard.rightChoice?.nextCard;
                
            if (!nextCardId) {
                console.warn(`No next card specified for card ${currentCardId}, choice ${choice}`);
                return this.getRandomCard(usedCardIds);
            }
            
            const nextCard = this.findCardById(nextCardId);
            if (!nextCard) {
                console.error(`Next card not found: ${nextCardId}`);
                return this.getRandomCard(usedCardIds);
            }
            
            return nextCard;
        } catch (error) {
            console.error('Error getting next card:', error);
            return this.getRandomCard(usedCardIds);
        }
    },
    
    findCardById(cardId) {
        // Search all card collections for matching ID
        for (const category of Object.values(this)) {
            if (Array.isArray(category)) {
                const foundCard = category.find(card => card.id === cardId);
                if (foundCard) return foundCard;
            }
        }
        
        console.warn(`Card not found with ID: ${cardId}`);
        return null;
    },
    
    getRandomCard(usedCardIds = new Set()) {
        // Get all available categories
        const categories = Object.entries(this)
            .filter(([key, value]) => Array.isArray(value) && key !== 'special')
            .map(([key, value]) => ({ key, cards: value }));
        
        if (categories.length === 0) {
            console.error('No card categories available');
            return null;
        }
        
        // Select a random category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // Filter out used cards
        const availableCards = randomCategory.cards.filter(card => 
            !usedCardIds.has(card.id)
        );
        
        if (availableCards.length === 0) {
            console.warn(`No unused cards in category ${randomCategory.key}`);
            // If we've used all cards in this category, try another or reset usage
            usedCardIds.clear();
            return this.getRandomCard(usedCardIds);
        }
        
        // Pick a random card from available cards
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        
        // Validate the card before returning
        if (this.validateCard(randomCard)) {
            return randomCard;
        } else {
            console.error('Selected random card failed validation, trying another');
            usedCardIds.add(randomCard.id); // Mark as used so we don't try it again
            return this.getRandomCard(usedCardIds);
        }
    },
    
    getRandomSpecialEvent() {
        if (!this.special || !Array.isArray(this.special) || this.special.length === 0) {
            console.warn('No special events available');
            return null;
        }
        
        const randomEvent = this.special[Math.floor(Math.random() * this.special.length)];
        
        if (this.validateCard(randomEvent)) {
            return randomEvent;
        } else {
            console.error('Selected special event failed validation');
            return null;
        }
    }
};

const StoryManager = {
    cards: StoryCards,
    
    validateCard(card) {
        const requiredFields = ['id', 'text', 'leftChoice', 'rightChoice'];
        const missingFields = requiredFields.filter(field => !card[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Invalid card: Missing required fields: ${missingFields.join(', ')}`);
        }
        
        if (!card.leftChoice.text || !card.rightChoice.text) {
            throw new Error(`Invalid card ${card.id}: Choice text is missing`);
        }
        
        return true;
    },
    
    getNextCard(currentCardId, choice, usedCardIds = new Set()) {
        try {
            if (!currentCardId) {
                return this.getRandomCard(usedCardIds);
            }
            
            const currentCard = this.findCardById(currentCardId);
            if (!currentCard) {
                throw new Error(`Card not found: ${currentCardId}`);
            }
            
            const nextCardId = choice === 0 ? currentCard.leftChoice.nextCard : currentCard.rightChoice.nextCard;
            if (!nextCardId) {
                return this.getRandomCard(usedCardIds);
            }
            
            const nextCard = this.findCardById(nextCardId);
            if (!nextCard) {
                console.warn(`Next card not found: ${nextCardId}, getting random card instead`);
                return this.getRandomCard(usedCardIds);
            }
            
            return nextCard;
        } catch (error) {
            console.error('Error getting next card:', error);
            return this.getRandomCard(usedCardIds);
        }
    },
    
    findCardById(cardId) {
        try {
            for (const category of Object.values(this.cards)) {
                const card = category.find(c => c.id === cardId);
                if (card) {
                    this.validateCard(card);
                    return card;
                }
            }
            return null;
        } catch (error) {
            console.error(`Error finding card ${cardId}:`, error);
            return null;
        }
    },
    
    getRandomCard(usedCardIds = new Set()) {
        try {
            const availableCards = Object.entries(this.cards)
                .filter(([category]) => category !== 'special')
                .flatMap(([_, cards]) => cards)
                .filter(card => !usedCardIds.has(card.id));
            
            if (availableCards.length === 0) {
                console.log('No available cards, resetting used cards');
                return this.getRandomCard(new Set());
            }
            
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const selectedCard = availableCards[randomIndex];
            
            this.validateCard(selectedCard);
            return selectedCard;
        } catch (error) {
            console.error('Error getting random card:', error);
            return this.cards.intro[0]; // Fallback to first intro card
        }
    },
    
    getRandomSpecialEvent() {
        try {
            const specialEvents = this.cards.special || [];
            if (specialEvents.length === 0) {
                throw new Error('No special events available');
            }
            
            const randomIndex = Math.floor(Math.random() * specialEvents.length);
            const event = specialEvents[randomIndex];
            
            // Validate special event
            if (!event.id || !event.description || !event.choices || event.choices.length !== 2) {
                throw new Error('Invalid special event format');
            }
            
            return event;
        } catch (error) {
            console.error('Error getting random special event:', error);
            return null;
        }
    }
};

// Initialize story manager
window.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize cards from StoryCards
        Object.entries(StoryCards).forEach(([category, cards]) => {
            if (Array.isArray(cards)) {
                StoryManager.cards[category] = cards;
            }
        });
        
        // Validate all cards
        Object.values(StoryManager.cards).forEach(categoryCards => {
            if (Array.isArray(categoryCards)) {
                categoryCards.forEach(card => {
                    try {
                        StoryManager.validateCard(card);
                    } catch (error) {
                        console.warn(`Card validation warning: ${error.message}`);
                    }
                });
            }
        });
        
        console.log('Story manager initialized successfully');
    } catch (error) {
        console.error('Story manager initialization error:', error);
    }
});