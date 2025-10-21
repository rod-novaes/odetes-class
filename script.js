document.addEventListener('DOMContentLoaded', () => {

    // --- Mapeamento de Elementos ---
    const mainContentArea = document.getElementById('main-content-area');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const chatInputArea = document.querySelector('.chat-input-area');
    const proficiencySelect = document.getElementById('proficiency-select');
    // O 'correctionSelect' ainda existe no HTML, mas não precisamos mais lê-lo aqui.
    const languageSelect = document.getElementById('language-select');
    
    // ... (resto do mapeamento de elementos inalterado) ...
    const topNavBar = document.getElementById('top-nav-bar');
    const navHomeBtn = document.getElementById('nav-home-btn');
    const navCustomBtn = document.getElementById('nav-custom-btn');
    const navHistoryBtn = document.getElementById('nav-history-btn');
    const navSettingsBtn = document.getElementById('nav-settings-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const feedbackContent = document.getElementById('feedback-content');
    const translateBtn = document.getElementById('translate-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const modalApiKeyInput = document.getElementById('modal-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const changeApiKeyBtn = document.getElementById('change-api-key-btn');
    const historyModal = document.getElementById('history-modal');
    const historyModalTitle = document.getElementById('history-modal-title');
    const historyModalContent = document.getElementById('history-modal-content');
    const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
    const missionModal = document.getElementById('mission-modal');
    const missionGoalText = document.getElementById('mission-goal-text');
    const startMissionBtn = document.getElementById('start-mission-btn');
    const missionModalCloseBtn = document.getElementById('mission-modal-close-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');

    // --- Variáveis de Estado e Constantes ---
    const AVATAR_AI_URL = 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png'; 
    const AVATAR_USER_URL = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    const TYPING_SIMULATION_DELAY = 1000;

    let conversationHistory = [];
    let currentScenario = null;
    let originalFeedback = '';
    let translatedFeedback = '';
    let isTranslated = false;

    // --- Funções de Gerenciamento da API Key ---
    const getApiKey = () => localStorage.getItem('groqApiKey');
    function openApiKeyModal(isPersistent = false) { if (isPersistent) { apiKeyModal.classList.add('modal-persistent'); } else { apiKeyModal.classList.remove('modal-persistent'); } apiKeyModal.classList.remove('modal-hidden'); }
    const closeApiKeyModal = () => apiKeyModal.classList.add('modal-hidden');
    function saveApiKey() { const key = modalApiKeyInput.value.trim(); if (key) { localStorage.setItem('groqApiKey', key); closeApiKeyModal(); if (mainContentArea.innerHTML === '') { renderHomePage(); } } else { alert("Por favor, insira uma chave de API válida."); } }
    
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
    
    mainContentArea.addEventListener('click', async (e) => {
        const scenarioCard = e.target.closest('.scenario-card');
        if (scenarioCard) {
            const scenarioName = scenarioCard.dataset.scenarioName;
            const categoryName = scenarioCard.dataset.categoryName;
            const lang = languageSelect.value;
            const scenario = SCENARIOS[categoryName]?.[scenarioName]?.[lang];
            if (scenario) { startNewConversation(scenario); }
            return;
        }

        const viewAllBtn = e.target.closest('.view-all-btn');
        if (viewAllBtn) {
            const categoryName = viewAllBtn.dataset.categoryName;
            renderCategoryPage(categoryName);
            return;
        }

        const backBtn = e.target.closest('.back-to-home-btn');
        if (backBtn) {
            renderHomePage();
            return;
        }
        
        const customBtn = e.target.closest('#start-custom-scenario-btn');
        if (customBtn) {
            const customInput = document.getElementById('custom-scenario-input');
            const goal = customInput.value.trim();
            const apiKey = getApiKey();

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
                    startNewConversation({ name: "Cenário Personalizado", goal });
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

    // ... (Listeners de Modais inalterados) ...
    modalCloseBtn.addEventListener('click', () => feedbackModal.classList.add('modal-hidden'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.add('modal-hidden'); });
    translateBtn.addEventListener('click', handleTranslateFeedback);
    historyModalCloseBtn.addEventListener('click', () => historyModal.classList.add('modal-hidden'));
    historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.classList.add('modal-hidden'); });
    startMissionBtn.addEventListener('click', () => { missionModal.classList.add('modal-hidden'); initiateChat(); });
    missionModalCloseBtn.addEventListener('click', () => missionModal.classList.add('modal-hidden'));
    missionModal.addEventListener('click', (e) => { if(e.target === missionModal) missionModal.classList.add('modal-hidden'); });
    settingsModalCloseBtn.addEventListener('click', () => settingsModal.classList.add('modal-hidden'));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('modal-hidden'); });
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    changeApiKeyBtn.addEventListener('click', () => { settingsModal.classList.add('modal-hidden'); openApiKeyModal(false); });
    apiKeyModal.addEventListener('click', (e) => { if (!apiKeyModal.classList.contains('modal-persistent') && e.target === apiKeyModal) closeApiKeyModal(); });

    // --- Funções de Renderização de "Páginas" ---
    function renderHomePage() {
        updateActiveNavIcon('nav-home-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area';
        chatInputArea.classList.add('chat-input-hidden');
        renderScenarioPanel();
    }

    function renderCustomScenarioPage() {
        updateActiveNavIcon('nav-custom-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area custom-scenario-page';
        chatInputArea.classList.add('chat-input-hidden');
        
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

    function showCustomScenarioError(message) {
        const feedbackArea = document.getElementById('custom-scenario-feedback');
        if (feedbackArea) {
            feedbackArea.textContent = message;
            feedbackArea.style.display = 'block';
        }
    }

    function clearCustomScenarioError() {
        const feedbackArea = document.getElementById('custom-scenario-feedback');
        if (feedbackArea) {
            feedbackArea.textContent = '';
            feedbackArea.style.display = 'none';
        }
    }

    function renderHistoryPage() {
        updateActiveNavIcon('nav-history-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area history-page';
        chatInputArea.classList.add('chat-input-hidden');
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
    }

    // --- Funções de Lógica Principal de Conversa ---
    function startNewConversation(scenario) {
        if (!getApiKey()) { openApiKeyModal(true); return; }
        currentScenario = { details: scenario };
        missionGoalText.textContent = scenario.goal;
        missionModal.classList.remove('modal-hidden');
    }

    async function initiateChat() {
        if (!currentScenario) return;
        renderChatInterface();
        conversationHistory = [];
        displayMessage(`🎯 Seu Objetivo: ${currentScenario.details.goal}`, 'system');
        setLoadingState(true, true, false);
        try {
            const apiKey = getApiKey();
            if (!apiKey) throw new Error("API Key not found");
            // LIMPEZA: O 'correction' foi removido daqui
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, currentScenario.details, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            setTimeout(() => {
                removeTypingIndicator();
                displayMessage(aiResponse, 'ai');
                setLoadingState(false, true, true);
            }, TYPING_SIMULATION_DELAY);

        } catch (error) {
            const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API está configurada corretamente em Configurações ⚙️.";
            displayMessage(userFriendlyError, 'ai');
            setLoadingState(false, true, true);
        }
    }

    async function handleSendMessage() {
        if (!currentScenario) { displayMessage("Por favor, selecione um cenário.", 'ai'); return; }
        const apiKey = getApiKey();
        if (!apiKey) { openApiKeyModal(true); return; }
        const messageText = textInput.value.trim();
        if (!messageText) return;

        displayMessage(messageText, 'user');
        conversationHistory.push({ role: 'user', content: messageText });
        textInput.value = '';
        setLoadingState(true);

        try {
            // LIMPEZA: O 'correction' foi removido daqui
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(messageText, conversationHistory, apiKey, currentScenario.details, settings);

            setTimeout(() => {
                removeTypingIndicator();
                if (aiResponse.includes("[Scenario Complete]")) {
                    const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim();
                    if (cleanResponse) {
                        conversationHistory.push({ role: 'assistant', content: cleanResponse });
                        displayMessage(cleanResponse, 'ai');
                    }
                    finalizeConversation();
                } else {
                    conversationHistory.push({ role: 'assistant', content: aiResponse });
                    displayMessage(aiResponse, 'ai');
                    setLoadingState(false, true);
                }
            }, TYPING_SIMULATION_DELAY);

        } catch (error) {
            const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API está configurada corretamente em Configurações ⚙️.";
            displayMessage(userFriendlyError, 'ai');
            setLoadingState(false, true);
        }
    }

    async function finalizeConversation() {
        const apiKey = getApiKey();
        let finalScenarioName = currentScenario.details.name;
        if (currentScenario.details.name === "Cenário Personalizado") {
            try { finalScenarioName = await getScenarioTitle(currentScenario.details.goal, apiKey, languageSelect.value); } 
            catch (error) { finalScenarioName = "Custom Scenario"; }
        }
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        history.unshift({ scenarioName: finalScenarioName, scenarioGoal: currentScenario.details.goal, timestamp: new Date().getTime(), transcript: conversationHistory, feedback: '' });
        localStorage.setItem('conversationHistory', JSON.stringify(history));
        displayCompletionScreen();
        setLoadingState(false, false);
    }
    
    function displayCompletionScreen() {
        const completionContainer = document.createElement('div');
        completionContainer.className = 'completion-container';
        completionContainer.innerHTML = `<div class="message system-message"><p>🎉 Parabéns! Você completou o cenário.</p></div>`;
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'completion-actions';
        actionsContainer.innerHTML = `
            <button id="feedback-btn">Ver Feedback</button>
            <button id="next-challenge-btn">Próximo Desafio</button>
        `;
        actionsContainer.querySelector('#feedback-btn').addEventListener('click', handleGetFeedback);
        actionsContainer.querySelector('#next-challenge-btn').addEventListener('click', startNextChallenge);
        completionContainer.appendChild(actionsContainer);
        mainContentArea.appendChild(completionContainer);
        scrollToBottom();
    }
    
    function startNextChallenge() {
        const allScenarios = Object.values(SCENARIOS).flatMap(category => Object.values(category).map(scenario => scenario[languageSelect.value]));
        const currentGoal = currentScenario.details.goal;
        const availableScenarios = allScenarios.filter(s => s.goal !== currentGoal);
        if (availableScenarios.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableScenarios.length);
            startNewConversation(availableScenarios[randomIndex]);
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
            const apiKey = getApiKey();
            if (!apiKey) throw new Error("Chave de API não encontrada. Configure no menu.");

            // LIMPEZA: O 'correction' foi removido daqui
            const settings = {
                language: languageSelect.value,
                proficiency: proficiencySelect.value
            };
            
            originalFeedback = await getFeedbackForConversation(conversationHistory, apiKey, languageSelect.value, settings);
            
            const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
            if (history.length > 0 && !history[0].feedback) {
                history[0].feedback = originalFeedback;
                localStorage.setItem('conversationHistory', JSON.stringify(history));
            }
            displayFormattedFeedback(originalFeedback);
            translateBtn.classList.remove('translate-btn-hidden');
            isTranslated = false;
            translateBtn.textContent = 'Traduzir para Português';
        } catch (error) {
            feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}</p>`;
        }
    }

    // ... (resto do código, que permanece inalterado, omitido para brevidade, mas deve ser mantido no seu arquivo) ...
    async function handleTranslateFeedback() { translateBtn.disabled = true; if (isTranslated) { displayFormattedFeedback(originalFeedback); isTranslated = false; translateBtn.textContent = 'Traduzir para Português'; } else { feedbackContent.innerHTML = '<p>Traduzindo, por favor, aguarde...</p>'; try { if (!translatedFeedback) { const apiKey = getApiKey(); if (!apiKey) throw new Error("Chave de API não encontrada."); const protectedSnippets = []; const textToTranslate = originalFeedback.replace(/\*\*(.*?)\*\*/g, (match) => { protectedSnippets.push(match); return `%%PROTECTED_${protectedSnippets.length - 1}%%`; }); const translatedTextWithPlaceholders = await translateText(textToTranslate, apiKey, languageSelect.value); let finalTranslatedText = translatedTextWithPlaceholders; protectedSnippets.forEach((snippet, index) => { finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet); }); translatedFeedback = finalTranslatedText; } displayFormattedFeedback(translatedFeedback); isTranslated = true; translateBtn.textContent = 'Mostrar Original (English)'; } catch (error) { feedbackContent.innerHTML = `<p>Erro ao traduzir: ${error.message}</p>`; } } translateBtn.disabled = false; }
    function formatFeedbackText(text) { return text.replace(/### (.*)/g, '<h3>$1</h3>').replace(/^\*\s(.*?)$/gm, '<p class="feedback-item">$1</p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
    function displayFormattedFeedback(text) { feedbackContent.innerHTML = formatFeedbackText(text); }
    function updateActiveNavIcon(activeBtnId) { [navHomeBtn, navCustomBtn, navHistoryBtn, navSettingsBtn].forEach(btn => { if (btn.id === activeBtnId) { btn.classList.add('active-nav-icon'); } else { btn.classList.remove('active-nav-icon'); } }); }
    function renderScenarioPanel() { const panelContainer = document.createElement('div'); panelContainer.className = 'scenario-panel'; const categoryClassMap = { "🍔 Restaurantes e Cafés": "category-restaurantes", "✈️ Viagens e Transporte": "category-viagens", "🛒 Compras": "category-compras", "🤝 Situações Sociais": "category-sociais", "💼 Profissional": "category-profissional", "🎓 Estudos": "category-estudos", "❤️ Saúde e Bem-estar": "category-saude", "🏠 Moradia e Serviços": "category-moradia" }; Object.keys(SCENARIOS).forEach(categoryName => { const categorySection = document.createElement('section'); categorySection.className = 'panel-category-section'; const themeClass = categoryClassMap[categoryName] || 'category-profissional'; if (themeClass) { categorySection.classList.add(themeClass); } const categoryTitle = document.createElement('h2'); categoryTitle.className = 'panel-category-title'; categoryTitle.textContent = categoryName; categorySection.appendChild(categoryTitle); const cardsContainer = document.createElement('div'); cardsContainer.className = 'scenario-cards-container'; const scenariosToShow = Object.keys(SCENARIOS[categoryName]).slice(0, 4); scenariosToShow.forEach(scenarioName => { const card = document.createElement('button'); card.className = 'scenario-card'; card.textContent = scenarioName; card.dataset.categoryName = categoryName; card.dataset.scenarioName = scenarioName; cardsContainer.appendChild(card); }); categorySection.appendChild(cardsContainer); const viewAllButton = document.createElement('button'); viewAllButton.className = 'view-all-btn'; viewAllButton.textContent = 'Ver todos →'; viewAllButton.dataset.categoryName = categoryName; categorySection.appendChild(viewAllButton); panelContainer.appendChild(categorySection); }); mainContentArea.appendChild(panelContainer); }
    function renderCategoryPage(categoryName) { mainContentArea.innerHTML = ''; mainContentArea.className = 'main-content-area category-page'; const categoryContainer = document.createElement('div'); categoryContainer.className = 'category-page-container'; const header = document.createElement('div'); header.className = 'category-page-header'; const backButton = document.createElement('button'); backButton.className = 'back-to-home-btn'; backButton.innerHTML = '&#8592; Voltar'; const title = document.createElement('h2'); title.textContent = categoryName; header.appendChild(backButton); header.appendChild(title); const cardsContainer = document.createElement('div'); cardsContainer.className = 'scenario-cards-container full-view'; Object.keys(SCENARIOS[categoryName]).forEach(scenarioName => { const card = document.createElement('button'); card.className = 'scenario-card'; card.textContent = scenarioName; card.dataset.categoryName = categoryName; card.dataset.scenarioName = scenarioName; cardsContainer.appendChild(card); }); categoryContainer.appendChild(header); categoryContainer.appendChild(cardsContainer); mainContentArea.appendChild(categoryContainer); }
    function scrollToBottom() { mainContentArea.scrollTop = mainContentArea.scrollHeight; }
    function setLoadingState(isLoading, isInputEnabled = false, shouldFocus = true) { textInput.disabled = isLoading || !isInputEnabled; sendBtn.disabled = isLoading || !isInputEnabled; if (isLoading) { showTypingIndicator(); } else { removeTypingIndicator(); if (isInputEnabled && shouldFocus) { textInput.focus(); } } }
    function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }
    function initializeApp() { if (!getApiKey()) { openApiKeyModal(true); } else { renderHomePage(); } }
    initializeApp();
    function displayMessage(text, sender) { if (sender === 'ai') { removeTypingIndicator(); } if (sender === 'system') { const systemEl = document.createElement('div'); systemEl.className = 'message system-message'; systemEl.innerHTML = `<p>${text}</p>`; mainContentArea.appendChild(systemEl); } else { const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message'; messageBubble.innerHTML = `<p>${text}</p>`; if (sender === 'user') { wrapper.classList.add('user-message-wrapper'); avatar.src = AVATAR_USER_URL; avatar.alt = 'User Avatar'; messageBubble.classList.add('user-message'); } else { wrapper.classList.add('ai-message-wrapper'); avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; messageBubble.classList.add('ai-message'); } wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); } scrollToBottom(); }
    function showTypingIndicator() { if (document.getElementById('typing-indicator')) return; const wrapper = document.createElement('div'); wrapper.id = 'typing-indicator'; wrapper.className = 'message-wrapper ai-message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message ai-message'; messageBubble.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>'; wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); scrollToBottom(); }

});