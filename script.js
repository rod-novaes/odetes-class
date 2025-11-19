// =================================================================
//  1. MAPEAMENTO DE ELEMENTOS DO DOM (ESCOPO GLOBAL)
// =================================================================
const mainContentArea = document.getElementById('main-content-area');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const chatInputArea = document.querySelector('.chat-input-area');
const bottomNavBar = document.getElementById('bottom-nav-bar');
const navHomeBtn = document.getElementById('nav-home-btn');
const navCustomBtn = document.getElementById('nav-custom-btn');
const navStoreBtn = document.getElementById('nav-store-btn');
const navHistoryBtn = document.getElementById('nav-history-btn');
const navGuideBtn = document.getElementById('nav-guide-btn');
const feedbackModal = document.getElementById('feedback-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const feedbackContent = document.getElementById('feedback-content');
const translateBtn = document.getElementById('translate-btn');
const historyModal = document.getElementById('history-modal');
const historyModalTitle = document.getElementById('history-modal-title');
const historyModalContent = document.getElementById('history-modal-content');
const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
const historyPracticeAgainBtn = document.getElementById('history-practice-again-btn');
const missionModal = document.getElementById('mission-modal');
const missionGoalText = document.getElementById('mission-goal-text');
const missionModalCloseBtn = document.getElementById('mission-modal-close-btn');
const missionImageContainer = document.getElementById('mission-image-container');
const micBtn = document.getElementById('mic-btn');
const startTextMissionBtn = document.getElementById('start-text-mission-btn');
const startVoiceMissionBtn = document.getElementById('start-voice-mission-btn');
const practiceAgainBtn = document.getElementById('practice-again-btn');
const contextBar = document.getElementById('context-bar');
const langIndicatorBtn = document.getElementById('lang-indicator-btn');
const proficiencyIndicatorBtn = document.getElementById('proficiency-indicator-btn');
const exitChatBtn = document.getElementById('exit-chat-btn');
const heartsIndicator = document.getElementById('score-indicator');
const headerBackBtn = document.getElementById('header-back-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const rewardNotification = document.getElementById('reward-notification');
const rewardText = document.getElementById('reward-text');
const rewardImage = document.getElementById('reward-image');
const splashScreen = document.getElementById('splash-screen');
const splashGif = document.getElementById('splash-gif');
const splashTitle = document.getElementById('splash-title');
const appContainer = document.getElementById('app-container');

// =================================================================
//  2. VARIÁVEIS DE ESTADO E CONSTANTES GLOBAIS
// =================================================================
const AVATAR_FEMALE_URL = 'assets/avatar-odete2.png';
const AVATAR_MALE_URL = 'assets/avatar-luciano.png';
function getAIAvatar() {
    const gender = localStorage.getItem('voiceGender') || 'female';
    return gender === 'male' ? AVATAR_MALE_URL : AVATAR_FEMALE_URL;
}
const AVATAR_USER_URL = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
const TYPING_SIMULATION_DELAY = 500;
let conversationHistory = [];
let currentScenario = null;
let originalFeedback = '';
let translatedFeedback = '';
let isTranslated = false;
let currentInteractionMode = null; // 'text' ou 'voice'
let conversationState = 'IDLE'; // IDLE, AI_SPEAKING, AWAITING_USER_INPUT, USER_LISTENING, PROCESSING
let isConversationActive = false;
const synthesis = window.speechSynthesis;
let voices = [];
let currentAudioPlayer = null; // Para áudio da ElevenLabs/Google
let mediaRecorder;
let audioChunks = [];
let badgeNotificationQueue = [];
let isBadgeNotificationVisible = false;
let messageDisplayTimeoutId = null;

// =================================================================
//  3. SISTEMA DE GAMIFICAÇÃO: ENERGIA (CORAÇÕES)
// =================================================================
const MAX_HEARTS = 10;
const RECHARGE_TIME_MS = 6 * 60 * 60 * 1000; // 6 horas
let userHearts = MAX_HEARTS;
let nextHeartTimestamp = 0;
let heartRechargeInterval = null;

// =================================================================
//  4. FUNÇÕES DE INICIALIZAÇÃO E UTILITÁRIOS GLOBAIS
// =================================================================

function initializeSpeechAPI() {
    function populateVoiceList() {
        if (synthesis.getVoices().length > 0) { voices = synthesis.getVoices(); }
    }
    populateVoiceList();
    if (synthesis.onvoiceschanged !== undefined) { synthesis.onvoiceschanged = populateVoiceList; }
}

// =================================================================
//  5. GERENCIAMENTO DE CONFIGURAÇÕES E CABEÇALHO
// =================================================================
function setDefaultSettings() {
    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en-US');
    }
    if (!localStorage.getItem('proficiency')) {
        localStorage.setItem('proficiency', 'intermediate');
    }
    if (!localStorage.getItem('voiceGender')) {
        localStorage.setItem('voiceGender', 'female'); // Padrão feminino
    }
}

function updateHeaderIndicators() {
    const langMap = { 
        "en-US": "🇺🇸", 
        "es-MX": "🇲🇽" 
    };
    const currentLang = localStorage.getItem('language') || 'en-US';
    langIndicatorBtn.innerHTML = langMap[currentLang] || '🌐';

    const profMap = {
        basic: '★<span class="star-off">★★</span>',
        intermediate: '★★<span class="star-off">★</span>',
        advanced: '★★★'
    };
    const currentProf = localStorage.getItem('proficiency') || 'intermediate';
    proficiencyIndicatorBtn.innerHTML = profMap[currentProf] || '★★★';
}

// =================================================================
//  6. SISTEMA DE GAMIFICAÇÃO: MOEDAS
// =================================================================
function getCoins() {
    return parseInt(localStorage.getItem('userCoins') || '0', 10);
}

function saveCoins(newAmount) {
    localStorage.setItem('userCoins', newAmount);
}

// --- Funções do Sistema de Corações ---
function initializeHeartSystem() {
    let heartData = JSON.parse(localStorage.getItem('heartData') || '{}');
    const now = Date.now();

    if (!heartData.hearts && !heartData.nextHeartTimestamp) {
        userHearts = MAX_HEARTS;
        nextHeartTimestamp = 0;
    } else {
        userHearts = heartData.hearts;
        nextHeartTimestamp = heartData.nextHeartTimestamp;

        if (userHearts < MAX_HEARTS && nextHeartTimestamp > 0 && now >= nextHeartTimestamp) {
            const timePassed = now - nextHeartTimestamp;
            const heartsRecharged = Math.floor(timePassed / RECHARGE_TIME_MS) + 1;
            userHearts = Math.min(MAX_HEARTS, userHearts + heartsRecharged);
        }
    }

    if (userHearts < MAX_HEARTS) {
        if (nextHeartTimestamp === 0 || now >= nextHeartTimestamp) {
            nextHeartTimestamp = now + RECHARGE_TIME_MS;
        }
    } else {
        nextHeartTimestamp = 0;
    }

    saveHeartData();
    updateHeartsDisplay();
    startHeartRechargeTimer();
}

function saveHeartData() {
    localStorage.setItem('heartData', JSON.stringify({ hearts: userHearts, nextHeartTimestamp: nextHeartTimestamp }));
}

function startHeartRechargeTimer() {
    if (heartRechargeInterval) clearInterval(heartRechargeInterval);

    heartRechargeInterval = setInterval(() => {
        if (userHearts >= MAX_HEARTS) {
            nextHeartTimestamp = 0;
            updateHeartsDisplay();
            clearInterval(heartRechargeInterval);
            return;
        }

        const now = Date.now();
        if (nextHeartTimestamp === 0) {
            nextHeartTimestamp = now + RECHARGE_TIME_MS;
        }

        if (now >= nextHeartTimestamp) {
            userHearts++;
            nextHeartTimestamp = (userHearts < MAX_HEARTS) ? now + RECHARGE_TIME_MS : 0;
            updateHeartsDisplay();
            saveHeartData();
        }
    }, 1000);
}

function spendHeart() {
    if (userHearts > 0) {
        userHearts--;
        if (userHearts < MAX_HEARTS && nextHeartTimestamp === 0) {
            nextHeartTimestamp = Date.now() + RECHARGE_TIME_MS;
            startHeartRechargeTimer();
        }
        saveHeartData();
        updateHeartsDisplay();
        return true;
    }
    return false;
}

function addHearts(amount) {
    userHearts = Math.min(MAX_HEARTS, userHearts + amount);
    if (userHearts >= MAX_HEARTS) {
        nextHeartTimestamp = 0; 
    }
    saveHeartData();
    updateHeartsDisplay();
    startHeartRechargeTimer(); 
}

function updateHeartsDisplay() {
    heartsIndicator.innerHTML = `❤️ ${userHearts}`;
    heartsIndicator.classList.remove('score-indicator-hidden');
}

function showNoHeartsModal() {
    const existingModal = document.getElementById('no-hearts-modal');
    if (existingModal) existingModal.remove();

    const userCoins = getCoins();
    const rechargeCost = 40;
    const canAfford = userCoins >= rechargeCost;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'no-hearts-modal';
    modalOverlay.className = 'modal-overlay';

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Energia Esgotada!</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body" style="text-align: center;">
                <p>Puxa! Parece que sua energia acabou por agora.</p>
                <p>Seus corações recarregam automaticamente com o tempo (1 ❤️ a cada 6 horas).</p>
                <br>
                <p>Não quer esperar? Recarregue agora mesmo na loja!</p>
                <div class="completion-actions" style="gap: 16px; margin-top: 16px;">
                    <button id="no-hearts-ok-btn" class="completion-finish-btn">Entendido</button>
                    <button id="recharge-hearts-btn" class="primary-btn" ${!canAfford ? 'disabled title="Moedas insuficientes"' : ''}>
                        Recarregar com ${rechargeCost} 🪙
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('#no-hearts-ok-btn').addEventListener('click', closeModal);
    
    const rechargeBtn = modalOverlay.querySelector('#recharge-hearts-btn');
    if (rechargeBtn && !rechargeBtn.disabled) {
        rechargeBtn.addEventListener('click', () => {
            closeModal();
            renderStorePage();
        });
    }

    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
}


// =================================================================
//  7. GERENCIAMENTO DE HISTÓRICO DE CONVERSAS
// =================================================================
function populateHistoryList(listElement) { 
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; 
    listElement.innerHTML = ''; 
    if (history.length === 0) { 
        listElement.innerHTML = '<li><small>Nenhum diálogo no histórico.</small></li>'; 
        return; 
    } 
    history.forEach((item, index) => { 
        const li = document.createElement('li'); 
        li.className = 'history-item'; 
        const viewButton = document.createElement('div'); 
        viewButton.className = 'history-item-view'; 
        // Exibe o nome do cenário na língua em que foi praticado, ou o fallback em inglês
        viewButton.innerHTML = `<span>${item.scenarioName}</span><small>${new Date(item.timestamp).toLocaleString()}</small>`; 
        viewButton.dataset.index = index; 
        const deleteButton = document.createElement('button'); 
        deleteButton.className = 'history-item-delete'; 
        deleteButton.innerHTML = '&times;'; 
        deleteButton.title = 'Excluir este item'; 
        deleteButton.dataset.index = index; 
        li.appendChild(viewButton); 
        li.appendChild(deleteButton); 
        listElement.appendChild(li); 
    }); 
}

function showHistoryModal(index) {
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    const item = history[index];
    if (!item) return;

    let scenarioToPractice;

    if (item.categoryName === 'custom') {
        scenarioToPractice = {
            "pt-BR": { goal: item.scenarioGoal },
            "en-US": { name: item.scenarioName, goal: item.scenarioGoal },
            "es-MX": { name: item.scenarioName, goal: item.scenarioGoal } // Adiciona fallback
        };
    } else {
        // Tenta encontrar pelo ID do cenário (chave em PT-BR), que é mais seguro
        if (item.scenarioId && SCENARIOS[item.categoryName] && SCENARIOS[item.categoryName][item.scenarioId]) {
             scenarioToPractice = SCENARIOS[item.categoryName][item.scenarioId];
        } 
        // Fallback para sistemas antigos (pelo nome em inglês)
        else {
            const categoryScenarios = SCENARIOS[item.categoryName];
            let originalScenarioKey = null;
            if (categoryScenarios) {
                originalScenarioKey = Object.keys(categoryScenarios).find(key => 
                    categoryScenarios[key]['en-US'].name === item.scenarioName
                );
            }
            if (originalScenarioKey) {
                scenarioToPractice = SCENARIOS[item.categoryName][originalScenarioKey];
            }
        }
    }

    const practiceBtn = document.getElementById('history-practice-again-btn');

    if (scenarioToPractice && practiceBtn) {
        practiceBtn.style.display = 'block';

        const newBtn = practiceBtn.cloneNode(true);
        practiceBtn.parentNode.replaceChild(newBtn, practiceBtn);
        
        newBtn.addEventListener('click', () => {
            if (userHearts < 1) {
                showNoHeartsModal();
                return;
            }
            historyModal.classList.add('modal-hidden');
            // Usa o scenarioId se disponível, senão tenta recuperar do nome
            const scenarioId = item.scenarioId || Object.keys(SCENARIOS[item.categoryName] || {}).find(k => SCENARIOS[item.categoryName][k]['en-US'].name === item.scenarioName);
            
            setTimeout(() => {
                startNewConversation(scenarioToPractice, item.categoryName, scenarioId);
            }, 300);
        });

    } else if (practiceBtn) {
        practiceBtn.style.display = 'none';
    }
    
    historyModalTitle.textContent = item.scenarioName;
    historyModalContent.innerHTML = '';
    item.transcript.forEach(msg => {
        const el = document.createElement('div');
        el.classList.add('message', `${msg.role}-message`);
        const p = document.createElement('p');
        p.textContent = msg.content;
        el.appendChild(p);
        historyModalContent.appendChild(el);
    });

    if (item.feedback) {
        const separator = document.createElement('hr');
        separator.className = 'history-feedback-separator';
        const feedbackTitle = document.createElement('h3');
        feedbackTitle.className = 'history-feedback-title';
        feedbackTitle.textContent = 'Your Feedback';
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'history-feedback-content';
        feedbackContainer.innerHTML = formatFeedbackText(item.feedback);
        historyModalContent.appendChild(separator);
        historyModalContent.appendChild(feedbackTitle);
        historyModalContent.appendChild(feedbackContainer);
    }

    historyModal.classList.remove('modal-hidden');
}

function deleteHistoryItem(index) { if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) { return; } let history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.splice(index, 1); localStorage.setItem('conversationHistory', JSON.stringify(history)); renderHistoryPage(); }

