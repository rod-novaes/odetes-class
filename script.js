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
const splashStartBtn = document.getElementById('splash-start-btn'); // NOVO
const appContainer = document.getElementById('app-container');

// Elementos do Wizard de Onboarding (NOVO)
const onboardingWizard = document.getElementById('onboarding-wizard');
const wizardSteps = document.querySelectorAll('.wizard-step');
const wizardDots = document.querySelectorAll('.wizard-dot');
const wizardNameInput = document.getElementById('wizard-name-input');
const btnNextName = document.getElementById('btn-next-name');
const btnNextLang = document.getElementById('btn-next-lang');
const btnNextLevel = document.getElementById('btn-next-level');
const btnFinishWizard = document.getElementById('btn-finish-wizard');

const AVATAR_FEMALE_URL = 'assets/avatar-odete2.png';
const AVATAR_MALE_URL = 'assets/avatar-luciano.png';
function getAIAvatar() {
    const gender = localStorage.getItem('voiceGender') || 'female';
    return gender === 'male' ? AVATAR_MALE_URL : AVATAR_FEMALE_URL;
}
const AVATAR_USER_URL = 'assets/avatar-user.png';
const TYPING_SIMULATION_DELAY = 500;

// =================================================================
//  2.1 GERENCIAMENTO DE ESTADO DO VIAJANTE (NOVO)
// =================================================================

function getTravelerState() {
    const defaultState = {
        humor: "Ansioso",
        backpack: ["Passaporte", "Celular"], // Itens iniciais
        skills: [],
        people: [],
        journal: [], // Histórico narrativo
        storyNodeCount: 0
    };
    return JSON.parse(localStorage.getItem('travelerState')) || defaultState;
}

function saveTravelerState(newState) {
    localStorage.setItem('travelerState', JSON.stringify(newState));
}

function updateTravelerStateFromGame(gameUpdates, journalEntryText) {
    let state = getTravelerState();

    // 1. Adiciona entrada no diário
    if (journalEntryText) {
        state.journal.push({
            text: journalEntryText,
            timestamp: new Date().getTime()
        });
    }

    // 2. Atualiza Status (se houver updates)
    if (gameUpdates) {
        if (gameUpdates.humor) state.humor = gameUpdates.humor;
        
        if (gameUpdates.backpack && Array.isArray(gameUpdates.backpack)) {
            gameUpdates.backpack.forEach(item => {
                if (!state.backpack.includes(item)) state.backpack.push(item);
            });
        }
        
        if (gameUpdates.skills && Array.isArray(gameUpdates.skills)) {
            gameUpdates.skills.forEach(skill => {
                if (!state.skills.includes(skill)) state.skills.push(skill);
            });
        }

        if (gameUpdates.people && Array.isArray(gameUpdates.people)) {
            gameUpdates.people.forEach(person => {
                // Verifica se já conhece a pessoa pelo nome
                const exists = state.people.find(p => p.name === person.name);
                if (!exists) state.people.push(person);
            });
        }
    }

    saveTravelerState(state);
    return state;
}

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
let feedbackPromise = null;

