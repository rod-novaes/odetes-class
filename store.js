/**
 * =================================================================
 *  MÓDULO DA LOJA - Missões da Odete
 * =================================================================
 * 
 * RESPONSABILIDADES:
 * - Define os itens da loja (utilidades e pacotes), seus preços e seções.
 * - Gerencia o estado de quais pacotes foram comprados pelo usuário (via localStorage).
 * - Renderiza a interface da página da loja.
 * - Lida com a lógica de transação (compra de itens com moedas).
 * 
 * DEPENDÊNCIAS (devem ser carregadas antes deste script):
 * - `scenarios.js`: Para a lista completa de categorias.
 * - `script.js`: Para as funções `getCoins()`, `saveCoins()`, `addHearts()`, 
 *   `updateActiveNavIcon()`, `triggerCoinAnimation()`, `showRewardNotification()` 
 *   e elementos do DOM.
 * 
 * NOTA DE IMPLEMENTAÇÃO:
 * Este arquivo assume que as funções e variáveis globais de `script.js` estarão
 * disponíveis no escopo global quando suas funções forem chamadas.
 */

// =================================================================
//  1. CONFIGURAÇÃO DA LOJA E DADOS
// =================================================================

// --- ITENS DE UTILIDADE ---
const STORE_UTILITIES = {
    "heart-refill": {
        name: "❤️ Refil de Corações",
        description: "Recarregue sua energia completamente: 10 corações.",
        price: 40,
        enabled: true
    },
    "unlimited-year": {
        name: "♾️ 1 Ano de Corações Ilimitados",
        description: "Pratique sem limites por um ano inteiro.",
        price: null,
        enabled: false
    },
    "ultimate-bundle": {
        name: "👑 Pacote Supremo",
        description: "Corações ilimitados e todos os pacotes liberados.",
        price: null,
        enabled: false
    }
};

// --- NOVA ESTRUTURA DE SEÇÕES E PACOTES DE CENÁRIOS ---
const STORE_SECTIONS = {
    "survival_kit": {
        title: "Sobrevivência Social",
        bundle: {
            id: "bundle_survival",
            name: "Kit de Sobrevivência Social",
            description: "Desbloqueie todos os 48 cenários essenciais desta seção.",
            price: 290
        },
        categories: {
            "🛒 Compras": { price: 80, description: "Suas 12 missões para dominar as lojas e mercados." },
            "🏠 Moradia e Serviços": { price: 80, description: "12 desafios para resolver as burocracias do lar." },
            "💼 Profissional": { price: 100, description: "Suas 12 ferramentas para brilhar no ambiente de trabalho." },
            "🎓 Estudos": { price: 100, description: "12 cenários para se tornar o craque da sala de aula." }
        }
    },
    "art_of_conversation": {
        title: "A Arte da Conversa",
        bundle: {
            id: "bundle_conversation",
            name: "Kit de A Arte da Conversa",
            description: "Desbloqueie todos os 48 cenários para aprimorar suas interações.",
            price: 420
        },
        categories: {
            "💕 Romance": { price: 120, description: "12 momentos para praticar a arte da conquista." },
            "😅 Situações Embaraçosas": { price: 120, description: "12 desafios para sair de qualquer saia justa com classe." },
            "💬 Conversa de Elevador": { price: 140, description: "Suas 12 chances de quebrar o gelo em segundos." },
            "🍺 Bar & Happy Hour": { price: 140, description: "12 missões para se tornar a alma da festa." }
        }
    },
    "foreigner_life": {
        title: "Vida de Estrangeiro",
        bundle: {
            id: "bundle_foreigner",
            name: "Kit de Vida de Estrangeiro",
            description: "Desbloqueie os 48 cenários mais complexos e desafiadores.",
            price: 550
        },
        categories: {
            "🛠️ Resolução de Conflitos": { price: 160, description: "12 situações para negociar e resolver qualquer impasse." },
            "🍳 Cozinhando em Casa": { price: 160, description: "12 cenários para ser o anfitrião perfeito." },
            "💼 Mestre das Entrevistas": { price: 180, description: "Suas 12 oportunidades de garantir o emprego dos sonhos." },
            "⚽ Esportes": { price: 180, description: "12 desafios para falar de esportes como um verdadeiro fã." }
        }
    }
};