// =================================================================
//  9. RENDERIZAÇÃO DE PÁGINAS E INTERFACES
// =================================================================
function renderHomePage() {
    updateActiveNavIcon('nav-home-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');

    exitChatBtn.textContent = 'Sair';
    exitChatBtn.classList.add('exit-chat-btn-hidden');

    updateHeartsDisplay();
    headerBackBtn.classList.add('back-btn-hidden');

    renderHomePageContent();

    mainContentArea.scrollTop = 0;
}

function renderCustomScenarioPage() {
    updateActiveNavIcon('nav-custom-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area custom-scenario-page';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');

    exitChatBtn.textContent = 'Sair';
    exitChatBtn.classList.add('exit-chat-btn-hidden');

    updateHeartsDisplay();
    headerBackBtn.classList.add('back-btn-hidden');

    // Exibe o nome do idioma atual para o usuário
    const langMap = { "en-US": "inglês", "es-MX": "espanhol" };
    const currentLang = localStorage.getItem('language') || 'en-US';
    const selectedLanguageName = langMap[currentLang] || "inglês";

    const customScenarioContainer = document.createElement('div');
    customScenarioContainer.className = 'custom-scenario-container';
    customScenarioContainer.innerHTML = `
        <h2>Cenário Personalizado</h2>
        <p>Descreva uma situação ou objetivo que você gostaria de praticar em <strong>${selectedLanguageName}</strong>.</p>
        
        <div class="custom-charge-info">
            <p>
                <span style="font-size: 1.2rem;">✨</span> Cenários personalizados custam <span class="custom-charge-hearts">2 Corações ❤️❤️</span>.
                Eles exigem um esforço extra da IA!
            </p>
        </div>
        
        <textarea id="custom-scenario-input" rows="6" placeholder="Ex: Convidar a pessoa que amo para sair, correndo o risco de sofer uma rejeição."></textarea>
        <div id="custom-scenario-feedback" class="custom-scenario-feedback"></div>
        <button id="start-custom-scenario-btn" class="primary-btn">Iniciar Cenário</button>
    `;
    mainContentArea.appendChild(customScenarioContainer);
}

function showCustomScenarioError(message) { const feedbackArea = document.getElementById('custom-scenario-feedback'); if (feedbackArea) { feedbackArea.textContent = message; feedbackArea.style.display = 'block'; } }
function clearCustomScenarioError() { const feedbackArea = document.getElementById('custom-scenario-feedback'); if (feedbackArea) { feedbackArea.textContent = ''; feedbackArea.style.display = 'none'; } }

function renderHistoryPage() {
    updateActiveNavIcon('nav-history-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area history-page';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');

    exitChatBtn.textContent = 'Sair';
    exitChatBtn.classList.add('exit-chat-btn-hidden');

    updateHeartsDisplay();
    headerBackBtn.classList.add('back-btn-hidden');

    const historyContainer = document.createElement('div');
    historyContainer.className = 'history-container';
    historyContainer.innerHTML = '<h2>Histórico de Diálogos</h2>';
    const list = document.createElement('ul');
    list.id = 'history-list';
    populateHistoryList(list);
    historyContainer.appendChild(list);
    mainContentArea.appendChild(historyContainer);
}

function renderChatInterface() {
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area chat-window';
    chatInputArea.classList.remove('chat-input-hidden');
    updateActiveNavIcon(null);
    bottomNavBar.classList.add('nav-hidden');

    exitChatBtn.textContent = 'Sair';
    exitChatBtn.classList.remove('exit-chat-btn-hidden');

    heartsIndicator.classList.add('score-indicator-hidden');
    headerBackBtn.classList.add('back-btn-hidden');
}

function renderSettingsPage() {
    updateActiveNavIcon(null); 
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area settings-page';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');
    heartsIndicator.classList.add('score-indicator-hidden');
    exitChatBtn.classList.add('exit-chat-btn-hidden');
    headerBackBtn.classList.remove('back-btn-hidden');

    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-page-container';
    settingsContainer.innerHTML = `
        <section class="settings-section">
            <h2>Idioma da Prática</h2>
            <div class="language-options-container">
                <div class="option-card language-card" data-value="en-US"><span>🇺🇸</span> English</div>
                <div class="option-card language-card" data-value="es-MX"><span>🇲🇽</span> Español</div>
            </div>
        </section>
        <section class="settings-section">
            <h2>Nível de Dificuldade</h2>
            <div class="proficiency-grid">
                <div class="option-card proficiency-card" data-value="basic">
                    <div class="proficiency-info">
                        <h5>Básico</h5>
                        <p>Frases curtas</p>
                    </div>
                    <div class="proficiency-stars">
                        ★<span class="star-off">★★</span>
                    </div>
                </div>
                <div class="option-card proficiency-card" data-value="intermediate">
                    <div class="proficiency-info">
                        <h5>Intermediário</h5>
                        <p>Conversa direta</p>
                    </div>
                    <div class="proficiency-stars">
                        ★★<span class="star-off">★</span>
                    </div>
                </div>
                <div class="option-card proficiency-card" data-value="advanced">
                    <div class="proficiency-info">
                        <h5>Avançado</h5>
                        <p>Conversa natural</p>
                    </div>
                    <div class="proficiency-stars">
                        ★★★
                    </div>
                </div>
            </div>
        </section>
        <section class="settings-section">
            <h2>Voz da IA</h2>
            <div class="language-options-container">
                <div class="option-card voice-card" data-value="female">
                    <img src="assets/avatar-odete2.png" alt="Odete" class="settings-avatar">
                    Feminina
                </div>
                <div class="option-card voice-card" data-value="male">
                    <img src="assets/avatar-luciano.png" alt="Luciano" class="settings-avatar">
                    Masculina
                </div>
            </div>
        </section>
    `;
    mainContentArea.appendChild(settingsContainer);

    const savedLanguage = localStorage.getItem('language') || 'en-US';
    const savedProficiency = localStorage.getItem('proficiency') || 'intermediate';

    const activeLangCard = document.querySelector(`.option-card[data-value="${savedLanguage}"]`);
    if (activeLangCard) {
        activeLangCard.classList.add('active');
    }

    const activeProfCard = document.querySelector(`.option-card[data-value="${savedProficiency}"]`);
    if (activeProfCard) {
        activeProfCard.classList.add('active');
    }

    const savedVoice = localStorage.getItem('voiceGender') || 'female';
    const activeVoiceCard = document.querySelector(`.option-card[data-value="${savedVoice}"]`);
    if (activeVoiceCard) {
        activeVoiceCard.classList.add('active');
    }
}

function renderGuidePage() {
    updateActiveNavIcon('nav-guide-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area guide-page';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');
    heartsIndicator.classList.add('score-indicator-hidden');
    exitChatBtn.classList.add('exit-chat-btn-hidden');
    headerBackBtn.classList.add('back-btn-hidden');

    const languageMap = { 'en-US': 'inglês', 'es-MX': 'espanhol' };
    const currentLanguageName = languageMap[localStorage.getItem('language') || 'en-US'];

    const guideContainer = document.createElement('div');
    guideContainer.className = 'guide-carousel-container';
    guideContainer.innerHTML = `
        <div class="guide-carousel-wrapper">
            <div class="guide-carousel-slides">
                <!-- Slide 1: Sua Guia -->
                <div class="guide-carousel-card" data-icon="👋">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete.png" alt="Odete, sua guia" class="guide-avatar">
                    </div>    
                    <h2>Seus Guias</h2>
                    <div class="guide-content">
                        <p>Olá! Somos <strong>Luciano e Odete</strong>, seus guias pessoais nesta jornada.</p>
                        <p>Vamos ajudar você a destravar seu <strong>${currentLanguageName}</strong> em diálogos realistas <strong>conduzidos por IA</strong>.</p>
                    </div>
                </div>

                <!-- Slide 2: Suas Missões -->
                <div class="guide-carousel-card" data-icon="🎯">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-apontando.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Suas Missões</h2>
                    <div class="guide-content">
                        <p>Cada diálogo tem um objetivo realista, seja pedir um café, fazer uma apresentação ou chamar alguém pra sair.</p>
                        <p>Você pode cumprir suas missões por voz 🎤 ou texto ✍️.</p>
                    </div>
                </div>

                <!-- Slide 3: Idioma e Nível -->
                <div class="guide-carousel-card" data-icon="⭐">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-estrelas.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Idioma e Nível</h2>
                    <div class="guide-content">
                        <p>Você está no controle! A qualquer momento, clique nas estrelas no topo da tela para ajustar o idioma e o nível de dificuldade.</p>
                    </div>
                </div>

                <!-- Slide 4: Corações -->
                <div class="guide-carousel-card" data-icon="❤️">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-coracao.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Corações</h2>
                    <div class="guide-content">
                        <p>Os corações são sua <strong>energia</strong>. Missões custam <strong>1 ❤️</strong> (normais) ou <strong>2 ❤️</strong> (personalizadas).</p>
                        <p>Eles recarregam com o tempo. Se acabar, espere ou visite a 🛍️ <strong>Loja</strong>.</p>
                    </div>
                </div>
                
                <!-- Slide 5: Moedas -->
                <div class="guide-carousel-card" data-icon="🪙">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-moedas.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Moedas</h2>
                    <div class="guide-content">
                        <p>Você ganha moedas ao completar missões. Dica: missões por voz 🎤 rendem <strong>o dobro de moedas!</strong></p>
                        <p>Use-as na 🛍️ <strong>Loja</strong> para comprar corações e novos cenários</p>
                    </div>
                </div>

                <!-- Slide 6: Ações -->
                <div class="guide-carousel-card" data-icon="🚀">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-apontando-para-baixo.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Vamos começar?</h2>
                    <div class="guide-content">
                        <div class="completion-actions guide-actions">
                            <button id="guide-start-mission-btn" class="primary-btn">Começar Primeira Missão</button>
                            <button id="guide-go-to-settings-btn" class="completion-finish-btn">Ajustar Idioma ⭐</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="guide-carousel-dots">
        </div>
    `;

    mainContentArea.appendChild(guideContainer);
    mainContentArea.scrollTop = 0;

    setupGuideCarousel();
}

function setupGuideCarousel() {
    const slidesContainer = document.querySelector('.guide-carousel-slides');
    const cards = document.querySelectorAll('.guide-carousel-card');
    const dotsContainer = document.querySelector('.guide-carousel-dots');

    if (!slidesContainer || cards.length === 0 || !dotsContainer) return;

    let currentSlideIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('guide-dot');
        dot.dataset.index = index;
        if (index === 0) {
            dot.classList.add('active');
        }
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.guide-dot');

    function updateCarouselState(newIndex) {
        if (newIndex < 0 || newIndex >= cards.length) return;

        currentSlideIndex = newIndex;

        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        dots.forEach(dot => {
            dot.classList.toggle('active', parseInt(dot.dataset.index) === currentSlideIndex);
        });
    }
    
    dotsContainer.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.guide-dot');
        if (targetDot) {
            const index = parseInt(targetDot.dataset.index);
            updateCarouselState(index);
        }
    });

    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < swipeThreshold) {
            return;
        }
        
        if (difference > 0) {
            updateCarouselState(currentSlideIndex + 1);
        } else {
            updateCarouselState(currentSlideIndex - 1);
        }
    }
}