// Variáveis do Wizard
let currentWizardStep = 0;
let tempOnboardingData = {
    name: '',
    language: '',
    level: '',
    voice: ''
};

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
    // Fallback apenas se não houver nada, mas o Wizard deve cuidar disso para novos usuários
    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en-US');
    }
    if (!localStorage.getItem('proficiency')) {
        localStorage.setItem('proficiency', 'intermediate');
    }
    if (!localStorage.getItem('voiceGender')) {
        localStorage.setItem('voiceGender', 'female'); 
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
        scenarioToPractice = { "pt-BR": { goal: item.scenarioGoal }, "en-US": { name: item.scenarioName, goal: item.scenarioGoal }, "es-MX": { name: item.scenarioName, goal: item.scenarioGoal } };
    } else {
         if (item.scenarioId && SCENARIOS[item.categoryName] && SCENARIOS[item.categoryName][item.scenarioId]) {
             scenarioToPractice = SCENARIOS[item.categoryName][item.scenarioId];
        } else {
            const categoryScenarios = SCENARIOS[item.categoryName];
            if (categoryScenarios) {
                const key = Object.keys(categoryScenarios).find(k => categoryScenarios[k]['en-US'].name === item.scenarioName);
                if(key) scenarioToPractice = SCENARIOS[item.categoryName][key];
            }
        }
    }
    
    const practiceBtn = document.getElementById('history-practice-again-btn');
    const newBtn = practiceBtn.cloneNode(true);
    practiceBtn.parentNode.replaceChild(newBtn, practiceBtn);

    if (scenarioToPractice) {
        newBtn.style.display = 'block';
        newBtn.addEventListener('click', () => {
            if (userHearts < 1) { showNoHeartsModal(); return; }
            historyModal.classList.add('modal-hidden');
            const sId = item.scenarioId || "unknown";
            setTimeout(() => startNewConversation(scenarioToPractice, item.categoryName, sId), 300);
        });
    } else {
        newBtn.style.display = 'none';
    }

    historyModalTitle.textContent = item.scenarioName;
    
    const dialogueContainer = document.getElementById('history-tab-dialogue');
    dialogueContainer.innerHTML = '';
    item.transcript.forEach(msg => {
        const el = document.createElement('div');
        const bubbleClass = msg.role === 'user' ? 'user-message history-user-message' : 'ai-message';
        const wrapperClass = msg.role === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper';
        
        el.className = `message-wrapper ${wrapperClass}`;
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = msg.role === 'user' ? AVATAR_USER_URL : getAIAvatar();
        
        const bubble = document.createElement('div');
        bubble.className = `message ${bubbleClass}`;
        bubble.innerHTML = `<p>${msg.content}</p>`;
        
        el.appendChild(avatar);
        el.appendChild(bubble);
        dialogueContainer.appendChild(el);
    });

    const feedbackTextContainer = document.getElementById('history-feedback-text');
    const translateBtnHist = document.getElementById('history-translate-btn');
    const generateBtnHist = document.getElementById('history-generate-btn');

    let histTranslated = false;
    let histOriginalText = item.feedback || "";
    let histTranslatedText = "";

    if (item.feedback) {
        feedbackTextContainer.innerHTML = formatFeedbackText(item.feedback);
        translateBtnHist.style.display = 'block';
        translateBtnHist.textContent = 'Traduzir para Português';
        generateBtnHist.style.display = 'none';
    } else {
        feedbackTextContainer.innerHTML = `<p style="text-align:center; color:var(--text-secondary); margin-top:20px;">Nenhum feedback foi gerado para esta conversa.</p>`;
        translateBtnHist.style.display = 'none';
        generateBtnHist.style.display = 'block';
    }

    translateBtnHist.onclick = async () => {
        translateBtnHist.disabled = true;
        if (histTranslated) {
            feedbackTextContainer.innerHTML = formatFeedbackText(histOriginalText);
            translateBtnHist.textContent = 'Traduzir para Português';
            histTranslated = false;
        } else {
            if (!histTranslatedText) {
                try {
                    feedbackTextContainer.innerHTML = '<p>Traduzindo...</p>';
                    const protectedSnippets = [];
                    const textToTranslate = histOriginalText.replace(/<lang>(.*?)<\/lang>/g, (match, content) => {
                        protectedSnippets.push(content);
                        return `%%PROTECTED_${protectedSnippets.length - 1}%%`;
                    });
                    let finalTranslated = await translateText(textToTranslate, localStorage.getItem('language'));
                    protectedSnippets.forEach((snippet, idx) => {
                        finalTranslated = finalTranslated.replace(`%%PROTECTED_${idx}%%`, snippet);
                    });
                    histTranslatedText = finalTranslated;
                } catch (e) {
                    console.error(e);
                    histTranslatedText = "Erro na tradução.";
                }
            }
            feedbackTextContainer.innerHTML = formatFeedbackText(histTranslatedText);
            translateBtnHist.textContent = 'Mostrar Original';
            histTranslated = true;
        }
        translateBtnHist.disabled = false;
    };

    generateBtnHist.onclick = async () => {
        generateBtnHist.disabled = true;
        generateBtnHist.textContent = "Gerando...";
        feedbackTextContainer.innerHTML = '<p class="typing-dots" style="justify-content:center;"><span>.</span><span>.</span><span>.</span></p>';
        
        try {
            const settings = { language: localStorage.getItem('language'), proficiency: localStorage.getItem('proficiency') };
            const newFeedback = await getFeedbackForConversation(item.transcript, localStorage.getItem('language'), settings, item.interactionMode || 'text');
            
            item.feedback = newFeedback;
            history[index] = item;
            localStorage.setItem('conversationHistory', JSON.stringify(history));
            
            histOriginalText = newFeedback;
            feedbackTextContainer.innerHTML = formatFeedbackText(newFeedback);
            generateBtnHist.style.display = 'none';
            translateBtnHist.style.display = 'block';
        } catch (e) {
            feedbackTextContainer.innerHTML = `<p>Erro: ${e.message}</p>`;
            generateBtnHist.textContent = "Tentar Novamente";
            generateBtnHist.disabled = false;
        }
    };

    setupHistoryTabs();
    historyModal.classList.remove('modal-hidden');
}

function setupHistoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="dialogue"]').classList.add('active');
    document.getElementById('history-tab-dialogue').classList.add('active');

    tabs.forEach(tab => {
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        
        newTab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            newTab.classList.add('active');
            const targetId = `history-tab-${newTab.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function deleteHistoryItem(index) { if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) { return; } let history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.splice(index, 1); localStorage.setItem('conversationHistory', JSON.stringify(history)); renderHistoryPage(); }

// =================================================================
//  8. LÓGICA DO WIZARD DE ONBOARDING (NOVO)
// =================================================================

function startOnboarding() {
    splashScreen.style.display = 'none';
    onboardingWizard.classList.remove('modal-hidden');
    updateWizardUI();
}

function updateWizardUI() {
    // Atualiza passos
    wizardSteps.forEach((step, index) => {
        if (index === currentWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Atualiza bolinhas
    wizardDots.forEach((dot, index) => {
        if (index === currentWizardStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function handleWizardNext(stepIndex) {
    if (stepIndex === 0) {
        // Valida Nome
        const name = wizardNameInput.value.trim();
        if (!name) return;
        tempOnboardingData.name = name;
    } else if (stepIndex === 1) {
        if (!tempOnboardingData.language) return;
    } else if (stepIndex === 2) {
        if (!tempOnboardingData.level) return;
    }

    currentWizardStep++;
    updateWizardUI();
}

function selectWizardOption(type, value, element) {
    // CORREÇÃO: Mapeia 'lang' (do HTML) para 'language' (do objeto JS)
    const key = type === 'lang' ? 'language' : type;
    tempOnboardingData[key] = value;

    // Remove seleção anterior
    const container = element.parentNode;
    if (type === 'level') {
        // Nível tem uma estrutura de lista diferente
        const list = element.parentNode;
        list.querySelectorAll('.wizard-card-list').forEach(card => card.classList.remove('selected'));
    } else {
        // Grid
        container.querySelectorAll('.wizard-card').forEach(card => card.classList.remove('selected'));
    }
    
    element.classList.add('selected');

    // Habilita botão correspondente
    if (type === 'lang') btnNextLang.disabled = false;
    if (type === 'level') btnNextLevel.disabled = false;
    if (type === 'voice') btnFinishWizard.disabled = false;
}

function finishOnboarding() {
    // Salva tudo no localStorage
    localStorage.setItem('userName', tempOnboardingData.name);
    localStorage.setItem('language', tempOnboardingData.language);
    localStorage.setItem('proficiency', tempOnboardingData.level);
    localStorage.setItem('voiceGender', tempOnboardingData.voice);
    localStorage.setItem('hasCompletedOnboarding', 'true');

    // Recompensa
    const currentCoins = getCoins();
    saveCoins(currentCoins + 10);
    
    // Fecha o Wizard
    onboardingWizard.classList.add('modal-hidden');
    
    // CORREÇÃO 1: Remove a classe 'hidden' antes de adicionar 'visible'
    appContainer.classList.remove('hidden');
    appContainer.classList.add('visible');
    
    // CORREÇÃO 2: Inicializa apenas os sistemas essenciais, sem chamar initializeApp()
    // Isso evita que o app tente carregar a Home Page e o Guia ao mesmo tempo.
    setDefaultSettings();
    updateHeaderIndicators();
    initializeHeartSystem();
    syncUserProgressAndCheckBadges();
    initializeSpeechAPI();

    // Redireciona para o guia e mostra recompensa
    renderGuidePage();
    setTimeout(() => {
        triggerCoinAnimation();
        showRewardNotification("Perfil Criado! +10 Moedas 🪙");
    }, 500);
}


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

function renderTrainingPage() {
    updateActiveNavIcon('nav-custom-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area training-page'; // Classe atualizada
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');

    exitChatBtn.textContent = 'Sair';
    exitChatBtn.classList.add('exit-chat-btn-hidden');

    updateHeartsDisplay();
    headerBackBtn.classList.add('back-btn-hidden');

    const currentLang = localStorage.getItem('language') || 'en-US';

    // Container Principal
    const container = document.createElement('div');
    container.className = 'training-container';
    
    // Cabeçalho e Abas
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px; font-size: 1.8rem;">✨ Treino Rápido</h2>
        
        <div class="tab-bar training-tabs">
            <button class="tab-btn active" data-tab="scenarios">Cenários da Odete</button>
            <button class="tab-btn" data-tab="custom">Personalizados</button>
        </div>

        <!-- ABA 1: CENÁRIOS (Lista de Categorias) -->
        <div id="tab-content-scenarios" class="tab-content active">
            <div id="scenarios-list-container" class="scenario-panel"></div>
        </div>

        <!-- ABA 2: PERSONALIZAÇÃO (Antiga página Custom) -->
        <div id="tab-content-custom" class="tab-content">
            <div class="custom-scenario-container">
                <div class="guide-header">
                    <img src="assets/luciano-e-odete-laboratorio.png" alt="Odete, sua guia" class="guide-avatar">
                </div>
                <div class="custom-charge-info">
                    <p>Crie qualquer situação para praticar. Custo: <span class="custom-charge-hearts">2 ❤️ Corações</span></p>
                </div>
                <textarea id="custom-scenario-input" rows="6" placeholder="Ex: Convidar a pessoa que amo para sair, correndo o risco de sofer uma rejeição."></textarea>
                <div id="custom-scenario-feedback" class="custom-scenario-feedback"></div>
                <button id="start-custom-scenario-btn" class="primary-btn">Criar Novo Cenário</button>
            </div>
        </div>
    `;

    mainContentArea.appendChild(container);

    // --- LÓGICA DA ABA 1: Renderizar Lista de Cenários ---
    const scenariosListContainer = document.getElementById('scenarios-list-container');
    const freeCategories = getFreeCategories();
    const purchasedCategories = getPurchasedCategories();
    const allowedCategories = [...freeCategories, ...purchasedCategories];

    Object.keys(SCENARIOS)
        .filter(categoryName => allowedCategories.includes(categoryName))
        .forEach(categoryName => {
            const categorySection = document.createElement('section'); 
            categorySection.className = 'panel-category-section';
            
            const categoryTitle = document.createElement('h2'); 
            categoryTitle.className = 'panel-category-title'; 
            categoryTitle.innerHTML = `<span class="category-title-text">${categoryName}</span><span class="category-toggle-icon">▸</span>`; 
            categorySection.appendChild(categoryTitle);
            
            const collapsibleContent = document.createElement('div'); 
            collapsibleContent.className = 'collapsible-content';
            
            const cardsContainer = document.createElement('div'); 
            cardsContainer.className = 'scenario-cards-container';
            
            const scenariosToShow = Object.keys(SCENARIOS[categoryName]).slice(0, 4);
            scenariosToShow.forEach(scenarioId => { 
                const card = document.createElement('button'); 
                card.className = 'scenario-card'; 
                card.textContent = SCENARIOS[categoryName][scenarioId][currentLang].name; 
                card.dataset.categoryName = categoryName; 
                card.dataset.scenarioId = scenarioId; 
                cardsContainer.appendChild(card); 
            });
            
            const viewAllButton = document.createElement('button'); 
            viewAllButton.className = 'view-all-btn'; 
            viewAllButton.textContent = 'Ver todos →'; 
            viewAllButton.dataset.categoryName = categoryName;
            
            collapsibleContent.appendChild(cardsContainer); 
            collapsibleContent.appendChild(viewAllButton);
            categorySection.appendChild(collapsibleContent); 
            scenariosListContainer.appendChild(categorySection);
        });

    // --- LÓGICA DE TROCA DE ABAS ---
    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetId = `tab-content-${tab.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });
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
    historyContainer.innerHTML = '<h2>🕒 Histórico</h2>';
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
    // Recupera o nome do usuário
    const userName = localStorage.getItem('userName') || "Viajante";

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
                    <h2>Olá, ${userName}!</h2>
                    <div class="guide-content">
                        <p>Eu sou Odete e este é Luciano. Vamos ajudar você a destravar seu <strong>${currentLanguageName}</strong> em diálogos realistas.</p>
                    </div>
                </div>

                <!-- Slide 2: Suas Missões -->
                <div class="guide-carousel-card" data-icon="🎯">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-apontando.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Suas Missões</h2>
                    <div class="guide-content">
                        <p>Cada diálogo tem um objetivo, seja pedir um café, fazer uma apresentação ou chamar alguém pra sair.</p>
                        <p>Você pode cumprir suas missões por voz 🎤 ou texto ✍️.</p>
                    </div>
                </div>

                <!-- Slide 3: Idioma e Nível -->
                <div class="guide-carousel-card" data-icon="⭐">
                    <div class="guide-header">
                        <img src="assets/luciano-e-odete-estrelas.png" alt="Odete, sua guia" class="guide-avatar">
                    </div> 
                    <h2>Personalize</h2>
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
                        <p>Eles recarregam com o tempo. Se acabarem, espere ou recarregue na 🛍️ <strong>Loja</strong>.</p>
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

function startNewConversation(scenario, categoryName, scenarioId, contextText = null, aiRole = null, userRole = null) {
    feedbackPromise = null;
    
    // Injeta os papéis dentro do objeto details do cenário para envio ao backend
    const enhancedScenario = JSON.parse(JSON.stringify(scenario)); // Deep copy
    const langs = ['pt-BR', 'en-US', 'es-MX'];
    
    langs.forEach(lang => {
        if(enhancedScenario[lang]) {
            enhancedScenario[lang].aiRole = aiRole;
            enhancedScenario[lang].userRole = userRole;
            enhancedScenario[lang].context = contextText;
        }
    });

    currentScenario = {
        details: enhancedScenario,
        categoryName: categoryName,
        id: scenarioId
    };

    const currentLevel = localStorage.getItem('proficiency') || 'intermediate';
    const coinsEarnedText = calculateMissionCoins(currentLevel, 'text');
    const coinsEarnedVoice = calculateMissionCoins(currentLevel, 'voice');
    const textPlural = coinsEarnedText === 1 ? 'moeda' : 'moedas';
    const voicePlural = coinsEarnedVoice === 1 ? 'moeda' : 'moedas';

    startTextMissionBtn.innerHTML = `<span>Por Texto</span><span class="mission-points-badge badge-text">+${coinsEarnedText} ${textPlural} 🪙</span>`;
    startVoiceMissionBtn.innerHTML = `<span>Por Voz</span><span class="mission-points-badge badge-voice">+${coinsEarnedVoice} ${voicePlural} 🪙</span>`;

    // Lógica de Contexto Narrativo no Modal
    const modalBody = missionModal.querySelector('.modal-body');
    let contextEl = document.getElementById('mission-context-text');
    if (!contextEl) {
        contextEl = document.createElement('p');
        contextEl.id = 'mission-context-text';
        contextEl.className = 'mission-context-text';
        if (missionImageContainer.nextSibling) {
            modalBody.insertBefore(contextEl, missionImageContainer.nextSibling);
        } else {
            modalBody.appendChild(contextEl);
        }
    }

    if (contextText) {
        contextEl.textContent = `"${contextText}"`;
        contextEl.style.display = 'block';
    } else {
        contextEl.style.display = 'none';
    }

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
    feedbackPromise = null;
    if (!currentScenario) return;
    isConversationActive = true;
    currentInteractionMode = 'text';
    renderChatInterface();
    chatInputArea.classList.remove('chat-input-hidden');
    micBtn.style.display = 'none';
    textInput.style.display = 'block';
    sendBtn.style.display = 'flex';

    conversationHistory = [];

    const currentLang = localStorage.getItem('language') || 'en-US';
    const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];

    displayMessage(`Scenario: ${scenarioDetails.name}`, 'system');
    displayMessage(`🎯 Your Goal: ${scenarioDetails.goal}`, 'system');
    setProcessingState(true);

    try {
        // Inclui userName nas settings
        const settings = { 
            userName: localStorage.getItem('userName') || 'Viajante',
            language: currentLang, 
            proficiency: localStorage.getItem('proficiency'), 
            voiceGender: localStorage.getItem('voiceGender') 
        };
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
        currentAudioPlayer = null;
    }
    if (synthesis.speaking) {
        synthesis.cancel();
    }

    if (mediaRecorder) {
        mediaRecorder.onstop = null;
        if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
        if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        mediaRecorder = null;
    }

    conversationHistory = [];
    currentScenario = null;
    feedbackPromise = null; 
    
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
    feedbackPromise = null;
    if (!currentScenario) return;
    if (!checkBrowserCompatibility()) { renderHomePage(); return; }
    isConversationActive = true;
    currentInteractionMode = 'voice';
    renderChatInterface();
    chatInputArea.classList.add('voice-mode-active');
    micBtn.style.display = 'flex';
    conversationHistory = [];

    const currentLang = localStorage.getItem('language') || 'en-US';
    const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];

    displayMessage(`Scenario: ${scenarioDetails.name}`, 'system');
    displayMessage(`🎯 Your Goal: ${scenarioDetails.goal}`, 'system');
    setProcessingState(true);

    try {
        const settings = { 
            userName: localStorage.getItem('userName') || 'Viajante',
            language: currentLang, 
            proficiency: localStorage.getItem('proficiency'), 
            voiceGender: localStorage.getItem('voiceGender') 
        };
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
                removeVoiceStatusIndicator();
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
    removeVoiceStatusIndicator();

    if (isProcessing) {
        conversationState = 'PROCESSING';
        showTypingIndicator();
        
        // Oculta os controles de texto para limpar a área
        textInput.style.display = 'none';
        sendBtn.style.display = 'none';
        
        // Desabilita visualmente o microfone (se estiver visível)
        micBtn.disabled = true;
        updateMicButtonState('processing');

        // Cria e insere o indicador centralizado
        const statusIndicator = document.createElement('span');
        statusIndicator.id = 'voice-status-indicator';
        statusIndicator.className = 'voice-status-indicator';
        statusIndicator.textContent = '-- Pensando --';
        
        // Insere antes do botão do microfone (que pode estar oculto ou não, dependendo do modo)
        chatInputArea.insertBefore(statusIndicator, micBtn);

    } else {
        removeTypingIndicator();
        // Nota: Não reexibimos os inputs aqui. 
        // Isso será feito explicitamente em setUserTurnState(true).
    }
}

function setUserTurnState(isUserTurn) {
    if (!isConversationActive && isUserTurn) return;

    if (isUserTurn) {
        // Habilita interações gerais
        micBtn.disabled = false;
        
        if (currentInteractionMode === 'voice') {
            // LÓGICA MODO VOZ
            textInput.style.display = 'none';
            sendBtn.style.display = 'none';
            micBtn.style.display = 'flex'; // Garante que o mic esteja visível
            
            conversationState = 'AWAITING_USER_INPUT';
            updateMicButtonState('ready');
            
            removeVoiceStatusIndicator(); 
            const statusIndicator = document.createElement('span');
            statusIndicator.id = 'voice-status-indicator';
            statusIndicator.className = 'voice-status-indicator';
            statusIndicator.textContent = '-- Clique em 🎤 para falar --';
            chatInputArea.insertBefore(statusIndicator, micBtn);
        } else {
            // LÓGICA MODO TEXTO (Atualizada)
            removeVoiceStatusIndicator(); // Remove "-- Pensando --"
            
            // Traz de volta os controles de texto
            textInput.style.display = 'block';
            textInput.disabled = false;
            
            sendBtn.style.display = 'flex';
            sendBtn.disabled = false;
            
            // Garante que o mic esteja oculto no modo texto
            micBtn.style.display = 'none';
        }
    } else {
        // Turno da IA (ou inativo)
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
    removeVoiceStatusIndicator();
    displayMessage(text, 'ai');
    removeTypingIndicator();

    const currentLang = localStorage.getItem('language') || 'en-US';
    const currentGender = localStorage.getItem('voiceGender') || 'female';

    try {
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
        
        const bestVoice = findBestVoice(langCode);
        if (bestVoice) {
            utterance.voice = bestVoice;
        } else {
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

    const langPrefix = langCode.split('-')[0];

    let bestVoice = voices.find(voice => voice.lang === langCode && (voice.name.includes('Google') || voice.name.includes('Microsoft')));
    if (bestVoice) return bestVoice;

    bestVoice = voices.find(voice => voice.lang === langCode);
    if (bestVoice) return bestVoice;

    bestVoice = voices.find(voice => voice.lang.startsWith(langPrefix) && (voice.name.includes('Google') || voice.name.includes('Microsoft')));
    if (bestVoice) return bestVoice;

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
        statusIndicator.textContent = '-- Clique em ⏹️ quando terminar --';
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

    if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
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
        const settings = { 
            userName: localStorage.getItem('userName') || 'Viajante',
            language: currentLang, 
            proficiency: localStorage.getItem('proficiency'), 
            voiceGender: localStorage.getItem('voiceGender') 
        };
        const scenarioDetails = currentScenario.details[currentLang] || currentScenario.details['en-US'];
        
        const rawAiResponse = await getAIResponse(messageText, conversationHistory, scenarioDetails, settings);
        let finalResponseText = rawAiResponse;

        // --- LÓGICA DE RPG (NOVO) ---
        if (rawAiResponse.includes("[Scenario Complete]")) {
            const parts = rawAiResponse.split("[Scenario Complete]");
            finalResponseText = parts[0].trim(); // Texto para o usuário
            const jsonPart = parts[1]; // JSON oculto

            if (jsonPart) {
                try {
                    const rpgData = JSON.parse(jsonPart);
                    console.log("RPG Update recebido:", rpgData);
                    
                    // Atualiza o estado no LocalStorage
                    updateTravelerStateFromGame(rpgData.updates, rpgData.journalEntry);
                    
                    // Notifica visualmente se houve item novo
                    if (rpgData.updates && rpgData.updates.backpack && rpgData.updates.backpack.length > 0) {
                        showRewardNotification(`Item obtido: ${rpgData.updates.backpack[0]}`);
                    }
                } catch (e) {
                    console.error("Erro ao processar JSON de RPG:", e);
                }
            }
            
            // Adiciona apenas o texto limpo ao histórico
            if (finalResponseText) {
                conversationHistory.push({ role: 'assistant', content: finalResponseText });
                await handleAIResponse(finalResponseText);
            }

            // Finaliza missão e dá recompensas
            const coinsEarned = await finalizeConversation();
            feedbackPromise = startBackgroundFeedbackGeneration();
            displayCompletionScreen(coinsEarned);

        } else {
            // Fluxo normal
            conversationHistory.push({ role: 'assistant', content: finalResponseText });
            await handleAIResponse(finalResponseText);
        }

    } catch (error) {
        console.error("Erro no processamento da mensagem:", error);
        const userFriendlyError = "Não foi possível conectar ao servidor. Verifique sua conexão.";
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

async function startBackgroundFeedbackGeneration() {
    console.log("Iniciando feedback em background...");
    const historySnapshot = [...conversationHistory];
    const language = localStorage.getItem('language');
    const settings = { language: language, proficiency: localStorage.getItem('proficiency'), voiceGender: localStorage.getItem('voiceGender') };
    const mode = currentInteractionMode;

    try {
        const feedbackText = await getFeedbackForConversation(historySnapshot, language, settings, mode);
        
        const savedHistory = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        if (savedHistory.length > 0) {
            savedHistory[0].feedback = feedbackText;
            localStorage.setItem('conversationHistory', JSON.stringify(savedHistory));
            
            const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
            userStats.feedbackViewed = (userStats.feedbackViewed || 0) + 1;
            if (feedbackText.toLowerCase().includes("no corrections needed")) {
                userStats.flawlessMissions = (userStats.flawlessMissions || 0) + 1;
            }
            localStorage.setItem('userStats', JSON.stringify(userStats));
            
            await checkAndAwardBadges(null, true);
            processBadgeNotificationQueue();
        }
        return feedbackText;
    } catch (error) {
        console.error("Erro no feedback background:", error);
        return null;
    }
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
        scenarioId: currentScenario.id, 
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
        scenarioId: currentScenario.id 
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
    
    // REMOVIDO: Botão "Próxima Missão"
    actionsContainer.innerHTML = `
        <button id="feedback-btn">Ver Feedback</button>
        <button id="finish-btn" class="completion-finish-btn">Concluir</button>
    `;

    actionsContainer.querySelector('#feedback-btn').addEventListener('click', handleGetFeedback);
    // REMOVIDO: Event Listener do botão "Próxima Missão"
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
    
    const allScenarios = Object.entries(SCENARIOS).flatMap(([category, scenarios]) =>
        Object.entries(scenarios).map(([id, s]) => ({ ...s, categoryName: category, id: id }))
    );
    
    const currentGoal = currentScenario.details[currentLang].goal;
    const availableScenarios = allScenarios.filter(s => s[currentLang].goal !== currentGoal);

    if (availableScenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        const nextScenario = availableScenarios[randomIndex];
        startNewConversation(nextScenario, nextScenario.categoryName, nextScenario.id);
    } else {
        renderHomePage();
        alert("Você praticou todos os cenários disponíveis!");
    }
}

async function handleGetFeedback() {
    feedbackModal.classList.remove('modal-hidden');
    feedbackContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>A Odete está escrevendo suas dicas...</p>
            <p class="typing-dots" style="justify-content: center;"><span>.</span><span>.</span><span>.</span></p>
        </div>`;
    translateBtn.classList.add('translate-btn-hidden');

    try {
        if (feedbackPromise) {
            console.log("Usando feedback pré-carregado.");
            originalFeedback = await feedbackPromise;
        } else {
            console.log("Gerando feedback agora (fallback).");
            const settings = { language: localStorage.getItem('language'), proficiency: localStorage.getItem('proficiency') };
            originalFeedback = await getFeedbackForConversation(conversationHistory, localStorage.getItem('language'), settings, currentInteractionMode);
            
            const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
            if (history.length > 0 && !history[0].feedback) {
                history[0].feedback = originalFeedback;
                localStorage.setItem('conversationHistory', JSON.stringify(history));
            }
        }

        if(!originalFeedback) throw new Error("Falha na geração.");

        displayFormattedFeedback(originalFeedback);
        translateBtn.classList.remove('translate-btn-hidden');
        isTranslated = false;
        translatedFeedback = '';
        translateBtn.textContent = 'Traduzir para Português';

    } catch (error) {
        feedbackContent.innerHTML = `<p>Erro: ${error.message}</p>`;
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
            <h2>Meu Passaporte</h2>
        </div>

        <!-- Barra de Abas -->
        <div class="tab-bar jornada-tabs">
            <button class="tab-btn active" data-tab="progress">Progresso</button>
            <button class="tab-btn" data-tab="achievements">Conquistas</button>
        </div>

        <!-- ABA 1: PROGRESSO (Ativa por padrão) -->
        <div id="content-progress" class="tab-content active">
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
        </div>

        <!-- ABA 2: CONQUISTAS (Oculta por padrão) -->
        <div id="content-achievements" class="tab-content">
             <section class="jornada-section">
                <!-- O container onde os badges serão renderizados -->
                <div class="badges-gallery-container"></div>
            </section>
        </div>
    `;

    mainContentArea.appendChild(container);

    createModeChart(document.getElementById('modeChart'), performanceData.modeCount);
    createCategoryChart(document.getElementById('categoryChart'), performanceData.categoryCount);
    createActivityCalendar(document.getElementById('calendar-container'), performanceData.activityByDay);

    renderBadgesGallery(container.querySelector('.badges-gallery-container'));

    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            
            const targetId = `content-${tab.dataset.tab}`;
            const targetContent = container.querySelector(`#${targetId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
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

function openTravelerModal(type) {
    const modal = document.getElementById('traveler-modal');
    const titleEl = document.getElementById('traveler-modal-title');
    const contentEl = document.getElementById('traveler-modal-content');
    
    const traveler = getTravelerState();
    contentEl.innerHTML = ''; // Limpa conteúdo anterior

    if (type === 'humor') {
        titleEl.textContent = "Humor Atual";
        contentEl.innerHTML = `<p class="traveler-detail-text">Você está se sentindo: <strong>${traveler.humor}</strong>.</p>`;
    } 
    else if (type === 'backpack') {
        titleEl.textContent = "Sua Mochila";
        if (traveler.backpack.length === 0) {
            contentEl.innerHTML = "<p>Sua mochila está vazia.</p>";
        } else {
            const ul = document.createElement('ul');
            ul.className = 'traveler-list';
            traveler.backpack.forEach(item => {
                ul.innerHTML += `
                    <li class="traveler-list-item">
                        <span style="font-size: 1.5rem;">🎒</span>
                        <div><strong>${item}</strong></div>
                    </li>`;
            });
            contentEl.appendChild(ul);
        }
    } 
    else if (type === 'skills') {
        titleEl.textContent = "Habilidades";
        if (traveler.skills.length === 0) {
            contentEl.innerHTML = "<p>Ainda não aprendeu habilidades específicas.</p>";
        } else {
            const ul = document.createElement('ul');
            ul.className = 'traveler-list';
            traveler.skills.forEach(skill => {
                ul.innerHTML += `
                    <li class="traveler-list-item">
                        <span style="font-size: 1.5rem;">⚡</span>
                        <div><strong>${skill}</strong></div>
                    </li>`;
            });
            contentEl.appendChild(ul);
        }
    } 
    else if (type === 'people') {
        titleEl.textContent = "Pessoas Conhecidas";
        if (traveler.people.length === 0) {
            contentEl.innerHTML = "<p>Você ainda não fez contatos marcantes.</p>";
        } else {
            const ul = document.createElement('ul');
            ul.className = 'traveler-list';
            traveler.people.forEach(npc => {
                // Define cor da barra (assumindo que o backend envia 'relation')
                let barClass = 'rel-neutral';
                if (npc.relation >= 70) barClass = 'rel-friend';
                if (npc.relation <= 30) barClass = 'rel-enemy';

                ul.innerHTML += `
                    <li class="traveler-list-item">
                        <div class="npc-item">
                            <div class="npc-header">
                                <span>${npc.name}</span>
                                <span class="npc-status-text">${npc.status || 'Conhecido'}</span>
                            </div>
                            <div class="relationship-bar-bg">
                                <div class="relationship-bar-fill ${barClass}" style="width: ${npc.relation || 50}%;"></div>
                            </div>
                        </div>
                    </li>`;
            });
            contentEl.appendChild(ul);
        }
    }

    modal.classList.remove('modal-hidden');
}

async function renderHomePageContent() {
    mainContentArea.innerHTML = '';
    
    // 1. Título da Página
    const title = document.createElement('h1'); 
    title.className = 'main-page-title'; 
    title.textContent = "Missões da Odete"; 
    mainContentArea.appendChild(title);
    
    // 2. Seção de Narrativa Infinita (IA)
    const narrativeSection = document.createElement('section'); 
    narrativeSection.className = 'suggestion-section';
    
    // Estado de Loading Inicial
    narrativeSection.innerHTML = `
        <div class="suggestion-card" style="min-height: 200px; justify-content: center;">
            <p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>
            <p style="margin-top: 10px; color: var(--text-secondary);">Consultando o destino...</p>
        </div>
    `;
    mainContentArea.appendChild(narrativeSection);

    // --- Carregamento Assíncrono da Narrativa ---
    try {
        const currentState = getTravelerState();
        // Chama a API
        const narrativeData = await getNarrativeFromAI(currentState);

        // Mapeamento de imagens (Mantido igual)
        const categoryImages = {
            "🍔 Restaurantes e Cafés": "assets/restaurantes/placeholder.png",
            "✈️ Viagens e Transporte": "assets/viagens/placeholder.png",
            "🏨 Hotéis e Hospedagens": "assets/hoteis/placeholder.png",
            "🩹 Saúde e Bem-estar": "assets/saude/placeholder.png",
            "🛒 Compras": "assets/compras/placeholder.png",
            "💼 Profissional": "assets/profissional/placeholder.png",
            "🎓 Estudos": "assets/estudos/placeholder.png",
            "🏠 Moradia e Serviços": "assets/moradia/placeholder.png",
            "💕 Romance": "assets/romance/placeholder.png",
            "😅 Situações Embaraçosas": "assets/embaracoso/placeholder.png",
            "🍺 Bar & Happy Hour": "assets/bar/placeholder.png",
            "⚽ Esportes": "assets/esportes/placeholder.png",
            "🤝 Situações Sociais": "assets/sociais/placeholder.png"
        };

        const imagePath = categoryImages[narrativeData.category] || "assets/viagens/placeholder.png";

        // --- LÓGICA DE RENDERIZAÇÃO BASEADA NO TIPO DE NÓ ---
        
        if (narrativeData.nodeType === 'story') {
            // === MODO HISTÓRIA (Só texto + Continuar) ===
            narrativeSection.innerHTML = `
                <div class="suggestion-card">
                    <h3 style="font-size: 0.9rem; color: var(--color-accent); text-transform: uppercase; margin-bottom: 8px;">${narrativeData.category}</h3>
                    <img src="${imagePath}" class="narrative-image" alt="Cenário Atual">
                    <p class="narrative-text">${narrativeData.text}</p>
                    <div class="decision-buttons" style="grid-template-columns: 1fr;">
                        <button id="btn-continue-story" class="decision-btn primary-btn">Continuar ➜</button>
                    </div>
                </div>
            `;

            // Listener para Continuar (Recarrega a Home para pegar o próximo nó)
            document.getElementById('btn-continue-story').addEventListener('click', () => {
                const state = getTravelerState();
                state.storyNodeCount = (state.storyNodeCount || 0) + 1; // Incrementa contador
                // Adiciona texto ao diário automaticamente para manter contexto
                state.journal.push({ text: narrativeData.text, timestamp: new Date().getTime() });
                saveTravelerState(state);
                renderHomePageContent(); // Recarrega a função
            });

        } else {
            // === MODO INTERAÇÃO (Texto + Opções A/B) ===
            
            // Reseta o contador de história pois houve interação
            const state = getTravelerState();
            if (state.storyNodeCount > 0) {
                state.storyNodeCount = 0;
                saveTravelerState(state);
            }

            narrativeSection.innerHTML = `
                <div class="suggestion-card">
                    <h3 style="font-size: 0.9rem; color: var(--color-accent); text-transform: uppercase; margin-bottom: 8px;">${narrativeData.category}</h3>
                    <img src="${imagePath}" class="narrative-image" alt="Cenário Atual">
                    <p class="narrative-text">${narrativeData.text}</p>
                    <div class="decision-buttons">
                        <button id="btn-option-a" class="decision-btn">${narrativeData.options.optionA.label}</button>
                        <button id="btn-option-b" class="decision-btn">${narrativeData.options.optionB.label}</button>
                    </div>
                </div>
            `;

            // Listeners dos botões de opção
            const handleDynamicScenario = (optionKey) => {
                const option = narrativeData.options[optionKey];
                if (userHearts > 0) {
                    const dynamicScenario = {
                        "pt-BR": { goal: option.goal },
                        "en-US": { name: "Story Mission", goal: option.goal },
                        "es-MX": { name: "Misión de Historia", goal: option.goal }
                    };
                    
                    startNewConversation(
                        dynamicScenario, 
                        narrativeData.category, 
                        "dynamic_story", 
                        option.context, 
                        option.aiRole,
                        option.userRole
                    );
                } else {
                    showNoHeartsModal();
                }
            };

            document.getElementById('btn-option-a').addEventListener('click', () => handleDynamicScenario('optionA'));
            document.getElementById('btn-option-b').addEventListener('click', () => handleDynamicScenario('optionB'));
        }

    } catch (error) {
        console.error("Erro ao carregar narrativa:", error);
        narrativeSection.innerHTML = `
            <div class="suggestion-card">
                <p>Ops! A Odete se perdeu no mapa. Tente recarregar.</p>
                <button class="primary-btn" onclick="renderHomePageContent()" style="margin-top:10px">Tentar Novamente</button>
            </div>`;
    }

    // 3. SEÇÃO: Status (Dados Reais do LocalStorage)
    const traveler = getTravelerState();

    const statusTitle = document.createElement('h3');
    statusTitle.textContent = "Status";
    statusTitle.style.cssText = "font-size: 1.2rem; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--border-color); color: var(--text-primary); width: 100%;";
    mainContentArea.appendChild(statusTitle);

    const stateSection = document.createElement('section');
    stateSection.className = 'traveler-state-grid';
    stateSection.innerHTML = `
        <div class="state-card" id="card-humor">
            <span class="state-icon">🎭</span>
            <span class="state-title">Humor</span>
            <span class="state-value">${traveler.humor}</span>
        </div>
        <div class="state-card" id="card-backpack">
            <span class="state-icon">🎒</span>
            <span class="state-title">Mochila</span>
            <span class="state-value">${traveler.backpack.length} Itens</span>
        </div>
        <div class="state-card" id="card-skills">
            <span class="state-icon">⚡</span>
            <span class="state-title">Habilidades</span>
            <span class="state-value">${traveler.skills.length}</span>
        </div>
        <div class="state-card" id="card-people">
            <span class="state-icon">👥</span>
            <span class="state-title">Pessoas</span>
            <span class="state-value">${traveler.people.length}</span>
        </div>
    `;
    mainContentArea.appendChild(stateSection);

    // Listeners dos Cards
    document.getElementById('card-humor').addEventListener('click', () => openTravelerModal('humor'));
    document.getElementById('card-backpack').addEventListener('click', () => openTravelerModal('backpack'));
    document.getElementById('card-skills').addEventListener('click', () => openTravelerModal('skills'));
    document.getElementById('card-people').addEventListener('click', () => openTravelerModal('people'));


    // 4. SEÇÃO: Diário de Experiências (Dados Reais)
    const journalSection = document.createElement('section');
    journalSection.className = 'journal-section';
    
    // Pega as últimas 5 entradas invertidas
    const recentJournal = traveler.journal.slice(-5).reverse();
    
    let journalHtml = '';
    if (recentJournal.length === 0) {
        journalHtml = '<div class="journal-entry"><span class="journal-entry-text">Seu diário ainda está vazio. Comece sua jornada!</span></div>';
    } else {
        journalHtml = recentJournal.map(entry => `
            <div class="journal-entry">
                <span class="journal-entry-icon">✍️</span>
                <span class="journal-entry-text">${entry.text}</span>
            </div>
        `).join('');
    }

    journalSection.innerHTML = `
        <h3>Diário de Experiências</h3>
        <div class="journal-list">
            ${journalHtml}
        </div>
    `;
    mainContentArea.appendChild(journalSection);
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

    // Verifica se já passou pelo onboarding
    if (localStorage.getItem('hasCompletedOnboarding') === 'true') {
        renderHomePage();
    } else {
        // Se não, inicia o Wizard (caso o clique em Iniciar tenha sido feito)
        // Nota: O clique em "Iniciar" chama startOnboarding se não houver flag
        // Mas se inicializarmos aqui direto, pode conflitar com a lógica do botão.
        // Vamos deixar o botão controlar o fluxo inicial.
    }
    
    initializeSpeechAPI();
}

const GIF_DURATION = 4000;
const TITLE_DURATION = 2200;
const TRANSITION_DURATION = 500;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Função auxiliar para garantir que a imagem carregou
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // Resolve mesmo com erro para não travar o app
        img.src = src;
    });
}

