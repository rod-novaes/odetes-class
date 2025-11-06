/**
 * =================================================================
 *  MÓDULO DA LOJA - Missões da Odete
 * =================================================================
 * 
 * RESPONSABILIDADES:
 * - Define os itens da loja, seus preços e seções.
 * - Gerencia o estado de quais itens foram comprados pelo usuário (via localStorage).
 * - Renderiza a interface da página da loja.
 * - Lida com a lógica de transação (compra de itens com moedas).
 * 
 * DEPENDÊNCIAS (devem ser carregadas antes deste script):
 * - `scenarios.js`: Para a lista completa de categorias.
 * - `script.js`: Para as funções `getCoins()`, `saveCoins()`, `updateActiveNavIcon()`,
 *   `triggerCoinAnimation()`, `showRewardNotification()` e elementos do DOM.
 * 
 * NOTA DE IMPLEMENTAÇÃO:
 * Este arquivo assume que as funções e variáveis globais de `script.js` estarão
 * disponíveis no escopo global quando suas funções forem chamadas.
 */

// =================================================================
//  1. CONFIGURAÇÃO DA LOJA E DADOS
// =================================================================

const STORE_CONFIG = {
    // Seção: Upgrade de Vida Real
    "🛒 Compras": { price: 80, section: "Upgrade de Vida Real" },
    "💼 Profissional": { price: 100, section: "Upgrade de Vida Real" },
    "🎓 Estudos": { price: 100, section: "Upgrade de Vida Real" },
    "🏠 Moradia e Serviços": { price: 80, section: "Upgrade de Vida Real" },
    "💕 Romance": { price: 120, section: "Upgrade de Vida Real" },
    "😅 Situações Embaraçosas": { price: 120, section: "Upgrade de Vida Real" },

    // Seção: Nível Jedi de Conversas
    "💼 Mestre das Entrevistas": { price: 180, section: "Nível Jedi de Conversas" },
    "💬 Conversa de Elevador": { price: 140, section: "Nível Jedi de Conversas" },
    "🛠️ Resolução de Conflitos": { price: 160, section: "Nível Jedi de Conversas" },
    "🍺 Bar & Happy Hour": { price: 140, section: "Nível Jedi de Conversas" },
    "🍳 Cozinhando em Casa": { price: 160, section: "Nível Jedi de Conversas" },
    "⚽ Esportes": { price: 180, section: "Nível Jedi de Conversas" },
};

const FREE_CATEGORIES = [
    "🍔 Restaurantes e Cafés",
    "🤝 Situações Sociais",
    "✈️ Viagens e Transporte",
    "🏨 Hotéis e Hospedagens", // Cenário adicionado em scenarios.js
    "🩹 Saúde e Bem-estar"
];

// =================================================================
//  2. GERENCIAMENTO DE DADOS (LocalStorage)
// =================================================================

/**
 * Retorna um array com os nomes das categorias que o usuário já comprou.
 * @returns {string[]} Array de nomes de categorias.
 */
function getPurchasedCategories() {
    return JSON.parse(localStorage.getItem('purchasedCategories') || '[]');
}

/**
 * Adiciona uma nova categoria à lista de itens comprados no localStorage.
 * @param {string} categoryName O nome da categoria a ser adicionada.
 */
function addPurchasedCategory(categoryName) {
    const purchased = getPurchasedCategories();
    if (!purchased.includes(categoryName)) {
        purchased.push(categoryName);
        localStorage.setItem('purchasedCategories', JSON.stringify(purchased));
    }
}

/**
 * Função auxiliar para expor as categorias gratuitas para outros scripts.
 * @returns {string[]} Array de nomes de categorias gratuitas.
 */
function getFreeCategories() {
    return FREE_CATEGORIES;
}

// =================================================================
//  3. LÓGICA DE TRANSAÇÃO (COMPRA)
// =================================================================

/**
 * Lida com a tentativa de compra de um pacote de cenários.
 * @param {string} categoryName O nome da categoria que o usuário está tentando comprar.
 */
function handlePurchase(categoryName) {
    const item = STORE_CONFIG[categoryName];
    if (!item) {
        console.error("Tentativa de compra de item inexistente:", categoryName);
        return;
    }

    const userCoins = getCoins();
    const itemPrice = item.price;

    if (userCoins >= itemPrice) {
        // Deduz as moedas
        const newBalance = userCoins - itemPrice;
        saveCoins(newBalance);

        // Adiciona o item à lista de comprados
        addPurchasedCategory(categoryName);

        // Feedback visual e sonoro
        triggerCoinAnimation();
        showRewardNotification(`Pacote "${categoryName}" desbloqueado!`);

        // Re-renderiza a loja para atualizar o estado do botão
        renderStorePage();
    } else {
        alert("Moedas insuficientes! Continue praticando para ganhar mais moedas e desbloquear este pacote.");
    }
}