// =================================================================
//  10. LÓGICA CENTRAL DA CONVERSA
// =================================================================
/**
 * Inicia uma nova conversa.
 * @param {Object} scenario O objeto do cenário contendo todos os idiomas (pt-BR, en-US, es-MX).
 * @param {string} categoryName O nome da categoria.
 * @param {string} scenarioId O ID do cenário (geralmente a chave em PT-BR, ex: "Pedindo um desconto").
 */
function startNewConversation(scenario, categoryName, scenarioId) {
    currentScenario = {
        details: scenario,
        categoryName: categoryName,
        id: scenarioId
    };

    const currentLevel = localStorage.getItem('proficiency') || 'intermediate';
    const coinsEarnedText = calculateMissionCoins(currentLevel, 'text');
    const coinsEarnedVoice = calculateMissionCoins(currentLevel, 'voice');

    const textPlural = coinsEarnedText === 1 ? 'moeda' : 'moedas';
    const voicePlural = coinsEarnedVoice === 1 ? 'moeda' : 'moedas';

    startTextMissionBtn.innerHTML = `
        <span>Por Texto</span>
        <span class="mission-points-badge badge-text">+${coinsEarnedText} ${textPlural} 🪙</span>
    `;
    startVoiceMissionBtn.innerHTML = `
        <span>Por Voz</span>
        <span class="mission-points-badge badge-voice">+${coinsEarnedVoice} ${voicePlural} 🪙</span>
    `;

    // O objetivo mostrado ao usuário é sempre em PT-BR (instrução)
    missionGoalText.textContent = scenario['pt-BR'].goal;

    if (scenario && scenario.image) {
        missionImageContainer.innerHTML = `<img src="${scenario.image}" alt="Ilustração do cenário">`;
        missionImageContainer.classList.remove('modal-hidden');
    } else {
        missionImageContainer.innerHTML = '';
        missionImageContainer.classList.add('modal-hidden');
    }

    missionModal.classList.remove('modal-hidden');
}

async function initiateChat() {
    if (!currentScenario) return;
    isConversationActive = true;
    currentInteractionMode = 'text';
    renderChatInterface();
    chatInputArea.classList.remove('voice-mode-active');
    micBtn.style.display = 'none';
    textInput.style.display = 'block';
    sendBtn.style.display = 'flex';

    conversationHistory = [];

    // Seleciona os detalhes do cenário com base no idioma atual
    const currentLang = localStorage.getItem('language') || 'en-US';
    const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];

    displayMessage(`Scenario: ${scenarioDetails.name}`, 'system');
    displayMessage(`🎯 Your Goal: ${scenarioDetails.goal}`, 'system');
    setProcessingState(true);

    try {
        const settings = { language: currentLang, proficiency: localStorage.getItem('proficiency') };
        const aiResponse = await getAIResponse(null, [], scenarioDetails, settings);
        conversationHistory.push({ role: 'assistant', content: aiResponse });

        messageDisplayTimeoutId = setTimeout(() => {
            removeTypingIndicator();
            displayMessage(aiResponse, 'ai');
            setUserTurnState(true);
        }, TYPING_SIMULATION_DELAY);

    } catch (error) {
        console.error("Error initiating text chat:", error);
        const userFriendlyError = `Erro de comunicação: ${error.message}.`;
        displayMessage(userFriendlyError, 'ai');
        setUserTurnState(true);
    }
}

async function handleSendMessage() {
    const messageText = textInput.value.trim();
    if (!messageText) return;

    setProcessingState(true);
    textInput.value = '';

    if (currentInteractionMode === 'voice' && conversationState === 'USER_LISTENING' && mediaRecorder) {
        mediaRecorder.stop();
    }

    await processUserMessage(messageText);
}

function handleExitChat() {
    if (messageDisplayTimeoutId) {
        clearTimeout(messageDisplayTimeoutId);
        messageDisplayTimeoutId = null;
    }

    if (isConversationActive) {
        if (!confirm('Tem certeza de que deseja sair? O progresso deste diálogo não será salvo.')) {
            return;
        }
    }

    isConversationActive = false;
    conversationState = 'IDLE';

    if (currentAudioPlayer && !currentAudioPlayer.paused) {
        currentAudioPlayer.pause();
    }
    if (synthesis.speaking) {
        synthesis.cancel();
    }
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }

    conversationHistory = [];
    currentScenario = null;
    renderHomePage();
}

function handlePracticeAgain() {
    if (!currentScenario) return;

    if (userHearts < 1) {
        showNoHeartsModal();
        return;
    }
    spendHeart();

    feedbackModal.classList.add('modal-hidden');

    setTimeout(() => {
        if (currentInteractionMode === 'voice') {
            initiateVoiceChat();
        } else {
            initiateChat();
        }
    }, 300);
}

// =================================================================
//  11. LÓGICA DE VOZ (TEXT-TO-SPEECH e SPEECH-TO-TEXT)
// =================================================================
function setupVoiceUI() {
    chatInputArea.classList.remove('chat-input-hidden');
    textInput.style.display = 'block';
    sendBtn.style.display = 'flex';
    micBtn.style.display = 'flex';
}

async function initiateVoiceChat() {
    if (!currentScenario) return;
    if (!checkBrowserCompatibility()) { renderHomePage(); return; }
    isConversationActive = true;
    currentInteractionMode = 'voice';
    renderChatInterface();
    chatInputArea.classList.add('voice-mode-active');
    micBtn.style.display = 'flex';
    conversationHistory = [];

    // Seleciona os detalhes do cenário com base no idioma atual
    const currentLang = localStorage.getItem('language') || 'en-US';
    const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];

    displayMessage(`Scenario: ${scenarioDetails.name}`, 'system');
    displayMessage(`🎯 Your Goal: ${scenarioDetails.goal}`, 'system');
    setProcessingState(true);

    try {
        const settings = { language: currentLang, proficiency: localStorage.getItem('proficiency') };
        const aiResponse = await getAIResponse(null, [], scenarioDetails, settings);
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        await speakText(aiResponse);
    } catch (error) {
        console.error("Error initiating voice chat:", error);
        const userFriendlyError = `Erro de comunicação: ${error.message}.`;
        displayMessage(userFriendlyError, 'ai');
        setUserTurnState(true);
    }
}

function handleMicButtonClick() {
    if (currentInteractionMode !== 'voice') return;

    if (currentAudioPlayer && !currentAudioPlayer.paused) {
        currentAudioPlayer.pause();
    }
    if (synthesis.speaking) {
        synthesis.cancel();
    }

    if (conversationState === 'AWAITING_USER_INPUT') {
        startRecording();
    } else if (conversationState === 'USER_LISTENING' && mediaRecorder) {
        mediaRecorder.stop();
    }
}

async function handleAIResponse(text) {
    if (currentInteractionMode === 'voice') {
        return speakText(text);
    } else {
        return new Promise(resolve => {
            messageDisplayTimeoutId = setTimeout(() => {
                removeTypingIndicator();
                displayMessage(text, 'ai');
                setUserTurnState(true);
                resolve();
            }, TYPING_SIMULATION_DELAY);
        });
    }
}