async function handleAppOpening() {
    initializeApp(); // Carrega configurações básicas
    
    const gifUrl = 'assets/animacoes/odete-airport-suitcase.gif';
    const splashLoader = document.getElementById('splash-loader');
    
    // 1. Espera o download real da imagem acontecer nos bastidores
    await preloadImage(gifUrl);

    // 2. Imagem carregada! Troca o Spinner pelo GIF
    if (splashLoader) splashLoader.classList.add('loader-hidden');
    splashGif.classList.remove('gif-loading');
    
    // 3. AGORA sim iniciamos o cronômetro da animação (garantindo a duração igual para todos)
    await delay(GIF_DURATION);
    
    splashGif.classList.add('hidden');
    splashTitle.classList.add('visible');
    
    await delay(TITLE_DURATION);
    
    // Mostra o botão iniciar
    splashStartBtn.classList.remove('hidden'); 
    splashStartBtn.classList.add('visible');
}

// Função chamada ao clicar em "Iniciar"
function handleSplashStart() {
    const hasCompleted = localStorage.getItem('hasCompletedOnboarding') === 'true';
    
    if (hasCompleted) {
        // Usuário antigo: Vai para Home
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            
            // CORREÇÃO: Remove a classe 'hidden' para garantir que a tela apareça
            appContainer.classList.remove('hidden');
            appContainer.classList.add('visible');
            
            renderHomePage();
        }, 500);
    } else {
        // Usuário novo: Abre Wizard
        startOnboarding();
    }
}