// =================================================================
//  4. RENDERIZAÇÃO DA PÁGINA DA LOJA
// =================================================================

/**
 * Limpa a área de conteúdo principal e renderiza a interface da loja.
 */
function renderStorePage() {
    // --- 1. Preparação da Interface (Consistência com outras páginas) ---
    const mainContentArea = document.getElementById('main-content-area');
    const chatInputArea = document.querySelector('.chat-input-area');
    const bottomNavBar = document.getElementById('bottom-nav-bar');
    const heartsIndicator = document.getElementById('score-indicator');
    const exitChatBtn = document.getElementById('exit-chat-btn');
    const headerBackBtn = document.getElementById('header-back-btn');

    updateActiveNavIcon('nav-store-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area store-page'; // Classe específica para a loja
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');
    heartsIndicator.classList.add('score-indicator-hidden');
    exitChatBtn.classList.add('exit-chat-btn-hidden');
    headerBackBtn.classList.remove('back-btn-hidden'); // Mostra o botão "Voltar"

    // --- 2. Obtenção de Dados do Usuário ---
    const userCoins = getCoins();
    const purchasedCategories = getPurchasedCategories();

    // --- 3. Construção do Conteúdo da Loja ---
    const storeContainer = document.createElement('div');
    storeContainer.className = 'store-container';

    // Cabeçalho da loja com saldo do usuário
    storeContainer.innerHTML = `
        <div class="store-header">
            <h1 class="main-page-title">Loja de Pacotes</h1>
            <div class="store-coin-balance">
                Seu Saldo: <strong>${userCoins} 🪙</strong>
            </div>
            <p class="store-description">Use suas moedas para desbloquear novos pacotes de cenários e expandir sua jornada de aprendizado!</p>
        </div>
    `;

    // Organiza as categorias por seção para renderização
    const sections = {
        "Básico Que Resolve": FREE_CATEGORIES,
        "Upgrade de Vida Real": [],
        "Nível Jedi de Conversas": []
    };

    for (const categoryName in STORE_CONFIG) {
        const item = STORE_CONFIG[categoryName];
        if (sections[item.section]) {
            sections[item.section].push(categoryName);
        }
    }

    // --- 4. Renderização das Seções e Cards ---
    for (const sectionName in sections) {
        const sectionEl = document.createElement('section');
        sectionEl.className = 'store-section panel-category-section'; // Reutiliza estilo
        
        const titleEl = document.createElement('h2');
        titleEl.className = 'panel-category-title expanded'; // Inicia expandido
        titleEl.innerHTML = `<span>${sectionName}</span>`;
        sectionEl.appendChild(titleEl);

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'store-cards-container'; // Classe para os cards da loja

        sections[sectionName].forEach(categoryName => {
            const cardEl = document.createElement('div');
            cardEl.className = 'store-card';

            const itemConfig = STORE_CONFIG[categoryName];
            const isFree = FREE_CATEGORIES.includes(categoryName);
            const isPurchased = purchasedCategories.includes(categoryName);

            let buttonHtml = '';
            if (isFree || isPurchased) {
                cardEl.classList.add('purchased');
                buttonHtml = `<button class="store-card-button purchased" disabled>${isFree ? 'Incluído' : 'Adquirido'}</button>`;
            } else if (userCoins >= itemConfig.price) {
                cardEl.classList.add('available');
                buttonHtml = `<button class="store-card-button available" data-category-name="${categoryName}">Comprar (<strong>${itemConfig.price} 🪙</strong>)</button>`;
            } else {
                cardEl.classList.add('locked');
                buttonHtml = `<button class="store-card-button locked" disabled>Moedas Insuficientes (<strong>${itemConfig.price} 🪙</strong>)</button>`;
            }

            cardEl.innerHTML = `
                <div class="store-card-info">
                    <h3 class="store-card-title">${categoryName}</h3>
                    <p class="store-card-desc">Um pacote com 12 novos cenários de conversação.</p>
                </div>
                <div class="store-card-action">
                    ${buttonHtml}
                </div>
            `;
            cardsContainer.appendChild(cardEl);
        });

        sectionEl.appendChild(cardsContainer);
        storeContainer.appendChild(sectionEl);
    }

    mainContentArea.appendChild(storeContainer);
    mainContentArea.scrollTop = 0;

    // --- 5. Adição dos Event Listeners ---
    document.querySelectorAll('.store-card-button.available').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryName = e.currentTarget.dataset.categoryName;
            handlePurchase(categoryName);
        });
    });
}