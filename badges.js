/**
 * =================================================================
 *  Banco de Dados de Emblemas (Badges) - Missões da Odete
 * =================================================================
 *
 * ESTRUTURA DE UM EMBLEMA:
 * - ... (demais propriedades) ...
 * - quote (string): NOVO! Mensagem temática exibida ao clicar em um emblema conquistado.
 */

const BADGES = {
    // ===================================
    // 1. Emblemas de Primeiros Passos (Onboarding)
    // ===================================
    "onboarding_first_mission": {
        category: "Primeiros Passos",
        secret: false,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Quebra-Gelo",
            description: "Complete sua primeira missão com sucesso.",
            icon: "🧊",
            quote: "O primeiro passo é sempre o mais difícil, e você já deu! Agora é só caminhar... ou melhor, voar!"
        }]
    },
    "onboarding_first_voice": {
        category: "Primeiros Passos",
        secret: false,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Soltando a Voz",
            description: "Use o modo de prática por voz pela primeira vez.",
            icon: "🎤",
            quote: "Gostei de ouvir sua voz! Continue falando, o mundo precisa te escutar."
        }]
    },
    "onboarding_first_custom": {
        category: "Primeiros Passos",
        secret: false,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Roteirista",
            description: "Crie e inicie seu primeiro cenário personalizado.",
            icon: "✨",
            quote: "Uau, que imaginação! Você está criando seus próprios desafios. Adorei a atitude!"
        }]
    },
    "onboarding_first_feedback": {
        category: "Primeiros Passos",
        secret: false,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Aluno da Odete",
            description: "Verifique seu primeiro feedback de desempenho.",
            icon: "🦉",
            quote: "Curiosidade é o tempero do aprendizado. Analisar o próprio progresso é coisa de gênio!"
        }]
    },

    // ===================================
    // 2. Emblemas de Consistência e Dedicação
    // ===================================
    "consistency_streak": {
        category: "Consistência",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 3,
            name: "Foguete de Fogo",
            description: "Mantenha uma sequência de 3 dias de prática.",
            icon: "🔥",
            quote: "Três dias seguidos! Você pegou fogo, hein? Cuidado pra não queimar a largada!"
        }, {
            level: "silver",
            goal: 7,
            name: "Cometa",
            description: "Mantenha uma sequência de 7 dias de prática.",
            icon: "☄️",
            quote: "Uma semana inteira! Você está passando rápido como um cometa pelo aprendizado. Brilhante!"
        }, {
            level: "gold",
            goal: 30,
            name: "Supernova",
            description: "Mantenha uma sequência de 30 dias de prática.",
            icon: "🌟",
            quote: "UM MÊS! Isso não é consistência, é uma explosão de dedicação! Você é uma estrela!"
        }]
    },
    "consistency_total_missions": {
        category: "Dedicação",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 10,
            name: "Aventureiro",
            description: "Complete 10 missões no total.",
            icon: "🗺️",
            quote: "Dez missões? Você já está mais viajado que a minha mala de rodinhas! Continue assim."
        }, {
            level: "silver",
            goal: 50,
            name: "Explorador",
            description: "Complete 50 missões no total.",
            icon: "🧭",
            quote: "Cinquenta missões! Você já desbravou mais cenários que muito guia turístico. Qual será o próximo continente... digo, categoria?"
        }, {
            level: "gold",
            goal: 100,
            name: "Lenda Viva",
            description: "Complete 100 missões no total.",
            icon: "🏆",
            quote: "CEM MISSÕES! Seus feitos serão contados em livros de história. Você não é mais um aluno, é uma lenda!"
        }]
    },

    // ===================================
    // 3. Emblemas de Maestria e Habilidade
    // ===================================
    "mastery_interaction_mode": {
        category: "Maestria",
        secret: false,
        tiers: [{
            level: "voice",
            goal: 25,
            name: "Mestre do Microfone",
            description: "Complete 25 missões usando o modo de voz.",
            icon: "🎙️",
            quote: "25 missões com a voz! Você fala com mais clareza que locutor de rádio. Alô, alô, testando o sucesso!"
        }, {
            level: "text",
            goal: 25,
            name: "Ás da Digitação",
            description: "Complete 25 missões usando o modo de texto.",
            icon: "✍️",
            quote: "25 missões no teclado! Seus dedos estão mais rápidos que um raio. Shakespeare que se cuide!"
        }]
    },
    "mastery_category_variety": {
        category: "Maestria",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Poliglota de Situações",
            description: "Complete pelo menos uma missão em 5 categorias diferentes.",
            icon: "🌐",
            quote: "Você já se virou em 5 tipos de situação. Está mais versátil que canivete suíço!"
        }, {
            level: "gold",
            goal: 8,
            name: "Globetrotter",
            description: "Complete pelo menos uma missão em TODAS as categorias disponíveis.",
            icon: "🌍",
            quote: "TODAS as categorias! Você deu a volta ao mundo das conversas. Carimbo de mestre no seu passaporte!"
        }]
    },
    "mastery_flawless": {
        category: "Maestria",
        secret: false,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Performance Impecável",
            description: "Receba um feedback com 'Nenhuma correção necessária' na seção de gramática.",
            icon: "✅",
            quote: "Uau, sem nenhuma correção? Perfeição existe e ela tem seu nome. Pode emoldurar esse feedback!"
        }]
    },
    
    // ===================================
    // 4. Emblemas de Especialista por Categoria
    // ===================================
    "category_restaurants": {
        category: "🍔 Restaurantes e Cafés",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Amante de Café",
            description: "Complete 5 missões na categoria 'Restaurantes e Cafés'.",
            icon: "☕",
            quote: "5 missões de restaurante? Você já pode pedir seu café sem gaguejar. Mas e o pão de queijo, já sabe?"
        }, {
            level: "gold",
            goal: 10,
            name: "Especialista Gourmet",
            description: "Complete 10 missões na categoria 'Restaurantes e Cafés'.",
            icon: "🍽️",
            quote: "Dez missões! Você já pode até reclamar do ponto da carne em inglês. Chique demais!"
        }]
    },
    "category_travel": {
        category: "✈️ Viagens e Transporte",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Turista",
            description: "Complete 5 missões na categoria 'Viagens e Transporte'.",
            icon: "🗺️",
            quote: "Já sabe pedir direções e fazer check-in. Cuidado pra não se perder no caminho para o sucesso!"
        }, {
            level: "gold",
            goal: 10,
            name: "Viajante Mestre",
            description: "Complete 10 missões na categoria 'Viagens e Transporte'.",
            icon: "✈️",
            quote: "Dez missões de viagem! Você lida com aeroportos como se fosse o quintal de casa. Próxima parada: fluência!"
        }]
    },
    "category_shopping": {
        category: "🛒 Compras",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Bom de Pechincha",
            description: "Complete 5 missões na categoria 'Compras'.",
            icon: "🏷️",
            quote: "Já está craque em perguntar preços e tamanhos. O próximo passo é pedir desconto!"
        }, {
            level: "gold",
            goal: 10,
            name: "Mestre das Compras",
            description: "Complete 10 missões na categoria 'Compras'.",
            icon: "🛍️",
            quote: "Devolver, reclamar, negociar... Sua sacola de habilidades está cheia! A Black Friday não te assusta mais."
        }]
    },
    "category_social": {
        category: "🤝 Situações Sociais",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Fazendo Amigos",
            description: "Complete 5 missões na categoria 'Situações Sociais'.",
            icon: "👋",
            quote: "Quebrou o gelo, elogiou, convidou... Você já é a alma da festa (ou pelo menos do ponto de ônibus)!"
        }, {
            level: "gold",
            goal: 10,
            name: "Borboleta Social",
            description: "Complete 10 missões na categoria 'Situações Sociais'.",
            icon: "💬",
            quote: "Dez missões sociais! Você flutua entre conversas com a elegância de uma borboleta. Continue espalhando simpatia!"
        }]
    },
    "category_professional": {
        category: "💼 Profissional",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Jovem Talento",
            description: "Complete 5 missões na categoria 'Profissional'.",
            icon: "📈",
            quote: "Seu inglês profissional está decolando. Logo, logo vai estar pedindo aumento!"
        }, {
            level: "gold",
            goal: 10,
            name: "Profissional de Sucesso",
            description: "Complete 10 missões na categoria 'Profissional'.",
            icon: "💼",
            quote: "Reuniões, clientes, prazos... Você domina o escritório. O CEO que se prepare!"
        }]
    },
    "category_studies": {
        category: "🎓 Estudos",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Aluno Dedicado",
            description: "Complete 5 missões na categoria 'Estudos'.",
            icon: "📚",
            quote: "Tirar dúvidas, pegar material emprestado... Você é o exemplo da turma!"
        }, {
            level: "gold",
            goal: 10,
            name: "Mente Brilhante",
            description: "Complete 10 missões na categoria 'Estudos'.",
            icon: "🎓",
            quote: "Debater, apresentar, negociar prazos... Harvard está te perdendo! Brilhante!"
        }]
    },
    "category_health": {
        category: "❤️ Saúde e Bem-estar",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Primeiros Socorros",
            description: "Complete 5 missões na categoria 'Saúde e Bem-estar'.",
            icon: "🩹",
            quote: "Já sabe descrever uma dor de cabeça e comprar um remédio. É o básico que salva!"
        }, {
            level: "gold",
            goal: 10,
            name: "Guardião da Saúde",
            description: "Complete 10 missões na categoria 'Saúde e Bem-estar'.",
            icon: "⚕️",
            quote: "Dez missões de saúde! Você explica sintomas com precisão de médico. 'An apple a day keeps the doctor away', né?"
        }]
    },
    "category_services": {
        category: "🏠 Moradia e Serviços",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Bom Vizinho",
            description: "Complete 5 missões na categoria 'Moradia e Serviços'.",
            icon: "🏘️",
            quote: "Lidar com entregas e barulho? A paz no condomínio está garantida com você."
        }, {
            level: "gold",
            goal: 10,
            name: "Síndico do Ano",
            description: "Complete 10 missões na categoria 'Moradia e Serviços'.",
            icon: "🔑",
            quote: "Vazamentos, contas, regras... Você resolve qualquer B.O. doméstico. Pode se candidatar na próxima reunião!"
        }]
    },
    "category_custom": {
        category: "✨ Cenários Personalizados",
        secret: false,
        tiers: [{
            level: "bronze",
            goal: 5,
            name: "Mente Criativa",
            description: "Complete 5 missões personalizadas.",
            icon: "💡",
            quote: "Cinco cenários da sua cabeça! Sua criatividade é o motor do seu aprendizado."
        }, {
            level: "gold",
            goal: 10,
            name: "Mestre Roteirista",
            description: "Complete 10 missões personalizadas.",
            icon: "📜",
            quote: "Dez roteiros originais! Se a vida é um palco, você está escrevendo uma peça de sucesso."
        }]
    },
    
    // ===================================
    // 5. Emblemas Especiais (Secretos)
    // ===================================
    "secret_night_owl": {
        category: "Conquistas Secretas",
        secret: true,
        tiers: [{
            level: "único",
            goal: 1,
            name: "Coruja da Madrugada",
            description: "Completou uma missão entre meia-noite e 4h da manhã.",
            icon: "🌙",
            quote: "Corujas são sábias, e você está estudando enquanto o mundo dorme. Essa dedicação vai te levar longe!"
        }]
    },
    "secret_phoenix": {
        category: "Conquistas Secretas",
        secret: true,
        tiers: [{
            level: "único",
            goal: 1,
            name: "A Fênix",
            description: "Retornou à prática após perder uma sequência de 7 dias ou mais.",
            icon: "🧡",
            quote: "Você tropeçou, mas se reergueu das cinzas mais forte do que antes. Voltar é mais difícil que começar, e você conseguiu!"
        }]
    },
    "secret_negotiator": {
        category: "Conquistas Secretas",
        secret: true,
        tiers: [{
            level: "único",
            goal: 1,
            name: "O Negociador",
            description: "Completou com sucesso a missão específica 'Pedindo um desconto'.",
            icon: "🤝",
            quote: "Conseguiu um desconto? Habilidade de mestre! Com esse poder de persuasão, você convence qualquer um."
        }]
    },
    "secret_curious": {
        category: "Conquistas Secretas",
        secret: true,
        tiers: [{
            level: "único",
            goal: 5,
            name: "Curioso",
            description: "Usou a função de tradução do feedback 5 vezes.",
            icon: "🔎",
            quote: "A tradução é uma ponte para o entendimento. Sua curiosidade em aprender o 'porquê' das coisas é sua maior força."
        }]
    }
};