function checkBrowserCompatibility() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
        alert("Desculpe, seu navegador não suporta gravação de áudio (MediaRecorder). Você pode continuar usando o modo de texto.");
        return false;
    }
    return true;
}

// =================================================================
//  12. GERENCIAMENTO DE ESTADO DA INTERFACE DE USUÁRIO (UI)
// =================================================================
function setProcessingState(isProcessing) {
    if (isProcessing) {
        removeVoiceStatusIndicator();
        conversationState = 'PROCESSING';
        showTypingIndicator();
        textInput.disabled = true;
        sendBtn.disabled = true;
        micBtn.disabled = true;
        updateMicButtonState('processing');
    } else {
        removeTypingIndicator();
    }
}

function setUserTurnState(isUserTurn) {
    if (!isConversationActive && isUserTurn) return;

    if (isUserTurn) {
        textInput.disabled = false;
        sendBtn.disabled = false;
        micBtn.disabled = false;

        if (currentInteractionMode === 'voice') {
            conversationState = 'AWAITING_USER_INPUT';
            updateMicButtonState('ready');
            
            removeVoiceStatusIndicator(); 
            const statusIndicator = document.createElement('span');
            statusIndicator.id = 'voice-status-indicator';
            statusIndicator.className = 'voice-status-indicator';
            statusIndicator.textContent = '-- Clique em 🎤 para falar --';
            chatInputArea.insertBefore(statusIndicator, micBtn);
        }
    } else {
        textInput.disabled = true;
        sendBtn.disabled = true;
        micBtn.disabled = true;
        updateMicButtonState('disabled');
    }
}

async function speakText(text) {
    text = text.replace(/[*_#]/g, '').replace(/<lang>|<\/lang>/g, '');
    if (!text || text.trim() === '') {
        setUserTurnState(true);
        return Promise.resolve();
    }
    conversationState = 'AI_SPEAKING';
    updateMicButtonState('disabled');
    displayMessage(text, 'ai');
    removeTypingIndicator();

    const currentLang = localStorage.getItem('language') || 'en-US';
    const currentGender = localStorage.getItem('voiceGender') || 'female';

    try {
        // Tenta usar o servidor (Google Cloud TTS)
        // Passamos o idioma para que a configuração correta seja usada
        // Nota: Se configuration.js não estiver atualizado para aceitar o segundo argumento, 
        // ele será ignorado e o backend fará fallback para en-US. 
        // Nesse caso, o bloco catch (fallback nativo) é nossa rede de segurança.
        const audioBlob = await getAudioFromServer(text, currentLang, currentGender); 
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudioPlayer = new Audio(audioUrl);

        return new Promise((resolve) => {
            currentAudioPlayer.onplay = () => { };
            currentAudioPlayer.onended = () => {
                URL.revokeObjectURL(audioUrl);
                setUserTurnState(true);
                resolve();
            };
            currentAudioPlayer.onerror = (e) => {
                console.error('Audio playback error:', e);
                URL.revokeObjectURL(audioUrl);
                // Fallback para voz nativa
                speakTextNative(text, currentLang).then(resolve);
            };
            currentAudioPlayer.play();
        });

    } catch (error) {
        console.warn("Falha ao buscar áudio do servidor, usando TTS nativo.", error);
        return speakTextNative(text, currentLang);
    }
}

function speakTextNative(text, langCode) {
    return new Promise((resolve) => {
        synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Seleciona a melhor voz nativa para o idioma
        const bestVoice = findBestVoice(langCode);
        if (bestVoice) {
            utterance.voice = bestVoice;
        } else {
            // Fallback genérico de idioma se não encontrar voz específica
            utterance.lang = langCode; 
        }

        utterance.onstart = () => { };
        utterance.onend = () => {
            setUserTurnState(true);
            resolve();
        };
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis error:', e);
            setUserTurnState(true);
            resolve();
        };
        synthesis.speak(utterance);
    });
}

function findBestVoice(langCode) {
    if (voices.length === 0) voices = synthesis.getVoices();
    if (voices.length === 0) return null;

    // Define o prefixo do idioma (ex: 'en', 'es')
    const langPrefix = langCode.split('-')[0];

    // Tenta encontrar vozes de alta qualidade (Google/Microsoft) para o idioma específico (ex: es-MX)
    let bestVoice = voices.find(voice => voice.lang === langCode && (voice.name.includes('Google') || voice.name.includes('Microsoft')));
    if (bestVoice) return bestVoice;

    // Tenta encontrar qualquer voz para o idioma específico
    bestVoice = voices.find(voice => voice.lang === langCode);
    if (bestVoice) return bestVoice;

    // Tenta encontrar vozes de alta qualidade para o grupo de idiomas (ex: es-ES para es-MX)
    bestVoice = voices.find(voice => voice.lang.startsWith(langPrefix) && (voice.name.includes('Google') || voice.name.includes('Microsoft')));
    if (bestVoice) return bestVoice;

    // Qualquer voz do grupo de idiomas
    return voices.find(voice => voice.lang.startsWith(langPrefix));
}

async function startRecording() {
    if (conversationState !== 'AWAITING_USER_INPUT') return;

    removeVoiceStatusIndicator();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = handleRecordingStop;

        mediaRecorder.start();
        conversationState = 'USER_LISTENING';
        updateMicButtonState('listening');
        const statusIndicator = document.createElement('span');
        statusIndicator.id = 'voice-status-indicator'; 
        statusIndicator.className = 'voice-status-indicator';
        statusIndicator.textContent = '-- Clique em ⏹️ quando terminar de falar --';
        chatInputArea.insertBefore(statusIndicator, micBtn); 

    } catch (error) {
        console.error('Microphone access denied or error:', error);
        alert("Não foi possível acessar o microfone. Verifique as permissões do seu navegador.");
        setUserTurnState(true);
    }
}

async function handleRecordingStop() {
    conversationState = 'PROCESSING';
    updateMicButtonState('processing');
    
    const statusIndicator = document.getElementById('voice-status-indicator');
    if (statusIndicator) {
        statusIndicator.remove();
    }

    const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

    try {
        const transcript = await getTranscriptionFromAudio(audioBlob);

        if (!transcript || transcript.trim() === '') {
            displayMessage("Não foi possível detectar fala. Tente novamente.", 'system');
            setUserTurnState(true);
            return;
        }

        await processUserMessage(transcript);

    } catch (error) {
        console.error("Transcription or API error:", error);
        const userFriendlyError = "Ocorreu um erro na transcrição de voz. Verifique o console do servidor.";
        displayMessage(userFriendlyError, 'ai');
        setUserTurnState(true);
    }
}

function removeVoiceStatusIndicator() {
    const statusIndicator = document.getElementById('voice-status-indicator');
    if (statusIndicator) {
        statusIndicator.remove();
    }
}

async function processUserMessage(messageText) {
    displayMessage(messageText, 'user');
    conversationHistory.push({ role: 'user', content: messageText });
    setProcessingState(true);

    try {
        const currentLang = localStorage.getItem('language') || 'en-US';
        const settings = { language: currentLang, proficiency: localStorage.getItem('proficiency') };
        // Garante que temos os detalhes do cenário no idioma correto
        const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];
        
        const aiResponse = await getAIResponse(messageText, conversationHistory, scenarioDetails, settings);

        if (aiResponse.includes("[Scenario Complete]")) {
            const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim();

            if (cleanResponse) {
                conversationHistory.push({ role: 'assistant', content: cleanResponse });
                await handleAIResponse(cleanResponse);
            }

            const coinsEarned = await finalizeConversation();
            displayCompletionScreen(coinsEarned);

        } else {
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            await handleAIResponse(aiResponse);
        }
    } catch (error) {
        console.error("Erro no processamento da mensagem:", error);
        const userFriendlyError = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e se o servidor local está rodando no terminal.";
        await handleAIResponse(userFriendlyError);
    }
}

function updateMicButtonState(state) {
    micBtn.classList.remove('mic-ready', 'mic-listening', 'mic-processing');
    switch (state) {
        case 'ready':
            micBtn.classList.add('mic-ready');
            micBtn.innerHTML = '🎤';
            micBtn.title = "Clique para falar";
            break;
        case 'listening':
            micBtn.classList.add('mic-listening');
            micBtn.innerHTML = '⏹️';
            micBtn.title = "Falando... Clique para parar";
            break;
        case 'processing':
            micBtn.classList.add('mic-processing');
            micBtn.innerHTML = '•••';
            micBtn.title = "Processando...";
            break;
        default:
            micBtn.innerHTML = '🎤';
            micBtn.title = "Aguarde sua vez";
            break;
    }
}

// =================================================================
//  13. FINALIZAÇÃO DE MISSÃO, RECOMPENSAS E FEEDBACK
// =================================================================
function calculateMissionCoins(level, mode) {
    const coinsMap = {
        basic: { text: 1, voice: 2 },
        intermediate: { text: 2, voice: 4 },
        advanced: { text: 4, voice: 8 }
    };
    return coinsMap[level]?.[mode] || 0;
}

function calculateStreakBonus(streak) {
    if (streak >= 30) return 8;
    if (streak >= 14) return 4;
    if (streak >= 7) return 2;
    if (streak >= 3) return 1;
    return 0;
}

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function triggerCoinAnimation() {
    const container = document.body;
    for (let i = 0; i < 15; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.textContent = '🪙';
        coin.style.left = `${Math.random() * 100}vw`;
        coin.style.animationDelay = `${Math.random() * 1}s`;
        container.appendChild(coin);
        setTimeout(() => coin.remove(), 2000);
    }
}

function showRewardNotification(message) {
    if (!rewardNotification || !rewardText || !rewardImage) return;

    rewardImage.style.display = 'block';
    rewardText.textContent = message;
    const originalSrc = rewardImage.src;
    rewardImage.src = '';
    rewardImage.src = originalSrc;

    rewardNotification.classList.add('visible');

    setTimeout(() => {
        rewardNotification.classList.remove('visible');
    }, 4000);
}

function showQuoteNotification(message) {
    if (!rewardNotification || !rewardText || !rewardImage) return;

    rewardImage.style.display = 'none';
    rewardText.innerHTML = message;

    rewardNotification.classList.add('visible');

    setTimeout(() => {
        rewardNotification.classList.remove('visible');
        setTimeout(() => {
            rewardImage.style.display = 'block';
        }, 500);
    }, 4000);
}