// =================================================================
//  PONTO DE ENTRADA DA APLICAÇÃO
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    navHomeBtn.addEventListener('click', renderHomePage);
    navCustomBtn.addEventListener('click', renderTrainingPage);
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

    // Listener do botão Iniciar da Splash Screen
    if (splashStartBtn) {
        splashStartBtn.addEventListener('click', handleSplashStart);
    }

    // Listeners do Wizard
    if (wizardNameInput) {
        wizardNameInput.addEventListener('input', (e) => {
            btnNextName.disabled = e.target.value.trim().length === 0;
        });
        wizardNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !btnNextName.disabled) handleWizardNext(0);
        });
    }

    // Delegação de eventos para cards do Wizard
    onboardingWizard.addEventListener('click', (e) => {
        const card = e.target.closest('.wizard-card, .wizard-card-list');
        if (card) {
            selectWizardOption(card.dataset.type, card.dataset.value, card);
        }
    });

    if (btnNextName) btnNextName.addEventListener('click', () => handleWizardNext(0));
    if (btnNextLang) btnNextLang.addEventListener('click', () => handleWizardNext(1));
    if (btnNextLevel) btnNextLevel.addEventListener('click', () => handleWizardNext(2));
    if (btnFinishWizard) btnFinishWizard.addEventListener('click', finishOnboarding);

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

    // Listeners para o Modal do Viajante
    const travelerModal = document.getElementById('traveler-modal');
    const travelerCloseBtn = document.getElementById('traveler-modal-close-btn');
    
    if (travelerCloseBtn) {
        travelerCloseBtn.addEventListener('click', () => travelerModal.classList.add('modal-hidden'));
    }
    if (travelerModal) {
        travelerModal.addEventListener('click', (e) => {
            if (e.target === travelerModal) travelerModal.classList.add('modal-hidden');
        });
    }

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