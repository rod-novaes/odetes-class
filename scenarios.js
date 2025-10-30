/**
 * =================================================================
 *  Banco de Dados de Cenários - Odete's English Class
 * =================================================================
 * 
 * ESTRUTURA ATUALIZADA:
 * Cada cenário agora contém um objeto "pt-BR" para a língua nativa
 * e um objeto "en-US" para a língua de estudo.
 * 
 * - "pt-BR": Contém o 'goal' (objetivo) em português, exibido nos modais de missão.
 * - "en-US": Contém o 'name' (nome) e o 'goal' (objetivo) em inglês, usados na tela de chat para imersão.
 * - "image": Permanece no mesmo nível para ser compartilhado entre os idiomas.
 * 
 */

const SCENARIOS = {
    "🍔 Restaurantes e Cafés": {
        "Pedindo um café simples": {
            "pt-BR": {
                goal: "Vá a uma cafeteria e peça um café preto para levar."
            },
            "en-US": {
                name: "Ordering a simple coffee",
                goal: "Go to a coffee shop and order one black coffee to go."
            },
            image: "assets/restaurantes/pedindo-cafe.jpg"
        },
        "Pedindo a conta": {
            "pt-BR": {
                goal: "Você terminou sua refeição. Chame a atenção do garçom e peça a conta."
            },
            "en-US": {
                name: "Asking for the check",
                goal: "You have finished your meal. Get the waiter's attention and ask for the check."
            },
            image: "assets/restaurantes/pedindo-a-conta.jpg"
        },
        "Pedindo uma mesa para dois": {
            "pt-BR": {
                goal: "Entre em um restaurante e peça ao anfitrião uma mesa para duas pessoas."
            },
            "en-US": {
                name: "Asking for a table for two",
                goal: "Enter a restaurant and ask the host for a table for two people."
            },
            image: "assets/restaurantes/pedindo-mesa.jpg"
        },
        "Fazendo um pedido do cardápio": {
            "pt-BR": {
                goal: "O garçom está pronto para anotar seu pedido. Peça um cheeseburger com batatas fritas e um refrigerante."
            },
            "en-US": {
                name: "Ordering from the menu",
                goal: "The waiter is ready to take your order. Order a cheeseburger with fries and a soda."
            },
            image: "assets/restaurantes/vendo-menu.jpg"
        },
        "Reservando uma mesa por telefone": {
            "pt-BR": {
                goal: "Ligue para um restaurante e reserve uma mesa para quatro pessoas para esta sexta-feira às 20h."
            },
            "en-US": {
                name: "Booking a table by phone",
                goal: "Call a restaurant and book a table for four people for this Friday at 8 PM."
            },
            image: "assets/restaurantes/reservando-mesa.jpg"
        },
        "Perguntando sobre ingredientes (alergia)": {
            "pt-BR": {
                goal: "Pergunte ao garçom se o prato de macarrão com frango contém alguma oleaginosa, pois você tem alergia."
            },
            "en-US": {
                name: "Asking about ingredients (allergy)",
                goal: "Ask the waiter if the chicken pasta dish contains any nuts, as you have an allergy."
            },
            image: "assets/restaurantes/perguntando-sobre-ingredientes.jpg"
        },
        "Pedindo recomendações ao garçom": {
            "pt-BR": {
                goal: "Você está indeciso. Pergunte ao garçom qual é o prato mais popular do cardápio."
            },
            "en-US": {
                name: "Asking the waiter for recommendations",
                goal: "You are undecided. Ask the waiter what the most popular dish on the menu is."
            },
            image: "assets/restaurantes/perguntando-ao-garcom.jpg"
        },
        "Reclamando de um prato frio": {
            "pt-BR": {
                goal: "Seu bife chegou frio. Chame educadamente a atenção do garçom e peça para aquecê-lo."
            },
            "en-US": {
                name: "Complaining about a cold dish",
                goal: "Your steak has arrived cold. Politely get the waiter's attention and ask them to heat it up."
            },
            image: "assets/restaurantes/reclamando-ao-garcom.jpg"
        },
        "Pedindo para dividir a conta": {
            "pt-BR": {
                goal: "Você comeu com um amigo. Pergunte ao garçom se é possível dividir a conta igualmente entre duas pessoas."
            },
            "en-US": {
                name: "Asking to split the check",
                goal: "You ate with a friend. Ask the waiter if it's possible to split the check evenly between two people."
            },
            image: "assets/restaurantes/dividindo-a-conta.jpg"
        },
        "Reclamando de um item errado no pedido": {
            "pt-BR": {
                goal: "Você pediu uma pizza vegetariana, mas recebeu uma com pepperoni. Informe o garçom sobre o erro."
            },
            "en-US": {
                name: "Complaining about a wrong item in the order",
                goal: "You ordered a vegetarian pizza, but you received one with pepperoni. Inform the waiter about the mistake."
            },
            image: "assets/restaurantes/reclamando-da-pizza.jpg"
        },
        "Questionando um valor na conta": {
            "pt-BR": {
                goal: "Você viu uma cobrança extra na sua conta por uma bebida que não pediu. Peça ao garçom para explicar e corrigir."
            },
            "en-US": {
                name: "Questioning a charge on the bill",
                goal: "You see an extra charge on your bill for a drink you didn't order. Ask the waiter to explain and correct it."
            },
            image: "assets/restaurantes/reclamando-da-conta.jpg"
        },
        "Reclamando do serviço com o gerente": {
            "pt-BR": {
                goal: "O serviço foi extremamente lento e o garçom foi rude. Peça para falar com o gerente para fazer uma reclamação formal."
            },
            "en-US": {
                name: "Complaining about the service to the manager",
                goal: "The service has been extremely slow and the waiter was rude. Ask to speak to the manager to make a formal complaint."
            },
            image: "assets/restaurantes/reclamando-com-gerente.jpg"
        }
    },

    "✈️ Viagens e Transporte": {
        "Comprando um bilhete de metrô": {
            "pt-BR": {
                goal: "Vá a uma máquina de bilhetes ou guichê e compre um bilhete para uma única viagem."
            },
            "en-US": {
                name: "Buying a subway ticket",
                goal: "Go to a ticket machine or counter and buy one single-journey ticket."
            },
            image: "assets/viagens/comprando-bilhete-do-metro.png"
        },
        "Pedindo direções na rua": {
            "pt-BR": {
                goal: "Você está perdido. Pergunte a uma pessoa na rua como chegar ao museu mais próximo."
            },
            "en-US": {
                name: "Asking for directions on the street",
                goal: "You are lost. Ask a person on the street how to get to the nearest museum."
            },
            image: "assets/viagens/pedindo-direcoes.png"
        },
        "Fazendo check-in no voo": {
            "pt-BR": {
                goal: "Vá ao balcão da companhia aérea, diga que quer fazer o check-in para seu voo para Nova York e que tem uma mala para despachar."
            },
            "en-US": {
                name: "Checking in for a flight",
                goal: "Go to the airline counter, say you want to check in for your flight to New York, and that you have one bag to check."
            },
            image: "assets/viagens/fazendo-check-in.png"
        },
        "Passando pela segurança do aeroporto": {
            "pt-BR": {
                goal: "Um agente pede para você remover seu laptop da bolsa e tirar os sapatos. Confirme e siga as instruções."
            },
            "en-US": {
                name: "Going through airport security",
                goal: "An agent asks you to remove your laptop from your bag and take off your shoes. Acknowledge and follow the instructions."
            },
            image: "assets/viagens/passando-pela-seguranca.png"
        },
        "Fazendo check-in no hotel": {
            "pt-BR": {
                goal: "Faça o check-in no hotel com uma reserva no nome 'Alex Smith' para duas noites."
            },
            "en-US": {
                name: "Checking into a hotel",
                goal: "Check into the hotel with a reservation under the name 'Alex Smith' for two nights."
            },
            image: "assets/viagens/fazendo-check-in-no-hotel.png"
        },
        "Pedindo informações no aeroporto": {
            "pt-BR": {
                goal: "Pergunte a um funcionário da companhia aérea onde fica o portão de embarque para o voo BA249 para Londres."
            },
            "en-US": {
                name: "Asking for information at the airport",
                goal: "Ask an airline employee where the departure gate for flight BA249 to London is."
            },
            image: "assets/viagens/pedindo-informacoes-no-aeroporto.png"
        },
        "Reportando uma bagagem perdida": {
            "pt-BR": {
                goal: "Sua mala despachada não chegou. Vá ao balcão de achados e perdidos e reporte o desaparecimento da sua mala."
            },
            "en-US": {
                name: "Reporting a lost baggage",
                goal: "Your checked bag did not arrive. Go to the lost and found desk and report your missing suitcase."
            },
            image: "assets/viagens/reportando-bagagem-perdida.png"
        },
        "Perguntando sobre um voo atrasado": {
            "pt-BR": {
                goal: "Seu voo está atrasado. Pergunte a um funcionário da companhia aérea o novo horário de partida e o motivo do atraso."
            },
            "en-US": {
                name: "Asking about a delayed flight",
                goal: "Your flight is delayed. Ask an airline employee for the new departure time and the reason for the delay."
            },
            image: "assets/viagens/perguntando-sobre-voo.png"
        },
        "Alugando um carro": {
            "pt-BR": {
                goal: "Vá a um balcão de aluguel de carros. Diga que você tem uma reserva para um carro compacto e pergunte sobre as opções de seguro."
            },
            "en-US": {
                name: "Renting a car",
                goal: "Go to a car rental desk. Say you have a reservation for a compact car and ask about insurance options."
            },
            image: "assets/viagens/alugando-carro.png"
        },
        "Reclamando do barulho no quarto do hotel": {
            "pt-BR": {
                goal: "O quarto ao lado do seu está fazendo muito barulho tarde da noite. Ligue para a recepção para reclamar e pedir que intervenham."
            },
            "en-US": {
                name: "Complaining about noise in the hotel room",
                goal: "The room next to yours is being very loud late at night. Call the front desk to complain and ask them to intervene."
            },
            image: "assets/viagens/reclamando-do-barulho.png"
        },
        "Tentando remarcar um voo cancelado": {
            "pt-BR": {
                goal: "Seu voo foi cancelado devido ao mau tempo. Vá ao balcão da companhia aérea e peça para ser remarcado no próximo voo disponível."
            },
            "en-US": {
                name: "Trying to rebook a cancelled flight",
                goal: "Your flight was cancelled due to weather. Go to the airline counter and ask to be booked on the next available flight."
            },
            image: "assets/viagens/remarcando-voo.png"
        },
        "Resolvendo um problema na conta do hotel": {
            "pt-BR": {
                goal: "Você está fazendo o check-out e vê cobranças do frigobar que não consumiu. Explique a situação à recepcionista e peça para removerem as cobranças."
            },
            "en-US": {
                name: "Resolving a hotel bill issue",
                goal: "You are checking out and see charges from the minibar that you did not consume. Explain the situation to the receptionist and ask for the charges to be removed."
            },
            image: "assets/viagens/resolvendo-problema-na-conta-do-hotel.png"
        }
    },

    "🛒 Compras": {
        "Perguntando o preço de um item": {
            "pt-BR": {
                goal: "Você encontrou uma camisa que gostou, mas ela não tem etiqueta de preço. Pergunte a um vendedor quanto custa."
            },
            "en-US": {
                name: "Asking for the price of an item",
                goal: "Find a shirt you like but it doesn't have a price tag. Ask a shop assistant how much it costs."
            },
            image: "assets/compras/perguntando-preco.png"
        },
        "Procurando por um produto": {
            "pt-BR": {
                goal: "Você está em um supermercado. Pergunte a um funcionário em qual corredor você pode encontrar macarrão."
            },
            "en-US": {
                name: "Looking for a product",
                goal: "You are in a supermarket. Ask an employee in which aisle you can find pasta."
            },
            image: "assets/compras/procurando-produto.png"
        },
        "Pagando pelas compras": {
            "pt-BR": {
                goal: "Você está no caixa. Diga que gostaria de pagar com cartão de crédito."
            },
            "en-US": {
                name: "Paying for your shopping",
                goal: "You are at the cashier. Say you would like to pay with a credit card."
            },
            image: "assets/compras/pagando-compras.png"
        },
        "Pedindo um tamanho ou cor diferente": {
            "pt-BR": {
                goal: "Pergunte a um vendedor se ele tem uma camiseta azul no tamanho médio."
            },
            "en-US": {
                name: "Asking for a different size or color",
                goal: "Ask a shop assistant if they have a blue T-shirt in a medium size."
            },
            image: "assets/compras/pedindo-cor-diferente.png"
        },
        "Perguntando onde ficam os provadores": {
            "pt-BR": {
                goal: "Você quer experimentar uma calça jeans. Pergunte a um funcionário da loja onde ficam os provadores."
            },
            "en-US": {
                name: "Asking for the fitting rooms",
                goal: "You want to try on some jeans. Ask a store employee where the fitting rooms are."
            },
            image: "assets/compras/perguntando-sobre-provadores.png"
        },
        "Devolvendo um item com defeito": {
            "pt-BR": {
                goal: "Devolva um fone de ouvido que parou de funcionar depois de um dia. Você tem o recibo e quer um reembolso."
            },
            "en-US": {
                name: "Returning a faulty item",
                goal: "Return a pair of headphones that stopped working after one day. You have the receipt and want a refund."
            },
            image: "assets/compras/devolvendo-item.png"
        },
        "Perguntando sobre a política de devolução": {
            "pt-BR": {
                goal: "Antes de comprar um presente, pergunte ao caixa quantos dias a pessoa tem para devolver ou trocar o item."
            },
            "en-US": {
                name: "Asking about the return policy",
                goal: "Before buying a gift, ask the cashier how many days the person has to return or exchange the item."
            },
            image: "assets/compras/perguntando-sobre-devolução.png"
        },
        "Pedindo um desconto": {
            "pt-BR": {
                goal: "Você está comprando um modelo de TV de mostruário que tem um pequeno arranhão. Pergunte ao gerente se ele pode oferecer um desconto."
            },
            "en-US": {
                name: "Asking for a discount",
                goal: "You are buying a display model of a TV that has a small scratch. Ask the manager if they can offer a discount."
            },
            image: "assets/compras/pedindo-desconto.png"
        },
        "Inscrevendo-se em um programa de fidelidade": {
            "pt-BR": {
                goal: "O caixa pergunta se você quer participar do programa de fidelidade gratuito. Pergunte quais são os benefícios antes de decidir."
            },
            "en-US": {
                name: "Signing up for a loyalty program",
                goal: "The cashier asks if you want to join their free loyalty program. Ask what the benefits are before deciding."
            },
            image: "assets/compras/inscrevendo-fidelidade.png"
        },
        "Reportando um produto vencido na prateleira": {
            "pt-BR": {
                goal: "Você encontrou uma caixa de leite na prateleira que está com a data de validade vencida. Informe educadamente um funcionário da loja."
            },
            "en-US": {
                name: "Reporting an expired product on the shelf",
                goal: "You found a carton of milk on the shelf that is past its expiration date. Politely inform a store employee."
            },
            image: "assets/compras/reportando-produto-vencido.png"
        },
        "Reclamando de propaganda enganosa": {
            "pt-BR": {
                goal: "Um item foi anunciado com um preço especial, mas passou no caixa com o preço cheio. Mostre o anúncio ao caixa e peça para honrarem o desconto."
            },
            "en-US": {
                name: "Complaining about false advertising",
                goal: "An item was advertised at a special price, but it scanned at the full price. Show the advertisement to the cashier and ask them to honor the discount."
            },
            image: "assets/compras/reclamando-sobre-anuncio.png"
        },
        "Falando com o gerente da loja": {
            "pt-BR": {
                goal: "Um vendedor foi muito inútil e rude. Peça para falar com o gerente da loja para relatar o incidente."
            },
            "en-US": {
                name: "Speaking with the store manager",
                goal: "A salesperson was very unhelpful and rude. Ask to speak to the store manager to report the incident."
            },
            image: "assets/compras/falando-com-gerente.png"
        }
    },

    "🤝 Situações Sociais": {
        "Apresentando-se em uma festa": {
            "pt-BR": {
                goal: "Você está em uma festa. Apresente-se a uma nova pessoa e pergunte o que ela faz da vida."
            },
            "en-US": {
                name: "Introducing yourself at a party",
                goal: "You are at a party. Introduce yourself to a new person and ask them what they do for a living."
            }
        },
        "Falando sobre o tempo": {
            "pt-BR": {
                goal: "Inicie uma conversa fiada com alguém em um ponto de ônibus. Faça um comentário sobre o tempo bonito."
            },
            "en-US": {
                name: "Talking about the weather",
                goal: "Start a small talk conversation with someone at a bus stop. Make a comment about the beautiful weather."
            }
        },
        "Elogiando alguém": {
            "pt-BR": {
                goal: "Você gostou do novo corte de cabelo do seu colega. Faça um elogio a ele."
            },
            "en-US": {
                name: "Giving a compliment",
                goal: "You like your colleague's new haircut. Give them a compliment."
            }
        },
        "Convidando um amigo para um café": {
            "pt-BR": {
                goal: "Pergunte ao seu amigo se ele está livre para tomar um café juntos em algum momento desta semana."
            },
            "en-US": {
                name: "Inviting a friend for coffee",
                goal: "Ask your friend if they are free to get a coffee together sometime this week."
            }
        },
        "Aceitando um convite": {
            "pt-BR": {
                goal: "Um amigo te convida para a festa de aniversário dele no sábado. Aceite o convite com entusiasmo e pergunte se deve levar alguma coisa."
            },
            "en-US": {
                name: "Accepting an invitation",
                goal: "A friend invites you to their birthday party on Saturday. Enthusiastically accept the invitation and ask if you should bring anything."
            }
        },
        "Recusando um convite educadamente": {
            "pt-BR": {
                goal: "Um colega te convida para ir ao cinema, mas você já tem planos. Recuse educadamente e agradeça pelo convite."
            },
            "en-US": {
                name: "Declining an invitation politely",
                goal: "A colleague invites you to a movie, but you already have plans. Politely decline and thank them for the invitation."
            }
        },
        "Pedindo um favor a um vizinho": {
            "pt-BR": {
                goal: "Você vai sair de férias. Pergunte ao seu vizinho se ele poderia regar suas plantas para você enquanto estiver fora."
            },
            "en-US": {
                name: "Asking a neighbor for a favor",
                goal: "You are going on vacation. Ask your neighbor if they could water your plants for you while you're away."
            }
        },
        "Contando sobre seu fim de semana": {
            "pt-BR": {
                goal: "Um colega de trabalho pergunta o que você fez no fim de semana. Descreva brevemente uma ou duas atividades que você fez."
            },
            "en-US": {
                name: "Telling about your weekend",
                goal: "A coworker asks you what you did over the weekend. Briefly describe one or two activities you did."
            }
        },
        "Juntando-se a uma conversa em andamento": {
            "pt-BR": {
                goal: "Seus amigos estão discutindo um filme que você já viu. Encontre um bom momento para entrar na conversa e compartilhar sua opinião."
            },
            "en-US": {
                name: "Joining an ongoing conversation",
                goal: "Your friends are discussing a movie you've seen. Find a good moment to join the conversation and share your opinion."
            }
        },
        "Discordando educadamente de uma opinião": {
            "pt-BR": {
                goal: "Alguém diz que não gosta de um livro que você ama. Expresse sua opinião diferente de forma respeitosa."
            },
            "en-US": {
                name: "Disagreeing politely with an opinion",
                goal: "Someone says they dislike a book that you love. Express your different opinion respectfully."
            }
        },
        "Terminando uma conversa educadamente": {
            "pt-BR": {
                goal: "Você está conversando com alguém há um tempo, mas agora precisa ir embora. Termine a conversa educadamente."
            },
            "en-US": {
                name: "Ending a conversation politely",
                goal: "You have been talking to someone for a while, but now you need to leave. Politely end the conversation."
            }
        },
        "Confortando um amigo": {
            "pt-BR": {
                goal: "Seu amigo está triste porque teve um dia ruim no trabalho. Ofereça palavras de conforto e apoio."
            },
            "en-US": {
                name: "Comforting a friend",
                goal: "Your friend is sad because they had a bad day at work. Offer words of comfort and support."
            }
        }
    },

    "💼 Profissional": {
        "Entrevista: 'Fale-me sobre você'": {
            "pt-BR": {
                goal: "Você está em uma entrevista de emprego. Responda à pergunta: 'Fale-me um pouco sobre você'."
            },
            "en-US": {
                name: "Interview: 'Tell me about yourself'",
                goal: "You are in a job interview. Answer the question: 'Tell me a little about yourself'."
            }
        },
        "Apresentando-se a um colega": {
            "pt-BR": {
                goal: "É seu primeiro dia. Apresente-se a um novo membro da equipe e pergunte no que ele está trabalhando."
            },
            "en-US": {
                name: "Introducing yourself to a colleague",
                goal: "It's your first day. Introduce yourself to a new team member and ask what they are working on."
            }
        },
        "Pedindo ajuda a um colega": {
            "pt-BR": {
                goal: "Você está com dificuldades em uma tarefa. Pergunte a um colega mais experiente se ele tem um momento para te ajudar."
            },
            "en-US": {
                name: "Asking a colleague for help",
                goal: "You are stuck on a task. Ask a more experienced colleague if they have a moment to help you."
            }
        },
        "Agendando uma reunião": {
            "pt-BR": {
                goal: "Envie uma mensagem ou fale com um colega de trabalho para agendar uma reunião de 30 minutos para amanhã para discutir o novo projeto."
            },
            "en-US": {
                name: "Scheduling a meeting",
                goal: "Send a message or talk to a coworker to schedule a 30-minute meeting for tomorrow to discuss the new project."
            }
        },
        "Dando uma atualização em uma reunião": {
            "pt-BR": {
                goal: "Em uma reunião de equipe, seu gerente pergunta sobre seu progresso. Dê uma breve atualização sobre o que você concluiu na semana passada."
            },
            "en-US": {
                name: "Giving an update in a meeting",
                goal: "In a team meeting, your manager asks for your progress. Give a brief update on what you completed last week."
            }
        },
        "Pedindo feedback sobre seu trabalho": {
            "pt-BR": {
                goal: "Você acabou de terminar um relatório. Pergunte ao seu gerente se ele tem tempo para revisá-lo e te dar algum feedback."
            },
            "en-US": {
                name: "Asking for feedback on your work",
                goal: "You have just finished a report. Ask your manager if they have time to review it and give you some feedback."
            }
        },
        "Avisando que vai se atrasar": {
            "pt-BR": {
                goal: "Você está preso no trânsito e vai se atrasar 15 minutos para o trabalho. Ligue ou mande uma mensagem para seu chefe para informá-lo."
            },
            "en-US": {
                name: "Informing you will be late",
                goal: "You are stuck in traffic and will be 15 minutes late for work. Call or message your boss to inform them."
            }
        },
        "Lidando com uma ligação de cliente": {
            "pt-BR": {
                goal: "Atenda uma ligação de um cliente que quer saber o status do pedido dele."
            },
            "en-US": {
                name: "Handling a customer call",
                goal: "Answer a phone call from a customer who wants to know the status of their order."
            }
        },
        "Apresentando uma ideia simples": {
            "pt-BR": {
                goal: "Você tem uma ideia para melhorar um processo. Explique brevemente sua ideia para sua equipe durante uma sessão de brainstorming."
            },
            "en-US": {
                name: "Pitching a simple idea",
                goal: "You have an idea to improve a process. Briefly explain your idea to your team during a brainstorming session."
            }
        },
        "Discordando de uma decisão em uma reunião": {
            "pt-BR": {
                goal: "Em uma reunião, uma decisão é tomada com a qual você não concorda. Expresse educadamente sua preocupação e explique seu raciocínio."
            },
            "en-US": {
                name: "Disagreeing with a decision in a meeting",
                goal: "In a meeting, a decision is made that you disagree with. Politely express your concern and explain your reasoning."
            }
        },
        "Negociando um prazo": {
            "pt-BR": {
                goal: "Seu chefe te dá uma nova tarefa com um prazo apertado. Explique sua carga de trabalho atual e pergunte se o prazo pode ser estendido."
            },
            "en-US": {
                name: "Negotiating a deadline",
                goal: "Your boss gives you a new task with a tight deadline. Explain your current workload and ask if the deadline can be extended."
            }
        },
        "Lidando com um cliente irritado": {
            "pt-BR": {
                goal: "Um cliente liga para reclamar com raiva de um produto. Ouça o problema dele, peça desculpas pelo inconveniente e ofereça uma solução."
            },
            "en-US": {
                name: "Dealing with an angry customer",
                goal: "A customer calls to complain angrily about a product. Listen to their problem, apologize for the inconvenience, and offer a solution."
            }
        }
    },
    
    "🎓 Estudos": {
        "Apresentando-se na aula": {
            "pt-BR": {
                goal: "É o primeiro dia de aula e o professor pede para todos se apresentarem. Diga seu nome, de onde você é e por que está fazendo a aula."
            },
            "en-US": {
                name: "Introducing yourself in class",
                goal: "It's the first day of class and the teacher asks everyone to introduce themselves. State your name, where you are from, and why you are taking the class."
            }
        },
        "Pedindo material emprestado": {
            "pt-BR": {
                goal: "Você esqueceu sua caneta. Peça educadamente ao colega ao seu lado se pode pegar uma emprestada."
            },
            "en-US": {
                name: "Borrowing class material",
                goal: "You forgot your pen. Politely ask the classmate next to you if you can borrow one."
            }
        },
        "Pedindo ajuda na biblioteca": {
            "pt-BR": {
                goal: "Você não consegue encontrar um livro para seu trabalho de pesquisa. Peça ajuda ao bibliotecário para localizá-lo."
            },
            "en-US": {
                name: "Asking for help at the library",
                goal: "You can't find a book for your research paper. Ask the librarian for help locating it."
            }
        },
        "Tirando uma dúvida com o professor": {
            "pt-BR": {
                goal: "Após a aula, aproxime-se do professor para fazer uma pergunta e esclarecer um conceito que você não entendeu."
            },
            "en-US": {
                name: "Asking a professor a question",
                goal: "After the lecture, approach the professor to ask a question to clarify a concept you didn't understand."
            }
        },
        "Combinando um estudo em grupo": {
            "pt-BR": {
                goal: "Converse com seus colegas e sugira estudarem juntos para a próxima prova. Proponha um horário e um local."
            },
            "en-US": {
                name: "Arranging a group study session",
                goal: "Talk to your classmates and suggest studying together for the upcoming exam. Propose a time and place."
            }
        },
        "Discutindo um projeto em grupo": {
            "pt-BR": {
                goal: "Você está em uma reunião com seu grupo de projeto. Sua tarefa é delegar responsabilidades para cada parte do projeto."
            },
            "en-US": {
                name: "Discussing a group project",
                goal: "You are in a meeting with your project group. Your task is to delegate responsibilities for each part of the project."
            }
        },
        "Marcando uma reunião com um orientador": {
            "pt-BR": {
                goal: "Você precisa discutir sua seleção de cursos para o próximo semestre. Escreva um e-mail ou fale com o orientador acadêmico para agendar uma reunião."
            },
            "en-US": {
                name: "Scheduling a meeting with an advisor",
                goal: "You need to discuss your course selection for the next semester. Write an email or talk to the academic advisor to schedule an appointment."
            }
        },
        "Informando uma ausência ao professor": {
            "pt-BR": {
                goal: "Você está doente e não poderá comparecer à aula amanhã. Informe seu professor e pergunte sobre qualquer material que você perderá."
            },
            "en-US": {
                name: "Informing a professor about an absence",
                goal: "You are sick and cannot attend class tomorrow. Inform your professor and ask about any material you will miss."
            }
        },
        "Debatendo um tópico em sala": {
            "pt-BR": {
                goal: "O professor apresenta um tópico para debate. Expresse sua opinião sobre o tópico e forneça um motivo para apoiá-la."
            },
            "en-US": {
                name: "Debating a topic in the classroom",
                goal: "The teacher presents a topic for debate. Express your opinion on the topic and provide one reason to support it."
            }
        },
        "Pedindo uma extensão de prazo": {
            "pt-BR": {
                goal: "Você tem muitos trabalhos para entregar ao mesmo tempo. Peça educadamente ao seu professor se é possível obter uma pequena extensão no seu trabalho."
            },
            "en-US": {
                name: "Asking for a deadline extension",
                goal: "You have too many assignments due at the same time. Politely ask your professor if it is possible to get a small extension on your paper."
            }
        },
        "Apresentando um trabalho para a turma": {
            "pt-BR": {
                goal: "É a sua vez de apresentar. Comece sua apresentação introduzindo seu tópico para a turma."
            },
            "en-US": {
                name: "Presenting a project to the class",
                goal: "It's your turn to present. Start your presentation by introducing your topic to the class."
            }
        },
        "Resolvendo um conflito em um grupo de estudo": {
            "pt-BR": {
                goal: "Um membro do seu grupo não está fazendo sua parte do trabalho. Você precisa conversar com ele sobre a importância de sua contribuição."
            },
            "en-US": {
                name: "Resolving a conflict in a study group",
                goal: "One member of your group is not doing their part of the work. You need to talk to them about the importance of their contribution."
            }
        }
    },
    
    "❤️ Saúde e Bem-estar": {
        "Comprando um analgésico": {
            "pt-BR": {
                goal: "Vá a uma farmácia e peça ao farmacêutico algo para aliviar uma dor de cabeça."
            },
            "en-US": {
                name: "Buying a painkiller",
                goal: "Go to a pharmacy and ask the pharmacist for something to relieve a headache."
            }
        },
        "Marcando uma consulta médica": {
            "pt-BR": {
                goal: "Ligue para uma clínica para agendar uma consulta com um clínico geral o mais rápido possível."
            },
            "en-US": {
                name: "Scheduling a doctor's appointment",
                goal: "Call a clinic to schedule an appointment with a general doctor for as soon as possible."
            }
        },
        "Fazendo o registro na clínica": {
            "pt-BR": {
                goal: "Você chegou para sua consulta. Vá até a recepção, diga seu nome e o horário da consulta."
            },
            "en-US": {
                name: "Checking in at the clinic",
                goal: "You have arrived for your appointment. Go to the front desk, state your name and appointment time."
            }
        },
        "Descrevendo sintomas de gripe": {
            "pt-BR": {
                goal: "O médico pergunta o que há de errado. Diga a ele que você está com febre, tosse e dor de garganta."
            },
            "en-US": {
                name: "Describing flu symptoms",
                goal: "The doctor asks what's wrong. Tell them you have a fever, a cough, and a sore throat."
            }
        },
        "Pedindo uma receita médica": {
            "pt-BR": {
                goal: "Ligue para o consultório do seu médico e peça para enviarem uma nova receita do seu medicamento para a sua farmácia local."
            },
            "en-US": {
                name: "Asking for a prescription refill",
                goal: "Call your doctor's office and ask them to send a prescription refill for your medication to your local pharmacy."
            }
        },
        "Perguntando sobre efeitos colaterais": {
            "pt-BR": {
                goal: "O médico prescreveu um novo medicamento. Pergunte se há algum efeito colateral comum sobre o qual você deva saber."
            },
            "en-US": {
                name: "Asking about side effects",
                goal: "The doctor prescribed a new medication. Ask if there are any common side effects you should be aware of."
            }
        },
        "Marcando uma consulta no dentista": {
            "pt-BR": {
                goal: "Você está com dor de dente. Ligue para um consultório odontológico e agende uma consulta de emergência."
            },
            "en-US": {
                name: "Making a dentist appointment",
                goal: "You have a toothache. Call a dental office and schedule an emergency appointment."
            }
        },
        "Explicando uma lesão": {
            "pt-BR": {
                goal: "Você caiu enquanto corria e machucou o tornozelo. Explique ao médico como aconteceu e onde dói."
            },
            "en-US": {
                name: "Explaining an injury",
                goal: "You fell while running and hurt your ankle. Explain to the doctor how it happened and where it hurts."
            }
        },
        "Perguntando sobre os resultados de um exame": {
            "pt-BR": {
                goal: "Ligue para a clínica para perguntar se os resultados do seu exame de sangue recente estão disponíveis."
            },
            "en-US": {
                name: "Asking about test results",
                goal: "Call the clinic to ask if the results of your recent blood test are available."
            }
        },
        "Discutindo opções de tratamento": {
            "pt-BR": {
                goal: "O médico lhe dá um diagnóstico e apresenta duas opções de tratamento diferentes. Pergunte sobre os prós e contras de cada uma."
            },
            "en-US": {
                name: "Discussing treatment options",
                goal: "The doctor gives you a diagnosis and presents two different treatment options. Ask about the pros and cons of each."
            }
        },
        "Ligando para uma ambulância": {
            "pt-BR": {
                goal: "Alguém desmaiou na rua. Ligue para os serviços de emergência, informe sua localização e descreva a situação."
            },
            "en-US": {
                name: "Calling for an ambulance",
                goal: "Someone has collapsed on the street. Call emergency services, state your location, and describe the situation."
            }
        },
        "Visitando um amigo no hospital": {
            "pt-BR": {
                goal: "Vá ao balcão de informações do hospital e pergunte o número do quarto do seu amigo e quais são os horários de visita."
            },
            "en-US": {
                name: "Visiting a friend in the hospital",
                goal: "Go to the hospital's information desk and ask for your friend's room number and what the visiting hours are."
            }
        }
    },
    
    "🏠 Moradia e Serviços": {
        "Recebendo uma encomenda": {
            "pt-BR": {
                goal: "Um entregador está na sua porta com um pacote. Você precisa assinar para recebê-lo."
            },
            "en-US": {
                name: "Receiving a package",
                goal: "A delivery person is at your door with a package. You need to sign for it."
            }
        },
        "Pedindo para baixar o volume": {
            "pt-BR": {
                goal: "Seu vizinho está tocando música muito alta tarde da noite. Bata na porta dele e peça educadamente para ele abaixar o volume."
            },
            "en-US": {
                name: "Asking to lower the volume",
                goal: "Your neighbor is playing very loud music late at night. Knock on their door and politely ask them to turn it down."
            }
        },
        "Reportando um vazamento": {
            "pt-BR": {
                goal: "Você notou um vazamento de água debaixo da pia da cozinha. Ligue para o seu locador ou gerente do prédio para relatar o problema."
            },
            "en-US": {
                name: "Reporting a leak",
                goal: "You notice a water leak under your kitchen sink. Call your landlord or building manager to report the problem."
            }
        },
        "Agendando a instalação da internet": {
            "pt-BR": {
                goal: "Ligue para um provedor de serviços de internet para agendar uma visita de um técnico para instalar seu novo serviço de internet."
            },
            "en-US": {
                name: "Scheduling an internet installation",
                goal: "Call an internet service provider to schedule an appointment for a technician to come and install your new internet service."
            }
        },
        "Falando com um técnico de reparos": {
            "pt-BR": {
                goal: "Um técnico chegou para consertar sua máquina de lavar. Explique a ele qual é o problema."
            },
            "en-US": {
                name: "Talking to a repair technician",
                goal: "A technician has arrived to fix your washing machine. Explain to them what the problem is."
            }
        },
        "Trancado para fora de casa": {
            "pt-BR": {
                goal: "Você trancou suas chaves dentro do seu apartamento. Ligue para o seu locador para ver se ele tem uma chave reserva ou pode ajudar."
            },
            "en-US": {
                name: "Locked out of your apartment",
                goal: "You've locked your keys inside your apartment. Call your landlord to see if they have a spare key or can help."
            }
        },
        "Contratando um serviço de limpeza": {
            "pt-BR": {
                goal: "Ligue para uma empresa de limpeza para perguntar sobre seus preços e para agendar um serviço de limpeza único para o seu apartamento."
            },
            "en-US": {
                name: "Hiring a cleaning service",
                goal: "Call a cleaning company to ask about their prices and to book a one-time cleaning service for your apartment."
            }
        },
        "Perguntando sobre as regras do condomínio": {
            "pt-BR": {
                goal: "Você quer dar uma pequena festa. Pergunte ao gerente do seu prédio sobre as regras relativas a barulho e convidados."
            },
            "en-US": {
                name: "Asking about building rules",
                goal: "You want to have a small party. Ask your building manager about the rules regarding noise and guests."
            }
        },
        "Discutindo um problema de pragas": {
            "pt-BR": {
                goal: "Você notou formigas na sua cozinha. Informe o seu locador e peça para que o controle de pragas seja enviado."
            },
            "en-US": {
                name: "Discussing a pest problem",
                goal: "You have noticed ants in your kitchen. Inform your landlord and ask for pest control to be sent."
            }
        },
        "Contestando uma conta de serviços": {
            "pt-BR": {
                goal: "Sua conta de luz este mês está muito mais alta que o normal. Ligue para a companhia de energia para questionar as cobranças."
            },
            "en-US": {
                name: "Disputing a utility bill",
                goal: "Your electricity bill this month is much higher than usual. Call the utility company to question the charges."
            }
        },
        "Entendendo um contrato de aluguel": {
            "pt-BR": {
                goal: "Antes de assinar um contrato de aluguel, você tem uma pergunta sobre a política de animais de estimação. Peça ao locador para esclarecê-la para você."
            },
            "en-US": {
                name: "Understanding a lease agreement",
                goal: "Before signing a lease, you have a question about the policy on pets. Ask the landlord to clarify it for you."
            }
        },
        "Terminando seu contrato de aluguel": {
            "pt-BR": {
                goal: "Você precisa se mudar antes do término do seu contrato de aluguel. Converse com seu locador para perguntar sobre o procedimento e quaisquer penalidades potenciais."
            },
            "en-US": {
                name: "Terminating your lease agreement",
                goal: "You need to move out before your lease ends. Talk to your landlord to ask about the procedure and any potential penalties."
            }
        }
    }
};