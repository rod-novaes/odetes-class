/**
 * =================================================================
 *  STORYLINES.JS - O Roteiro Mestre das Séries Interativas
 * =================================================================
 */

const STORYLINES = {
    // =============================================================
    // SÉRIE 1: CARREIRA (ATUALIZADO)
    // =============================================================
    "career_main": {
        id: "career_main",
        title: "O Último Andar",
        genre: "Carreira",
        coverImage: "assets/historias/carreira.png",
        heroImage: "assets/historias/carreira.png",
        description: "Do café da universidade à sala da diretoria. Uma jornada sobre ambição, escolhas difíceis e o preço do sucesso.",
        
        roles: {
            male: "O Novo Estagiário",
            female: "A Nova Estagiária"
        },

        seasons: {
            "s1": {
                id: "s1",
                title: "Temporada 1: O Começo",
                episodes: [
                    {
                        id: "career_s1_e1",
                        title: "Episódio 1: O Começo Inesperado",
                        description: "Um café, pouco dinheiro e uma oportunidade que pode mudar tudo.",
                        coverImage: "assets/historias/carreira.png",
                        locked: false,
                        initialNodeId: "node_1",
                        
                        nodes: {
                            // PASSO 1: NARRATIVA INICIAL (SEM SPOILER)
                            "node_1": {
                                type: "narrative",
                                text: "Você conta as moedas para o café. A vida universitária não está fácil. O lugar está lotado. De repente, um homem bem vestido, com um terno impecável, aponta para a cadeira vazia à sua frente e pergunta: 'Importa-se se eu dividir a mesa com você?'.",
                                backgroundImage: "assets/series/backgrounds/carreira/cafe_table.png",
                                nextNodeId: "node_1_interaction"
                            },

                            // PASSO 1.5: INTERAÇÃO NOVA (O TESTE SECRETO)
                            "node_1_interaction": {
                                type: "interaction",
                                sourceType: "dynamic",
                                scenarioTitle: "Conversa com o Estranho",
                                scenarioGoal: "Responda a 3 perguntas do estranho educadamente.",
                                systemInstruction: "Você está num café perto de uma universidade. Você é um homem de negócios elegante e observador. Você é secretamente o Diretor de RH da Nexus Corp, mas NÃO revele isso no início. Seu objetivo é testar o usuário com 3 perguntas sobre a vida/estudos dele. REGRAS CRÍTICAS: 1. Mantenha a conversa fluindo até fazer pelo menos 3 perguntas. 2. Se o usuário der respostas curtas, pressione por mais detalhes. 3. OBRIGATÓRIO: Você SÓ PODE encerrar o cenário (usar a tag Scenario Complete) APÓS dizer a frase exata: 'Impressionante. Gostei da sua postura. Prazer, eu sou o Diretor de RH da Nexus Corp.'. NUNCA termine diálogo sem revelar que você é o Diretor de RH da Nexus Corp.",
                                aiRole: "Estranho Elegante",
                                backgroundImage: "assets/series/backgrounds/carreira/cafe_table.png",
                                nextNodeId: "node_1_transition"
                            },

                            // PASSO 1.8: TRANSIÇÃO NARRATIVA (NOVO)
                            "node_1_transition": {
                                type: "narrative",
                                text: "Após o breve diálogo, o homem se revela. Diretor de RH da Nexus Corp? A empresa mais cobiçada da cidade? O homem observa sua reação com um leve sorriso, cruza os dedos sobre a mesa e muda sua postura na cadeira. A casualidade do café desaparece instantaneamente. Ele agora te encara com o olhar afiado de um recrutador.",
                                backgroundImage: "assets/series/backgrounds/carreira/cafe_table.png",
                                nextNodeId: "node_2"
                            },

                            // PASSO 2: A ENTREVISTA (AGORA REVELADA)
                            "node_2": {
                                type: "interaction",
                                sourceType: "static",
                                baseScenarioCategory: "💼 Mestre das Entrevistas",
                                baseScenarioId: "Fazendo perguntas ao entrevistador", 
                                contextPrompt: "CONTEXTO DA CENA: O homem acabou de revelar que é Gerente de RH da Nexus Corp. O usuário ainda está processando a surpresa. O Gerente diz: 'Tenho uma vaga aberta para quem tem a sua garra. Quer fazer uma entrevista relâmpago agora mesmo?'. O objetivo agora é mostrar interesse e fazer perguntas inteligentes sobre a vaga.",
                                aiRole: "Gerente de RH (Simpático mas avaliador)",
                                backgroundImage: "assets/series/backgrounds/carreira/cafe_table.png",
                                nextNodeId: "node_3"
                            },

                            // PASSO 3: DECISÃO
                            "node_3": {
                                type: "decision",
                                text: "A conversa termina bem. O gerente deixa um cartão e um desafio. Você sai do café com o coração acelerado. Precisa contar para alguém!",
                                backgroundImage: "assets/series/backgrounds/carreira/street_day.png",
                                options: [
                                    { label: "Ligar para os pais 👪", targetNodeId: "node_3a_1" },
                                    { label: "Ligar para o melhor amigo 📱", targetNodeId: "node_3b_1" }
                                ]
                            },

                            // --- RAMO A: PAIS ---
                            "node_3a_1": {
                                type: "narrative",
                                text: "Seus pais atendem. Eles ficam felizes, mas logo a preocupação aparece: 'Filho(a), você tem provas semana que vem... será que esse estágio não vai atrapalhar seus estudos?'",
                                backgroundImage: "assets/series/backgrounds/carreira/phone_call.png",
                                nextNodeId: "node_3a_2"
                            },
                            "node_3a_2": {
                                type: "interaction",
                                sourceType: "dynamic",
                                scenarioTitle: "Convencendo os Pais",
                                scenarioGoal: "Dar 2 bons motivos para aceitar a entrevista.",
                                systemInstruction: "Você interpreta os PAIS do usuário. Vocês são amorosos, mas conservadores e muito preocupados com as notas da faculdade. O usuário quer o estágio, mas vocês acham que vai atrapalhar os estudos. O objetivo do usuário é convencer vocês dando 2 motivos (ex: experiência, dinheiro). Sejam difíceis, mas aceitem se os argumentos forem bons.",
                                aiRole: "Pais Preocupados",
                                backgroundImage: "assets/series/backgrounds/carreira/phone_call.png",
                                nextNodeId: "node_3a_3"
                            },
                            "node_3a_3": {
                                type: "decision",
                                text: "A conversa foi tensa, mas eles aceitaram. Agora, sozinho em casa, a fome aperta e a geladeira está vazia.",
                                backgroundImage: "assets/series/backgrounds/carreira/apartment_night.png",
                                options: [
                                    { label: "Pedir uma pizza 🍕", targetNodeId: "node_3a_4_pizza" },
                                    { label: "Sair para caminhar 🚶", targetNodeId: "node_3a_4_walk" }
                                ]
                            },
                            "node_3a_4_pizza": {
                                type: "interaction",
                                sourceType: "static",
                                baseScenarioCategory: "🍔 Restaurantes e Cafés", 
                                baseScenarioId: "Fazendo um pedido do cardápio", 
                                contextPrompt: "CONTEXTO: O usuário está pedindo delivery por telefone de casa. Ele está cansado e com fome. O atendente da pizzaria é rápido e direto.",
                                aiRole: "Atendente de Pizzaria",
                                backgroundImage: "assets/series/backgrounds/carreira/pizza_app.png",
                                nextNodeId: "node_end_episode"
                            },
                            "node_3a_4_walk": {
                                type: "narrative",
                                text: "Você decide economizar. O ar da noite é gelado. Enquanto caminha pelo quarteirão, você observa os prédios comerciais ao longe e visualiza seu futuro. Amanhã é o grande dia.",
                                backgroundImage: "assets/series/backgrounds/carreira/night_walk.png",
                                nextNodeId: "node_end_episode"
                            },

                            // --- RAMO B: AMIGO ---
                            "node_3b_1": {
                                type: "narrative",
                                text: "Seu amigo atende no segundo toque e grita: 'VOCÊ CONSEGUIU UMA ENTREVISTA? ISSO É INCRÍVEL! Temos que comemorar agora mesmo!'",
                                backgroundImage: "assets/series/backgrounds/carreira/phone_happy.png",
                                nextNodeId: "node_3b_2"
                            },
                            "node_3b_2": {
                                type: "interaction",
                                sourceType: "dynamic",
                                scenarioTitle: "Fofoca com o Melhor Amigo",
                                scenarioGoal: "Contar 2 detalhes sobre a empresa ou a vaga.",
                                systemInstruction: "Você é o MELHOR AMIGO do usuário. Muito energético, curioso e um pouco barulhento. Faça perguntas rápidas e empolgadas sobre a empresa, o salário e o chefe. Seu objetivo é fazer o usuário falar detalhes.",
                                aiRole: "Melhor Amigo Animado",
                                backgroundImage: "assets/series/backgrounds/carreira/phone_happy.png",
                                nextNodeId: "node_3b_3"
                            },
                            "node_3b_3": {
                                type: "decision",
                                text: "Seu amigo insiste: 'Vamos pro bar! Só umas cervejinhas pra dar sorte!'. Mas a entrevista é amanhã cedo...",
                                backgroundImage: "assets/series/backgrounds/carreira/street_night.png",
                                options: [
                                    { label: "Ir ao bar (só um pouco) 🍺", targetNodeId: "node_3b_4_bar" },
                                    { label: "Dormir cedo 😴", targetNodeId: "node_3b_4_sleep" }
                                ]
                            },
                            "node_3b_4_bar": {
                                type: "interaction",
                                sourceType: "static",
                                baseScenarioCategory: "🍺 Bar & Happy Hour",
                                baseScenarioId: "Recusando uma bebida educadamente",
                                contextPrompt: "CONTEXTO: O usuário foi ao bar, mas não quer beber muito pois tem entrevista amanhã. O amigo (IA) já pediu uma rodada e está insistindo. O usuário precisa recusar a próxima dose.",
                                aiRole: "Amigo insistente (Bêbado)",
                                backgroundImage: "assets/series/backgrounds/carreira/bar_noisy.png",
                                nextNodeId: "node_end_episode"
                            },
                            "node_3b_4_sleep": {
                                type: "narrative",
                                text: "Você explica que precisa estar 100% amanhã. Seu amigo ri, te chama de 'futuro CEO', mas entende. Você vai para a cama focado, revisando suas respostas mentais.",
                                backgroundImage: "assets/series/backgrounds/carreira/bedroom.png",
                                nextNodeId: "node_end_episode"
                            },

                            // --- FIM DO EPISÓDIO ---
                            "node_end_episode": {
                                type: "narrative",
                                text: "Fim do Episódio 1. Você sobreviveu às escolhas de hoje. O despertador está programado. Amanhã, a verdadeira escalada começa.",
                                backgroundImage: "assets/series/backgrounds/carreira/sunrise.png",
                                isEpisodeEnd: true,
                                nextEpisodeId: "career_s1_e2"
                            }
                        }
                    },
                    {
                        id: "career_s1_e2",
                        title: "Episódio 2: A Entrevista",
                        description: "Frente a frente com o destino. Você está preparado?",
                        coverImage: "assets/series/episodes/career_s1_e2.png",
                        locked: true,
                        initialNodeId: "node_1",
                        nodes: {} 
                    }
                ]
            }
        }
    },

    // =============================================================
    // SÉRIE 2: MISTÉRIO
    // =============================================================
    "mystery_main": {
        id: "mystery_main",
        title: "Sombras do Passado",
        genre: "Mistério",
        coverImage: "assets/series/covers/misterio.png",
        heroImage: "assets/series/backgrounds/misterio/hero_hotel.png",
        description: "Um hóspede desapareceu do Quarto 404. Todos no hotel parecem esconder algo.",
        roles: { male: "O Hóspede Curioso", female: "A Hóspede Curiosa" },
        seasons: {
            "s1": {
                id: "s1",
                title: "Temporada 1: O Hotel",
                episodes: [
                    {
                        id: "mystery_s1_e1",
                        title: "Episódio 1: Check-in Suspeito",
                        description: "Sua chegada ao hotel Shadow Creek numa noite chuvosa.",
                        coverImage: "assets/series/episodes/mystery_s1_e1.png",
                        locked: false,
                        initialNodeId: "node_1",
                        nodes: {
                            "node_1": {
                                type: "narrative",
                                text: "A chuva bate forte na janela do táxi. O Hotel Shadow Creek surge na neblina. Você sente um calafrio. Ao entrar, o saguão está vazio, exceto por um recepcionista que não sorri.",
                                backgroundImage: "assets/series/backgrounds/misterio/hotel_lobby.png",
                                nextNodeId: "node_2"
                            },
                            "node_2": {
                                type: "interaction",
                                sourceType: "static",
                                baseScenarioCategory: "🏨 Hotéis e Hospedagens",
                                baseScenarioId: "Fazendo check-in no hotel",
                                contextPrompt: "CONTEXTO: Hotel antigo e assustador. O recepcionista é evasivo e estranho. Ele avisa para não sair do quarto à noite.",
                                aiRole: "Recepcionista Sinistro",
                                backgroundImage: "assets/series/backgrounds/misterio/reception.png",
                                nextNodeId: "node_end"
                            },
                            "node_end": {
                                type: "narrative",
                                text: "Você pega a chave pesada de metal. Quarto 404. O jogo começou.",
                                isEpisodeEnd: true,
                                nextEpisodeId: "mystery_s1_e2"
                            }
                        }
                    }
                ]
            }
        }
    },

    // =============================================================
    // SÉRIE 3: ROMANCE
    // =============================================================
    "romance_main": {
        id: "romance_main",
        title: "Encontro em Paris",
        genre: "Romance",
        coverImage: "assets/series/covers/romance.png",
        heroImage: "assets/series/backgrounds/romance/hero_paris.png",
        description: "Cidade nova, vida nova. Será que o amor fala a mesma língua que você?",
        roles: { male: "O Viajante Sonhador", female: "A Viajante Sonhadora" },
        seasons: {
            "s1": {
                id: "s1",
                title: "Temporada 1: O Primeiro Olhar",
                episodes: [
                    {
                        id: "romance_s1_e1",
                        title: "Episódio 1: O Café",
                        description: "Um dia chuvoso, um livro e um esbarrão que muda tudo.",
                        coverImage: "assets/series/episodes/romance_s1_e1.png",
                        locked: false,
                        initialNodeId: "node_1",
                        nodes: {
                            "node_1": {
                                type: "narrative",
                                text: "Paris é linda, mesmo na chuva. Você corre para se abrigar na livraria Shakespeare & Co. Ao virar no corredor de poesia, você esbarra em alguém.",
                                backgroundImage: "assets/series/backgrounds/romance/bookstore.png",
                                nextNodeId: "node_2"
                            },
                            "node_2": {
                                type: "interaction",
                                sourceType: "static",
                                baseScenarioCategory: "😅 Situações Embaraçosas",
                                baseScenarioId: "Derrubando café em alguém", 
                                contextPrompt: "CONTEXTO: Livraria charmosa. Vocês derrubaram livros, não café. O clima é de 'meet-cute' de comédia romântica. O NPC deve ser charmoso e rir da situação.",
                                aiRole: "O Estranho Charmoso",
                                backgroundImage: "assets/series/backgrounds/romance/books_floor.png",
                                nextNodeId: "node_end"
                            },
                            "node_end": {
                                type: "narrative",
                                text: "Vocês trocam sorrisos enquanto juntam os livros. Talvez Paris não seja tão solitária assim.",
                                isEpisodeEnd: true,
                                nextEpisodeId: "romance_s1_e2"
                            }
                        }
                    }
                ]
            }
        }
    }
};