async function finalizeConversation() {
    isConversationActive = false;
    conversationState = 'IDLE';
    setProcessingState(false);
    setUserTurnState(false);

    let totalCoinsToAdd = 0;

    const missionCoins = calculateMissionCoins(localStorage.getItem('proficiency'), currentInteractionMode);
    totalCoinsToAdd += missionCoins;

    const todayStr = getTodayDateString();
    const lastCompletionDate = localStorage.getItem('lastCompletionDate');
    let currentStreak = parseInt(localStorage.getItem('currentStreak') || '0', 10);
    let bestStreak = parseInt(localStorage.getItem('bestStreak') || '0', 10);
    let bonusCoins = 0;

    if (lastCompletionDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (lastCompletionDate === yesterdayStr) {
            currentStreak++;
        } else {
            if (currentStreak >= 7) {
                const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
                userStats.phoenix_eligible = true;
                localStorage.setItem('userStats', JSON.stringify(userStats));
            }
            currentStreak = 1;
        }

        bonusCoins = calculateStreakBonus(currentStreak);
        if (bonusCoins > 0) {
            totalCoinsToAdd += bonusCoins;
            setTimeout(() => showRewardNotification(`🔥 Sequência de ${currentStreak} dias! +${bonusCoins} moedas!`), 500);
        }

        localStorage.setItem('lastCompletionDate', todayStr);
        localStorage.setItem('currentStreak', currentStreak);
    }

    if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        localStorage.setItem('bestStreak', bestStreak);
    }

    const currentCoins = getCoins();
    saveCoins(currentCoins + totalCoinsToAdd);

    // Usa o idioma atual para salvar o nome do cenário corretamente no histórico
    const currentLang = localStorage.getItem('language') || 'en-US';
    let finalScenarioName = currentScenario.details[currentLang].name;
    
    if (currentScenario.id === "Custom Scenario" || currentScenario.categoryName === "custom") {
        try { 
            finalScenarioName = await getScenarioTitle(currentScenario.details[currentLang].goal, currentLang); 
        } catch (error) { 
            finalScenarioName = "Custom Scenario"; 
        }
    }
    
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];

    history.unshift({
        scenarioName: finalScenarioName,
        scenarioGoal: currentScenario.details[currentLang].goal,
        scenarioId: currentScenario.id, // Salva o ID para referência futura segura
        timestamp: new Date().getTime(),
        transcript: conversationHistory,
        feedback: '',
        interactionMode: currentInteractionMode,
        categoryName: currentScenario.categoryName
    });
    localStorage.setItem('conversationHistory', JSON.stringify(history));

    const newMissionData = {
        categoryName: currentScenario.categoryName,
        interactionMode: currentInteractionMode,
        timestamp: new Date().getTime(),
        scenarioName: finalScenarioName,
        scenarioId: currentScenario.id // Usado para validação de badges
    };
    await checkAndAwardBadges(newMissionData, true);
    processBadgeNotificationQueue();

    return { missionCoins, bonusCoins, totalCoins: totalCoinsToAdd, newBalance: getCoins() };
}

function displayCompletionScreen(rewards) {
    chatInputArea.classList.add('chat-input-hidden');
    triggerCoinAnimation();

    const completionContainer = document.createElement('div');
    completionContainer.className = 'completion-container';

    let rewardsHtml = `+ <strong>${rewards.missionCoins} 🪙 Moedas</strong> (missão)`;
    if (rewards.bonusCoins > 0) {
        rewardsHtml += `<br>+ <strong>${rewards.bonusCoins} 🪙 Moedas</strong> (bônus de sequência 🔥)`;
    }

    const completionMessage = `
        🎉 Parabéns!<br><strong>Seu progresso foi salvo.</strong>
        <hr style="margin: 12px 0; border-color: rgba(0,0,0,0.1);">
        <div style="text-align: left; display: inline-block;">
            <p style="margin: 0;">Você ganhou:</p>
            <p style="margin: 0;">${rewardsHtml}</p>
        </div>
        <hr style="margin: 12px 0; border-color: rgba(0,0,0,0.1);">
        Seu novo saldo: <strong>🪙 ${rewards.newBalance} Moedas</strong>
    `;

    completionContainer.innerHTML = `<div class="message system-message" style="text-align: center;">${completionMessage}</div>`;

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'completion-actions';
    actionsContainer.innerHTML = `
        <button id="feedback-btn">Ver Feedback</button>
        <button id="next-challenge-btn">Próxima Missão</button>
        <button id="finish-btn" class="completion-finish-btn">Concluir</button>
    `;

    actionsContainer.querySelector('#feedback-btn').addEventListener('click', handleGetFeedback);
    actionsContainer.querySelector('#next-challenge-btn').addEventListener('click', () => {
        if (userHearts < 1) { showNoHeartsModal(); } else { startNextChallenge(); }
    });
    actionsContainer.querySelector('#finish-btn').addEventListener('click', handleExitChat);

    completionContainer.appendChild(actionsContainer);
    mainContentArea.appendChild(completionContainer);
    scrollToBottom();

    if (exitChatBtn) {
        exitChatBtn.textContent = 'Concluir';
    }
}

function startNextChallenge() {
    spendHeart();
    const currentLang = localStorage.getItem('language') || 'en-US';
    
    // Reúne todos os cenários e adiciona o ID (chave PT-BR) a eles
    const allScenarios = Object.entries(SCENARIOS).flatMap(([category, scenarios]) =>
        Object.entries(scenarios).map(([id, s]) => ({ ...s, categoryName: category, id: id }))
    );
    
    const currentGoal = currentScenario.details[currentLang].goal;
    // Filtra cenários diferentes do atual
    const availableScenarios = allScenarios.filter(s => s[currentLang].goal !== currentGoal);

    if (availableScenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        const nextScenario = availableScenarios[randomIndex];
        // Passa o ID (chave PT-BR) para startNewConversation
        startNewConversation(nextScenario, nextScenario.categoryName, nextScenario.id);
    } else {
        renderHomePage();
        alert("Você praticou todos os cenários disponíveis!");
    }
}