const FREE_CATEGORIES = [
    "🍔 Restaurantes e Cafés",
    "🤝 Situações Sociais",
    "✈️ Viagens e Transporte",
    "🏨 Hotéis e Hospedagens",
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
 * Lida com a tentativa de compra de um pacote de cenários individual.
 * @param {string} categoryName O nome da categoria que o usuário está tentando comprar.
 */
function handleCategoryPurchase(categoryName) {
    let item = null;
    for (const sectionId in STORE_SECTIONS) {
        if (STORE_SECTIONS[sectionId].categories[categoryName]) {
            item = STORE_SECTIONS[sectionId].categories[categoryName];
            break;
        }
    }

    if (!item) {
        console.error("Tentativa de compra de pacote inexistente:", categoryName);
        return;
    }

    const userCoins = getCoins();
    if (userCoins >= item.price) {
        saveCoins(userCoins - item.price);
        addPurchasedCategory(categoryName);
        triggerCoinAnimation();
        showRewardNotification(`Pacote "${categoryName}" desbloqueado!`);
        renderStorePage();
    } else {
        alert("Moedas insuficientes! Continue praticando para ganhar mais moedas.");
    }
}

/**
 * Lida com a tentativa de compra de um pacote de seção (bundle).
 * @param {string} bundleId O ID do pacote a ser comprado.
 */
function handleBundlePurchase(bundleId) {
    let bundle;
    let sectionCategories;

    for (const sectionId in STORE_SECTIONS) {
        if (STORE_SECTIONS[sectionId].bundle.id === bundleId) {
            bundle = STORE_SECTIONS[sectionId].bundle;
            sectionCategories = Object.keys(STORE_SECTIONS[sectionId].categories);
            break;
        }
    }

    if (!bundle) {
        console.error("Tentativa de compra de pacote de seção inexistente:", bundleId);
        return;
    }

    const userCoins = getCoins();
    if (userCoins >= bundle.price) {
        saveCoins(userCoins - bundle.price);
        sectionCategories.forEach(categoryName => addPurchasedCategory(categoryName));
        triggerCoinAnimation();
        showRewardNotification(`${bundle.name} adquirido! 48 novos cenários desbloqueados!`);
        renderStorePage();
    } else {
        alert("Moedas insuficientes! Continue praticando para ganhar mais moedas.");
    }
}

/**
 * Lida com a tentativa de compra de um item de utilidade (ex: corações).
 * @param {string} utilityId O ID do item de utilidade (chave do objeto STORE_UTILITIES).
 */
function handleUtilityPurchase(utilityId) {
    const item = STORE_UTILITIES[utilityId];
    if (!item || !item.enabled) {
        console.error("Tentativa de compra de utilidade inexistente ou desabilitada:", utilityId);
        return;
    }

    const userCoins = getCoins();
    if (userCoins >= item.price) {
        saveCoins(userCoins - item.price);

        if (utilityId === 'heart-refill') {
            addHearts(10); // Função de script.js
        }
        
        triggerCoinAnimation();
        showRewardNotification(`${item.name} adquirido!`);
        renderStorePage();
    } else {
        alert("Moedas insuficientes! Continue praticando para ganhar mais moedas.");
    }
}

// =================================================================
//  4. RENDERIZAÇÃO DA PÁGINA DA LOJA
// =================================================================

/**
 * Limpa a área de conteúdo principal e renderiza a interface da loja.
 */
function renderStorePage() {
    // --- 1. Preparação da Interface ---
    const mainContentArea = document.getElementById('main-content-area');
    const chatInputArea = document.querySelector('.chat-input-area');
    const bottomNavBar = document.getElementById('bottom-nav-bar');
    const heartsIndicator = document.getElementById('score-indicator');
    const exitChatBtn = document.getElementById('exit-chat-btn');
    const headerBackBtn = document.getElementById('header-back-btn');

    updateActiveNavIcon('nav-store-btn');
    mainContentArea.innerHTML = '';
    mainContentArea.className = 'main-content-area store-page';
    chatInputArea.classList.add('chat-input-hidden');
    bottomNavBar.classList.remove('nav-hidden');
    heartsIndicator.classList.add('score-indicator-hidden');
    exitChatBtn.classList.add('exit-chat-btn-hidden');
    headerBackBtn.classList.remove('back-btn-hidden');

    // --- 2. Obtenção de Dados do Usuário ---
    const userCoins = getCoins();
    const purchasedCategories = getPurchasedCategories();

    // --- 3. Construção do Conteúdo da Loja ---
    const storeContainer = document.createElement('div');
    storeContainer.className = 'store-container';

    storeContainer.innerHTML = `
        <div class="store-header">
            <h1 class="main-page-title">Loja</h1>
            <div class="store-coin-balance">
                Seu Saldo: <strong>${userCoins} 🪙</strong>
            </div>
            <!--<p class="store-description">Use suas moedas para desbloquear pacotes de cenários ou recarregar sua energia!</p>-->
        </div>
    `;
    
    // --- 4. Renderização da Seção de Utilidades ---
    const utilitySectionEl = document.createElement('section');
    utilitySectionEl.className = 'store-section panel-category-section';
    utilitySectionEl.innerHTML = `<h2 class="panel-category-title expanded"><span>Energia e Utilidades</span></h2>`;

    const utilityCardsContainer = document.createElement('div');
    utilityCardsContainer.className = 'store-cards-container';

    for (const utilityId in STORE_UTILITIES) {
        const item = STORE_UTILITIES[utilityId];
        const cardEl = document.createElement('div');
        cardEl.className = 'store-card';

        let buttonHtml = '';
        if (!item.enabled) {
            cardEl.classList.add('disabled');
            buttonHtml = `<button class="store-card-button locked" disabled>Em Breve</button>`;
        } else if (userCoins >= item.price) {
            cardEl.classList.add('available');
            buttonHtml = `<button class="store-card-button available" data-utility-id="${utilityId}">Comprar (<strong>${item.price} 🪙</strong>)</button>`;
        } else {
            cardEl.classList.add('locked');
            buttonHtml = `<button class="store-card-button locked" disabled><strong>${item.price} 🪙</strong></button>`;
        }

        cardEl.innerHTML = `
            <div class="store-card-info">
                <h3 class="store-card-title">${item.name}</h3>
                <p class="store-card-desc">${item.description}</p>
            </div>
            <div class="store-card-action">
                ${buttonHtml}
            </div>
        `;
        utilityCardsContainer.appendChild(cardEl);
    }
    
    utilitySectionEl.appendChild(utilityCardsContainer);
    storeContainer.appendChild(utilitySectionEl);

    // --- 5. Renderização das Novas Seções de Pacotes ---
    for (const sectionId in STORE_SECTIONS) {
        const section = STORE_SECTIONS[sectionId];
        const sectionEl = document.createElement('section');
        sectionEl.className = 'store-section panel-category-section'; 
        
        const titleEl = document.createElement('h2');
        titleEl.className = 'panel-category-title expanded'; 
        titleEl.innerHTML = `<span>${section.title}</span>`;
        sectionEl.appendChild(titleEl);

        // Renderiza o card do Pacote (Bundle)
        const bundle = section.bundle;
        const bundleCardEl = document.createElement('div');
        bundleCardEl.className = 'store-card store-card-bundle';
        
        const sectionCategoryNames = Object.keys(section.categories);
        const allInCategoryPurchased = sectionCategoryNames.every(name => purchasedCategories.includes(name));

        let bundleButtonHtml = '';
        if (allInCategoryPurchased) {
            bundleCardEl.classList.add('purchased');
            bundleButtonHtml = `<button class="store-card-button purchased" disabled>Adquirido</button>`;
        } else if (userCoins >= bundle.price) {
            bundleCardEl.classList.add('available');
            bundleButtonHtml = `<button class="store-card-button available" data-bundle-id="${bundle.id}">Comprar Pacote (<strong>${bundle.price} 🪙</strong>)</button>`;
        } else {
            bundleCardEl.classList.add('locked');
            bundleButtonHtml = `<button class="store-card-button locked" disabled><strong>${bundle.price} 🪙</strong></button>`;
        }

        bundleCardEl.innerHTML = `
            <div class="store-card-info">
                <h3 class="store-card-title">${bundle.name}</h3>
                <p class="store-card-desc">${bundle.description}</p>
            </div>
            <div class="store-card-action">
                <div class="bundle-badge">Melhor Valor!</div>
                ${bundleButtonHtml}
            </div>
        `;
        sectionEl.appendChild(bundleCardEl);

        // Renderiza a grade de categorias individuais
        const gridContainer = document.createElement('div');
        gridContainer.className = 'store-cards-grid';

        sectionCategoryNames.forEach(categoryName => {
            const cardEl = document.createElement('div');
            cardEl.className = 'store-card';
            const itemConfig = section.categories[categoryName];
            const isPurchased = purchasedCategories.includes(categoryName);

            let buttonHtml = '';
            if (isPurchased) {
                cardEl.classList.add('purchased');
                buttonHtml = `<button class="store-card-button purchased" disabled>Adquirido</button>`;
            } else if (userCoins >= itemConfig.price) {
                cardEl.classList.add('available');
                buttonHtml = `<button class="store-card-button available" data-category-name="${categoryName}">Comprar (<strong>${itemConfig.price} 🪙</strong>)</button>`;
            } else {
                cardEl.classList.add('locked');
                buttonHtml = `<button class="store-card-button locked" disabled><strong>${itemConfig.price} 🪙</strong></button>`;
            }

            cardEl.innerHTML = `
                <div class="store-card-info">
                    <h3 class="store-card-title">${categoryName}</h3>
                    <p class="store-card-desc">${itemConfig.description}</p>
                </div>
                <div class="store-card-action">
                    ${buttonHtml}
                </div>
            `;
            gridContainer.appendChild(cardEl);
        });
        
        sectionEl.appendChild(gridContainer);
        storeContainer.appendChild(sectionEl);
    }

    mainContentArea.appendChild(storeContainer);
    mainContentArea.scrollTop = 0;

    // --- 6. Adição dos Event Listeners ---
    document.querySelectorAll('.store-card-button.available').forEach(button => {
        button.addEventListener('click', (e) => {
            const currentButton = e.currentTarget;
            const utilityId = currentButton.dataset.utilityId;
            const bundleId = currentButton.dataset.bundleId;
            const categoryName = currentButton.dataset.categoryName;

            if (utilityId) {
                handleUtilityPurchase(utilityId);
            } else if (bundleId) {
                handleBundlePurchase(bundleId);
            } else if (categoryName) {
                handleCategoryPurchase(categoryName);
            }
        });
    });
}