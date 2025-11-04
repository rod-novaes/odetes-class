// CÓDIGO ATUALIZADO PARA script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mapeamento de Elementos ---
    const mainContentArea = document.getElementById('main-content-area');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const chatInputArea = document.querySelector('.chat-input-area');
    const proficiencySelect = document.getElementById('proficiency-select');
    const languageSelect = document.getElementById('language-select');
    const bottomNavBar = document.getElementById('bottom-nav-bar');
    const navHomeBtn = document.getElementById('nav-home-btn');
    const navCustomBtn = document.getElementById('nav-custom-btn');
    const navHistoryBtn = document.getElementById('nav-history-btn');
    const navSettingsBtn = document.getElementById('nav-settings-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const feedbackContent = document.getElementById('feedback-content');
    const translateBtn = document.getElementById('translate-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const modalGoogleApiKeyInput = document.getElementById('modal-google-api-key-input');
    const modalElevenLabsApiKeyInput = document.getElementById('modal-elevenlabs-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const changeApiKeyBtn = document.getElementById('change-api-key-btn');
    const historyModal = document.getElementById('history-modal');
    const historyModalTitle = document.getElementById('history-modal-title');
    const historyModalContent = document.getElementById('history-modal-content');
    const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
    const missionModal = document.getElementById('mission-modal');
    const missionGoalText = document.getElementById('mission-goal-text');
    const missionModalCloseBtn = document.getElementById('mission-modal-close-btn');
    const missionImageContainer = document.getElementById('mission-image-container');
    const settingsModal = document.getElementById('settings-modal');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
    const micBtn = document.getElementById('mic-btn');
    const startTextMissionBtn = document.getElementById('start-text-mission-btn');
    const startVoiceMissionBtn = document.getElementById('start-voice-mission-btn');
    const practiceAgainBtn = document.getElementById('practice-again-btn');
    
    // Mapeamento do cabeçalho global e seus componentes
    const contextBar = document.getElementById('context-bar');
    const langIndicatorBtn = document.getElementById('lang-indicator-btn');
    const proficiencyIndicatorBtn = document.getElementById('proficiency-indicator-btn');
    const exitChatBtn = document.getElementById('exit-chat-btn');
    const scoreIndicator = document.getElementById('score-indicator');
    const headerBackBtn = document.getElementById('header-back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // Mapeamento de Elementos da Notificação de Recompensa
    const rewardNotification = document.getElementById('reward-notification');
    const rewardText = document.getElementById('reward-text');
    const rewardImage = document.getElementById('reward-image');

    // Mapeamento dos Elementos da Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    const splashGif = document.getElementById('splash-gif');
    const splashTitle = document.getElementById('splash-title');
    const appContainer = document.getElementById('app-container');


    // --- Variáveis de Estado e Constantes ---
    const AVATAR_AI_URL = 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png';
    const AVATAR_USER_URL = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    const TYPING_SIMULATION_DELAY = 1000;

    let conversationHistory = [];
    let currentScenario = null;
    let originalFeedback = '';
    let translatedFeedback = '';
    let isTranslated = false;
    
    let currentInteractionMode = null; // 'text' ou 'voice'
    let conversationState = 'IDLE';    // 'IDLE', 'AI_SPEAKING', 'USER_LISTENING', 'PROCESSING'
    let isConversationActive = false; 
    const synthesis = window.speechSynthesis;
    let voices = [];
    let currentAudioPlayer = null;

    let mediaRecorder; 
    let audioChunks = []; 
    
    let badgeNotificationQueue = [];
    let isBadgeNotificationVisible = false;

    // Variável para controlar o timeout de exibição de mensagens
    let messageDisplayTimeoutId = null; 

    // --- Funções de Inicialização da API de Voz ---
    function initializeSpeechAPI() {
        function populateVoiceList() {
            if (synthesis.getVoices().length > 0) {
                voices = synthesis.getVoices();
            }
        }
        populateVoiceList();
        if (synthesis.onvoiceschanged !== undefined) {
            synthesis.onvoiceschanged = populateVoiceList;
        }
    }

    // --- Funções de Gerenciamento da API Key ---
    const getGoogleApiKey = () => localStorage.getItem('googleApiKey');
    const getElevenLabsApiKey = () => localStorage.getItem('elevenLabsApiKey');
    function openApiKeyModal(isPersistent = false) { if (isPersistent) { apiKeyModal.classList.add('modal-persistent'); } else { apiKeyModal.classList.remove('modal-persistent'); } apiKeyModal.classList.remove('modal-hidden'); }
    const closeApiKeyModal = () => apiKeyModal.classList.add('modal-hidden');
    function saveApiKey() { 
        const googleKey = modalGoogleApiKeyInput.value.trim(); 
        const elevenLabsKey = modalElevenLabsApiKeyInput.value.trim();
        if (googleKey && elevenLabsKey) { 
            localStorage.setItem('googleApiKey', googleKey); 
            localStorage.setItem('elevenLabsApiKey', elevenLabsKey);
            closeApiKeyModal(); 
            initializeApp();
        } else { 
            alert("Por favor, insira as duas chaves de API para continuar."); 
        } 
    }
    
    // --- Funções de Gerenciamento de Configurações e Cabeçalho ---
    function loadSettings() {
        const savedLanguage = localStorage.getItem('language');
        const savedProficiency = localStorage.getItem('proficiency');
        if (savedLanguage) languageSelect.value = savedLanguage;
        if (savedProficiency) proficiencySelect.value = savedProficiency;
    }

    function updateHeaderIndicators() {
        const langMap = { "en-US": "🇺🇸" };
        const currentLang = languageSelect.value;
        langIndicatorBtn.innerHTML = langMap[currentLang] || '🌐';

        const profMap = {
            basic: '★<span class="star-off">★★</span>',
            intermediate: '★★<span class="star-off">★</span>',
            advanced: '★★★'
        };
        const currentProf = proficiencySelect.value;
        proficiencyIndicatorBtn.innerHTML = profMap[currentProf] || '★★★';
    }

    // --- Funções do Sistema de Pontuação ---
    function getScore() {
        return parseInt(localStorage.getItem('userScore') || '0', 10);
    }

    function saveScore(newScore) {
        localStorage.setItem('userScore', newScore);
    }
    
    function updateScoreDisplay() {
        scoreIndicator.innerHTML = `🦉 ${getScore()}`;
    }


    // --- Funções de Histórico ---
    function populateHistoryList(listElement) { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; listElement.innerHTML = ''; if (history.length === 0) { listElement.innerHTML = '<li><small>Nenhum diálogo no histórico.</small></li>'; return; } history.forEach((item, index) => { const li = document.createElement('li'); li.className = 'history-item'; const viewButton = document.createElement('div'); viewButton.className = 'history-item-view'; viewButton.innerHTML = `<span>${item.scenarioName}</span><small>${new Date(item.timestamp).toLocaleString()}</small>`; viewButton.dataset.index = index; const deleteButton = document.createElement('button'); deleteButton.className = 'history-item-delete'; deleteButton.innerHTML = '&times;'; deleteButton.title = 'Excluir este item'; deleteButton.dataset.index = index; li.appendChild(viewButton); li.appendChild(deleteButton); listElement.appendChild(li); }); }
    function showHistoryModal(index) { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; const item = history[index]; if (!item) return; historyModalTitle.textContent = item.scenarioName; historyModalContent.innerHTML = ''; item.transcript.forEach(msg => { const el = document.createElement('div'); el.classList.add('message', `${msg.role}-message`); const p = document.createElement('p'); p.textContent = msg.content; el.appendChild(p); historyModalContent.appendChild(el); }); if (item.feedback) { const separator = document.createElement('hr'); separator.className = 'history-feedback-separator'; const feedbackTitle = document.createElement('h3'); feedbackTitle.className = 'history-feedback-title'; feedbackTitle.textContent = 'Análise de Desempenho Salva'; const feedbackContainer = document.createElement('div'); feedbackContainer.className = 'history-feedback-content'; feedbackContainer.innerHTML = formatFeedbackText(item.feedback); historyModalContent.appendChild(separator); historyModalContent.appendChild(feedbackTitle); historyModalContent.appendChild(feedbackContainer); } historyModal.classList.remove('modal-hidden'); }
    function deleteHistoryItem(index) { if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) { return; } let history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.splice(index, 1); localStorage.setItem('conversationHistory', JSON.stringify(history)); renderHistoryPage(); }

    // --- Event Listeners ---
    navHomeBtn.addEventListener('click', renderHomePage);
    navCustomBtn.addEventListener('click', renderCustomScenarioPage);
    navHistoryBtn.addEventListener('click', renderHistoryPage);
    navSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    sendBtn.addEventListener('click', handleSendMessage);
    textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });
    micBtn.addEventListener('click', handleMicButtonClick);
    exitChatBtn.addEventListener('click', handleExitChat);
    headerBackBtn.addEventListener('click', renderHomePage);
    
    langIndicatorBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    proficiencyIndicatorBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    
    scoreIndicator.addEventListener('click', renderJornadaPage);

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    languageSelect.addEventListener('change', () => {
        localStorage.setItem('language', languageSelect.value);
        updateHeaderIndicators();
    });
    proficiencySelect.addEventListener('change', () => {
        localStorage.setItem('proficiency', proficiencySelect.value);
        updateHeaderIndicators();
    });

    mainContentArea.addEventListener('click', async (e) => {
        const suggestionBtn = e.target.closest('#start-suggestion-btn');
        if (suggestionBtn) {
            const categoryName = suggestionBtn.dataset.categoryName;
            const scenarioName = suggestionBtn.dataset.scenarioName;
            const scenario = SCENARIOS[categoryName]?.[scenarioName];
            if (scenario) {
                startNewConversation(scenario, categoryName);
            }
            return;
        }

        const scenarioCard = e.target.closest('.scenario-card');
        if (scenarioCard) {
            const scenarioName = scenarioCard.dataset.scenarioName;
            const categoryName = scenarioCard.dataset.categoryName;
            const scenario = SCENARIOS[categoryName]?.[scenarioName];
            if (scenario) { startNewConversation(scenario, categoryName); }
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
            const customInput = document.getElementById('custom-scenario-input');
            const goal = customInput.value.trim();
            const apiKey = getGoogleApiKey();
            if (!apiKey) { openApiKeyModal(true); return; }
            if (!goal) {
                showCustomScenarioError("Por favor, descreva o cenário que você quer praticar.");
                return;
            }
            clearCustomScenarioError();
            customBtn.disabled = true;
            customInput.disabled = true;
            customBtn.textContent = 'Validando...';
            try {
                const validation = await validateScenarioGoal(goal, apiKey);
                if (validation.isValid) {
                    const customScenario = {
                        "pt-BR": { goal: goal },
                        "en-US": { name: "Custom Scenario", goal: goal }
                    };
                    startNewConversation(customScenario, 'custom');
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
    settingsModalCloseBtn.addEventListener('click', () => settingsModal.classList.add('modal-hidden'));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('modal-hidden'); });
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    changeApiKeyBtn.addEventListener('click', () => { settingsModal.classList.add('modal-hidden'); openApiKeyModal(false); });
    apiKeyModal.addEventListener('click', (e) => { if (!apiKeyModal.classList.contains('modal-persistent') && e.target === apiKeyModal) closeApiKeyModal(); });
    practiceAgainBtn.addEventListener('click', handlePracticeAgain);

    startTextMissionBtn.addEventListener('click', () => {
        currentInteractionMode = 'text';
        missionModal.classList.add('modal-hidden');
        initiateChat();
    });

    startVoiceMissionBtn.addEventListener('click', () => {
        currentInteractionMode = 'voice';
        missionModal.classList.add('modal-hidden');
        initiateVoiceChat();
    });

    // --- Funções de Renderização de "Páginas" ---
    function renderHomePage() {
        updateActiveNavIcon('nav-home-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area';
        chatInputArea.classList.add('chat-input-hidden');
        bottomNavBar.classList.remove('nav-hidden');
        
        exitChatBtn.textContent = 'Sair';
        exitChatBtn.classList.add('exit-chat-btn-hidden');

        scoreIndicator.classList.remove('score-indicator-hidden');
        headerBackBtn.classList.add('back-btn-hidden');

        renderHomePageContent();
        
        // CORREÇÃO: Reseta a posição de rolagem
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

        scoreIndicator.classList.remove('score-indicator-hidden');
        headerBackBtn.classList.add('back-btn-hidden');
        
        const customScenarioContainer = document.createElement('div');
        customScenarioContainer.className = 'custom-scenario-container';
        customScenarioContainer.innerHTML = `
            <h2>Cenário Personalizado</h2>
            <p>Descreva uma situação ou objetivo que você gostaria de praticar em inglês.</p>
            <textarea id="custom-scenario-input" rows="6" placeholder="Ex: Pedir o reembolso de um produto com defeito em uma loja de eletrônicos..."></textarea>
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
        
        scoreIndicator.classList.remove('score-indicator-hidden');
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

        scoreIndicator.classList.add('score-indicator-hidden');
        headerBackBtn.classList.add('back-btn-hidden');
    }

    // --- Funções de Lógica Principal de Conversa ---
    function startNewConversation(scenario, categoryName) {
        if (!getGoogleApiKey() || !getElevenLabsApiKey()) {
            openApiKeyModal(true);
            return;
        }

        currentScenario = { 
            details: scenario,
            categoryName: categoryName 
        };

        const currentLevel = proficiencySelect.value;
        const textPoints = calculateMissionPoints(currentLevel, 'text');
        const voicePoints = calculateMissionPoints(currentLevel, 'voice');

        const textPlural = textPoints === 1 ? 'pt' : 'pts';
        const voicePlural = voicePoints === 1 ? 'pt' : 'pts';

        startTextMissionBtn.innerHTML = `
            <span>Por Texto</span>
            <span class="mission-points-badge badge-text">+${textPoints} ${textPlural}</span>
        `;
        startVoiceMissionBtn.innerHTML = `
            <span>Por Voz</span>
            <span class="mission-points-badge badge-voice">+${voicePoints} ${voicePlural}</span>
        `;

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
        micBtn.style.display = 'none';
        textInput.style.display = 'block';
        sendBtn.style.display = 'flex';

        conversationHistory = [];
        const scenarioInEnglish = currentScenario.details['en-US'];
        displayMessage(`Scenario: ${scenarioInEnglish.name}`, 'system');
        displayMessage(`🎯 Your Goal: ${scenarioInEnglish.goal}`, 'system');
        setProcessingState(true);
        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada");
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, scenarioInEnglish, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            // CORREÇÃO: Captura o ID do timeout
            messageDisplayTimeoutId = setTimeout(() => { 
                removeTypingIndicator(); 
                displayMessage(aiResponse, 'ai'); 
                setUserTurnState(true); 
            }, TYPING_SIMULATION_DELAY);

        } catch (error) { const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API do Google está configurada corretamente em Configurações ⚙️."; displayMessage(userFriendlyError, 'ai'); setUserTurnState(true); }
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
        // CORREÇÃO: Limpa qualquer timeout pendente para evitar "avatar fantasma"
        if (messageDisplayTimeoutId) {
            clearTimeout(messageDisplayTimeoutId);
            messageDisplayTimeoutId = null;
        }

        // A checagem de `isConversationActive` previne o `confirm` após a conclusão da missão
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

        feedbackModal.classList.add('modal-hidden');

        setTimeout(() => {
            startNewConversation(currentScenario.details, currentScenario.categoryName);
        }, 300);
    }

    // --- LÓGICA DE VOZ HÍBRIDA ---

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
        setupVoiceUI();
        conversationHistory = [];
        const scenarioInEnglish = currentScenario.details['en-US'];
        displayMessage(`Scenario: ${scenarioInEnglish.name}`, 'system');
        displayMessage(`🎯 Your Goal: ${scenarioInEnglish.goal}`, 'system');
        setProcessingState(true);
        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada");
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, scenarioInEnglish, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            await speakText(aiResponse);
        } catch (error) {
            console.error("Error initiating voice chat:", error);
            const userFriendlyError = `Erro: ${error.message}. A sessão foi encerrada.`;
            displayMessage(userFriendlyError, 'ai');
            setProcessingState(false);
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

        if (conversationState === 'USER_LISTENING' && mediaRecorder) {
            mediaRecorder.stop();
            updateMicButtonState('processing');
            conversationState = 'PROCESSING';
        }
    }
    
    async function handleAIResponse(text) {
        if (currentInteractionMode === 'voice') {
            // A função speakText já retorna uma Promise, então podemos esperar por ela
            return speakText(text);
        } else {
            return new Promise(resolve => {
                // CORREÇÃO: Captura o ID do timeout
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
    
    // --- LÓGICA DE ESTADO DA INTERFACE ---

    function setProcessingState(isProcessing) {
        if (isProcessing) {
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
        if (!isConversationActive && !document.querySelector('.completion-container')) return;

        textInput.disabled = !isUserTurn;
        sendBtn.disabled = !isUserTurn;
        micBtn.disabled = !isUserTurn;
        
        if (isUserTurn) {
            updateMicButtonState('default');
            textInput.focus();
            if (currentInteractionMode === 'voice') {
                startRecording();
            }
        }
    }

    // --- SISTEMA DE VOZ (TTS e STT) ---

    async function speakText(text) {
        text = text.replace(/[*_#]/g, '').replace(/<eng>|<\/eng>/g, '');
        if (!text || text.trim() === '') {
            setUserTurnState(true);
            return Promise.resolve();
        }
        displayMessage(text, 'ai');
        removeTypingIndicator();

        const elevenLabsApiKey = getElevenLabsApiKey();
        if (!elevenLabsApiKey) {
            return speakTextNative(text);
        }

        try {
            const audioBlob = await getAudioFromElevenLabs(text, elevenLabsApiKey);
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudioPlayer = new Audio(audioUrl);

            return new Promise((resolve) => {
                currentAudioPlayer.onplay = () => { conversationState = 'AI_SPEAKING'; };
                currentAudioPlayer.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    setUserTurnState(true);
                    resolve();
                };
                currentAudioPlayer.onerror = () => {
                    console.error('Audio playback error');
                    URL.revokeObjectURL(audioUrl);
                    setUserTurnState(true);
                    resolve();
                };
                currentAudioPlayer.play();
            });

        } catch (error) {
            console.warn("ElevenLabs API failed, falling back to native TTS.", error);
            showFallbackNotification();
            return speakTextNative(text);
        }
    }

    function speakTextNative(text) {
        return new Promise((resolve) => {
            synthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const bestVoice = findBestEnglishVoice();
            if (bestVoice) utterance.voice = bestVoice;

            utterance.onstart = () => { conversationState = 'AI_SPEAKING'; };
            utterance.onend = () => {
                setUserTurnState(true);
                resolve();
            };
            utterance.onerror = () => {
                console.error('SpeechSynthesis error');
                setUserTurnState(true);
                resolve();
            };
            synthesis.speak(utterance);
        });
    }

    async function startRecording() {
        if (conversationState === 'USER_LISTENING') return;
        
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

        } catch (error) {
            console.error('Microphone access denied or error:', error);
            alert("Não foi possível acessar o microfone. Verifique as permissões do seu navegador.");
            setUserTurnState(false);
            updateMicButtonState('default');
        }
    }

    async function handleRecordingStop() {
        setProcessingState(true);
        
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada.");
            
            const transcript = await getTranscriptionFromAudio(audioBlob, apiKey);
            
            if (!transcript || transcript.trim() === '') {
                displayMessage("Não foi possível detectar fala. Tente novamente.", 'system');
                setUserTurnState(true);
                return;
            }

            await processUserMessage(transcript);

        } catch (error) {
            console.error("Transcription or API error:", error);
            const userFriendlyError = "Ocorreu um erro na transcrição de voz. Tente novamente ou use o modo texto.";
            displayMessage(userFriendlyError, 'ai');
            setUserTurnState(true);
        }
    }

    async function processUserMessage(messageText) {
        displayMessage(messageText, 'user');
        conversationHistory.push({ role: 'user', content: messageText });

        try {
            const apiKey = getGoogleApiKey();
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const scenarioInEnglish = currentScenario.details['en-US'];
            const aiResponse = await getAIResponse(messageText, conversationHistory, apiKey, scenarioInEnglish, settings);
            
            if (aiResponse.includes("[Scenario Complete]")) {
                const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim();
                
                if (cleanResponse) { 
                    conversationHistory.push({ role: 'assistant', content: cleanResponse });
                    await handleAIResponse(cleanResponse); 
                }
                
                const pointsEarned = await finalizeConversation(); 
                
                displayCompletionScreen(pointsEarned);

            } else {
                conversationHistory.push({ role: 'assistant', content: aiResponse });
                await handleAIResponse(aiResponse);
            }
        } catch (error) {
            const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API do Google está configurada corretamente em Configurações ⚙️.";
            await handleAIResponse(userFriendlyError);
        }
    }
    
    function showFallbackNotification() {
        if (!sessionStorage.getItem('fallbackNotified')) {
            alert("Seus créditos de voz premium da ElevenLabs podem ter acabado. O aplicativo continuará com a voz padrão do seu dispositivo. A qualidade da voz pode ser diferente.");
            sessionStorage.setItem('fallbackNotified', 'true');
        }
    }

    function findBestEnglishVoice() {
        if (voices.length === 0) voices = synthesis.getVoices();
        if (voices.length === 0) return null;
        let bestVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google'));
        if (bestVoice) return bestVoice;
        bestVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Microsoft'));
        if (bestVoice) return bestVoice;
        bestVoice = voices.find(voice => voice.lang === 'en-US');
        if (bestVoice) return bestVoice;
        return voices.find(voice => voice.lang.startsWith('en-'));
    }

    function updateMicButtonState(state) {
        micBtn.classList.remove('mic-listening', 'mic-processing');
        switch (state) {
            case 'listening':
                micBtn.classList.add('mic-listening');
                micBtn.innerHTML = '⏹️'; 
                micBtn.title = "Falando... Clique para enviar";
                break;
            case 'processing':
                micBtn.classList.add('mic-processing');
                micBtn.innerHTML = '🎤'; 
                micBtn.title = "Processando...";
                break;
            default: // idle
                micBtn.innerHTML = '🎤'; 
                micBtn.title = "Aguarde sua vez";
                break;
        }
    }

    // --- LÓGICA DE FINALIZAÇÃO E FEEDBACK ---

    function calculateMissionPoints(level, mode) {
        const pointsMap = {
            basic: { text: 1, voice: 2 },
            intermediate: { text: 2, voice: 4 },
            advanced: { text: 4, voice: 8 }
        };
        return pointsMap[level]?.[mode] || 0;
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
        setProcessingState(false);
        textInput.disabled = true;
        sendBtn.disabled = true;
        micBtn.disabled = true;
        updateMicButtonState('default');
        
        let totalPointsToAdd = 0;
        
        const missionPoints = calculateMissionPoints(proficiencySelect.value, currentInteractionMode);
        totalPointsToAdd += missionPoints;

        const todayStr = getTodayDateString();
        const lastCompletionDate = localStorage.getItem('lastCompletionDate');
        let currentStreak = parseInt(localStorage.getItem('currentStreak') || '0', 10);
        let bestStreak = parseInt(localStorage.getItem('bestStreak') || '0', 10);
        let bonusPoints = 0;

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
            
            bonusPoints = calculateStreakBonus(currentStreak);
            if (bonusPoints > 0) {
                totalPointsToAdd += bonusPoints;
                setTimeout(() => showRewardNotification(`🔥 Sequência de ${currentStreak} dias! +${bonusPoints} pontos!`), 500);
            }

            localStorage.setItem('lastCompletionDate', todayStr);
            localStorage.setItem('currentStreak', currentStreak);
        }

        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            localStorage.setItem('bestStreak', bestStreak);
        }
        
        const currentScore = getScore();
        saveScore(currentScore + totalPointsToAdd);
        updateScoreDisplay();

        const apiKey = getGoogleApiKey();
        let finalScenarioName = currentScenario.details['en-US'].name;
        if (finalScenarioName === "Custom Scenario" || finalScenarioName === "Cenário Personalizado") {
            try { finalScenarioName = await getScenarioTitle(currentScenario.details['en-US'].goal, apiKey, languageSelect.value); } catch (error) { finalScenarioName = "Custom Scenario"; }
        }
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        
        history.unshift({ 
            scenarioName: finalScenarioName, 
            scenarioGoal: currentScenario.details['en-US'].goal, 
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
            scenarioName: currentScenario.details['en-US'].name
        };
        await checkAndAwardBadges(newMissionData, true);
        processBadgeNotificationQueue();
        
        return totalPointsToAdd;
    }

    function displayCompletionScreen(pointsEarned) {
        const completionContainer = document.createElement('div');
        completionContainer.className = 'completion-container';

        let completionMessage = `🎉 Parabéns!<br><strong>Seu progresso foi salvo.</strong>`;
        if (pointsEarned > 0) {
            const plural = pointsEarned === 1 ? 'ponto' : 'pontos';
            completionMessage += ` Você ganhou <strong>${pointsEarned}</strong> ${plural}.`;
        }
        
        completionContainer.innerHTML = `<div class="message system-message"><p>${completionMessage}</p></div>`;
        
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'completion-actions';
        actionsContainer.innerHTML = `
            <button id="feedback-btn">Ver Feedback</button>
            <button id="next-challenge-btn">Próxima Missão</button>
            <button id="finish-btn" class="completion-finish-btn">Concluir</button>
        `;
        
        actionsContainer.querySelector('#feedback-btn').addEventListener('click', handleGetFeedback);
        actionsContainer.querySelector('#next-challenge-btn').addEventListener('click', startNextChallenge);
        actionsContainer.querySelector('#finish-btn').addEventListener('click', handleExitChat);
        
        completionContainer.appendChild(actionsContainer);
        mainContentArea.appendChild(completionContainer);
        scrollToBottom();

        if (exitChatBtn) {
            exitChatBtn.textContent = 'Concluir';
        }
    }

    function startNextChallenge() { 
        const allScenarios = Object.entries(SCENARIOS).flatMap(([category, scenarios]) => 
            Object.values(scenarios).map(s => ({ ...s, categoryName: category }))
        );
        const currentGoal = currentScenario.details['en-US'].goal; 
        const availableScenarios = allScenarios.filter(s => s['en-US'].goal !== currentGoal); 

        if (availableScenarios.length > 0) { 
            const randomIndex = Math.floor(Math.random() * availableScenarios.length); 
            const nextScenario = availableScenarios[randomIndex];
            startNewConversation(nextScenario, nextScenario.categoryName); 
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
            const apiKey = getGoogleApiKey(); 
            if (!apiKey) throw new Error("Chave de API do Google não encontrada."); 
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value }; 
            originalFeedback = await getFeedbackForConversation(conversationHistory, apiKey, languageSelect.value, settings, currentInteractionMode); 
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
            feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}</p>`; 
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
                    const apiKey = getGoogleApiKey(); 
                    if (!apiKey) throw new Error("Chave de API do Google não encontrada."); 
                    const protectedSnippets = []; 
                    const textToTranslate = originalFeedback.replace(/<eng>(.*?)<\/eng>/g, (match, content) => { 
                        protectedSnippets.push(content); 
                        return `%%PROTECTED_${protectedSnippets.length - 1}%%`; 
                    }); 
                    const translatedTextWithPlaceholders = await translateText(textToTranslate, apiKey, languageSelect.value); 
                    let finalTranslatedText = translatedTextWithPlaceholders; 
                    protectedSnippets.forEach((snippet, index) => { 
                        finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet); 
                    }); 
                    translatedFeedback = finalTranslatedText; 
                } 
                displayFormattedFeedback(translatedFeedback); 
                isTranslated = true; 
                translateBtn.textContent = 'Mostrar Original (English)'; 
                
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
                   .replace(/<eng>|<\/eng>/g, '');
    }

    function displayFormattedFeedback(text) { feedbackContent.innerHTML = formatFeedbackText(text); }

    // --- Funções de Tela Cheia ---
    function isFullscreen() {
        return !!document.fullscreenElement;
    }

    function toggleFullscreen() {
        if (!isFullscreen()) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Não foi possível entrar em modo de tela cheia: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
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
    
    // =======================================================
    // --- LÓGICA DA PÁGINA "MINHA JORNADA" ---
    // =======================================================

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
        bottomNavBar.classList.add('nav-hidden');

        scoreIndicator.classList.add('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.remove('back-btn-hidden');

        const performanceData = getPerformanceData();
        const totalPoints = getScore();
        const currentStreak = localStorage.getItem('currentStreak') || 0;
        const bestStreak = localStorage.getItem('bestStreak') || currentStreak;

        const container = document.createElement('div');
        container.className = 'jornada-container';

        container.innerHTML = `
            <div class="jornada-header">
                <h2>Minha Jornada</h2>
            </div>

            <section class="jornada-section stats-grid-section">
                <div class="summary-card">
                    <div class="summary-icon-wrapper theme-points"><span class="summary-icon">🦉</span></div>
                    <span class="summary-value">${totalPoints}</span>
                    <span class="summary-label">Pontos Totais</span>
                </div>
                 <div class="summary-card">
                    <div class="summary-icon-wrapper theme-missions"><span class="summary-icon">✅</span></div>
                    <span class="summary-value">${performanceData.missionsCompleted}</span>
                    <span class="summary-label">Missões Concluídas</span>
                </div>
                <div class="summary-card">
                    <div class="summary-icon-wrapper theme-streak"><span class="summary-icon">🔥</span></div>
                    <span class="summary-value">${currentStreak}</span>
                    <span class="summary-label">Sequência Atual</span>
                </div>
                <div class="summary-card">
                    <div class="summary-icon-wrapper theme-best-streak"><span class="summary-icon">🏆</span></div>
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
                <div class="stat-card calendar-card" id="calendar-container">
                    <!-- O calendário será gerado aqui -->
                </div>
            </section>

            <section class="jornada-section" id="badges-section">
                <h3>Minhas Conquistas</h3>
                <div class="badges-gallery-container">
                    <!-- A galeria de emblemas será gerada aqui -->
                </div>
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
            type: 'doughnut',
            data: {
                labels: ['Texto ✍️', 'Voz 🎤'],
                datasets: [{
                    label: 'Modo de Prática',
                    data: [modeData.text || 0, modeData.voice || 0],
                    backgroundColor: ['#ca8a04', '#a16207'],
                    borderColor: [ '#FFFFFF' ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { boxWidth: 12 } 
                    } 
                } 
            }
        });
    }

    function createCategoryChart(canvasElement, categoryData) {
        if (!canvasElement) return;
        const ctx = canvasElement.getContext('2d');

        const sortedCategories = Object.entries(categoryData).sort(([,a],[,b]) => b-a);
        const labels = sortedCategories.map(entry => entry[0]);
        const data = sortedCategories.map(entry => entry[1]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Missões Concluídas',
                    data: data,
                    backgroundColor: '#a16207',
                    borderRadius: 4
                }]
            },
            options: { 
                indexAxis: 'y', 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: false } 
                }, 
                scales: { 
                    x: { 
                        beginAtZero: true, 
                        ticks: { stepSize: 1 } 
                    } 
                } 
            }
        });
    }

    function createActivityCalendar(container, activityData) {
        if (!container) return;
        
        const weeksToShow = window.innerWidth < 768 ? 13 : 26;
        const today = new Date();
        const endDate = new Date(today);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - ((weeksToShow - 1) * 7 + today.getDay()));
        
        let daysHtml = '';
        for (let i = 0; i < weeksToShow * 7; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            if (currentDay > endDate) {
                daysHtml += `<div class="day-square future"></div>`;
                continue;
            }

            const dateString = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
            const count = activityData[dateString] || 0;

            let level = 0;
            if (count > 0 && count <= 2) level = 1;
            else if (count > 2 && count <= 4) level = 2;
            else if (count > 4) level = 3;

            daysHtml += `<div class="day-square level-${level}" title="${dateString}: ${count} missões"></div>`;
        }
        
        container.innerHTML = `
            <div class="calendar-labels">
                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
            </div>
            <div class="calendar-grid" style="grid-template-columns: repeat(${weeksToShow}, 1fr);">
                ${daysHtml}
            </div>
        `;
    }

    // =======================================================
    // --- LÓGICA COMPLETA DO SISTEMA DE EMBLEMAS ---
    // =======================================================

    function getUserStats() {
        const defaultStats = {
            totalMissions: 0,
            missionsByMode: { text: 0, voice: 0 },
            missionsByCategory: {},
            uniqueCategories: new Set(),
            streak: 0,
            feedbackViewed: 0,
            flawlessMissions: 0,
            phoenixEligible: false,
        };
        const storedStats = JSON.parse(localStorage.getItem('userStats') || '{}');
        if (storedStats.uniqueCategories) {
            storedStats.uniqueCategories = new Set(storedStats.uniqueCategories);
        }
        return { ...defaultStats, ...storedStats };
    }

    function syncUserProgressAndCheckBadges() {
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        const stats = {
            totalMissions: history.length,
            missionsByMode: { text: 0, voice: 0 },
            missionsByCategory: {},
            uniqueCategories: new Set(),
            streak: parseInt(localStorage.getItem('currentStreak') || '0', 10),
            feedbackViewed: parseInt(localStorage.getItem('feedbackViewedCount') || '0', 10),
            flawlessMissions: parseInt(localStorage.getItem('flawlessCount') || '0', 10),
            translateCount: parseInt(localStorage.getItem('translateCount') || '0', 10),
        };

        history.forEach(item => {
            if (item.interactionMode) {
                stats.missionsByMode[item.interactionMode] = (stats.missionsByMode[item.interactionMode] || 0) + 1;
            }
            if (item.categoryName) {
                const categoryKey = item.categoryName === 'custom' ? '✨ Cenários Personalizados' : item.categoryName;
                stats.missionsByCategory[categoryKey] = (stats.missionsByCategory[categoryKey] || 0) + 1;
                stats.uniqueCategories.add(categoryKey);
            }
        });
        
        const savableStats = { ...stats, uniqueCategories: [...stats.uniqueCategories] };
        localStorage.setItem('userStats', JSON.stringify(savableStats));

        checkAndAwardBadges(null, false);
    }
    
    async function checkAndAwardBadges(newMissionData = null, triggerNotification = false) {
        if (typeof BADGES === 'undefined') {
            console.error("Arquivo badges.js não foi carregado.");
            return;
        }

        let userStats = getUserStats();
        let userBadges = JSON.parse(localStorage.getItem('userBadges') || '{}');
        
        if (newMissionData) {
            userStats.totalMissions += 1;
            userStats.missionsByMode[newMissionData.interactionMode] += 1;
            const categoryKey = newMissionData.categoryName === 'custom' ? '✨ Cenários Personalizados' : newMissionData.categoryName;
            userStats.missionsByCategory[categoryKey] = (userStats.missionsByCategory[categoryKey] || 0) + 1;
            userStats.uniqueCategories.add(categoryKey);
            
            const now = new Date();
            if (now.getHours() >= 0 && now.getHours() < 4) {
                userStats.night_owl_mission = true;
            }
            if(newMissionData.scenarioName.includes("Asking for a discount")) {
                userStats.negotiator_mission = true;
            }
            if(userStats.phoenix_eligible) {
                userStats.phoenix_achieved = true;
                userStats.phoenix_eligible = false;
            }
        }
        
        const savableStats = { ...userStats, uniqueCategories: [...userStats.uniqueCategories] };
        localStorage.setItem('userStats', JSON.stringify(savableStats));

        const getBadgeProgress = (badgeId) => userBadges[badgeId] || { unlocked_tier: null };
        const awardBadge = (badgeId, tier) => {
            userBadges[badgeId] = {
                unlocked_tier: tier.level,
                date: new Date().toISOString()
            };
            if (triggerNotification) {
                badgeNotificationQueue.push(tier);
            }
        };

        for (const badgeId in BADGES) {
            const badge = BADGES[badgeId];
            const currentProgress = getBadgeProgress(badgeId);
            
            for (const tier of badge.tiers) {
                if (badge.tiers.findIndex(t => t.level === currentProgress.unlocked_tier) >= badge.tiers.findIndex(t => t.level === tier.level)) {
                    continue;
                }
                
                let conditionMet = false;
                switch (badgeId) {
                    case "onboarding_first_mission": if (userStats.totalMissions >= tier.goal) conditionMet = true; break;
                    case "onboarding_first_voice": if (userStats.missionsByMode.voice >= tier.goal) conditionMet = true; break;
                    case "onboarding_first_custom": if ((userStats.missionsByCategory['✨ Cenários Personalizados'] || 0) >= tier.goal) conditionMet = true; break;
                    case "onboarding_first_feedback": if (userStats.feedbackViewed >= tier.goal) conditionMet = true; break;
                    
                    case "consistency_streak": if (userStats.streak >= tier.goal) conditionMet = true; break;
                    case "consistency_total_missions": if (userStats.totalMissions >= tier.goal) conditionMet = true; break;
                    
                    case "mastery_interaction_mode":
                        if (tier.level === 'voice' && userStats.missionsByMode.voice >= tier.goal) conditionMet = true;
                        if (tier.level === 'text' && userStats.missionsByMode.text >= tier.goal) conditionMet = true;
                        break;
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

                if (conditionMet) {
                    awardBadge(badgeId, tier);
                }
            }
        }
        localStorage.setItem('userBadges', JSON.stringify(userBadges));
    }
    
    function processBadgeNotificationQueue() {
        if (isBadgeNotificationVisible || badgeNotificationQueue.length === 0) {
            return;
        }
        isBadgeNotificationVisible = true;
        const badgeTier = badgeNotificationQueue.shift();
        
        rewardImage.src = 'assets/animacoes/odete-celebrating.gif';
        rewardText.innerHTML = `Conquista Desbloqueada!<br><strong>${badgeTier.icon} ${badgeTier.name}</strong>`;
        
        rewardNotification.classList.add('visible');

        setTimeout(() => {
            rewardNotification.classList.remove('visible');
            isBadgeNotificationVisible = false;
            setTimeout(processBadgeNotificationQueue, 500);
        }, 4000); 
    }

    function renderBadgesGallery(container) {
        if (!container || typeof BADGES === 'undefined') return;
    
        const userBadges = JSON.parse(localStorage.getItem('userBadges') || '{}');
        const userStats = getUserStats();
    
        const badgesByCategory = {};
        for (const badgeId in BADGES) {
            const badge = BADGES[badgeId];
            if (!badgesByCategory[badge.category]) {
                badgesByCategory[badge.category] = [];
            }
            badgesByCategory[badge.category].push({ ...badge, id: badgeId });
        }
    
        container.innerHTML = '';
    
        for (const categoryName in badgesByCategory) {
            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'badge-category';
            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'badge-category-title';
            categoryTitle.textContent = categoryName;
            categoryWrapper.appendChild(categoryTitle);
    
            const badgesGrid = document.createElement('div');
            badgesGrid.className = 'badges-grid';
    
            if (categoryName === "Conquistas Secretas") {
                const secretBadges = badgesByCategory[categoryName];
                const unlockedSecrets = secretBadges.filter(b => userBadges[b.id]);
    
                if (unlockedSecrets.length === 0) {
                    const placeholderCard = document.createElement('div');
                    placeholderCard.className = 'badge-card locked';
                    placeholderCard.innerHTML = `
                        <div class="badge-icon">?</div>
                        <div class="badge-info">
                            <h5>Conquista Secreta</h5>
                            <p>Continue praticando para descobrir e desbloquear recompensas raras!</p>
                        </div>
                    `;
                    badgesGrid.appendChild(placeholderCard);
                    categoryWrapper.appendChild(badgesGrid);
                    container.appendChild(categoryWrapper);
                    continue;
                }
            }
    
            for (const badge of badgesByCategory[categoryName]) {
                if (badge.secret && !userBadges[badge.id]) {
                    continue;
                }
    
                const userProgress = userBadges[badge.id] || { unlocked_tier: null };
                const unlockedTierIndex = badge.tiers.findIndex(t => t.level === userProgress.unlocked_tier);
    
                for (let i = 0; i <= unlockedTierIndex; i++) {
                    const tier = badge.tiers[i];
                    const badgeCard = document.createElement('div');
                    badgeCard.className = 'badge-card unlocked complete';
                    
                    badgeCard.dataset.badgeId = badge.id;
                    badgeCard.dataset.tierLevel = tier.level;
    
                    badgeCard.innerHTML = `
                        <div class="badge-icon">${tier.icon}</div>
                        <div class="badge-info">
                            <h5>${tier.name}</h5>
                            <p>${tier.description}</p>
                        </div>
                    `;
                    badgesGrid.appendChild(badgeCard);
                }
    
                const nextTierIndex = unlockedTierIndex + 1;
                if (nextTierIndex < badge.tiers.length) {
                    const nextTier = badge.tiers[nextTierIndex];
                    const prevTier = unlockedTierIndex >= 0 ? badge.tiers[unlockedTierIndex] : null;
    
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
                        const prevTierGoal = prevTier ? prevTier.goal : 0;
                        const progress = Math.max(0, currentProgressValue - prevTierGoal);
                        const goal = nextTier.goal - prevTierGoal;
                        const percentage = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                        
                        progressBar = `
                            <div class="badge-progress-bar">
                                <div style="width: ${percentage}%;"></div>
                            </div>
                            <small class="badge-progress-text">${currentProgressValue}/${nextTier.goal}</small>
                        `;
                    }
    
                    const badgeCard = document.createElement('div');
                    badgeCard.className = 'badge-card locked';
                    badgeCard.innerHTML = `
                        <div class="badge-icon">${nextTier.icon}</div>
                        <div class="badge-info">
                            <h5>${nextTier.name}</h5>
                            <p>${nextTier.description}</p>
                            ${progressBar}
                        </div>
                    `;
                    badgesGrid.appendChild(badgeCard);
                }
            }
    
            categoryWrapper.appendChild(badgesGrid);
            container.appendChild(categoryWrapper);
        }
    }


    // --- FUNÇÕES UTILITÁRIAS ---
    function updateActiveNavIcon(activeBtnId) {
        [navHomeBtn, navCustomBtn, navHistoryBtn, navSettingsBtn].forEach(btn => {
            if (btn.id === activeBtnId) {
                btn.classList.add('active-nav-icon');
            } else {
                btn.classList.remove('active-nav-icon');
            }
        });
    }
    
    function renderHomePageContent() {
        mainContentArea.innerHTML = '';

        const title = document.createElement('h1');
        title.className = 'main-page-title';
        title.textContent = "Missões da Odete";
        mainContentArea.appendChild(title);

        const allScenarios = Object.entries(SCENARIOS).flatMap(([categoryName, scenarios]) =>
            Object.entries(scenarios).map(([scenarioName, scenarioData]) => ({
                ...scenarioData,
                categoryName: categoryName,
                scenarioName: scenarioName
            }))
        ).filter(Boolean);

        const suggestionSection = document.createElement('section');
        suggestionSection.className = 'suggestion-section';
        suggestionSection.innerHTML = `
            <div class="suggestion-card">
                <div id="new-suggestion-trigger" class="suggestion-header" title="Clique para gerar uma nova sugestão">
                    <img src="assets/odete.jpg" alt="Mascote Odete" class="suggestion-avatar">
                    <h3 id="suggestion-title"></h3>
                </div>
                <button id="start-suggestion-btn" class="primary-btn">
                    Começar Missão
                </button>
            </div>
        `;
        mainContentArea.appendChild(suggestionSection);

        const renderNewSuggestion = () => {
            const categoryImageMap = {
                "🍔 Restaurantes e Cafés": 'assets/avatar-restaurantes.jpg',
                "✈️ Viagens e Transporte": 'assets/avatar-viagens.jpg',
                "🛒 Compras": 'assets/avatar-compras.jpg',
                "🤝 Situações Sociais": 'assets/avatar-social.jpg',
                "💼 Profissional": 'assets/avatar-profissional.jpg',
                "🎓 Estudos": 'assets/avatar-estudos.jpg',
                "❤️ Saúde e Bem-estar": 'assets/avatar-saude.jpg',
                "🏠 Moradia e Serviços": 'assets/avatar-moradia.jpg'
            };

            const suggestedScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
            
            const suggestionTitleEl = document.getElementById('suggestion-title');
            const startSuggestionBtn = document.getElementById('start-suggestion-btn');
            const suggestionAvatarEl = document.querySelector('.suggestion-avatar');

            if (suggestionTitleEl && startSuggestionBtn && suggestionAvatarEl) {
                suggestionTitleEl.textContent = suggestedScenario.scenarioName;
                startSuggestionBtn.dataset.categoryName = suggestedScenario.categoryName;
                startSuggestionBtn.dataset.scenarioName = suggestedScenario.scenarioName;

                const imagePath = suggestedScenario.image || categoryImageMap[suggestedScenario.categoryName] || 'assets/odete.jpg';
                suggestionAvatarEl.src = imagePath;

                if (suggestedScenario.image) {
                    suggestionAvatarEl.alt = `Ilustração do cenário: ${suggestedScenario['en-US'].name}`;
                } else {
                    const cleanCategoryName = suggestedScenario.categoryName.replace(/[^a-zA-ZÀ-ú\s]/g, '').trim();
                    suggestionAvatarEl.alt = `Ilustração da categoria: ${cleanCategoryName}`;
                }
            }
        };

        renderNewSuggestion();

        document.getElementById('new-suggestion-trigger').addEventListener('click', renderNewSuggestion);

        const panelContainer = document.createElement('div');
        panelContainer.className = 'scenario-panel';
        Object.keys(SCENARIOS).forEach(categoryName => {
            const categorySection = document.createElement('section');
            categorySection.className = 'panel-category-section';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'panel-category-title';
            categoryTitle.innerHTML = `
                <span class="category-title-text">${categoryName}</span>
                <span class="category-toggle-icon">▸</span>
            `;
            categorySection.appendChild(categoryTitle);

            const collapsibleContent = document.createElement('div');
            collapsibleContent.className = 'collapsible-content';

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'scenario-cards-container';
            const scenariosToShow = Object.keys(SCENARIOS[categoryName]).slice(0, 4);
            scenariosToShow.forEach(scenarioName => {
                const card = document.createElement('button');
                card.className = 'scenario-card';
                card.textContent = scenarioName;
                card.dataset.categoryName = categoryName;
                card.dataset.scenarioName = scenarioName;
                cardsContainer.appendChild(card);
            });

            const viewAllButton = document.createElement('button');
            viewAllButton.className = 'view-all-btn';
            viewAllButton.textContent = 'Ver todos →';
            viewAllButton.dataset.categoryName = categoryName;

            collapsibleContent.appendChild(cardsContainer);
            collapsibleContent.appendChild(viewAllButton);
            
            categorySection.appendChild(collapsibleContent);
            panelContainer.appendChild(categorySection);
        });
        mainContentArea.appendChild(panelContainer);
    }
    
    function renderCategoryPage(categoryName) {
        scoreIndicator.classList.add('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.remove('back-btn-hidden');
        
        mainContentArea.innerHTML = ''; 
        mainContentArea.className = 'main-content-area category-page'; 
        
        const categoryContainer = document.createElement('div'); 
        categoryContainer.className = 'category-page-container'; 
        
        const header = document.createElement('div'); 
        header.className = 'category-page-header'; 
        const title = document.createElement('h2'); 
        title.textContent = categoryName; 
        header.appendChild(title); 
        
        const cardsContainer = document.createElement('div'); 
        cardsContainer.className = 'scenario-cards-container full-view'; 
        Object.keys(SCENARIOS[categoryName]).forEach(scenarioName => { 
            const card = document.createElement('button'); 
            card.className = 'scenario-card'; 
            card.textContent = scenarioName; 
            card.dataset.categoryName = categoryName; 
            card.dataset.scenarioName = scenarioName; 
            cardsContainer.appendChild(card); 
        }); 
        
        categoryContainer.appendChild(header); 
        categoryContainer.appendChild(cardsContainer); 
        mainContentArea.appendChild(categoryContainer);
        
        mainContentArea.scrollTop = 0;
    }

    function scrollToBottom() { mainContentArea.scrollTop = mainContentArea.scrollHeight; }
    function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }
    
    function initializeApp() { 
        loadSettings();
        updateHeaderIndicators();
        updateScoreDisplay();
        if (!getGoogleApiKey() || !getElevenLabsApiKey()) { 
            openApiKeyModal(true); 
        } else { 
            syncUserProgressAndCheckBadges();
            renderHomePage(); 
        } 
        initializeSpeechAPI(); 
    }
    
    function displayMessage(text, sender) { if (sender === 'ai') { removeTypingIndicator(); } if (sender === 'system') { const systemEl = document.createElement('div'); systemEl.className = 'message system-message'; systemEl.innerHTML = `<p>${text}</p>`; mainContentArea.appendChild(systemEl); } else { const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message'; messageBubble.innerHTML = `<p>${text}</p>`; if (sender === 'user') { wrapper.classList.add('user-message-wrapper'); avatar.src = AVATAR_USER_URL; avatar.alt = 'User Avatar'; messageBubble.classList.add('user-message'); } else { wrapper.classList.add('ai-message-wrapper'); avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; messageBubble.classList.add('ai-message'); } wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); } scrollToBottom(); }
    function showTypingIndicator() { if (document.getElementById('typing-indicator')) return; const wrapper = document.createElement('div'); wrapper.id = 'typing-indicator'; wrapper.className = 'message-wrapper ai-message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message ai-message'; messageBubble.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>'; wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); }


    // --- LÓGICA DE INICIALIZAÇÃO COM SPLASH SCREEN ---

    const GIF_DURATION = 3900;
    const TITLE_DURATION = 2000; 
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

    handleAppOpening();

});