async function handleGetFeedback() {
    feedbackModal.classList.remove('modal-hidden');
    feedbackContent.innerHTML = '<p>Analisando sua conversa, por favor, aguarde...</p>';
    translateBtn.classList.add('translate-btn-hidden');
    try {
        const settings = { language: localStorage.getItem('language'), proficiency: localStorage.getItem('proficiency') };
        
        originalFeedback = await getFeedbackForConversation(conversationHistory, localStorage.getItem('language'), settings, currentInteractionMode);
        
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        if (history.length > 0 && !history[0].feedback) {
            history[0].feedback = originalFeedback;
            localStorage.setItem('conversationHistory', JSON.stringify(history));
        }
        displayFormattedFeedback(originalFeedback);
        translateBtn.classList.remove('translate-btn-hidden');
        isTranslated = false;
        translatedFeedback = '';
        translateBtn.textContent = 'Traduzir para Português';

        const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
        userStats.feedbackViewed = (userStats.feedbackViewed || 0) + 1;
        if (originalFeedback.toLowerCase().includes("no corrections needed")) {
            userStats.flawlessMissions = (userStats.flawlessMissions || 0) + 1;
        }
        localStorage.setItem('userStats', JSON.stringify(userStats));
        await checkAndAwardBadges(null, true);
        processBadgeNotificationQueue();

    } catch (error) {
        feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}. Verifique o console do servidor.</p>`;
    }
}

async function handleTranslateFeedback() {
    translateBtn.disabled = true;
    if (isTranslated) {
        displayFormattedFeedback(originalFeedback);
        isTranslated = false;
        translateBtn.textContent = 'Traduzir para Português';
    } else {
        feedbackContent.innerHTML = '<p>Traduzindo, por favor, aguarde...</p>';
        try {
            const translateCount = parseInt(localStorage.getItem('translateCount') || '0', 10) + 1;
            localStorage.setItem('translateCount', translateCount);

            if (!translatedFeedback) {
                const protectedSnippets = [];
                // Regex atualizado para usar a tag <lang>
                const textToTranslate = originalFeedback.replace(/<lang>(.*?)<\/lang>/g, (match, content) => {
                    protectedSnippets.push(content);
                    return `%%PROTECTED_${protectedSnippets.length - 1}%%`;
                });
                const translatedTextWithPlaceholders = await translateText(textToTranslate, localStorage.getItem('language'));
                let finalTranslatedText = translatedTextWithPlaceholders;
                protectedSnippets.forEach((snippet, index) => {
                    finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet);
                });
                translatedFeedback = finalTranslatedText;
            }
            displayFormattedFeedback(translatedFeedback);
            isTranslated = true;
            translateBtn.textContent = 'Mostrar Original';

            await checkAndAwardBadges(null, true);
            processBadgeNotificationQueue();
        } catch (error) {
            feedbackContent.innerHTML = `<p>Erro ao traduzir: ${error.message}</p>`;
        }
    }
    translateBtn.disabled = false;
}

function formatFeedbackText(text) {
    return text.replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/^\*\s(.*?)$/gm, '<p class="feedback-item">$1</p>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/<lang>|<\/lang>/g, '');
}

function displayFormattedFeedback(text) { feedbackContent.innerHTML = formatFeedbackText(text); }

// =================================================================
//  14. FUNCIONALIDADE DE TELA CHEIA
// =================================================================
function isFullscreen() { return !!document.fullscreenElement; }
function toggleFullscreen() {
    if (!isFullscreen()) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Não foi possível entrar em modo de tela cheia: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
    }
}
function updateFullscreenIcon() {
    if (isFullscreen()) {
        fullscreenBtn.innerHTML = '<span>↘↙</span>';
        fullscreenBtn.title = "Sair da Tela Cheia";
    } else {
        fullscreenBtn.innerHTML = '<span>⛶</span>';
        fullscreenBtn.title = "Alternar Tela Cheia";
    }
}

// =================================================================
//  15. LÓGICA DA PÁGINA "MINHA JORNADA" (ESTATÍSTICAS)
// =================================================================
function getPerformanceData() {
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    const validHistory = history.filter(item => item.categoryName && item.interactionMode);

    const missionsCompleted = validHistory.length;

    const modeCount = validHistory.reduce((acc, item) => {
        acc[item.interactionMode] = (acc[item.interactionMode] || 0) + 1;
        return acc;
    }, { text: 0, voice: 0 });

    const categoryCount = validHistory.reduce((acc, item) => {
        const category = item.categoryName === 'custom' ? '✨ Cenários Personalizados' : item.categoryName;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const activityByDay = validHistory.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
    }, {});

    return { missionsCompleted, modeCount, categoryCount, activityByDay };
}

function renderJornadaPage() {
    updateActiveNavIcon(null);
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area performance-page';
    chatInputArea.classList.add('chat-input-hidden');

    heartsIndicator.classList.add('score-indicator-hidden');
    exitChatBtn.classList.add('exit-chat-btn-hidden');
    headerBackBtn.classList.remove('back-btn-hidden');

    const performanceData = getPerformanceData();
    const totalCoins = getCoins();
    const currentStreak = localStorage.getItem('currentStreak') || 0;
    const bestStreak = localStorage.getItem('bestStreak') || currentStreak;

    const container = document.createElement('div');
    container.className = 'jornada-container';

    container.innerHTML = `
        <div class="jornada-header">
            <h2>Minha Jornada</h2>
        </div>

        <section class="jornada-section stats-grid-section">
            <div class="summary-card theme-points" data-icon="🪙">
                <span class="summary-value">${totalCoins}</span>
                <span class="summary-label">Moedas Totais</span>
            </div>
            <div class="summary-card theme-missions" data-icon="✅">
                <span class="summary-value">${performanceData.missionsCompleted}</span>
                <span class="summary-label">Missões Concluídas</span>
            </div>
            <div class="summary-card theme-streak" data-icon="🔥">
                <span class="summary-value">${currentStreak}</span>
                <span class="summary-label">Sequência Atual</span>
            </div>
            <div class="summary-card theme-best-streak" data-icon="🏆">
                <span class="summary-value">${bestStreak}</span>
                <span class="summary-label">Melhor Sequência</span>
            </div>
        </section>

        <section class="jornada-section">
            <h3>Modo de Prática</h3>
            <div class="stat-card chart-card">
                <canvas id="modeChart"></canvas>
            </div>
        </section>

        <section class="jornada-section">
            <h3>Desempenho por Categoria</h3>
            <div class="stat-card chart-card">
                <canvas id="categoryChart"></canvas>
            </div>
        </section>

        <section class="jornada-section">
            <h3>Calendário de Atividades</h3>
            <div class="stat-card calendar-card" id="calendar-container"></div>
        </section>

        <section class="jornada-section" id="badges-section">
            <h3>Minhas Conquistas</h3>
            <div class="badges-gallery-container"></div>
        </section>
    `;

    mainContentArea.appendChild(container);

    createModeChart(document.getElementById('modeChart'), performanceData.modeCount);
    createCategoryChart(document.getElementById('categoryChart'), performanceData.categoryCount);
    createActivityCalendar(document.getElementById('calendar-container'), performanceData.activityByDay);

    renderBadgesGallery(container.querySelector('.badges-gallery-container'));
}

function createModeChart(canvasElement, modeData) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', data: {
            labels: ['Texto ✍️', 'Voz 🎤'],
            datasets: [{
                label: 'Modo de Prática', data: [modeData.text || 0, modeData.voice || 0],
                backgroundColor: ['#ca8a04', '#a16207'], borderColor: ['#FFFFFF'], borderWidth: 2, hoverOffset: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
    });
}

function createCategoryChart(canvasElement, categoryData) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    const sortedCategories = Object.entries(categoryData).sort(([, a], [, b]) => b - a);
    const labels = sortedCategories.map(entry => entry[0]);
    const data = sortedCategories.map(entry => entry[1]);
    new Chart(ctx, {
        type: 'bar', data: {
            labels: labels, datasets: [{
                label: 'Missões Concluídas', data: data, backgroundColor: '#a16207', borderRadius: 4
            }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
}

function createActivityCalendar(container, activityData) {
    if (!container) return;
    const weeksToShow = window.innerWidth < 768 ? 13 : 26;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - ((weeksToShow - 1) * 7 + today.getDay()));

    let daysHtml = '';
    for (let i = 0; i < weeksToShow * 7; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        if (currentDay > today) { daysHtml += `<div class="day-square future"></div>`; continue; }
        const dateString = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
        const count = activityData[dateString] || 0;
        let level = 0;
        if (count > 0 && count <= 2) level = 1; else if (count > 2 && count <= 4) level = 2; else if (count > 4) level = 3;
        daysHtml += `<div class="day-square level-${level}" title="${dateString}: ${count} missões"></div>`;
    }
    container.innerHTML = `<div class="calendar-labels"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div><div class="calendar-grid" style="grid-template-columns: repeat(${weeksToShow}, 1fr);">${daysHtml}</div>`;
}

// =================================================================
//  16. SISTEMA DE EMBLEMAS (CONQUISTAS)
// =================================================================
function getUserStats() {
    const defaultStats = { totalMissions: 0, missionsByMode: { text: 0, voice: 0 }, missionsByCategory: {}, uniqueCategories: new Set(), streak: 0, feedbackViewed: 0, flawlessMissions: 0, phoenixEligible: false, };
    const storedStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    if (storedStats.uniqueCategories) { storedStats.uniqueCategories = new Set(storedStats.uniqueCategories); }
    return { ...defaultStats, ...storedStats };
}
function syncUserProgressAndCheckBadges() {
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    const stats = { totalMissions: history.length, missionsByMode: { text: 0, voice: 0 }, missionsByCategory: {}, uniqueCategories: new Set(), streak: parseInt(localStorage.getItem('currentStreak') || '0', 10), feedbackViewed: parseInt(localStorage.getItem('feedbackViewedCount') || '0', 10), flawlessMissions: parseInt(localStorage.getItem('flawlessCount') || '0', 10), translateCount: parseInt(localStorage.getItem('translateCount') || '0', 10), };
    history.forEach(item => { if (item.interactionMode) { stats.missionsByMode[item.interactionMode] = (stats.missionsByMode[item.interactionMode] || 0) + 1; } if (item.categoryName) { const categoryKey = item.categoryName === 'custom' ? '✨ Cenários Personalizados' : item.categoryName; stats.missionsByCategory[categoryKey] = (stats.missionsByCategory[categoryKey] || 0) + 1; stats.uniqueCategories.add(categoryKey); } });
    const savableStats = { ...stats, uniqueCategories: [...stats.uniqueCategories] };
    localStorage.setItem('userStats', JSON.stringify(savableStats));
    checkAndAwardBadges(null, false);
}
async function checkAndAwardBadges(newMissionData = null, triggerNotification = false) {
    if (typeof BADGES === 'undefined') { console.error("Arquivo badges.js não foi carregado."); return; }
    let userStats = getUserStats();
    let userBadges = JSON.parse(localStorage.getItem('userBadges') || '{}');
    if (newMissionData) {
        userStats.totalMissions++; userStats.missionsByMode[newMissionData.interactionMode]++; const categoryKey = newMissionData.categoryName === 'custom' ? '✨ Cenários Personalizados' : newMissionData.categoryName; userStats.missionsByCategory[categoryKey] = (userStats.missionsByCategory[categoryKey] || 0) + 1; userStats.uniqueCategories.add(categoryKey);
        const now = new Date(); if (now.getHours() >= 0 && now.getHours() < 4) { userStats.night_owl_mission = true; } 
        
        // Verificação atualizada para usar o ID (chave PT-BR), independente do idioma de prática
        if (newMissionData.scenarioId === "Pedindo um desconto") { userStats.negotiator_mission = true; } 
        
        if (userStats.phoenix_eligible) { userStats.phoenix_achieved = true; userStats.phoenix_eligible = false; }
    }
    localStorage.setItem('userStats', JSON.stringify({ ...userStats, uniqueCategories: [...userStats.uniqueCategories] }));
    const awardBadge = (badgeId, tier) => { userBadges[badgeId] = { unlocked_tier: tier.level, date: new Date().toISOString() }; if (triggerNotification) { badgeNotificationQueue.push(tier); } };
    for (const badgeId in BADGES) {
        const badge = BADGES[badgeId]; const currentProgress = userBadges[badgeId] || { unlocked_tier: null };
        for (const tier of badge.tiers) {
            if (badge.tiers.findIndex(t => t.level === currentProgress.unlocked_tier) >= badge.tiers.findIndex(t => t.level === tier.level)) continue;
            let conditionMet = false;
            switch (badgeId) {
                case "onboarding_first_mission": if (userStats.totalMissions >= tier.goal) conditionMet = true; break;
                case "onboarding_first_voice": if (userStats.missionsByMode.voice >= tier.goal) conditionMet = true; break;
                case "onboarding_first_custom": if ((userStats.missionsByCategory['✨ Cenários Personalizados'] || 0) >= tier.goal) conditionMet = true; break;
                case "onboarding_first_feedback": if (userStats.feedbackViewed >= tier.goal) conditionMet = true; break;
                case "consistency_streak": if (userStats.streak >= tier.goal) conditionMet = true; break;
                case "consistency_total_missions": if (userStats.totalMissions >= tier.goal) conditionMet = true; break;
                case "mastery_interaction_mode": if (tier.level === 'voice' && userStats.missionsByMode.voice >= tier.goal) conditionMet = true; if (tier.level === 'text' && userStats.missionsByMode.text >= tier.goal) conditionMet = true; break;
                case "mastery_category_variety": if (userStats.uniqueCategories.size >= tier.goal) conditionMet = true; break;
                case "mastery_flawless": if (userStats.flawlessMissions >= tier.goal) conditionMet = true; break;
                case "category_restaurants": if ((userStats.missionsByCategory['🍔 Restaurantes e Cafés'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_travel": if ((userStats.missionsByCategory['✈️ Viagens e Transporte'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_shopping": if ((userStats.missionsByCategory['🛒 Compras'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_social": if ((userStats.missionsByCategory['🤝 Situações Sociais'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_professional": if ((userStats.missionsByCategory['💼 Profissional'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_studies": if ((userStats.missionsByCategory['🎓 Estudos'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_health": if ((userStats.missionsByCategory['❤️ Saúde e Bem-estar'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_services": if ((userStats.missionsByCategory['🏠 Moradia e Serviços'] || 0) >= tier.goal) conditionMet = true; break;
                case "category_custom": if ((userStats.missionsByCategory['✨ Cenários Personalizados'] || 0) >= tier.goal) conditionMet = true; break;
                case "secret_night_owl": if (userStats.night_owl_mission) conditionMet = true; break;
                case "secret_phoenix": if (userStats.phoenix_achieved) conditionMet = true; break;
                case "secret_negotiator": if (userStats.negotiator_mission) conditionMet = true; break;
                case "secret_curious": if (parseInt(localStorage.getItem('translateCount') || '0', 10) >= tier.goal) conditionMet = true; break;
            }
            if (conditionMet) awardBadge(badgeId, tier);
        }
    }
    localStorage.setItem('userBadges', JSON.stringify(userBadges));
}
function processBadgeNotificationQueue() {
    if (isBadgeNotificationVisible || badgeNotificationQueue.length === 0) return;
    isBadgeNotificationVisible = true;
    const badgeTier = badgeNotificationQueue.shift();
    rewardImage.src = 'assets/animacoes/odete-celebrating.gif';
    rewardText.innerHTML = `Conquista Desbloqueada!<br><strong>${badgeTier.icon} ${badgeTier.name}</strong>`;
    rewardNotification.classList.add('visible');
    setTimeout(() => { rewardNotification.classList.remove('visible'); isBadgeNotificationVisible = false; setTimeout(processBadgeNotificationQueue, 500); }, 4000);
}
function renderBadgesGallery(container) {
    if (!container || typeof BADGES === 'undefined') return;
    const userBadges = JSON.parse(localStorage.getItem('userBadges') || '{}');
    const userStats = getUserStats();
    const badgesByCategory = {};
    for (const badgeId in BADGES) { const badge = BADGES[badgeId]; if (!badgesByCategory[badge.category]) { badgesByCategory[badge.category] = []; } badgesByCategory[badge.category].push({ ...badge, id: badgeId }); }
    container.innerHTML = '';
    for (const categoryName in badgesByCategory) {
        const categoryWrapper = document.createElement('div'); categoryWrapper.className = 'badge-category';
        const categoryTitle = document.createElement('h4'); categoryTitle.className = 'badge-category-title'; categoryTitle.textContent = categoryName; categoryWrapper.appendChild(categoryTitle);
        const badgesGrid = document.createElement('div'); badgesGrid.className = 'badges-grid';
        if (categoryName === "Conquistas Secretas") {
            const secretBadges = badgesByCategory[categoryName]; const unlockedSecrets = secretBadges.filter(b => userBadges[b.id]);
            if (unlockedSecrets.length === 0) {
                const placeholderCard = document.createElement('div'); placeholderCard.className = 'badge-card locked';
                placeholderCard.innerHTML = `<div class="badge-icon">?</div><div class="badge-info"><h5>Conquista Secreta</h5><p>Continue praticando para descobrir e desbloquear recompensas raras!</p></div>`;
                badgesGrid.appendChild(placeholderCard); categoryWrapper.appendChild(badgesGrid); container.appendChild(categoryWrapper); continue;
            }
        }
        for (const badge of badgesByCategory[categoryName]) {
            if (badge.secret && !userBadges[badge.id]) continue;
            const userProgress = userBadges[badge.id] || { unlocked_tier: null }; const unlockedTierIndex = badge.tiers.findIndex(t => t.level === userProgress.unlocked_tier);
            for (let i = 0; i <= unlockedTierIndex; i++) {
                const tier = badge.tiers[i]; const badgeCard = document.createElement('div'); badgeCard.className = 'badge-card unlocked complete';
                badgeCard.dataset.badgeId = badge.id; badgeCard.dataset.tierLevel = tier.level;
                badgeCard.innerHTML = `<div class="badge-icon">${tier.icon}</div><div class="badge-info"><h5>${tier.name}</h5><p>${tier.description}</p></div>`;
                badgesGrid.appendChild(badgeCard);
            }
            const nextTierIndex = unlockedTierIndex + 1;
            if (nextTierIndex < badge.tiers.length) {
                const nextTier = badge.tiers[nextTierIndex]; const prevTier = unlockedTierIndex >= 0 ? badge.tiers[unlockedTierIndex] : null;
                let currentProgressValue = null;
                switch (badge.id) {
                    case "consistency_total_missions": currentProgressValue = userStats.totalMissions; break;
                    case "category_restaurants": currentProgressValue = userStats.missionsByCategory['🍔 Restaurantes e Cafés'] || 0; break;
                    case "category_travel": currentProgressValue = userStats.missionsByCategory['✈️ Viagens e Transporte'] || 0; break;
                    case "category_shopping": currentProgressValue = userStats.missionsByCategory['🛒 Compras'] || 0; break;
                    case "category_social": currentProgressValue = userStats.missionsByCategory['🤝 Situações Sociais'] || 0; break;
                    case "category_professional": currentProgressValue = userStats.missionsByCategory['💼 Profissional'] || 0; break;
                    case "category_studies": currentProgressValue = userStats.missionsByCategory['🎓 Estudos'] || 0; break;
                    case "category_health": currentProgressValue = userStats.missionsByCategory['❤️ Saúde e Bem-estar'] || 0; break;
                    case "category_services": currentProgressValue = userStats.missionsByCategory['🏠 Moradia e Serviços'] || 0; break;
                    case "category_custom": currentProgressValue = userStats.missionsByCategory['✨ Cenários Personalizados'] || 0; break;
                    case "consistency_streak": currentProgressValue = userStats.streak; break;
                }
                let progressBar = '';
                if (currentProgressValue !== null) {
                    const prevTierGoal = prevTier ? prevTier.goal : 0; const progress = Math.max(0, currentProgressValue - prevTierGoal); const goal = nextTier.goal - prevTierGoal;
                    const percentage = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                    progressBar = `<div class="badge-progress-bar"><div style="width: ${percentage}%;"></div></div><small class="badge-progress-text">${currentProgressValue}/${nextTier.goal}</small>`;
                }
                const badgeCard = document.createElement('div'); badgeCard.className = 'badge-card locked';
                badgeCard.innerHTML = `<div class="badge-icon">${nextTier.icon}</div><div class="badge-info"><h5>${nextTier.name}</h5><p>${nextTier.description}</p>${progressBar}</div>`;
                badgesGrid.appendChild(badgeCard);
            }
        }
        categoryWrapper.appendChild(badgesGrid); container.appendChild(categoryWrapper);
    }
}

// =================================================================
//  17. FUNÇÕES UTILITÁRIAS
// =================================================================
function updateActiveNavIcon(activeBtnId) { [navHomeBtn, navCustomBtn, navStoreBtn, navHistoryBtn, navGuideBtn].forEach(btn => { if (btn.id === activeBtnId) { btn.classList.add('active-nav-icon'); } else { btn.classList.remove('active-nav-icon'); } }); }

function renderHomePageContent() {
    mainContentArea.innerHTML = '';
    const title = document.createElement('h1'); title.className = 'main-page-title'; title.textContent = "Missões da Odete"; mainContentArea.appendChild(title);
    
    const currentLang = localStorage.getItem('language') || 'en-US';
    
    const allScenarios = Object.entries(SCENARIOS).flatMap(([categoryName, scenarios]) => 
        Object.entries(scenarios).map(([id, scenarioData]) => ({ ...scenarioData, categoryName: categoryName, id: id }))
    ).filter(Boolean);
    
    const suggestionSection = document.createElement('section'); suggestionSection.className = 'suggestion-section';
    
    suggestionSection.innerHTML = `
        <div class="suggestion-card">
            <div id="new-suggestion-trigger" class="suggestion-header" title="Clique para gerar uma nova sugestão">
                <img src="assets/odete.jpg" alt="Mascote Odete" class="suggestion-avatar">
                <div class="suggestion-info">
                    <h3 id="suggestion-title"></h3>
                    <p id="suggestion-category" class="suggestion-category-text"></p>
                </div>
            </div>
            <button id="start-suggestion-btn" class="primary-btn">Começar Missão</button>
        </div>
    `;
    
    mainContentArea.appendChild(suggestionSection);
    
    const renderNewSuggestion = () => {
        const categoryImageMap = { "🍔 Restaurantes e Cafés": 'assets/avatar-restaurantes.jpg', "✈️ Viagens e Transporte": 'assets/avatar-viagens.jpg', "🛒 Compras": 'assets/avatar-compras.jpg', "🤝 Situações Sociais": 'assets/avatar-social.jpg', "💼 Profissional": 'assets/avatar-profissional.jpg', "🎓 Estudos": 'assets/avatar-estudos.jpg', "❤️ Saúde e Bem-estar": 'assets/avatar-saude.jpg', "🏠 Moradia e Serviços": 'assets/avatar-moradia.jpg' };
        const suggestedScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
        const suggestionTitleEl = document.getElementById('suggestion-title'); 
        const startSuggestionBtn = document.getElementById('start-suggestion-btn'); 
        const suggestionAvatarEl = document.querySelector('.suggestion-avatar');
        const suggestionCategoryEl = document.getElementById('suggestion-category');

        if (suggestionTitleEl && startSuggestionBtn && suggestionAvatarEl && suggestionCategoryEl) {
            suggestionTitleEl.textContent = suggestedScenario[currentLang].name; 
            suggestionCategoryEl.textContent = `${suggestedScenario.categoryName}`; 

            startSuggestionBtn.dataset.categoryName = suggestedScenario.categoryName; 
            startSuggestionBtn.dataset.scenarioId = suggestedScenario.id; 
            
            const imagePath = suggestedScenario.image || categoryImageMap[suggestedScenario.categoryName] || 'assets/odete.jpg'; 
            suggestionAvatarEl.src = imagePath;
            if (suggestedScenario.image) { 
                suggestionAvatarEl.alt = `Ilustração do cenário: ${suggestedScenario[currentLang].name}`; 
            } else { 
                const cleanCategoryName = suggestedScenario.categoryName.replace(/[^a-zA-ZÀ-ú\s]/g, '').trim(); 
                suggestionAvatarEl.alt = `Ilustração da categoria: ${cleanCategoryName}`; 
            }
        }
    };
    
    renderNewSuggestion();
    document.getElementById('new-suggestion-trigger').addEventListener('click', renderNewSuggestion);
    const panelContainer = document.createElement('div'); panelContainer.className = 'scenario-panel';

    const freeCategories = getFreeCategories();
    const purchasedCategories = getPurchasedCategories();
    const allowedCategories = [...freeCategories, ...purchasedCategories];

    Object.keys(SCENARIOS)
        .filter(categoryName => allowedCategories.includes(categoryName))
        .forEach(categoryName => {
            const categorySection = document.createElement('section'); categorySection.className = 'panel-category-section';
            const categoryTitle = document.createElement('h2'); categoryTitle.className = 'panel-category-title'; categoryTitle.innerHTML = `<span class="category-title-text">${categoryName}</span><span class="category-toggle-icon">▸</span>`; categorySection.appendChild(categoryTitle);
            const collapsibleContent = document.createElement('div'); collapsibleContent.className = 'collapsible-content';
            const cardsContainer = document.createElement('div'); cardsContainer.className = 'scenario-cards-container';
            const scenariosToShow = Object.keys(SCENARIOS[categoryName]).slice(0, 4);
            scenariosToShow.forEach(scenarioId => { 
                const card = document.createElement('button'); 
                card.className = 'scenario-card'; 
                // Exibe o nome no idioma atual
                card.textContent = SCENARIOS[categoryName][scenarioId][currentLang].name; 
                card.dataset.categoryName = categoryName; 
                card.dataset.scenarioId = scenarioId; // Armazena o ID
                cardsContainer.appendChild(card); 
            });
            const viewAllButton = document.createElement('button'); viewAllButton.className = 'view-all-btn'; viewAllButton.textContent = 'Ver todos →'; viewAllButton.dataset.categoryName = categoryName;
            collapsibleContent.appendChild(cardsContainer); collapsibleContent.appendChild(viewAllButton);
            categorySection.appendChild(collapsibleContent); panelContainer.appendChild(categorySection);
        });
    mainContentArea.appendChild(panelContainer);
}

function renderCategoryPage(categoryName) {
    heartsIndicator.classList.add('score-indicator-hidden'); exitChatBtn.classList.add('exit-chat-btn-hidden'); headerBackBtn.classList.remove('back-btn-hidden');
    mainContentArea.innerHTML = ''; mainContentArea.className = 'main-content-area category-page';
    
    const currentLang = localStorage.getItem('language') || 'en-US';
    
    const categoryContainer = document.createElement('div'); categoryContainer.className = 'category-page-container';
    const header = document.createElement('div'); header.className = 'category-page-header';
    const title = document.createElement('h2'); title.textContent = categoryName; header.appendChild(title);
    const cardsContainer = document.createElement('div'); cardsContainer.className = 'scenario-cards-container full-view';
    
    Object.keys(SCENARIOS[categoryName]).forEach(scenarioId => { 
        const card = document.createElement('button'); 
        card.className = 'scenario-card'; 
        card.textContent = SCENARIOS[categoryName][scenarioId][currentLang].name; 
        card.dataset.categoryName = categoryName; 
        card.dataset.scenarioId = scenarioId; 
        cardsContainer.appendChild(card); 
    });
    
    categoryContainer.appendChild(header); categoryContainer.appendChild(cardsContainer); mainContentArea.appendChild(categoryContainer);
    mainContentArea.scrollTop = 0;
}

function scrollToBottom() { mainContentArea.scrollTop = mainContentArea.scrollHeight; }
function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

function displayMessage(text, sender) {
    if (sender === 'ai') {
        removeTypingIndicator();
    }
    if (sender === 'system') {
        const systemEl = document.createElement('div');
        systemEl.className = 'message system-message';
        systemEl.innerHTML = `<p>${text}</p>`;
        mainContentArea.appendChild(systemEl);
    } else {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message';
        messageBubble.innerHTML = `<p>${text}</p>`;

        if (sender === 'user') {
            wrapper.classList.add('user-message-wrapper');
            avatar.src = AVATAR_USER_URL;
            avatar.alt = 'User Avatar';
            messageBubble.classList.add('user-message');
        } else {
            wrapper.classList.add('ai-message-wrapper');
            // Alterado para usar a função dinâmica de avatar
            avatar.src = getAIAvatar();
            avatar.alt = 'AI Avatar';
            messageBubble.classList.add('ai-message');
        }
        wrapper.appendChild(avatar);
        wrapper.appendChild(messageBubble);
        mainContentArea.appendChild(wrapper);
    }
    scrollToBottom();
}

function showTypingIndicator() {
    if (document.getElementById('typing-indicator')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'typing-indicator';
    wrapper.className = 'message-wrapper ai-message-wrapper';
    
    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    // Alterado para usar a função dinâmica de avatar
    avatar.src = getAIAvatar();
    avatar.alt = 'AI Avatar';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message ai-message';
    messageBubble.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>';
    
    wrapper.appendChild(avatar);
    wrapper.appendChild(messageBubble);
    mainContentArea.appendChild(wrapper);
}

// =================================================================
//  18. INICIALIZAÇÃO DA APLICAÇÃO
// =================================================================
function initializeApp() {
    setDefaultSettings();
    updateHeaderIndicators();
    initializeHeartSystem();
    syncUserProgressAndCheckBadges();

    if (!localStorage.getItem('hasSeenGuide')) {
        renderGuidePage();
        localStorage.setItem('hasSeenGuide', 'true');
    } else {
        renderHomePage();
    }
    
    initializeSpeechAPI();
}

const GIF_DURATION = 4000;
const TITLE_DURATION = 2200;
const TRANSITION_DURATION = 500;
const delay = ms => new Promise(res => setTimeout(res, ms));

async function handleAppOpening() {
    if (sessionStorage.getItem('hasVisited')) {
        splashScreen.style.display = 'none';
        appContainer.classList.add('visible');
        initializeApp();
    } else {
        sessionStorage.setItem('hasVisited', 'true');
        initializeApp();
        await delay(GIF_DURATION);
        splashGif.classList.add('hidden');
        splashTitle.classList.add('visible');
        await delay(TITLE_DURATION);
        splashScreen.classList.add('hidden');
        appContainer.classList.add('visible');
        await delay(TRANSITION_DURATION);
        splashScreen.style.display = 'none';
    }
}

// =================================================================
//  PONTO DE ENTRADA DA APLICAÇÃO
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    navHomeBtn.addEventListener('click', renderHomePage);
    navCustomBtn.addEventListener('click', renderCustomScenarioPage);
    navStoreBtn.addEventListener('click', renderStorePage);
    navHistoryBtn.addEventListener('click', renderHistoryPage);
    navGuideBtn.addEventListener('click', renderGuidePage);
    sendBtn.addEventListener('click', handleSendMessage);
    textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });
    micBtn.addEventListener('click', handleMicButtonClick);
    exitChatBtn.addEventListener('click', handleExitChat);
    headerBackBtn.addEventListener('click', renderHomePage);

    langIndicatorBtn.addEventListener('click', renderSettingsPage); 
    proficiencyIndicatorBtn.addEventListener('click', renderSettingsPage); 
    heartsIndicator.addEventListener('click', renderJornadaPage);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    mainContentArea.addEventListener('click', async (e) => {
        const optionCard = e.target.closest('.option-card:not(.disabled)');
        if (optionCard) {
            const value = optionCard.dataset.value;
            const parentContainer = optionCard.parentElement;

            if (parentContainer.classList.contains('language-options-container') && !optionCard.classList.contains('voice-card')) {
                localStorage.setItem('language', value);
            } else if (parentContainer.classList.contains('proficiency-grid')) {
                localStorage.setItem('proficiency', value);
            } else if (optionCard.classList.contains('voice-card')) {
                localStorage.setItem('voiceGender', value);
            }

            parentContainer.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('active');
            });
            optionCard.classList.add('active');

            updateHeaderIndicators();
            return;
        }

        const guideStartBtn = e.target.closest('#guide-start-mission-btn');
        if (guideStartBtn) {
            renderHomePage();
            return;
        }

        const guideStoreBtn = e.target.closest('#guide-go-to-store-btn');
        if (guideStoreBtn) {
            renderStorePage();
            return;
        }

        const guideSettingsBtn = e.target.closest('#guide-go-to-settings-btn');
        if (guideSettingsBtn) {
            renderSettingsPage();
            return;
        }

        const suggestionBtn = e.target.closest('#start-suggestion-btn');
        if (suggestionBtn) {
            const categoryName = suggestionBtn.dataset.categoryName;
            const scenarioId = suggestionBtn.dataset.scenarioId;
            const scenario = SCENARIOS[categoryName]?.[scenarioId];
            if (scenario) {
                if (userHearts > 0) {
                    // Passa o ID (chave PT-BR)
                    startNewConversation(scenario, categoryName, scenarioId);
                } else {
                    showNoHeartsModal();
                }
            }
            return;
        }

        const scenarioCard = e.target.closest('.scenario-card');
        if (scenarioCard) {
            const scenarioId = scenarioCard.dataset.scenarioId;
            const categoryName = scenarioCard.dataset.categoryName;
            const scenario = SCENARIOS[categoryName]?.[scenarioId];
            if (scenario) {
                if (userHearts > 0) {
                    // Passa o ID (chave PT-BR)
                    startNewConversation(scenario, categoryName, scenarioId);
                } else {
                    showNoHeartsModal();
                }
            }
            return;
        }

        const categoryTitle = e.target.closest('.panel-category-title');
        if (categoryTitle) {
            const section = categoryTitle.closest('.panel-category-section');
            const content = section.querySelector('.collapsible-content');
            const icon = categoryTitle.querySelector('.category-toggle-icon');

            if (content) {
                const isExpanded = content.classList.contains('expanded');
                content.classList.toggle('expanded');
                categoryTitle.classList.toggle('expanded');

                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.textContent = '▾';
                } else {
                    content.style.maxHeight = '0px';
                    if (icon) icon.textContent = '▸';
                }
            }
            return;
        }

        const viewAllBtn = e.target.closest('.view-all-btn');
        if (viewAllBtn) {
            const categoryName = viewAllBtn.dataset.categoryName;
            renderCategoryPage(categoryName);
            return;
        }

        const customBtn = e.target.closest('#start-custom-scenario-btn');
        if (customBtn) {
            const heartsNeeded = 2; 
            const customInput = document.getElementById('custom-scenario-input');
            const goal = customInput.value.trim();

            if (!goal) {
                showCustomScenarioError("Por favor, descreva o cenário que você quer praticar.");
                return;
            }
            
            if (userHearts < heartsNeeded) { 
                showNoHeartsModal();
                return;
            }

            clearCustomScenarioError();
            customBtn.disabled = true;
            customInput.disabled = true;
            customBtn.textContent = 'Validando...';
            
            try {
                const validation = await validateScenarioGoal(goal);
                if (validation.isValid) {
                    spendHeart(); 
                    spendHeart(); 

                    const customScenario = {
                        "pt-BR": { goal: goal },
                        "en-US": { name: "Custom Scenario", goal: goal },
                        "es-MX": { name: "Escenario Personalizado", goal: goal }
                    };
                    // ID para cenário customizado pode ser o texto "Custom Scenario" ou similar
                    startNewConversation(customScenario, 'custom', "Custom Scenario");
                } else {
                    showCustomScenarioError(validation.reason || "Ocorreu um erro ao validar o cenário.");
                }
            } catch (error) {
                console.error("Validation failed:", error);
                showCustomScenarioError("Não foi possível validar o cenário. Tente novamente.");
            } finally {
                customBtn.disabled = false;
                customInput.disabled = false;
                customBtn.textContent = 'Iniciar Cenário'; 
            }
            return;
        }

        const badgeCard = e.target.closest('.badge-card.unlocked.complete');
        if (badgeCard) {
            const badgeId = badgeCard.dataset.badgeId;
            const tierLevel = badgeCard.dataset.tierLevel;

            if (badgeId && tierLevel && BADGES[badgeId]) {
                const quote = BADGES[badgeId]?.tiers.find(t => t.level === tierLevel)?.quote;
                if (quote) {
                    showQuoteNotification(quote);
                }
            }
            return;
        }

        const viewTarget = e.target.closest('.history-item-view');
        if (viewTarget) {
            showHistoryModal(viewTarget.dataset.index);
            return;
        }
        
        const deleteTarget = e.target.closest('.history-item-delete');
        if (deleteTarget) {
            deleteHistoryItem(deleteTarget.dataset.index);
            return;
        }
    });

    modalCloseBtn.addEventListener('click', () => feedbackModal.classList.add('modal-hidden'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.add('modal-hidden'); });
    translateBtn.addEventListener('click', handleTranslateFeedback);
    historyModalCloseBtn.addEventListener('click', () => historyModal.classList.add('modal-hidden'));
    historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.classList.add('modal-hidden'); });
    missionModalCloseBtn.addEventListener('click', () => missionModal.classList.add('modal-hidden'));
    missionModal.addEventListener('click', (e) => { if (e.target === missionModal) missionModal.classList.add('modal-hidden'); });
    practiceAgainBtn.addEventListener('click', handlePracticeAgain);

    startTextMissionBtn.addEventListener('click', () => {
        spendHeart();
        currentInteractionMode = 'text';
        missionModal.classList.add('modal-hidden');
        initiateChat();
    });

    startVoiceMissionBtn.addEventListener('click', () => {
        spendHeart();
        currentInteractionMode = 'voice';
        missionModal.classList.add('modal-hidden');
        initiateVoiceChat();
    });

    handleAppOpening();
});