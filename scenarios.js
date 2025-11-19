/**
 * =================================================================
 *  Banco de Dados de Cenários - Missões da Odete (Versão Expandida)
 * =================================================================
 * 
 * ESTRUTURA:
 * Cada cenário contém um objeto para cada idioma suportado.
 * - "pt-BR": Língua nativa (objetivo).
 * - "en-US": Língua de estudo (nome e objetivo).
 * - "es-MX": NOVA LÍNGUA DE ESTUDO (nome e objetivo em espanhol mexicano).
 * 
 * CONTEÚDO:
 * - 17 categorias.
 * - 12 cenários por categoria com progressão de dificuldade.
 * - Total de 204 cenários.
 * 
 */

const SCENARIOS = {
    "🍔 Restaurantes e Cafés": {
        "Pedindo um café simples": {
            "pt-BR": { goal: "Vá a uma cafeteria e peça um café preto para levar." },
            "en-US": { name: "Ordering a simple coffee", goal: "Go to a coffee shop and order one black coffee to go." },
            "es-MX": { name: "Pedir un café sencillo", goal: "Ve a una cafetería y pide un café negro para llevar." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Pedindo uma mesa para dois": {
            "pt-BR": { goal: "Entre em um restaurante e peça ao anfitrião uma mesa para duas pessoas." },
            "en-US": { name: "Asking for a table for two", goal: "Enter a restaurant and ask the host for a table for two people." },
            "es-MX": { name: "Pedir una mesa para dos", goal: "Entra a un restaurante y pide al anfitrión una mesa para dos personas." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Fazendo um pedido do cardápio": {
            "pt-BR": { goal: "O garçom está pronto para anotar seu pedido. Peça um cheeseburger com batatas fritas e um refrigerante." },
            "en-US": { name: "Ordering from the menu", goal: "The waiter is ready to take your order. Order a cheeseburger with fries and a soda." },
            "es-MX": { name: "Ordenar del menú", goal: "El mesero está listo para tomar tu orden. Pide una hamburguesa con queso, papas fritas y un refresco." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Pedindo a conta": {
            "pt-BR": { goal: "Você terminou sua refeição. Chame a atenção do garçom e peça a conta." },
            "en-US": { name: "Asking for the check", goal: "You have finished your meal. Get the waiter's attention and ask for the check." },
            "es-MX": { name: "Pedir la cuenta", goal: "Has terminado de comer. Llama la atención del mesero y pide la cuenta." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Perguntando sobre ingredientes (alergia)": {
            "pt-BR": { goal: "Pergunte ao garçom se o prato de macarrão com frango contém alguma oleaginosa, pois você tem alergia." },
            "en-US": { name: "Asking about ingredients (allergy)", goal: "Ask the waiter if the chicken pasta dish contains any nuts, as you have an allergy." },
            "es-MX": { name: "Preguntar por ingredientes (alergia)", goal: "Pregúntale al mesero si el plato de pasta con pollo contiene nueces, ya que tienes alergia." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Pedindo recomendações ao garçom": {
            "pt-BR": { goal: "Você está indeciso. Pergunte ao garçom qual é o prato mais popular do cardápio." },
            "en-US": { name: "Asking the waiter for recommendations", goal: "You are undecided. Ask the waiter what the most popular dish on the menu is." },
            "es-MX": { name: "Pedir recomendaciones al mesero", goal: "Estás indeciso. Pregúntale al mesero cuál es el platillo más popular del menú." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Reservando uma mesa por telefone": {
            "pt-BR": { goal: "Ligue para um restaurante e reserve uma mesa para quatro pessoas para esta sexta-feira às 20h." },
            "en-US": { name: "Booking a table by phone", goal: "Call a restaurant and book a table for four people for this Friday at 8 PM." },
            "es-MX": { name: "Reservar una mesa por teléfono", goal: "Llama a un restaurante y reserva una mesa para cuatro personas para este viernes a las 8 PM." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Pedindo para dividir a conta": {
            "pt-BR": { goal: "Você comeu com um amigo. Pergunte ao garçom se é possível dividir a conta igualmente entre duas pessoas." },
            "en-US": { name: "Asking to split the check", goal: "You ate with a friend. Ask the waiter if it's possible to split the check evenly between two people." },
            "es-MX": { name: "Pedir dividir la cuenta", goal: "Comiste con un amigo. Pregúntale al mesero si es posible dividir la cuenta en partes iguales entre dos personas." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Reclamando de um item errado no pedido": {
            "pt-BR": { goal: "Você pediu uma pizza vegetariana, mas recebeu uma com pepperoni. Informe o garçom sobre o erro." },
            "en-US": { name: "Complaining about a wrong item in the order", goal: "You ordered a vegetarian pizza, but you received one with pepperoni. Inform the waiter about the mistake." },
            "es-MX": { name: "Quejarse de un platillo equivocado", goal: "Pediste una pizza vegetariana, pero recibiste una con pepperoni. Infórmale al mesero sobre el error." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Reclamando de um prato frio": {
            "pt-BR": { goal: "Seu bife chegou frio. Chame educadamente a atenção do garçom e peça para aquecê-lo." },
            "en-US": { name: "Complaining about a cold dish", goal: "Your steak has arrived cold. Politely get the waiter's attention and ask them to heat it up." },
            "es-MX": { name: "Quejarse de un plato frío", goal: "Tu bistec llegó frío. Llama amablemente la atención del mesero y pide que lo calienten." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Questionando um valor na conta": {
            "pt-BR": { goal: "Você viu uma cobrança extra na sua conta por uma bebida que não pediu. Peça ao garçom para explicar e corrigir." },
            "en-US": { name: "Questioning a charge on the bill", goal: "You see an extra charge on your bill for a drink you didn't order. Ask the waiter to explain and correct it." },
            "es-MX": { name: "Cuestionar un cargo en la cuenta", goal: "Ves un cargo extra en tu cuenta por una bebida que no pediste. Pídele al mesero que lo explique y lo corrija." },
            image: "assets/restaurantes/placeholder.png"
        },
        "Reclamando do serviço com o gerente": {
            "pt-BR": { goal: "O serviço foi extremamente lento e o garçom foi rude. Peça para falar com o gerente para fazer uma reclamação formal." },
            "en-US": { name: "Complaining about the service to the manager", goal: "The service has been extremely slow and the waiter was rude. Ask to speak to the manager to make a formal complaint." },
            "es-MX": { name: "Quejarse del servicio con el gerente", goal: "El servicio ha sido extremadamente lento y el mesero fue grosero. Pide hablar con el gerente para presentar una queja formal." },
            image: "assets/restaurantes/placeholder.png"
        }
    },
    "🤝 Situações Sociais": {
        "Apresentando-se em uma festa": {
            "pt-BR": { goal: "Você está em uma festa. Apresente-se a uma nova pessoa e pergunte o que ela faz da vida." },
            "en-US": { name: "Introducing yourself at a party", goal: "You are at a party. Introduce yourself to a new person and ask them what they do for a living." },
            "es-MX": { name: "Presentarse en una fiesta", goal: "Estás en una fiesta. Preséntate a una persona nueva y pregúntale a qué se dedica." },
            image: "assets/sociais/placeholder.png"
        },
        "Falando sobre o tempo": {
            "pt-BR": { goal: "Inicie uma conversa fiada com alguém em um ponto de ônibus. Faça um comentário sobre o tempo bonito." },
            "en-US": { name: "Talking about the weather", goal: "Start a small talk conversation with someone at a bus stop. Make a comment about the beautiful weather." },
            "es-MX": { name: "Hablar sobre el clima", goal: "Inicia una conversación casual con alguien en una parada de autobús. Haz un comentario sobre el buen clima." },
            image: "assets/sociais/placeholder.png"
        },
        "Elogiando alguém": {
            "pt-BR": { goal: "Você gostou do novo corte de cabelo do seu colega. Faça um elogio a ele." },
            "en-US": { name: "Giving a compliment", goal: "You like your colleague's new haircut. Give them a compliment." },
            "es-MX": { name: "Hacer un cumplido", goal: "Te gusta el nuevo corte de pelo de tu colega. Hazle un cumplido." },
            image: "assets/sociais/placeholder.png"
        },
        "Convidando um amigo para um café": {
            "pt-BR": { goal: "Pergunte ao seu amigo se ele está livre para tomar um café juntos em algum momento desta semana." },
            "en-US": { name: "Inviting a friend for coffee", goal: "Ask your friend if they are free to get a coffee together sometime this week." },
            "es-MX": { name: "Invitar a un amigo a un café", goal: "Pregúntale a tu amigo si está libre para tomar un café juntos en algún momento de esta semana." },
            image: "assets/sociais/placeholder.png"
        },
        "Contando sobre seu fim de semana": {
            "pt-BR": { goal: "Um colega de trabalho pergunta o que você fez no fim de semana. Descreva brevemente uma ou duas atividades que você fez." },
            "en-US": { name: "Telling about your weekend", goal: "A coworker asks you what you did over the weekend. Briefly describe one or two activities you did." },
            "es-MX": { name: "Contar sobre tu fin de semana", goal: "Un colega te pregunta qué hiciste el fin de semana. Describe brevemente una o dos actividades que realizaste." },
            image: "assets/sociais/placeholder.png"
        },
        "Aceitando um convite": {
            "pt-BR": { goal: "Um amigo te convida para a festa de aniversário dele no sábado. Aceite o convite com entusiasmo e pergunte se deve levar alguma coisa." },
            "en-US": { name: "Accepting an invitation", goal: "A friend invites you to their birthday party on Saturday. Enthusiastically accept the invitation and ask if you should bring anything." },
            "es-MX": { name: "Aceptar una invitación", goal: "Un amigo te invita a su fiesta de cumpleaños el sábado. Acepta la invitación con entusiasmo y pregunta si debes llevar algo." },
            image: "assets/sociais/placeholder.png"
        },
        "Recusando um convite educadamente": {
            "pt-BR": { goal: "Um colega te convida para ir ao cinema, mas você já tem planos. Recuse educadamente e agradeça pelo convite." },
            "en-US": { name: "Declining an invitation politely", goal: "A colleague invites you to a movie, but you already have plans. Politely decline and thank them for the invitation." },
            "es-MX": { name: "Rechazar una invitación amablemente", goal: "Un colega te invita al cine, pero ya tienes planes. Rechaza amablemente y agradécele la invitación." },
            image: "assets/sociais/placeholder.png"
        },
        "Pedindo um favor a um vizinho": {
            "pt-BR": { goal: "Você vai sair de férias. Pergunte ao seu vizinho se ele poderia regar suas plantas para você enquanto estiver fora." },
            "en-US": { name: "Asking a neighbor for a favor", goal: "You are going on vacation. Ask your neighbor if they could water your plants for you while you're away." },
            "es-MX": { name: "Pedirle un favor a un vecino", goal: "Te vas de vacaciones. Pregúntale a tu vecino si podría regar tus plantas mientras no estás." },
            image: "assets/sociais/placeholder.png"
        },
        "Terminando uma conversa educadamente": {
            "pt-BR": { goal: "Você está conversando com alguém há um tempo, mas agora precisa ir embora. Termine a conversa educadamente." },
            "en-US": { name: "Ending a conversation politely", goal: "You have been talking to someone for a while, but now you need to leave. Politely end the conversation." },
            "es-MX": { name: "Terminar una conversación amablemente", goal: "Has estado hablando con alguien por un rato, pero ahora necesitas irte. Termina la conversación de manera amable." },
            image: "assets/sociais/placeholder.png"
        },
        "Discordando educadamente de uma opinião": {
            "pt-BR": { goal: "Alguém diz que não gosta de um livro que você ama. Expresse sua opinião diferente de forma respeitosa." },
            "en-US": { name: "Disagreeing politely with an opinion", goal: "Someone says they dislike a book that you love. Express your different opinion respectfully." },
            "es-MX": { name: "No estar de acuerdo amablemente con una opinión", goal: "Alguien dice que no le gusta un libro que a ti te encanta. Expresa tu opinión diferente de manera respetuosa." },
            image: "assets/sociais/placeholder.png"
        },
        "Confortando um amigo": {
            "pt-BR": { goal: "Seu amigo está triste porque teve um dia ruim no trabalho. Ofereça palavras de conforto e apoio." },
            "en-US": { name: "Comforting a friend", goal: "Your friend is sad because they had a bad day at work. Offer words of comfort and support." },
            "es-MX": { name: "Consolar a un amigo", goal: "Tu amigo está triste porque tuvo un mal día en el trabajo. Ofrécele palabras de consuelo y apoyo." },
            image: "assets/sociais/placeholder.png"
        },
        "Apresentando dois amigos um ao outro": {
            "pt-BR": { goal: "Você está com dois amigos que não se conhecem. Apresente um ao outro, mencionando algo que eles têm em comum." },
            "en-US": { name: "Introducing two friends to each other", goal: "You are with two friends who don't know each other. Introduce them to one another, mentioning something they have in common." },
            "es-MX": { name: "Presentar a dos amigos", goal: "Estás con dos amigos que no se conocen. Preséntalos, mencionando algo que tengan en común." },
            image: "assets/sociais/placeholder.png"
        }
    },
    "✈️ Viagens e Transporte": {
        "Comprando um bilhete de metrô": {
            "pt-BR": { goal: "Vá a uma máquina de bilhetes ou guichê e compre um bilhete para uma única viagem." },
            "en-US": { name: "Buying a subway ticket", goal: "Go to a ticket machine or counter and buy one single-journey ticket." },
            "es-MX": { name: "Comprar un boleto de metro", goal: "Ve a una máquina de boletos o a la taquilla y compra un boleto para un solo viaje." },
            image: "assets/viagens/placeholder.png"
        },
        "Pedindo direções na rua": {
            "pt-BR": { goal: "Você está perdido. Pergunte a uma pessoa na rua como chegar ao museu mais próximo." },
            "en-US": { name: "Asking for directions on the street", goal: "You are lost. Ask a person on the street how to get to the nearest museum." },
            "es-MX": { name: "Pedir direcciones en la calle", goal: "Estás perdido. Pregúntale a una persona en la calle cómo llegar al museo más cercano." },
            image: "assets/viagens/placeholder.png"
        },
        "Chamando um táxi": {
            "pt-BR": { goal: "Você está na rua e precisa de um táxi. Dê o endereço do seu hotel ao motorista e pergunte o preço estimado." },
            "en-US": { name: "Hailing a cab", goal: "You are on the street and need a taxi. Give the driver your hotel's address and ask for an estimated fare." },
            "es-MX": { name: "Llamar a un taxi", goal: "Estás en la calle y necesitas un taxi. Dale al conductor la dirección de tu hotel y pregunta por la tarifa estimada." },
            image: "assets/viagens/placeholder.png"
        },
        "Fazendo check-in no voo": {
            "pt-BR": { goal: "Vá ao balcão da companhia aérea, diga que quer fazer o check-in para seu voo para Nova York e que tem uma mala para despachar." },
            "en-US": { name: "Checking in for a flight", goal: "Go to the airline counter, say you want to check in for your flight to New York, and that you have one bag to check." },
            "es-MX": { name: "Hacer check-in para un vuelo", goal: "Ve al mostrador de la aerolínea, di que quieres hacer check-in para tu vuelo a Nueva York y que tienes una maleta para documentar." },
            image: "assets/viagens/placeholder.png"
        },
        "Passando pela segurança do aeroporto": {
            "pt-BR": { goal: "Um agente pede para você remover seu laptop da bolsa e tirar os sapatos. Confirme e siga as instruções." },
            "en-US": { name: "Going through airport security", goal: "An agent asks you to remove your laptop from your bag and take off your shoes. Acknowledge and follow the instructions." },
            "es-MX": { name: "Pasar por la seguridad del aeropuerto", goal: "Un agente te pide que saques tu laptop de la bolsa y te quites los zapatos. Confirma y sigue las instrucciones." },
            image: "assets/viagens/placeholder.png"
        },
        "Perguntando sobre o portão de embarque": {
            "pt-BR": { goal: "Pergunte a um funcionário do aeroporto onde fica o portão de embarque para o voo BA249 para Londres." },
            "en-US": { name: "Asking for the boarding gate", goal: "Ask an airport employee where the departure gate for flight BA249 to London is." },
            "es-MX": { name: "Preguntar por la puerta de embarque", goal: "Pregúntale a un empleado del aeropuerto dónde está la puerta de embarque para el vuelo BA249 a Londres." },
            image: "assets/viagens/placeholder.png"
        },
        "Alugando um carro": {
            "pt-BR": { goal: "Vá a um balcão de aluguel de carros. Diga que você tem uma reserva para um carro compacto e pergunte sobre as opções de seguro." },
            "en-US": { name: "Renting a car", goal: "Go to a car rental desk. Say you have a reservation for a compact car and ask about insurance options." },
            "es-MX": { name: "Rentar un coche", goal: "Ve a un mostrador de renta de coches. Di que tienes una reservación para un coche compacto y pregunta sobre las opciones de seguro." },
            image: "assets/viagens/placeholder.png"
        },
        "Entendendo um anúncio na estação de trem": {
            "pt-BR": { goal: "Um anúncio informa sobre uma mudança de plataforma para o seu trem. Ouça e confirme com um funcionário para qual plataforma você deve ir." },
            "en-US": { name: "Understanding a train station announcement", goal: "An announcement informs of a platform change for your train. Listen and confirm with an employee which platform you need to go to." },
            "es-MX": { name: "Entender un anuncio en la estación de tren", goal: "Un anuncio informa sobre un cambio de andén para tu tren. Escucha y confirma con un empleado a qué andén necesitas ir." },
            image: "assets/viagens/placeholder.png"
        },
        "Perguntando sobre um voo atrasado": {
            "pt-BR": { goal: "Seu voo está atrasado. Pergunte a um funcionário da companhia aérea o novo horário de partida e o motivo do atraso." },
            "en-US": { name: "Asking about a delayed flight", goal: "Your flight is delayed. Ask an airline employee for the new departure time and the reason for the delay." },
            "es-MX": { name: "Preguntar por un vuelo retrasado", goal: "Tu vuelo está retrasado. Pregúntale a un empleado de la aerolínea la nueva hora de salida y la razón del retraso." },
            image: "assets/viagens/placeholder.png"
        },
        "Reportando uma bagagem perdida": {
            "pt-BR": { goal: "Sua mala despachada não chegou. Vá ao balcão de achados e perdidos e reporte o desaparecimento da sua mala." },
            "en-US": { name: "Reporting a lost baggage", goal: "Your checked bag did not arrive. Go to the lost and found desk and report your missing suitcase." },
            "es-MX": { name: "Reportar equipaje perdido", goal: "Tu maleta documentada no llegó. Ve al mostrador de objetos perdidos y reporta la desaparición de tu maleta." },
            image: "assets/viagens/placeholder.png"
        },
        "Lidando com um pneu furado (carro alugado)": {
            "pt-BR": { goal: "O carro que você alugou está com um pneu furado. Ligue para a agência de aluguel para informar o problema e pedir assistência." },
            "en-US": { name: "Dealing with a flat tire (rental car)", goal: "The car you rented has a flat tire. Call the rental agency to report the problem and ask for assistance." },
            "es-MX": { name: "Lidiar con una llanta ponchada (coche de renta)", goal: "El coche que rentaste tiene una llanta ponchada. Llama a la agencia de renta para reportar el problema y pedir asistencia." },
            image: "assets/viagens/placeholder.png"
        },
        "Tentando remarcar um voo cancelado": {
            "pt-BR": { goal: "Seu voo foi cancelado devido ao mau tempo. Vá ao balcão da companhia aérea e peça para ser remarcado no próximo voo disponível." },
            "en-US": { name: "Trying to rebook a cancelled flight", goal: "Your flight was cancelled due to weather. Go to the airline counter and ask to be booked on the next available flight." },
            "es-MX": { name: "Intentar cambiar un vuelo cancelado", goal: "Tu vuelo fue cancelado debido al mal tiempo. Ve al mostrador de la aerolínea y pide que te cambien al próximo vuelo disponible." },
            image: "assets/viagens/placeholder.png"
        }
    },
    "🏨 Hotéis e Hospedagens": {
        "Fazendo check-in no hotel": {
            "pt-BR": { goal: "Faça o check-in no hotel com uma reserva no nome 'Alex Smith' para duas noites." },
            "en-US": { name: "Checking into a hotel", goal: "Check into the hotel with a reservation under the name 'Alex Smith' for two nights." },
            "es-MX": { name: "Hacer check-in en el hotel", goal: "Haz check-in en el hotel con una reservación a nombre de 'Alex Smith' por dos noches." },
            image: "assets/hoteis/placeholder.png"
        },
        "Perguntando sobre o Wi-Fi": {
            "pt-BR": { goal: "Pergunte na recepção se o hotel oferece Wi-Fi gratuito e como se conectar." },
            "en-US": { name: "Asking about the Wi-Fi", goal: "Ask the front desk if the hotel offers free Wi-Fi and how to connect to it." },
            "es-MX": { name: "Preguntar por el Wi-Fi", goal: "Pregunta en la recepción si el hotel ofrece Wi-Fi gratis y cómo conectarse." },
            image: "assets/hoteis/placeholder.png"
        },
        "Solicitando toalhas extras": {
            "pt-BR": { goal: "Ligue para a recepção e peça para enviarem mais duas toalhas limpas para o seu quarto." },
            "en-US": { name: "Requesting extra towels", goal: "Call housekeeping and ask for two more clean towels to be sent to your room." },
            "es-MX": { name: "Solicitar toallas extras", goal: "Llama a recepción y pide que envíen dos toallas limpias más a tu habitación." },
            image: "assets/hoteis/placeholder.png"
        },
        "Perguntando o horário do café da manhã": {
            "pt-BR": { goal: "Pergunte a um funcionário do hotel a que horas o café da manhã é servido e onde." },
            "en-US": { name: "Asking for breakfast time", goal: "Ask a hotel employee what time breakfast is served and where." },
            "es-MX": { name: "Preguntar la hora del desayuno", goal: "Pregúntale a un empleado del hotel a qué hora se sirve el desayuno y dónde." },
            image: "assets/hoteis/placeholder.png"
        },
        "Pedindo serviço de quarto": {
            "pt-BR": { goal: "Ligue para o serviço de quarto e peça um sanduíche de clube e uma garrafa de água." },
            "en-US": { name: "Ordering room service", goal: "Call room service and order a club sandwich and a bottle of water." },
            "es-MX": { name: "Pedir servicio a la habitación", goal: "Llama al servicio a la habitación y pide un club sándwich y una botella de agua." },
            image: "assets/hoteis/placeholder.png"
        },
        "Reportando um problema no quarto": {
            "pt-BR": { goal: "O ar condicionado do seu quarto não está funcionando. Ligue para a recepção para informar o problema." },
            "en-US": { name: "Reporting a problem in the room", goal: "The air conditioning in your room is not working. Call the front desk to report the issue." },
            "es-MX": { name: "Reportar un problema en la habitación", goal: "El aire acondicionado de tu habitación no funciona. Llama a la recepción para reportar el problema." },
            image: "assets/hoteis/placeholder.png"
        },
        "Usando o concierge": {
            "pt-BR": { goal: "Peça ao concierge do hotel para recomendar um bom restaurante local e fazer uma reserva para você." },
            "en-US": { name: "Using the concierge", goal: "Ask the hotel concierge to recommend a good local restaurant and make a reservation for you." },
            "es-MX": { name: "Usar el servicio de concierge", goal: "Pídele al concierge del hotel que te recomiende un buen restaurante local y haga una reservación para ti." },
            image: "assets/hoteis/placeholder.png"
        },
        "Solicitando um check-out tardio": {
            "pt-BR": { goal: "Seu voo é só à noite. Ligue para a recepção e pergunte se é possível fazer o check-out um pouco mais tarde." },
            "en-US": { name: "Requesting a late check-out", goal: "Your flight isn't until the evening. Call the front desk and ask if a late check-out is possible." },
            "es-MX": { name: "Solicitar un check-out tardío", goal: "Tu vuelo no sale hasta la noche. Llama a la recepción y pregunta si es posible hacer el check-out un poco más tarde." },
            image: "assets/hoteis/placeholder.png"
        },
        "Fazendo o check-out": {
            "pt-BR": { goal: "Vá para a recepção, informe o número do seu quarto e diga que você gostaria de fazer o check-out." },
            "en-US": { name: "Checking out of the hotel", goal: "Go to the front desk, provide your room number, and say you would like to check out." },
            "es-MX": { name: "Hacer el check-out del hotel", goal: "Ve a la recepción, da tu número de habitación y di que te gustaría hacer el check-out." },
            image: "assets/hoteis/placeholder.png"
        },
        "Reclamando do barulho no quarto ao lado": {
            "pt-BR": { goal: "O quarto ao lado do seu está fazendo muito barulho tarde da noite. Ligue para a recepção para reclamar." },
            "en-US": { name: "Complaining about noise in the next room", goal: "The room next to yours is being very loud late at night. Call the front desk to complain." },
            "es-MX": { name: "Quejarse del ruido en la habitación de al lado", goal: "La habitación de al lado está haciendo mucho ruido muy tarde en la noche. Llama a la recepción para quejarte." },
            image: "assets/hoteis/placeholder.png"
        },
        "Contestando uma cobrança na conta do hotel": {
            "pt-BR": { goal: "Você está fazendo o check-out e vê cobranças do frigobar que não consumiu. Explique a situação à recepcionista." },
            "en-US": { name: "Disputing a charge on the hotel bill", goal: "You are checking out and see charges from the minibar that you did not consume. Explain the situation to the receptionist." },
            "es-MX": { name: "Disputar un cargo en la cuenta del hotel", goal: "Estás haciendo el check-out y ves cargos del minibar que no consumiste. Explícale la situación a la recepcionista." },
            image: "assets/hoteis/placeholder.png"
        },
        "Deixando a bagagem após o check-out": {
            "pt-BR": { goal: "Você já fez o check-out, mas seu trem parte em algumas horas. Pergunte na recepção se você pode deixar sua bagagem no hotel." },
            "en-US": { name: "Leaving luggage after check-out", goal: "You have checked out, but your train leaves in a few hours. Ask the front desk if you can leave your luggage at the hotel." },
            "es-MX": { name: "Dejar el equipaje después del check-out", goal: "Ya hiciste el check-out, pero tu tren sale en unas horas. Pregunta en la recepción si puedes dejar tu equipaje en el hotel." },
            image: "assets/hoteis/placeholder.png"
        }
    },
    "🩹 Saúde e Bem-estar": {
        "Comprando um analgésico": {
            "pt-BR": { goal: "Vá a uma farmácia e peça ao farmacêutico algo para aliviar uma dor de cabeça." },
            "en-US": { name: "Buying a painkiller", goal: "Go to a pharmacy and ask the pharmacist for something to relieve a headache." },
            "es-MX": { name: "Comprar un analgésico", goal: "Ve a una farmacia y pídele al farmacéutico algo para aliviar el dolor de cabeza." },
            image: "assets/saude/placeholder.png"
        },
        "Marcando uma consulta médica": {
            "pt-BR": { goal: "Ligue para uma clínica para agendar uma consulta com um clínico geral o mais rápido possível." },
            "en-US": { name: "Scheduling a doctor's appointment", goal: "Call a clinic to schedule an appointment with a general doctor for as soon as possible." },
            "es-MX": { name: "Agendar una cita médica", goal: "Llama a una clínica para agendar una cita con un médico general lo antes posible." },
            image: "assets/saude/placeholder.png"
        },
        "Fazendo o registro na clínica": {
            "pt-BR": { goal: "Você chegou para sua consulta. Vá até a recepção, diga seu nome e o horário da consulta." },
            "en-US": { name: "Checking in at the clinic", goal: "You have arrived for your appointment. Go to the front desk, state your name and appointment time." },
            "es-MX": { name: "Registrarse en la clínica", goal: "Has llegado a tu cita. Ve a la recepción, di tu nombre y la hora de tu cita." },
            image: "assets/saude/placeholder.png"
        },
        "Descrevendo sintomas de gripe": {
            "pt-BR": { goal: "O médico pergunta o que há de errado. Diga a ele que você está com febre, tosse e dor de garganta." },
            "en-US": { name: "Describing flu symptoms", goal: "The doctor asks what's wrong. Tell them you have a fever, a cough, and a sore throat." },
            "es-MX": { name: "Describir síntomas de gripe", goal: "El médico pregunta qué te pasa. Dile que tienes fiebre, tos y dolor de garganta." },
            image: "assets/saude/placeholder.png"
        },
        "Marcando uma consulta no dentista": {
            "pt-BR": { goal: "Você está com dor de dente. Ligue para um consultório odontológico e agende uma consulta de emergência." },
            "en-US": { name: "Making a dentist appointment", goal: "You have a toothache. Call a dental office and schedule an emergency appointment." },
            "es-MX": { name: "Hacer una cita con el dentista", goal: "Tienes dolor de muelas. Llama a un consultorio dental y agenda una cita de emergencia." },
            image: "assets/saude/placeholder.png"
        },
        "Explicando uma lesão": {
            "pt-BR": { goal: "Você caiu enquanto corria e machucou o tornozelo. Explique ao médico como aconteceu e onde dói." },
            "en-US": { name: "Explaining an injury", goal: "You fell while running and hurt your ankle. Explain to the doctor how it happened and where it hurts." },
            "es-MX": { name: "Explicar una lesión", goal: "Te caíste mientras corrías y te lastimaste el tobillo. Explícale al médico cómo sucedió y dónde te duele." },
            image: "assets/saude/placeholder.png"
        },
        "Pegando uma receita na farmácia": {
            "pt-BR": { goal: "Vá à farmácia para pegar um medicamento prescrito. Diga ao farmacêutico seu nome e o medicamento que você precisa." },
            "en-US": { name: "Picking up a prescription", goal: "Go to the pharmacy to pick up a prescribed medication. Tell the pharmacist your name and the medicine you need." },
            "es-MX": { name: "Surtir una receta en la farmacia", goal: "Ve a la farmacia a surtir un medicamento recetado. Dile al farmacéutico tu nombre y el medicamento que necesitas." },
            image: "assets/saude/placeholder.png"
        },
        "Perguntando sobre efeitos colaterais": {
            "pt-BR": { goal: "O médico prescreveu um novo medicamento. Pergunte se há algum efeito colateral comum sobre o qual você deva saber." },
            "en-US": { name: "Asking about side effects", goal: "The doctor prescribed a new medication. Ask if there are any common side effects you should be aware of." },
            "es-MX": { name: "Preguntar sobre efectos secundarios", goal: "El médico te recetó un nuevo medicamento. Pregunta si hay algún efecto secundario común que debas conocer." },
            image: "assets/saude/placeholder.png"
        },
        "Perguntando sobre os resultados de um exame": {
            "pt-BR": { goal: "Ligue para a clínica para perguntar se os resultados do seu exame de sangue recente estão disponíveis." },
            "en-US": { name: "Asking about test results", goal: "Call the clinic to ask if the results of your recent blood test are available." },
            "es-MX": { name: "Preguntar por los resultados de un análisis", goal: "Llama a la clínica para preguntar si los resultados de tu reciente análisis de sangre están disponibles." },
            image: "assets/saude/placeholder.png"
        },
        "Discutindo opções de tratamento": {
            "pt-BR": { goal: "O médico lhe dá um diagnóstico e apresenta duas opções de tratamento diferentes. Pergunte sobre os prós e contras de cada uma." },
            "en-US": { name: "Discussing treatment options", goal: "The doctor gives you a diagnosis and presents two different treatment options. Ask about the pros and cons of each." },
            "es-MX": { name: "Discutir opciones de tratamiento", goal: "El médico te da un diagnóstico y presenta dos opciones de tratamiento diferentes. Pregunta sobre los pros y contras de cada una." },
            image: "assets/saude/placeholder.png"
        },
        "Ligando para uma ambulância": {
            "pt-BR": { goal: "Alguém desmaiou na rua. Ligue para os serviços de emergência, informe sua localização e descreva a situação." },
            "en-US": { name: "Calling for an ambulance", goal: "Someone has collapsed on the street. Call emergency services, state your location, and describe the situation." },
            "es-MX": { name: "Llamar a una ambulancia", goal: "Alguien se ha desmayado en la calle. Llama a los servicios de emergencia, indica tu ubicación y describe la situación." },
            image: "assets/saude/placeholder.png"
        },
        "Remarcando uma consulta": {
            "pt-BR": { goal: "Algo surgiu e você não poderá ir à sua consulta médica. Ligue para a clínica para cancelar e remarcar para outro dia." },
            "en-US": { name: "Rescheduling an appointment", goal: "Something has come up and you cannot make it to your doctor's appointment. Call the clinic to cancel and reschedule for another day." },
            "es-MX": { name: "Reagendar una cita", goal: "Surgió algo y no podrás asistir a tu cita médica. Llama a la clínica para cancelar y reagendar para otro día." },
            image: "assets/saude/placeholder.png"
        }
    },
    "🛒 Compras": {
        "Perguntando o preço de um item": {
            "pt-BR": { goal: "Você encontrou uma camisa que gostou, mas ela não tem etiqueta de preço. Pergunte a um vendedor quanto custa." },
            "en-US": { name: "Asking for the price of an item", goal: "Find a shirt you like but it doesn't have a price tag. Ask a shop assistant how much it costs." },
            "es-MX": { name: "Preguntar el precio de un artículo", goal: "Encontraste una camisa que te gusta pero no tiene etiqueta de precio. Pregúntale a un vendedor cuánto cuesta." },
            image: "assets/compras/placeholder.png"
        },
        "Procurando por um produto": {
            "pt-BR": { goal: "Você está em um supermercado. Pergunte a um funcionário em qual corredor você pode encontrar macarrão." },
            "en-US": { name: "Looking for a product", goal: "You are in a supermarket. Ask an employee in which aisle you can find pasta." },
            "es-MX": { name: "Buscar un producto", goal: "Estás en un supermercado. Pregúntale a un empleado en qué pasillo puedes encontrar la pasta." },
            image: "assets/compras/placeholder.png"
        },
        "Pagando pelas compras": {
            "pt-BR": { goal: "Você está no caixa. Diga que gostaria de pagar com cartão de crédito." },
            "en-US": { name: "Paying for your shopping", goal: "You are at the cashier. Say you would like to pay with a credit card." },
            "es-MX": { name: "Pagar las compras", goal: "Estás en la caja. Di que te gustaría pagar con tarjeta de crédito." },
            image: "assets/compras/placeholder.png"
        },
        "Pedindo um tamanho ou cor diferente": {
            "pt-BR": { goal: "Pergunte a um vendedor se ele tem uma camiseta azul no tamanho médio." },
            "en-US": { name: "Asking for a different size or color", goal: "Ask a shop assistant if they have a blue T-shirt in a medium size." },
            "es-MX": { name: "Pedir una talla o color diferente", goal: "Pregúntale a un vendedor si tiene una camiseta azul en talla mediana." },
            image: "assets/compras/placeholder.png"
        },
        "Perguntando onde ficam os provadores": {
            "pt-BR": { goal: "Você quer experimentar uma calça jeans. Pergunte a um funcionário da loja onde ficam os provadores." },
            "en-US": { name: "Asking for the fitting rooms", goal: "You want to try on some jeans. Ask a store employee where the fitting rooms are." },
            "es-MX": { name: "Preguntar por los probadores", goal: "Quieres probarte unos jeans. Pregúntale a un empleado de la tienda dónde están los probadores." },
            image: "assets/compras/placeholder.png"
        },
        "Perguntando sobre a política de devolução": {
            "pt-BR": { goal: "Antes de comprar um presente, pergunte ao caixa quantos dias a pessoa tem para devolver ou trocar o item." },
            "en-US": { name: "Asking about the return policy", goal: "Before buying a gift, ask the cashier how many days the person has to return or exchange the item." },
            "es-MX": { name: "Preguntar sobre la política de devoluciones", goal: "Antes de comprar un regalo, pregúntale al cajero cuántos días tiene la persona para devolver o cambiar el artículo." },
            image: "assets/compras/placeholder.png"
        },
        "Devolvendo um item": {
            "pt-BR": { goal: "Você comprou uma jaqueta no tamanho errado. Vá ao atendimento ao cliente com o recibo e peça para trocá-la por um tamanho maior." },
            "en-US": { name: "Returning an item", goal: "You bought a jacket in the wrong size. Go to customer service with the receipt and ask to exchange it for a larger size." },
            "es-MX": { name: "Devolver un artículo", goal: "Compraste una chaqueta de la talla equivocada. Ve a servicio al cliente con el recibo y pide cambiarla por una talla más grande." },
            image: "assets/compras/placeholder.png"
        },
        "Inscrevendo-se em um programa de fidelidade": {
            "pt-BR": { goal: "O caixa pergunta se você quer participar do programa de fidelidade gratuito. Pergunte quais são os benefícios antes de decidir." },
            "en-US": { name: "Signing up for a loyalty program", goal: "The cashier asks if you want to join their free loyalty program. Ask what the benefits are before deciding." },
            "es-MX": { name: "Inscribirse a un programa de lealtad", goal: "El cajero te pregunta si quieres unirte a su programa de lealtad gratuito. Pregunta cuáles son los beneficios antes de decidir." },
            image: "assets/compras/placeholder.png"
        },
        "Pedindo um desconto": {
            "pt-BR": { goal: "Você está comprando um modelo de TV de mostruário que tem um pequeno arranhão. Pergunte ao gerente se ele pode oferecer um desconto." },
            "en-US": { name: "Asking for a discount", goal: "You are buying a display model of a TV that has a small scratch. Ask the manager if they can offer a discount." },
            "es-MX": { name: "Pedir un descuento", goal: "Estás comprando un modelo de exhibición de una televisión que tiene un pequeño rasguño. Pregúntale al gerente si puede ofrecerte un descuento." },
            image: "assets/compras/placeholder.png"
        },
        "Devolvendo um item com defeito": {
            "pt-BR": { goal: "Devolva um fone de ouvido que parou de funcionar depois de um dia. Você tem o recibo e quer um reembolso." },
            "en-US": { name: "Returning a faulty item", goal: "Return a pair of headphones that stopped working after one day. You have the receipt and want a refund." },
            "es-MX": { name: "Devolver un artículo defectuoso", goal: "Devuelve un par de audífonos que dejaron de funcionar después de un día. Tienes el recibo y quieres un reembolso." },
            image: "assets/compras/placeholder.png"
        },
        "Reclamando de propaganda enganosa": {
            "pt-BR": { goal: "Um item foi anunciado com um preço especial, mas passou no caixa com o preço cheio. Mostre o anúncio ao caixa e peça para honrarem o desconto." },
            "en-US": { name: "Complaining about false advertising", goal: "An item was advertised at a special price, but it scanned at the full price. Show the advertisement to the cashier and ask them to honor the discount." },
            "es-MX": { name: "Quejarse de publicidad engañosa", goal: "Un artículo estaba anunciado a un precio especial, pero al pagar marcó el precio completo. Muéstrale el anuncio al cajero y pide que respeten el descuento." },
            image: "assets/compras/placeholder.png"
        },
        "Falando com o gerente da loja": {
            "pt-BR": { goal: "Um vendedor foi muito inútil e rude. Peça para falar com o gerente da loja para relatar o incidente." },
            "en-US": { name: "Speaking with the store manager", goal: "A salesperson was very unhelpful and rude. Ask to speak to the store manager to report the incident." },
            "es-MX": { name: "Hablar con el gerente de la tienda", goal: "Un vendedor fue poco servicial y grosero. Pide hablar con el gerente de la tienda para reportar el incidente." },
            image: "assets/compras/placeholder.png"
        }
    },
    "💼 Profissional": {
        "Apresentando-se a um colega": {
            "pt-BR": { goal: "É seu primeiro dia. Apresente-se a um novo membro da equipe e pergunte no que ele está trabalhando." },
            "en-US": { name: "Introducing yourself to a colleague", goal: "It's your first day. Introduce yourself to a new team member and ask what they are working on." },
            "es-MX": { name: "Presentarte con un colega", goal: "Es tu primer día. Preséntate a un nuevo miembro del equipo y pregúntale en qué está trabajando." },
            image: "assets/profissional/placeholder.png"
        },
        "Pedindo ajuda a um colega": {
            "pt-BR": { goal: "Você está com dificuldades em uma tarefa. Pergunte a um colega mais experiente se ele tem um momento para te ajudar." },
            "en-US": { name: "Asking a colleague for help", goal: "You are stuck on a task. Ask a more experienced colleague if they have a moment to help you." },
            "es-MX": { name: "Pedir ayuda a un colega", goal: "Estás atascado en una tarea. Pregúntale a un colega con más experiencia si tiene un momento para ayudarte." },
            image: "assets/profissional/placeholder.png"
        },
        "Agendando uma reunião": {
            "pt-BR": { goal: "Fale com um colega para agendar uma reunião de 30 minutos para amanhã para discutir o novo projeto." },
            "en-US": { name: "Scheduling a meeting", goal: "Talk to a coworker to schedule a 30-minute meeting for tomorrow to discuss the new project." },
            "es-MX": { name: "Agendar una reunión", goal: "Habla con un compañero de trabajo para agendar una reunión de 30 minutos mañana para discutir el nuevo proyecto." },
            image: "assets/profissional/placeholder.png"
        },
        "Avisando que vai se atrasar": {
            "pt-BR": { goal: "Você está preso no trânsito e vai se atrasar 15 minutos para o trabalho. Mande uma mensagem para seu chefe para informá-lo." },
            "en-US": { name: "Informing you will be late", goal: "You are stuck in traffic and will be 15 minutes late for work. Message your boss to inform them." },
            "es-MX": { name: "Avisar que llegarás tarde", goal: "Estás atorado en el tráfico y llegarás 15 minutos tarde al trabajo. Mándale un mensaje a tu jefe para informarle." },
            image: "assets/profissional/placeholder.png"
        },
        "Dando uma atualização em uma reunião": {
            "pt-BR": { goal: "Em uma reunião de equipe, seu gerente pergunta sobre seu progresso. Dê uma breve atualização sobre o que você concluiu." },
            "en-US": { name: "Giving an update in a meeting", goal: "In a team meeting, your manager asks for your progress. Give a brief update on what you completed." },
            "es-MX": { name: "Dar una actualización en una reunión", goal: "En una reunión de equipo, tu gerente pregunta por tu progreso. Dale una breve actualización sobre lo que has completado." },
            image: "assets/profissional/placeholder.png"
        },
        "Pedindo feedback sobre seu trabalho": {
            "pt-BR": { goal: "Você acabou de terminar um relatório. Pergunte ao seu gerente se ele tem tempo para revisá-lo e te dar algum feedback." },
            "en-US": { name: "Asking for feedback on your work", goal: "You have just finished a report. Ask your manager if they have time to review it and give you some feedback." },
            "es-MX": { name: "Pedir retroalimentación sobre tu trabajo", goal: "Acabas de terminar un informe. Pregúntale a tu gerente si tiene tiempo para revisarlo y darte su opinión." },
            image: "assets/profissional/placeholder.png"
        },
        "Lidando com uma ligação de cliente": {
            "pt-BR": { goal: "Atenda uma ligação de um cliente que quer saber o status do pedido dele." },
            "en-US": { name: "Handling a customer call", goal: "Answer a phone call from a customer who wants to know the status of their order." },
            "es-MX": { name: "Atender la llamada de un cliente", goal: "Responde una llamada telefónica de un cliente que quiere saber el estado de su pedido." },
            image: "assets/profissional/placeholder.png"
        },
        "Oferecendo ajuda a um colega": {
            "pt-BR": { goal: "Você percebe que um colega está sobrecarregado. Ofereça-se para ajudar com alguma de suas tarefas." },
            "en-US": { name: "Offering help to a colleague", goal: "You notice a colleague is overwhelmed. Offer to help them with one of their tasks." },
            "es-MX": { name: "Ofrecer ayuda a un colega", goal: "Te das cuenta de que un colega está abrumado. Ofrécete a ayudarle con alguna de sus tareas." },
            image: "assets/profissional/placeholder.png"
        },
        "Discordando de uma decisão em uma reunião": {
            "pt-BR": { goal: "Em uma reunião, uma decisão é tomada com a qual você não concorda. Expresse educadamente sua preocupação e explique seu raciocínio." },
            "en-US": { name: "Disagreeing with a decision in a meeting", goal: "In a meeting, a decision is made that you disagree with. Politely express your concern and explain your reasoning." },
            "es-MX": { name: "No estar de acuerdo con una decisión en una reunión", goal: "En una reunión, se toma una decisión con la que no estás de acuerdo. Expresa amablemente tu preocupación y explica tu razonamiento." },
            image: "assets/profissional/placeholder.png"
        },
        "Negociando um prazo": {
            "pt-BR": { goal: "Seu chefe te dá uma nova tarefa com um prazo apertado. Explique sua carga de trabalho atual e pergunte se o prazo pode ser estendido." },
            "en-US": { name: "Negotiating a deadline", goal: "Your boss gives you a new task with a tight deadline. Explain your current workload and ask if the deadline can be extended." },
            "es-MX": { name: "Negociar una fecha de entrega", goal: "Tu jefe te asigna una nueva tarea con una fecha de entrega ajustada. Explica tu carga de trabajo actual y pregunta si se puede extender la fecha límite." },
            image: "assets/profissional/placeholder.png"
        },
        "Lidando com um cliente irritado": {
            "pt-BR": { goal: "Um cliente liga para reclamar com raiva de um produto. Ouça o problema dele, peça desculpas pelo inconveniente e ofereça uma solução." },
            "en-US": { name: "Dealing with an angry customer", goal: "A customer calls to complain angrily about a product. Listen to their problem, apologize for the inconvenience, and offer a solution." },
            "es-MX": { name: "Lidiar con un cliente enojado", goal: "Un cliente llama para quejarse enojado sobre un producto. Escucha su problema, discúlpate por el inconveniente y ofrece una solución." },
            image: "assets/profissional/placeholder.png"
        },
        "Pedindo um aumento": {
            "pt-BR": { goal: "Você acredita que merece um aumento com base em seu desempenho. Agende uma reunião com seu chefe para discutir sua remuneração." },
            "en-US": { name: "Asking for a raise", goal: "You believe you deserve a raise based on your performance. Schedule a meeting with your boss to discuss your compensation." },
            "es-MX": { name: "Pedir un aumento de sueldo", goal: "Crees que mereces un aumento basado en tu desempeño. Agenda una reunión con tu jefe para discutir tu compensación." },
            image: "assets/profissional/placeholder.png"
        }
    },
    "🎓 Estudos": {
        "Apresentando-se na aula": {
            "pt-BR": { goal: "É o primeiro dia de aula. O professor pede para todos se apresentarem. Diga seu nome, de onde você é e por que está fazendo a aula." },
            "en-US": { name: "Introducing yourself in class", goal: "It's the first day of class. The teacher asks everyone to introduce themselves. State your name, where you are from, and why you are taking the class." },
            "es-MX": { name: "Presentarse en clase", goal: "Es el primer día de clase. El profesor pide a todos que se presenten. Di tu nombre, de dónde eres y por qué estás tomando la clase." },
            image: "assets/estudos/placeholder.png"
        },
        "Pedindo material emprestado": {
            "pt-BR": { goal: "Você esqueceu sua caneta. Peça educadamente ao colega ao seu lado se pode pegar uma emprestada." },
            "en-US": { name: "Borrowing class material", goal: "You forgot your pen. Politely ask the classmate next to you if you can borrow one." },
            "es-MX": { name: "Pedir material de clase prestado", goal: "Olvidaste tu pluma. Pídele amablemente al compañero de al lado si te puede prestar una." },
            image: "assets/estudos/placeholder.png"
        },
        "Tirando uma dúvida com o professor": {
            "pt-BR": { goal: "Após a aula, aproxime-se do professor para fazer uma pergunta e esclarecer um conceito que você não entendeu." },
            "en-US": { name: "Asking a professor a question", goal: "After the lecture, approach the professor to ask a question to clarify a concept you didn't understand." },
            "es-MX": { name: "Hacerle una pregunta a un profesor", goal: "Después de la clase, acércate al profesor para hacerle una pregunta y aclarar un concepto que no entendiste." },
            image: "assets/estudos/placeholder.png"
        },
        "Pedindo ajuda na biblioteca": {
            "pt-BR": { goal: "Você não consegue encontrar um livro para seu trabalho de pesquisa. Peça ajuda ao bibliotecário para localizá-lo." },
            "en-US": { name: "Asking for help at the library", goal: "You can't find a book for your research paper. Ask the librarian for help locating it." },
            "es-MX": { name: "Pedir ayuda en la biblioteca", goal: "No puedes encontrar un libro para tu trabajo de investigación. Pídele ayuda al bibliotecario para localizarlo." },
            image: "assets/estudos/placeholder.png"
        },
        "Combinando um estudo em grupo": {
            "pt-BR": { goal: "Converse com seus colegas e sugira estudarem juntos para a próxima prova. Proponha um horário e um local." },
            "en-US": { name: "Arranging a group study session", goal: "Talk to your classmates and suggest studying together for the upcoming exam. Propose a time and place." },
            "es-MX": { name: "Organizar una sesión de estudio en grupo", goal: "Habla con tus compañeros y sugiere estudiar juntos para el próximo examen. Propón una hora y un lugar." },
            image: "assets/estudos/placeholder.png"
        },
        "Informando uma ausência ao professor": {
            "pt-BR": { goal: "Você está doente e não poderá comparecer à aula amanhã. Informe seu professor e pergunte sobre qualquer material que você perderá." },
            "en-US": { name: "Informing a professor about an absence", goal: "You are sick and cannot attend class tomorrow. Inform your professor and ask about any material you will miss." },
            "es-MX": { name: "Informar a un profesor sobre una ausencia", goal: "Estás enfermo y no podrás asistir a clase mañana. Informa a tu profesor y pregunta sobre cualquier material que te perderás." },
            image: "assets/estudos/placeholder.png"
        },
        "Discutindo um projeto em grupo": {
            "pt-BR": { goal: "Você está em uma reunião com seu grupo de projeto. Sua tarefa é delegar responsabilidades para cada parte do projeto." },
            "en-US": { name: "Discussing a group project", goal: "You are in a meeting with your project group. Your task is to delegate responsibilities for each part of the project." },
            "es-MX": { name: "Discutir un proyecto en grupo", goal: "Estás en una reunión con tu grupo de proyecto. Tu tarea es delegar responsabilidades para cada parte del proyecto." },
            image: "assets/estudos/placeholder.png"
        },
        "Debatendo um tópico em sala": {
            "pt-BR": { goal: "O professor apresenta um tópico para debate. Expresse sua opinião sobre o tópico e forneça um motivo para apoiá-la." },
            "en-US": { name: "Debating a topic in the classroom", goal: "The teacher presents a topic for debate. Express your opinion on the topic and provide one reason to support it." },
            "es-MX": { name: "Debatir un tema en el salón de clases", goal: "El profesor presenta un tema a debate. Expresa tu opinión sobre el tema y da una razón para respaldarla." },
            image: "assets/estudos/placeholder.png"
        },
        "Marcando uma reunião com um orientador": {
            "pt-BR": { goal: "Você precisa discutir sua seleção de cursos para o próximo semestre. Fale com o orientador acadêmico para agendar uma reunião." },
            "en-US": { name: "Scheduling a meeting with an advisor", goal: "You need to discuss your course selection for the next semester. Talk to the academic advisor to schedule an appointment." },
            "es-MX": { name: "Agendar una reunión con un asesor", goal: "Necesitas discutir tu selección de cursos para el próximo semestre. Habla con el asesor académico para agendar una cita." },
            image: "assets/estudos/placeholder.png"
        },
        "Apresentando um trabalho para a turma": {
            "pt-BR": { goal: "É a sua vez de apresentar. Comece sua apresentação introduzindo seu tópico para a turma." },
            "en-US": { name: "Presenting a project to the class", goal: "It's your turn to present. Start your presentation by introducing your topic to the class." },
            "es-MX": { name: "Presentar un proyecto a la clase", goal: "Es tu turno de presentar. Comienza tu presentación introduciendo tu tema a la clase." },
            image: "assets/estudos/placeholder.png"
        },
        "Pedindo uma extensão de prazo": {
            "pt-BR": { goal: "Você tem muitos trabalhos para entregar ao mesmo tempo. Peça educadamente ao seu professor se é possível obter uma pequena extensão no seu trabalho." },
            "en-US": { name: "Asking for a deadline extension", goal: "You have too many assignments due at the same time. Politely ask your professor if it is possible to get a small extension on your paper." },
            "es-MX": { name: "Pedir una prórroga para la fecha de entrega", goal: "Tienes demasiadas tareas que entregar al mismo tiempo. Pídele amablemente a tu profesor si es posible obtener una pequeña prórroga en tu trabajo." },
            image: "assets/estudos/placeholder.png"
        },
        "Resolvendo um conflito em um grupo de estudo": {
            "pt-BR": { goal: "Um membro do seu grupo não está fazendo sua parte do trabalho. Você precisa conversar com ele sobre a importância de sua contribuição." },
            "en-US": { name: "Resolving a conflict in a study group", goal: "One member of your group is not doing their part of the work. You need to talk to them about the importance of their contribution." },
            "es-MX": { name: "Resolver un conflicto en un grupo de estudio", goal: "Un miembro de tu grupo no está haciendo su parte del trabajo. Necesitas hablar con él sobre la importancia de su contribución." },
            image: "assets/estudos/placeholder.png"
        }
    },
    "🏠 Moradia e Serviços": {
        "Recebendo uma encomenda": {
            "pt-BR": { goal: "Um entregador está na sua porta com um pacote. Você precisa assinar para recebê-lo." },
            "en-US": { name: "Receiving a package", goal: "A delivery person is at your door with a package. You need to sign for it." },
            "es-MX": { name: "Recibir un paquete", goal: "Un repartidor está en tu puerta con un paquete. Necesitas firmar para recibirlo." },
            image: "assets/moradia/placeholder.png"
        },
        "Pedindo para baixar o volume": {
            "pt-BR": { goal: "Seu vizinho está tocando música muito alta. Bata na porta dele e peça educadamente para ele abaixar o volume." },
            "en-US": { name: "Asking to lower the volume", goal: "Your neighbor is playing very loud music. Knock on their door and politely ask them to turn it down." },
            "es-MX": { name: "Pedir que bajen el volumen", goal: "Tu vecino está poniendo música muy alta. Toca a su puerta y pídele amablemente que le baje al volumen." },
            image: "assets/moradia/placeholder.png"
        },
        "Reportando um vazamento": {
            "pt-BR": { goal: "Você notou um vazamento de água debaixo da pia da cozinha. Ligue para o seu locador para relatar o problema." },
            "en-US": { name: "Reporting a leak", goal: "You notice a water leak under your kitchen sink. Call your landlord to report the problem." },
            "es-MX": { name: "Reportar una fuga", goal: "Notaste una fuga de agua debajo del fregadero de la cocina. Llama a tu arrendador para reportar el problema." },
            image: "assets/moradia/placeholder.png"
        },
        "Falando com um técnico de reparos": {
            "pt-BR": { goal: "Um técnico chegou para consertar sua máquina de lavar. Explique a ele qual é o problema." },
            "en-US": { name: "Talking to a repair technician", goal: "A technician has arrived to fix your washing machine. Explain to them what the problem is." },
            "es-MX": { name: "Hablar con un técnico de reparaciones", goal: "Un técnico ha llegado para arreglar tu lavadora. Explícale cuál es el problema." },
            image: "assets/moradia/placeholder.png"
        },
        "Agendando a instalação da internet": {
            "pt-BR": { goal: "Ligue para um provedor de serviços de internet para agendar uma visita de um técnico para instalar seu novo serviço." },
            "en-US": { name: "Scheduling an internet installation", goal: "Call an internet service provider to schedule an appointment for a technician to come and install your new service." },
            "es-MX": { name: "Agendar la instalación de internet", goal: "Llama a un proveedor de servicios de internet para agendar una cita para que un técnico venga a instalar tu nuevo servicio." },
            image: "assets/moradia/placeholder.png"
        },
        "Trancado para fora de casa": {
            "pt-BR": { goal: "Você trancou suas chaves dentro do seu apartamento. Ligue para o seu locador para ver se ele pode ajudar." },
            "en-US": { name: "Locked out of your apartment", goal: "You've locked your keys inside your apartment. Call your landlord to see if they can help." },
            "es-MX": { name: "Quedarse afuera de tu apartamento", goal: "Dejaste tus llaves dentro de tu apartamento. Llama a tu arrendador para ver si te puede ayudar." },
            image: "assets/moradia/placeholder.png"
        },
        "Contratando um serviço de limpeza": {
            "pt-BR": { goal: "Ligue para uma empresa de limpeza para perguntar sobre seus preços e agendar um serviço para o seu apartamento." },
            "en-US": { name: "Hiring a cleaning service", goal: "Call a cleaning company to ask about their prices and to book a service for your apartment." },
            "es-MX": { name: "Contratar un servicio de limpieza", goal: "Llama a una compañía de limpieza para preguntar por sus precios y agendar un servicio para tu apartamento." },
            image: "assets/moradia/placeholder.png"
        },
        "Perguntando sobre as regras do condomínio": {
            "pt-BR": { goal: "Você quer dar uma pequena festa. Pergunte ao gerente do seu prédio sobre as regras relativas a barulho e convidados." },
            "en-US": { name: "Asking about building rules", goal: "You want to have a small party. Ask your building manager about the rules regarding noise and guests." },
            "es-MX": { name: "Preguntar sobre las reglas del edificio", goal: "Quieres hacer una pequeña fiesta. Pregúntale al administrador de tu edificio sobre las reglas relativas al ruido y los invitados." },
            image: "assets/moradia/placeholder.png"
        },
        "Discutindo um problema de pragas": {
            "pt-BR": { goal: "Você notou formigas na sua cozinha. Informe o seu locador e peça para que o controle de pragas seja enviado." },
            "en-US": { name: "Discussing a pest problem", goal: "You have noticed ants in your kitchen. Inform your landlord and ask for pest control to be sent." },
            "es-MX": { name: "Discutir un problema de plagas", goal: "Has notado hormigas en tu cocina. Informa a tu arrendador y pide que envíen a un fumigador." },
            image: "assets/moradia/placeholder.png"
        },
        "Entendendo um contrato de aluguel": {
            "pt-BR": { goal: "Antes de assinar um contrato de aluguel, você tem uma pergunta sobre a política de animais de estimação. Peça ao locador para esclarecê-la." },
            "en-US": { name: "Understanding a lease agreement", goal: "Before signing a lease, you have a question about the policy on pets. Ask the landlord to clarify it." },
            "es-MX": { name: "Entender un contrato de arrendamiento", goal: "Antes de firmar un contrato de arrendamiento, tienes una pregunta sobre la política de mascotas. Pídele al arrendador que te la aclare." },
            image: "assets/moradia/placeholder.png"
        },
        "Contestando uma conta de serviços": {
            "pt-BR": { goal: "Sua conta de luz este mês está muito mais alta que o normal. Ligue para a companhia de energia para questionar as cobranças." },
            "en-US": { name: "Disputing a utility bill", goal: "Your electricity bill this month is much higher than usual. Call the utility company to question the charges." },
            "es-MX": { name: "Disputar una factura de servicios", goal: "Tu factura de electricidad de este mes es mucho más alta de lo normal. Llama a la compañía eléctrica para cuestionar los cargos." },
            image: "assets/moradia/placeholder.png"
        },
        "Terminando seu contrato de aluguel": {
            "pt-BR": { goal: "Você precisa se mudar antes do término do seu contrato. Converse com seu locador para perguntar sobre o procedimento e quaisquer penalidades." },
            "en-US": { name: "Terminating your lease agreement", goal: "You need to move out before your lease ends. Talk to your landlord to ask about the procedure and any potential penalties." },
            "es-MX": { name: "Terminar tu contrato de arrendamiento", goal: "Necesitas mudarte antes de que termine tu contrato. Habla con tu arrendador para preguntar sobre el procedimiento y cualquier posible penalización." },
            image: "assets/moradia/placeholder.png"
        }
    },
    "💕 Romance": {
        "Puxando conversa": {
            "pt-BR": { goal: "Você está em um café e vê alguém interessante. Inicie uma conversa comentando sobre o livro que a pessoa está lendo." },
            "en-US": { name: "Striking up a conversation", goal: "You're at a coffee shop and see someone interesting. Start a conversation by commenting on the book they are reading." },
            "es-MX": { name: "Iniciar una conversación", goal: "Estás en una cafetería y ves a alguien interesante. Inicia una conversación comentando sobre el libro que está leyendo." },
            image: "assets/romance/placeholder.png"
        },
        "Convidando alguém para sair": {
            "pt-BR": { goal: "Você conversou com alguém e gostou da pessoa. Convide-a para tomar um drinque ou um café em algum momento." },
            "en-US": { name: "Asking someone out", goal: "You've had a nice conversation with someone. Ask them if they would like to get a drink or coffee sometime." },
            "es-MX": { name: "Invitar a salir a alguien", goal: "Has tenido una agradable conversación con alguien. Invítalo/a a tomar una copa o un café en algún momento." },
            image: "assets/romance/placeholder.png"
        },
        "O primeiro encontro": {
            "pt-BR": { goal: "Você está em seu primeiro encontro. Faça perguntas para conhecer melhor a outra pessoa, como seus hobbies e interesses." },
            "en-US": { name: "The first date", goal: "You are on your first date. Ask questions to get to know the other person better, like their hobbies and interests." },
            "es-MX": { name: "La primera cita", goal: "Estás en tu primera cita. Haz preguntas para conocer mejor a la otra persona, como sus pasatiempos e intereses." },
            image: "assets/romance/placeholder.png"
        },
        "Fazendo um elogio sincero": {
            "pt-BR": { goal: "Seu parceiro(a) está incrível hoje. Faça um elogio genuíno sobre a aparência ou a personalidade dele(a)." },
            "en-US": { name: "Giving a sincere compliment", goal: "Your partner looks amazing today. Give them a genuine compliment on their appearance or personality." },
            "es-MX": { name: "Hacer un cumplido sincero", goal: "Tu pareja se ve increíble hoy. Hazle un cumplido genuino sobre su apariencia o personalidad." },
            image: "assets/romance/placeholder.png"
        },
        "Planejando um fim de semana juntos": {
            "pt-BR": { goal: "Converse com seu parceiro(a) e planeje uma pequena viagem de fim de semana. Decidam juntos para onde ir e o que fazer." },
            "en-US": { name: "Planning a weekend together", goal: "Talk with your partner and plan a short weekend trip. Decide together on where to go and what to do." },
            "es-MX": { name: "Planear un fin de semana juntos", goal: "Habla con tu pareja y planeen un viaje corto de fin de semana. Decidan juntos a dónde ir y qué hacer." },
            image: "assets/romance/placeholder.png"
        },
        "Apresentando seu parceiro(a) aos amigos": {
            "pt-BR": { goal: "Você vai apresentar seu novo parceiro(a) aos seus amigos pela primeira vez. Faça as apresentações e tente incluí-lo(a) na conversa." },
            "en-US": { name: "Introducing your partner to friends", goal: "You are introducing your new partner to your friends for the first time. Make the introductions and try to include them in the conversation." },
            "es-MX": { name: "Presentar a tu pareja a tus amigos", goal: "Vas a presentar a tu nueva pareja a tus amigos por primera vez. Haz las presentaciones e intenta incluirlo/a en la conversación." },
            image: "assets/romance/placeholder.png"
        },
        "Tendo 'a conversa' sobre o relacionamento": {
            "pt-BR": { goal: "Vocês estão saindo há algum tempo. Inicie uma conversa para definir o relacionamento e perguntar se vocês são um casal exclusivo." },
            "en-US": { name: "Having 'the talk' about the relationship", goal: "You've been dating for a while. Start a conversation to define the relationship and ask if you are an exclusive couple." },
            "es-MX": { name: "Tener 'la plática' sobre la relación", goal: "Han estado saliendo por un tiempo. Inicia una conversación para definir la relación y preguntar si son una pareja exclusiva." },
            image: "assets/romance/placeholder.png"
        },
        "Pedindo desculpas após uma discussão": {
            "pt-BR": { goal: "Você e seu parceiro(a) tiveram um desentendimento. Inicie a conversa para se desculpar e resolver as coisas." },
            "en-US": { name: "Apologizing after an argument", goal: "You and your partner had a disagreement. Initiate the conversation to apologize and make things right." },
            "es-MX": { name: "Disculparse después de una discusión", goal: "Tú y tu pareja tuvieron un desacuerdo. Inicia la conversación para disculparte y arreglar las cosas." },
            image: "assets/romance/placeholder.png"
        },
        "Discutindo o futuro juntos": {
            "pt-BR": { goal: "Inicie uma conversa séria com seu parceiro(a) sobre seus objetivos de longo prazo, como morar juntos ou casamento." },
            "en-US": { name: "Discussing the future together", goal: "Start a serious conversation with your partner about your long-term goals, such as moving in together or marriage." },
            "es-MX": { name: "Hablar del futuro juntos", goal: "Inicia una conversación seria con tu pareja sobre sus metas a largo plazo, como vivir juntos o casarse." },
            image: "assets/romance/placeholder.png"
        },
        "Lidando com o ciúme": {
            "pt-BR": { goal: "Você se sentiu desconfortável com uma situação. Converse com seu parceiro(a) sobre seus sentimentos de ciúme de uma forma calma e construtiva." },
            "en-US": { name: "Dealing with jealousy", goal: "You felt uncomfortable about a situation. Talk to your partner about your feelings of jealousy in a calm and constructive way." },
            "es-MX": { name: "Lidiar con los celos", goal: "Te sentiste incómodo/a con una situación. Habla con tu pareja sobre tus sentimientos de celos de una manera tranquila y constructiva." },
            image: "assets/romance/placeholder.png"
        },
        "Conhecendo os pais": {
            "pt-BR": { goal: "Você vai conhecer os pais do seu parceiro(a) pela primeira vez. Prepare-se para responder perguntas sobre você e seu trabalho." },
            "en-US": { name: "Meeting the parents", goal: "You are meeting your partner's parents for the first time. Be prepared to answer questions about yourself and your job." },
            "es-MX": { name: "Conocer a los padres", goal: "Vas a conocer a los padres de tu pareja por primera vez. Prepárate para responder preguntas sobre ti y tu trabajo." },
            image: "assets/romance/placeholder.png"
        },
        "Terminando o relacionamento": {
            "pt-BR": { goal: "Você decidiu que precisa terminar o relacionamento. Inicie a conversa difícil, explicando seus sentimentos de forma honesta, mas gentil." },
            "en-US": { name: "Breaking up with someone", goal: "You've decided you need to end the relationship. Initiate the difficult conversation, explaining your feelings honestly but gently." },
            "es-MX": { name: "Terminar una relación", goal: "Has decidido que necesitas terminar la relación. Inicia la difícil conversación, explicando tus sentimientos de manera honesta pero amable." },
            image: "assets/romance/placeholder.png"
        }
    },
    "😅 Situações Embaraçosas": {
        "Esquecendo o nome de alguém": {
            "pt-BR": { goal: "Alguém que você já conheceu vem falar com você, mas você esqueceu o nome da pessoa. Lide com a situação educadamente." },
            "en-US": { name: "Forgetting someone's name", goal: "Someone you've met before comes to talk to you, but you've forgotten their name. Handle the situation gracefully." },
            "es-MX": { name: "Olvidar el nombre de alguien", goal: "Alguien que ya conocías se acerca a hablar contigo, pero has olvidado su nombre. Maneja la situación con elegancia." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Chamando alguém pelo nome errado": {
            "pt-BR": { goal: "Você acidentalmente chamou um colega de trabalho pelo nome errado. Peça desculpas e corrija-se." },
            "en-US": { name: "Calling someone by the wrong name", goal: "You accidentally called a coworker by the wrong name. Apologize and correct yourself." },
            "es-MX": { name: "Llamar a alguien por el nombre equivocado", goal: "Llamaste accidentalmente a un compañero de trabajo por el nombre equivocado. Discúlpate y corrígete." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Enviando uma mensagem para a pessoa errada": {
            "pt-BR": { goal: "Você enviou uma mensagem de texto reclamando do seu chefe... para o seu chefe. Envie uma mensagem de acompanhamento para se desculpar e esclarecer." },
            "en-US": { name: "Sending a text to the wrong person", goal: "You sent a text complaining about your boss... to your boss. Send a follow-up message to apologize and clarify." },
            "es-MX": { name: "Enviar un mensaje a la persona equivocada", goal: "Enviaste un mensaje de texto quejándote de tu jefe... a tu jefe. Envía un mensaje de seguimiento para disculparte y aclarar." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Entrando na sala de reunião errada": {
            "pt-BR": { goal: "Você entrou em uma sala e percebeu que é a reunião errada. Peça desculpas e saia discretamente." },
            "en-US": { name: "Walking into the wrong meeting room", goal: "You walked into a room and realize it's the wrong meeting. Apologize and exit discreetly." },
            "es-MX": { name: "Entrar a la sala de juntas equivocada", goal: "Entraste a una sala y te das cuenta de que es la reunión equivocada. Discúlpate y sal discretamente." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Derramando café em alguém": {
            "pt-BR": { goal: "Você acidentalmente derramou café na camisa de um colega. Peça desculpas profusamente e ofereça-se para ajudar a limpar." },
            "en-US": { name: "Spilling coffee on someone", goal: "You accidentally spilled coffee on a colleague's shirt. Apologize profusely and offer to help clean it up." },
            "es-MX": { name: "Derramar café sobre alguien", goal: "Derramaste café accidentalmente en la camisa de un colega. Discúlpate profusamente y ofrece ayuda para limpiarlo." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Contando uma piada que ninguém entendeu": {
            "pt-BR": { goal: "Você contou uma piada e foi recebido com silêncio. Tente salvar a situação com um comentário leve." },
            "en-US": { name: "Telling a joke that no one gets", goal: "You told a joke and it was met with silence. Try to save the situation with a lighthearted comment." },
            "es-MX": { name: "Contar un chiste que nadie entiende", goal: "Contaste un chiste y te recibieron con silencio. Intenta salvar la situación con un comentario ligero." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Seu cartão de crédito foi recusado": {
            "pt-BR": { goal: "Você está pagando por um item, mas seu cartão é recusado. Diga ao caixa que você tentará outro método de pagamento." },
            "en-US": { name: "Your credit card is declined", goal: "You are paying for an item, but your card is declined. Tell the cashier you will try another payment method." },
            "es-MX": { name: "Tu tarjeta de crédito es rechazada", goal: "Estás pagando por un artículo, pero tu tarjeta es rechazada. Dile al cajero que intentarás con otro método de pago." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Encontrando um ex em público": {
            "pt-BR": { goal: "Você inesperadamente encontra seu ex-parceiro(a) no supermercado. Tenha uma breve e educada conversa." },
            "en-US": { name: "Running into an ex in public", goal: "You unexpectedly bump into your ex-partner at the supermarket. Have a brief, polite conversation." },
            "es-MX": { name: "Encontrarse a un ex en público", goal: "Te encuentras inesperadamente a tu ex-pareja en el supermercado. Ten una conversación breve y educada." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Alguém aponta que você tem algo no dente": {
            "pt-BR": { goal: "Durante uma conversa, alguém aponta que você tem comida no dente. Agradeça à pessoa e lide com a situação." },
            "en-US": { name: "Someone points out you have food in your teeth", goal: "During a conversation, someone points out you have food in your teeth. Thank the person and handle the situation." },
            "es-MX": { name: "Alguien señala que tienes comida en los dientes", goal: "Durante una conversación, alguien señala que tienes comida en los dientes. Agradécele a la persona y maneja la situación." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Respondendo a um elogio estranho": {
            "pt-BR": { goal: "Alguém lhe faz um elogio que soa um pouco estranho ou ambíguo. Responda de forma educada, mas neutra." },
            "en-US": { name: "Responding to an awkward compliment", goal: "Someone gives you a compliment that sounds a bit strange or backhanded. Respond in a polite but neutral way." },
            "es-MX": { name: "Responder a un cumplido incómodo", goal: "Alguien te hace un cumplido que suena un poco extraño o ambiguo. Responde de manera educada pero neutral." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Interrompendo alguém acidentalmente": {
            "pt-BR": { goal: "Você se empolgou e interrompeu alguém no meio de uma frase. Peça desculpas e incentive a pessoa a continuar." },
            "en-US": { name: "Interrupting someone accidentally", goal: "You got excited and cut someone off mid-sentence. Apologize and encourage them to continue." },
            "es-MX": { name: "Interrumpir a alguien accidentalmente", goal: "Te emocionaste e interrumpiste a alguien a media frase. Discúlpate y anímale a continuar." },
            image: "assets/embaracoso/placeholder.png"
        },
        "Fingindo que entendeu algo que não entendeu": {
            "pt-BR": { goal: "Alguém explicou algo, você disse que entendeu, mas não entendeu. Agora eles estão fazendo uma pergunta. Admita que precisa de mais esclarecimentos." },
            "en-US": { name: "Pretending you understood something you didn't", goal: "Someone explained something, you nodded along, but you didn't get it. Now they're asking you a question. Admit you need more clarification." },
            "es-MX": { name: "Fingir que entendiste algo que no entendiste", goal: "Alguien explicó algo, asentiste como si hubieras entendido, pero no fue así. Ahora te están haciendo una pregunta. Admite que necesitas más aclaraciones." },
            image: "assets/embaracoso/placeholder.png"
        }
    },
    "💼 Mestre das Entrevistas": {
        "Apresentando-se ao entrevistador": {
            "pt-BR": { goal: "A entrevista começou. Cumprimente o entrevistador, agradeça pela oportunidade e apresente-se brevemente." },
            "en-US": { name: "Introducing yourself to the interviewer", goal: "The interview has begun. Greet the interviewer, thank them for the opportunity, and briefly introduce yourself." },
            "es-MX": { name: "Presentarte con el entrevistador", goal: "La entrevista ha comenzado. Saluda al entrevistador, agradécele la oportunidad y preséntate brevemente." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Respondendo 'Fale-me sobre você'": {
            "pt-BR": { goal: "O entrevistador pede: 'Fale-me um pouco sobre você'. Responda com um resumo conciso da sua experiência profissional relevante." },
            "en-US": { name: "Answering 'Tell me about yourself'", goal: "The interviewer asks: 'Tell me a little about yourself'. Respond with a concise summary of your relevant professional experience." },
            "es-MX": { name: "Responder a 'Háblame de ti'", goal: "El entrevistador pregunta: 'Háblame un poco de ti'. Responde con un resumen conciso de tu experiencia profesional relevante." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Descrevendo seus pontos fortes": {
            "pt-BR": { goal: "O entrevistador pergunta: 'Quais são seus maiores pontos fortes?'. Mencione dois ou três pontos fortes com exemplos." },
            "en-US": { name: "Describing your strengths", goal: "The interviewer asks: 'What are your greatest strengths?'. Mention two or three strengths with examples." },
            "es-MX": { name: "Describir tus fortalezas", goal: "El entrevistador pregunta: '¿Cuáles son tus mayores fortalezas?'. Menciona dos o tres fortalezas con ejemplos." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Descrevendo seus pontos fracos": {
            "pt-BR": { goal: "O entrevistador pergunta: 'Qual é o seu maior ponto fraco?'. Responda honestamente, mas foque em como você está trabalhando para melhorar." },
            "en-US": { name: "Describing your weaknesses", goal: "The interviewer asks: 'What is your greatest weakness?'. Answer honestly but focus on how you are working to improve." },
            "es-MX": { name: "Describir tus debilidades", goal: "El entrevistador pregunta: '¿Cuál es tu mayor debilidad?'. Responde honestamente pero enfócate en cómo estás trabajando para mejorar." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Respondendo 'Por que você quer este trabalho?'": {
            "pt-BR": { goal: "Explique seu interesse na vaga, conectando suas habilidades e paixões com os requisitos do trabalho e a missão da empresa." },
            "en-US": { name: "Answering 'Why do you want this job?'", goal: "Explain your interest in the position, connecting your skills and passions with the job requirements and the company's mission." },
            "es-MX": { name: "Responder a '¿Por qué quieres este trabajo?'", goal: "Explica tu interés en el puesto, conectando tus habilidades y pasiones con los requisitos del trabajo y la misión de la empresa." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Pergunta comportamental: Trabalho em equipe": {
            "pt-BR": { goal: "Responda à pergunta: 'Fale sobre uma vez em que você teve que trabalhar com um colega difícil'." },
            "en-US": { name: "Behavioral question: Teamwork", goal: "Answer the question: 'Tell me about a time you had to work with a difficult colleague'." },
            "es-MX": { name: "Pregunta conductual: Trabajo en equipo", goal: "Responde a la pregunta: 'Háblame de una vez que tuviste que trabajar con un colega difícil'." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Pergunta comportamental: Resolução de problemas": {
            "pt-BR": { goal: "Responda à pergunta: 'Descreva um desafio complexo que você enfrentou no trabalho e como você o resolveu'." },
            "en-US": { name: "Behavioral question: Problem-solving", goal: "Answer the question: 'Describe a complex challenge you faced at work and how you solved it'." },
            "es-MX": { name: "Pregunta conductual: Resolución de problemas", goal: "Responde a la pregunta: 'Describe un desafío complejo que enfrentaste en el trabajo y cómo lo resolviste'." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Pergunta comportamental: Liderança": {
            "pt-BR": { goal: "Responda à pergunta: 'Fale sobre uma vez em que você assumiu a liderança em um projeto'." },
            "en-US": { name: "Behavioral question: Leadership", goal: "Answer the question: 'Tell me about a time you took the lead on a project'." },
            "es-MX": { name: "Pregunta conductual: Liderazgo", goal: "Responde a la pregunta: 'Háblame de una vez que tomaste la iniciativa en un proyecto'." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Fazendo perguntas ao entrevistador": {
            "pt-BR": { goal: "No final da entrevista, o entrevistador pergunta se você tem alguma dúvida. Faça duas perguntas perspicazes sobre a equipe ou a cultura da empresa." },
            "en-US": { name: "Asking questions to the interviewer", goal: "At the end of the interview, the interviewer asks if you have any questions. Ask two insightful questions about the team or company culture." },
            "es-MX": { name: "Hacer preguntas al entrevistador", goal: "Al final de la entrevista, el entrevistador pregunta si tienes alguna pregunta. Haz dos preguntas perspicaces sobre el equipo o la cultura de la empresa." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Discutindo a pretensão salarial": {
            "pt-BR": { goal: "O entrevistador pergunta sobre sua pretensão salarial. Responda fornecendo uma faixa salarial baseada em sua pesquisa e experiência." },
            "en-US": { name: "Discussing salary expectations", goal: "The interviewer asks about your salary expectations. Respond by providing a salary range based on your research and experience." },
            "es-MX": { name: "Discutir expectativas salariales", goal: "El entrevistador pregunta sobre tus expectativas salariales. Responde proporcionando un rango salarial basado en tu investigación y experiencia." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Respondendo 'Onde você se vê em 5 anos?'": {
            "pt-BR": { goal: "O entrevistador pergunta sobre seus planos de carreira. Descreva seus objetivos de forma que se alinhem com o crescimento potencial dentro da empresa." },
            "en-US": { name: "Answering 'Where do you see yourself in 5 years?'", goal: "The interviewer asks about your career plans. Describe your goals in a way that aligns with potential growth within the company." },
            "es-MX": { name: "Responder a '¿Dónde te ves en 5 años?'", goal: "El entrevistador pregunta sobre tus planes de carrera. Describe tus metas de una manera que se alinee con el crecimiento potencial dentro de la empresa." },
            image: "assets/entrevistas/placeholder.png"
        },
        "Encerrando a entrevista": {
            "pt-BR": { goal: "A entrevista está terminando. Agradeça novamente ao entrevistador pelo tempo dele e reitere seu forte interesse na vaga." },
            "en-US": { name: "Closing the interview", goal: "The interview is ending. Thank the interviewer again for their time and reiterate your strong interest in the position." },
            "es-MX": { name: "Cerrar la entrevista", goal: "La entrevista está terminando. Agradece nuevamente al entrevistador por su tiempo y reitera tu gran interés en el puesto." },
            image: "assets/entrevistas/placeholder.png"
        }
    },
    "💬 Conversa de Elevador": {
        "Comentando sobre o tempo": {
            "pt-BR": { goal: "Você entra em um elevador com um vizinho. Inicie uma breve conversa sobre como o tempo está chuvoso hoje." },
            "en-US": { name: "Commenting on the weather", goal: "You get into an elevator with a neighbor. Start a brief conversation about the rainy weather today." },
            "es-MX": { name: "Comentar sobre el clima", goal: "Entras a un elevador con un vecino. Inicia una breve conversación sobre el clima lluvioso de hoy." },
            image: "assets/elevador/placeholder.png"
        },
        "Elogiando um colega": {
            "pt-BR": { goal: "Você está no elevador com um colega. Faça um elogio rápido sobre a apresentação que ele fez mais cedo." },
            "en-US": { name: "Complimenting a coworker", goal: "You are in the elevator with a colleague. Give them a quick compliment on the presentation they gave earlier." },
            "es-MX": { name: "Elogiar a un colega", goal: "Estás en el elevador con un colega. Hazle un cumplido rápido sobre la presentación que dio antes." },
            image: "assets/elevador/placeholder.png"
        },
        "Perguntando sobre o fim de semana": {
            "pt-BR": { goal: "É sexta-feira à tarde. Pergunte a um colega no elevador se ele tem algum plano interessante para o fim de semana." },
            "en-US": { name: "Asking about the weekend", goal: "It's Friday afternoon. Ask a coworker in the elevator if they have any exciting plans for the weekend." },
            "es-MX": { name: "Preguntar sobre el fin de semana", goal: "Es viernes por la tarde. Pregúntale a un colega en el elevador si tiene algún plan emocionante para el fin de semana." },
            image: "assets/elevador/placeholder.png"
        },
        "Falando sobre a carga de trabalho": {
            "pt-BR": { goal: "Você e um colega estão saindo no final do dia. Faça um breve comentário sobre como a semana foi corrida." },
            "en-US": { name: "Talking about workload", goal: "You and a colleague are leaving at the end of the day. Make a brief comment about how busy the week has been." },
            "es-MX": { name: "Hablar sobre la carga de trabajo", goal: "Tú y un colega están saliendo al final del día. Haz un breve comentario sobre lo ocupada que ha estado la semana." },
            image: "assets/elevador/placeholder.png"
        },
        "Comentando sobre um evento da empresa": {
            "pt-BR": { goal: "No dia seguinte a uma festa da empresa, comente com um colega no elevador o quão divertido foi o evento." },
            "en-US": { name: "Commenting on a company event", goal: "The day after a company party, comment to a colleague in the elevator on how much fun the event was." },
            "es-MX": { name: "Comentar sobre un evento de la empresa", goal: "Al día siguiente de una fiesta de la empresa, coméntale a un colega en el elevador lo divertido que fue el evento." },
            image: "assets/elevador/placeholder.png"
        },
        "Conversa com um executivo": {
            "pt-BR": { goal: "Você está sozinho no elevador com um executivo de alto escalão. Apresente-se brevemente e mencione em qual equipe você trabalha." },
            "en-US": { name: "Chatting with an executive", goal: "You are alone in the elevator with a high-level executive. Briefly introduce yourself and mention what team you work on." },
            "es-MX": { name: "Charlar con un ejecutivo", goal: "Estás solo en el elevador con un ejecutivo de alto nivel. Preséntate brevemente y menciona en qué equipo trabajas." },
            image: "assets/elevador/placeholder.png"
        },
        "Perguntando sobre o almoço": {
            "pt-BR": { goal: "É perto da hora do almoço. Pergunte a um colega no elevador se ele tem alguma recomendação de lugar para comer por perto." },
            "en-US": { name: "Asking about lunch", goal: "It's around lunchtime. Ask a colleague in the elevator if they have any recommendations for a place to eat nearby." },
            "es-MX": { name: "Preguntar sobre el almuerzo", goal: "Es casi la hora del almuerzo. Pregúntale a un colega en el elevador si tiene alguna recomendación de un lugar para comer cerca." },
            image: "assets/elevador/placeholder.png"
        },
        "Desejando um bom feriado": {
            "pt-BR": { goal: "É o último dia de trabalho antes de um feriado. Deseje a um colega no elevador um bom feriado." },
            "en-US": { name: "Wishing a happy holiday", goal: "It's the last workday before a holiday. Wish a coworker in the elevator a happy holiday." },
            "es-MX": { name: "Desear un feliz día festivo", goal: "Es el último día de trabajo antes de un día festivo. Deséale a un colega en el elevador un feliz día festivo." },
            image: "assets/elevador/placeholder.png"
        },
        "Reagindo a uma parada inesperada": {
            "pt-BR": { goal: "O elevador para entre os andares. Faça um comentário calmo e leve para a outra pessoa para quebrar a tensão." },
            "en-US": { name: "Reacting to an unexpected stop", goal: "The elevator stops between floors. Make a calm, lighthearted comment to the other person to break the tension." },
            "es-MX": { name: "Reaccionar a una parada inesperada", goal: "El elevador se detiene entre pisos. Haz un comentario tranquilo y ligero a la otra persona para romper la tensión." },
            image: "assets/elevador/placeholder.png"
        },
        "Oferecendo ajuda": {
            "pt-BR": { goal: "Você vê alguém no elevador lutando para carregar várias caixas. Ofereça-se para segurar a porta ou apertar o botão do andar." },
            "en-US": { name: "Offering help", goal: "You see someone in the elevator struggling with several boxes. Offer to hold the door or press the floor button for them." },
            "es-MX": { name: "Ofrecer ayuda", goal: "Ves a alguien en el elevador batallando para cargar varias cajas. Ofrécete a detener la puerta o presionar el botón del piso por ellos." },
            image: "assets/elevador/placeholder.png"
        },
        "Comentando sobre o trânsito": {
            "pt-BR": { goal: "É de manhã e você entra no elevador com um colega. Comente brevemente sobre como o trânsito estava ruim hoje." },
            "en-US": { name: "Commenting on traffic", goal: "It's the morning and you get in the elevator with a colleague. Briefly comment on how bad the traffic was today." },
            "es-MX": { name: "Comentar sobre el tráfico", goal: "Es por la mañana y entras al elevador con un colega. Comenta brevemente sobre lo terrible que estuvo el tráfico hoy." },
            image: "assets/elevador/placeholder.png"
        },
        "Encerrando a conversa": {
            "pt-BR": { goal: "Você chegou ao seu andar. Termine a conversa educadamente desejando à outra pessoa um bom dia." },
            "en-US": { name: "Ending the conversation", goal: "You have arrived at your floor. Politely end the conversation by wishing the other person a good day." },
            "es-MX": { name: "Terminar la conversación", goal: "Has llegado a tu piso. Termina la conversación amablemente deseándole a la otra persona un buen día." },
            image: "assets/elevador/placeholder.png"
        }
    },
    "🛠️ Resolução de Conflitos": {
        "Colega de quarto bagunceiro": {
            "pt-BR": { goal: "Seu colega de quarto não lava a louça há dias. Inicie uma conversa para pedir que ele ajude a manter a cozinha limpa." },
            "en-US": { name: "Messy roommate", goal: "Your roommate hasn't done their dishes in days. Start a conversation to ask them to help keep the kitchen clean." },
            "es-MX": { name: "Compañero de cuarto desordenado", goal: "Tu compañero de cuarto no ha lavado los platos en días. Inicia una conversación para pedirle que ayude a mantener la cocina limpia." },
            image: "assets/conflitos/placeholder.png"
        },
        "Vizinho barulhento": {
            "pt-BR": { goal: "O cachorro do seu vizinho late constantemente durante a noite. Converse com seu vizinho sobre o problema de forma educada." },
            "en-US": { name: "Noisy neighbor", goal: "Your neighbor's dog barks constantly during the night. Talk to your neighbor about the issue in a polite way." },
            "es-MX": { name: "Vecino ruidoso", goal: "El perro de tu vecino ladra constantemente durante la noche. Habla con tu vecino sobre el problema de manera educada." },
            image: "assets/conflitos/placeholder.png"
        },
        "Discordando de um amigo": {
            "pt-BR": { goal: "Seu amigo quer ir a um restaurante caro, mas você está com o orçamento apertado. Sugira uma alternativa mais barata sem ofendê-lo." },
            "en-US": { name: "Disagreeing with a friend", goal: "Your friend wants to go to an expensive restaurant, but you're on a budget. Suggest a cheaper alternative without offending them." },
            "es-MX": { name: "No estar de acuerdo con un amigo", goal: "Tu amigo quiere ir a un restaurante caro, pero tienes un presupuesto limitado. Sugiere una alternativa más barata sin ofenderlo." },
            image: "assets/conflitos/placeholder.png"
        },
        "Item emprestado não devolvido": {
            "pt-BR": { goal: "Você emprestou um livro a um amigo há meses e ele ainda não o devolveu. Peça o livro de volta educadamente." },
            "en-US": { name: "Borrowed item not returned", goal: "You lent a book to a friend months ago and they haven't returned it. Politely ask for the book back." },
            "es-MX": { name: "Artículo prestado no devuelto", goal: "Le prestaste un libro a un amigo hace meses y no lo ha devuelto. Pídele amablemente que te lo devuelva." },
            image: "assets/conflitos/placeholder.png"
        },
        "Dividindo despesas com amigos": {
            "pt-BR": { goal: "Você saiu com amigos e um deles 'esqueceu' de pagar a parte dele na conta. Aborde o assunto com ele em particular." },
            "en-US": { name: "Splitting expenses with friends", goal: "You went out with friends and one of them 'forgot' to pay their share of the bill. Bring it up with them privately." },
            "es-MX": { name: "Dividir gastos con amigos", goal: "Saliste con amigos y uno de ellos 'olvidó' pagar su parte de la cuenta. Habla con él sobre el tema en privado." },
            image: "assets/conflitos/placeholder.png"
        },
        "Recebendo feedback negativo": {
            "pt-BR": { goal: "Seu chefe lhe deu um feedback construtivo com o qual você não concorda totalmente. Responda de forma profissional e peça exemplos específicos." },
            "en-US": { name: "Receiving negative feedback", goal: "Your boss has given you constructive feedback that you don't fully agree with. Respond professionally and ask for specific examples." },
            "es-MX": { name: "Recibir retroalimentación negativa", goal: "Tu jefe te ha dado una retroalimentación constructiva con la que no estás del todo de acuerdo. Responde profesionalmente y pide ejemplos específicos." },
            image: "assets/conflitos/placeholder.png"
        },
        "Colega de trabalho pegando crédito": {
            "pt-BR": { goal: "Um colega apresentou sua ideia como se fosse dele em uma reunião. Converse com ele em particular sobre o ocorrido." },
            "en-US": { name: "Coworker taking credit", goal: "A coworker presented your idea as their own in a meeting. Talk to them privately about what happened." },
            "es-MX": { name: "Colega que se atribuye el mérito", goal: "Un colega presentó tu idea como si fuera suya en una reunión. Habla con él en privado sobre lo que pasó." },
            image: "assets/conflitos/placeholder.png"
        },
        "Mal-entendido por e-mail": {
            "pt-BR": { goal: "O tom de um e-mail de um colega pareceu rude. Em vez de responder com raiva, vá até a mesa dele para esclarecer a situação pessoalmente." },
            "en-US": { name: "Misunderstanding via email", goal: "A coworker's email tone came across as rude. Instead of replying angrily, go to their desk to clarify the situation in person." },
            "es-MX": { name: "Malentendido por correo electrónico", goal: "El tono de un correo electrónico de un colega te pareció grosero. En lugar de responder enojado, ve a su escritorio para aclarar la situación en persona." },
            image: "assets/conflitos/placeholder.png"
        },
        "Cancelando planos de última hora": {
            "pt-BR": { goal: "Você precisa cancelar planos com um amigo na noite do evento. Ligue para ele, peça desculpas e explique a situação." },
            "en-US": { name: "Canceling plans last-minute", goal: "You need to cancel plans with a friend on the night of the event. Call them, apologize, and explain the situation." },
            "es-MX": { name: "Cancelar planes a última hora", goal: "Necesitas cancelar planes con un amigo la misma noche del evento. Llámale, discúlpate y explícale la situación." },
            image: "assets/conflitos/placeholder.png"
        },
        "Conflito de agendamento no trabalho": {
            "pt-BR": { goal: "Você e um colega marcaram reuniões conflitantes na mesma sala. Negociem para ver quem pode usar a sala ou se um de vocês pode remarcá-la." },
            "en-US": { name: "Scheduling conflict at work", goal: "You and a coworker have booked the same meeting room at the same time. Negotiate to see who can use the room or if one of you can reschedule." },
            "es-MX": { name: "Conflicto de horarios en el trabajo", goal: "Tú y un colega han reservado la misma sala de juntas a la misma hora. Negocien para ver quién puede usar la sala o si uno de ustedes puede reagendar." },
            image: "assets/conflitos/placeholder.png"
        },
        "Mediando uma discussão": {
            "pt-BR": { goal: "Dois de seus amigos estão discutindo sobre algo trivial. Intervenha como um mediador neutro para ajudá-los a encontrar um meio-termo." },
            "en-US": { name: "Mediating an argument", goal: "Two of your friends are arguing over something trivial. Step in as a neutral mediator to help them find a middle ground." },
            "es-MX": { name: "Mediar una discusión", goal: "Dos de tus amigos están discutiendo por algo trivial. Intervén como mediador neutral para ayudarles a encontrar un punto medio." },
            image: "assets/conflitos/placeholder.png"
        },
        "Dando feedback construtivo": {
            "pt-BR": { goal: "Você precisa dar feedback a um colega sobre uma parte do trabalho dele que precisa de melhorias. Aborde a conversa de forma positiva e construtiva." },
            "en-US": { name: "Giving constructive feedback", goal: "You need to give feedback to a colleague about a part of their work that needs improvement. Approach the conversation positively and constructively." },
            "es-MX": { name: "Dar retroalimentación constructiva", goal: "Necesitas dar retroalimentación a un colega sobre una parte de su trabajo que necesita mejorar. Aborda la conversación de manera positiva y constructiva." },
            image: "assets/conflitos/placeholder.png"
        }
    },
    "🍺 Bar & Happy Hour": {
        "Encontrando amigos no bar": {
            "pt-BR": { goal: "Você chegou ao bar e vê seus amigos em uma mesa. Aproxime-se e cumprimente a todos." },
            "en-US": { name: "Meeting friends at the bar", goal: "You've arrived at the bar and see your friends at a table. Go over and greet everyone." },
            "es-MX": { name: "Encontrarse con amigos en el bar", goal: "Llegaste al bar y ves a tus amigos en una mesa. Acércate y saluda a todos." },
            image: "assets/bar/placeholder.png"
        },
        "Chamando a atenção do barman": {
            "pt-BR": { goal: "O bar está cheio, mas você está pronto para pedir. Chame a atenção do barman educadamente." },
            "en-US": { name: "Getting the bartender's attention", goal: "The bar is busy, but you're ready to order. Politely get the bartender's attention." },
            "es-MX": { name: "Llamar la atención del barman", goal: "El bar está lleno, pero estás listo para ordenar. Llama la atención del barman de manera educada." },
            image: "assets/bar/placeholder.png"
        },
        "Pedindo uma cerveja": {
            "pt-BR": { goal: "Vá ao balcão e peça uma cerveja pilsen." },
            "en-US": { name: "Ordering a beer", goal: "Go to the bar and order one pint of lager." },
            "es-MX": { name: "Pedir una cerveza", goal: "Ve a la barra y pide una cerveza lager de barril." },
            image: "assets/bar/placeholder.png"
        },
        "Perguntando sobre as cervejas da casa": {
            "pt-BR": { goal: "Você quer experimentar algo local. Pergunte ao barman que tipos de cervejas artesanais eles têm na torneira." },
            "en-US": { name: "Asking about the beers on tap", goal: "You want to try something local. Ask the bartender what kind of craft beers they have on tap." },
            "es-MX": { name: "Preguntar por las cervezas de barril", goal: "Quieres probar algo local. Pregúntale al barman qué tipo de cervezas artesanales tienen de barril." },
            image: "assets/bar/placeholder.png"
        },
        "Pedindo uma rodada de bebidas": {
            "pt-BR": { goal: "É a sua vez de pagar. Pergunte aos seus amigos o que eles querem beber e faça o pedido para o grupo." },
            "en-US": { name: "Ordering a round of drinks", goal: "It's your turn to pay. Ask your friends what they want to drink and place the order for the group." },
            "es-MX": { name: "Pedir una ronda de bebidas", goal: "Es tu turno de pagar. Pregúntale a tus amigos qué quieren beber y haz el pedido para el grupo." },
            image: "assets/bar/placeholder.png"
        },
        "Puxando conversa com um estranho": {
            "pt-BR": { goal: "Você está sozinho no bar. Inicie uma conversa com a pessoa ao seu lado comentando sobre o jogo na TV." },
            "en-US": { name: "Starting a conversation with a stranger", goal: "You are at the bar alone. Start a conversation with the person next to you by commenting on the game on TV." },
            "es-MX": { name: "Iniciar conversación con un desconocido", goal: "Estás solo en el bar. Inicia una conversación con la persona de al lado comentando sobre el partido en la televisión." },
            image: "assets/bar/placeholder.png"
        },
        "Pedindo um aperitivo": {
            "pt-BR": { goal: "Você está com fome. Peça ao garçom uma porção de batatas fritas para compartilhar com a mesa." },
            "en-US": { name: "Ordering an appetizer", goal: "You are feeling hungry. Order a portion of fries to share with the table from the waiter." },
            "es-MX": { name: "Pedir una botana", goal: "Tienes hambre. Pídele al mesero una porción de papas fritas para compartir con la mesa." },
            image: "assets/bar/placeholder.png"
        },
        "Abrindo uma comanda": {
            "pt-BR": { goal: "Diga ao barman que você gostaria de abrir uma comanda e entregue seu cartão de crédito." },
            "en-US": { name: "Starting a tab", goal: "Tell the bartender you'd like to start a tab and give them your credit card." },
            "es-MX": { name: "Abrir una cuenta", goal: "Dile al barman que te gustaría abrir una cuenta y dale tu tarjeta de crédito." },
            image: "assets/bar/placeholder.png"
        },
        "Fechando a comanda": {
            "pt-BR": { goal: "Você está pronto para ir embora. Peça ao barman para fechar sua comanda." },
            "en-US": { name: "Closing your tab", goal: "You are ready to leave. Ask the bartender to close your tab." },
            "es-MX": { name: "Cerrar tu cuenta", goal: "Estás listo para irte. Pídele al barman que cierre tu cuenta." },
            image: "assets/bar/placeholder.png"
        },
        "Recusando uma bebida educadamente": {
            "pt-BR": { goal: "Alguém oferece para comprar uma bebida para você, mas você não quer mais beber. Agradeça e recuse educadamente." },
            "en-US": { name: "Politely declining a drink", goal: "Someone offers to buy you a drink, but you don't want to drink anymore. Thank them and politely decline." },
            "es-MX": { name: "Rechazar una bebida amablemente", goal: "Alguien te ofrece invitarte una bebida, pero ya no quieres beber más. Agradécele y recházala amablemente." },
            image: "assets/bar/placeholder.png"
        },
        "Encontrando o banheiro": {
            "pt-BR": { goal: "Você precisa usar o banheiro. Pergunte a um funcionário onde ele fica." },
            "en-US": { name: "Finding the restroom", goal: "You need to use the restroom. Ask a staff member where it is located." },
            "es-MX": { name: "Encontrar el baño", goal: "Necesitas usar el baño. Pregúntale a un miembro del personal dónde se encuentra." },
            image: "assets/bar/placeholder.png"
        },
        "Lidando com atenção indesejada": {
            "pt-BR": { goal: "Alguém no bar está te incomodando. Deixe claro, de forma firme mas educada, que você não está interessado em conversar." },
            "en-US": { name: "Dealing with unwanted attention", goal: "Someone at the bar is bothering you. Firmly but politely make it clear that you are not interested in talking." },
            "es-MX": { name: "Lidiar con atención no deseada", goal: "Alguien en el bar te está molestando. Deja en claro, de manera firme pero educada, que no te interesa hablar." },
            image: "assets/bar/placeholder.png"
        }
    },
    "🍳 Cozinhando em Casa": {
        "Convidando amigos para jantar": {
            "pt-BR": { goal: "Ligue para um amigo e convide-o para jantar na sua casa no próximo sábado." },
            "en-US": { name: "Inviting friends for dinner", goal: "Call a friend and invite them over for dinner at your place next Saturday." },
            "es-MX": { name: "Invitar a amigos a cenar", goal: "Llama a un amigo e invítalo a cenar a tu casa el próximo sábado." },
            image: "assets/cozinha/placeholder.png"
        },
        "Perguntando sobre restrições alimentares": {
            "pt-BR": { goal: "Ao convidar amigos para jantar, pergunte se alguém tem alguma alergia ou restrição alimentar." },
            "en-US": { name: "Asking about dietary restrictions", goal: "When inviting friends for dinner, ask if anyone has any allergies or dietary restrictions." },
            "es-MX": { name: "Preguntar sobre restricciones alimentarias", goal: "Al invitar a amigos a cenar, pregunta si alguien tiene alguna alergia o restricción alimentaria." },
            image: "assets/cozinha/placeholder.png"
        },
        "Indo às compras para a receita": {
            "pt-BR": { goal: "Você está no supermercado, mas não encontra um ingrediente. Peça a um funcionário para te ajudar a encontrar o coentro." },
            "en-US": { name: "Shopping for the recipe", goal: "You're at the supermarket but can't find an ingredient. Ask an employee to help you find cilantro." },
            "es-MX": { name: "Comprar los ingredientes para la receta", goal: "Estás en el supermercado pero no encuentras un ingrediente. Pídele a un empleado que te ayude a encontrar el cilantro." },
            image: "assets/cozinha/placeholder.png"
        },
        "Pedindo ajuda na cozinha": {
            "pt-BR": { goal: "Você está cozinhando com um amigo. Peça a ele para picar as cebolas enquanto você prepara o molho." },
            "en-US": { name: "Asking for help in the kitchen", goal: "You are cooking with a friend. Ask them to chop the onions while you prepare the sauce." },
            "es-MX": { name: "Pedir ayuda en la cocina", goal: "Estás cocinando con un amigo. Pídele que pique las cebollas mientras tú preparas la salsa." },
            image: "assets/cozinha/placeholder.png"
        },
        "Seguindo uma receita": {
            "pt-BR": { goal: "Você não tem certeza sobre o próximo passo da receita. Pergunte ao seu parceiro de cozinha: 'O que a receita diz para fazer a seguir?'" },
            "en-US": { name: "Following a recipe", goal: "You are unsure about the next step in the recipe. Ask your cooking partner, 'What does the recipe say to do next?'" },
            "es-MX": { name: "Seguir una receta", goal: "No estás seguro sobre el siguiente paso de la receta. Pregúntale a tu compañero de cocina: '¿Qué dice la receta que hay que hacer ahora?'" },
            image: "assets/cozinha/placeholder.png"
        },
        "Oferecendo uma bebida aos convidados": {
            "pt-BR": { goal: "Seus convidados chegaram. Ofereça a eles algo para beber, como vinho ou água." },
            "en-US": { name: "Offering guests a drink", goal: "Your guests have arrived. Offer them something to drink, like wine or water." },
            "es-MX": { name: "Ofrecer una bebida a los invitados", goal: "Tus invitados han llegado. Ofréceles algo de beber, como vino o agua." },
            image: "assets/cozinha/placeholder.png"
        },
        "Anunciando que o jantar está pronto": {
            "pt-BR": { goal: "A comida está pronta. Chame seus convidados para a mesa de jantar." },
            "en-US": { name: "Announcing that dinner is ready", goal: "The food is ready. Call your guests to the dining table." },
            "es-MX": { name: "Anunciar que la cena está lista", goal: "La comida está lista. Llama a tus invitados a la mesa." },
            image: "assets/cozinha/placeholder.png"
        },
        "Explicando o prato": {
            "pt-BR": { goal: "Ao servir a comida, descreva brevemente o prato que você preparou para seus convidados." },
            "en-US": { name: "Explaining the dish", goal: "As you serve the food, briefly describe the dish you have prepared for your guests." },
            "es-MX": { name: "Explicar el platillo", goal: "Mientras sirves la comida, describe brevemente el platillo que has preparado para tus invitados." },
            image: "assets/cozinha/placeholder.png"
        },
        "Aceitando elogios": {
            "pt-BR": { goal: "Um convidado elogia sua comida. Agradeça e diga que está feliz que ele gostou." },
            "en-US": { name: "Accepting compliments", goal: "A guest compliments your cooking. Thank them and say you're glad they enjoy it." },
            "es-MX": { name: "Aceptar cumplidos", goal: "Un invitado elogia tu comida. Agradécele y dile que te alegra que le guste." },
            image: "assets/cozinha/placeholder.png"
        },
        "Oferecendo mais comida": {
            "pt-BR": { goal: "Pergunte aos seus convidados se eles gostariam de uma segunda porção do prato principal." },
            "en-US": { name: "Offering more food", goal: "Ask your guests if they would like a second serving of the main course." },
            "es-MX": { name: "Ofrecer más comida", goal: "Pregúntale a tus invitados si les gustaría una segunda porción del plato principal." },
            image: "assets/cozinha/placeholder.png"
        },
        "Lidando com um pequeno desastre na cozinha": {
            "pt-BR": { goal: "Você queimou o alho para o molho. Diga ao seu parceiro de cozinha que você precisa jogar fora e começar de novo." },
            "en-US": { name: "Handling a small kitchen disaster", goal: "You burned the garlic for the sauce. Tell your cooking partner that you need to throw it out and start over." },
            "es-MX": { name: "Manejar un pequeño desastre en la cocina", goal: "Quemaste el ajo para la salsa. Dile a tu compañero de cocina que necesitas tirarlo y empezar de nuevo." },
            image: "assets/cozinha/placeholder.png"
        },
        "Recusando ajuda para limpar": {
            "pt-BR": { goal: "Seus convidados oferecem ajuda para lavar a louça. Agradeça, mas insista educadamente que eles relaxem e que você cuidará disso mais tarde." },
            "en-US": { name: "Refusing help with cleaning up", goal: "Your guests offer to help with the dishes. Thank them, but politely insist they relax and that you'll take care of it later." },
            "es-MX": { name: "Rechazar ayuda para limpiar", goal: "Tus invitados ofrecen ayuda para lavar los platos. Agradéceles, pero insiste amablemente en que se relajen y que tú te encargarás más tarde." },
            image: "assets/cozinha/placeholder.png"
        }
    },
    "⚽ Esportes": {
        "Convidando um amigo para jogar": {
            "pt-BR": { goal: "Ligue para um amigo e pergunte se ele quer jogar basquete no parque no fim de semana." },
            "en-US": { name: "Inviting a friend to play", goal: "Call a friend and ask if they want to play basketball at the park on the weekend." },
            "es-MX": { name: "Invitar a un amigo a jugar", goal: "Llama a un amigo y pregúntale si quiere jugar baloncesto en el parque el fin de semana." },
            image: "assets/esportes/placeholder.png"
        },
        "Comprando ingressos para um jogo": {
            "pt-BR": { goal: "Vá à bilheteria do estádio e peça dois ingressos para o jogo de futebol de hoje à noite." },
            "en-US": { name: "Buying tickets for a game", goal: "Go to the stadium's box office and ask for two tickets for tonight's soccer game." },
            "es-MX": { name: "Comprar boletos para un partido", goal: "Ve a la taquilla del estadio y pide dos boletos para el partido de fútbol de esta noche." },
            image: "assets/esportes/placeholder.png"
        },
        "Discutindo o jogo de ontem": {
            "pt-BR": { goal: "Inicie uma conversa com um colega de trabalho sobre a vitória incrível do seu time no jogo de ontem." },
            "en-US": { name: "Discussing yesterday's game", goal: "Start a conversation with a coworker about your team's amazing victory in the game yesterday." },
            "es-MX": { name: "Hablar del partido de ayer", goal: "Inicia una conversación con un compañero de trabajo sobre la increíble victoria de tu equipo en el partido de ayer." },
            image: "assets/esportes/placeholder.png"
        },
        "Inscrevendo-se em uma academia": {
            "pt-BR": { goal: "Vá à recepção de uma academia e peça informações sobre os planos de adesão." },
            "en-US": { name: "Joining a gym", goal: "Go to a gym's front desk and ask for information about their membership plans." },
            "es-MX": { name: "Inscribirse en un gimnasio", goal: "Ve a la recepción de un gimnasio y pide información sobre sus planes de membresía." },
            image: "assets/esportes/placeholder.png"
        },
        "Procurando por um equipamento na academia": {
            "pt-BR": { goal: "Pergunte a um funcionário da academia onde você pode encontrar os pesos livres." },
            "en-US": { name: "Looking for gym equipment", goal: "Ask a gym employee where you can find the free weights." },
            "es-MX": { name: "Buscar equipo en el gimnasio", goal: "Pregúntale a un empleado del gimnasio dónde puedes encontrar las pesas libres." },
            image: "assets/esportes/placeholder.png"
        },
        "Perguntando sobre aulas": {
            "pt-BR": { goal: "Pergunte na recepção da academia se eles oferecem aulas de ioga e qual é o horário." },
            "en-US": { name: "Asking about classes", goal: "Ask the gym's front desk if they offer yoga classes and what the schedule is." },
            "es-MX": { name: "Preguntar por las clases", goal: "Pregunta en la recepción del gimnasio si ofrecen clases de yoga y cuál es el horario." },
            image: "assets/esportes/placeholder.png"
        },
        "Falando com um personal trainer": {
            "pt-BR": { goal: "Aproxime-se de um personal trainer e explique seus objetivos de condicionamento físico, perguntando como ele pode ajudar." },
            "en-US": { name: "Talking to a personal trainer", goal: "Approach a personal trainer and explain your fitness goals, asking how they can help." },
            "es-MX": { name: "Hablar con un entrenador personal", goal: "Acércate a un entrenador personal y explícale tus objetivos de acondicionamiento físico, preguntando cómo puede ayudarte." },
            image: "assets/esportes/placeholder.png"
        },
        "Comprando equipamento esportivo": {
            "pt-BR": { goal: "Vá a uma loja de artigos esportivos e peça ajuda a um vendedor para encontrar um bom par de tênis de corrida." },
            "en-US": { name: "Buying sports equipment", goal: "Go to a sporting goods store and ask a sales associate for help finding a good pair of running shoes." },
            "es-MX": { name: "Comprar equipo deportivo", goal: "Ve a una tienda de artículos deportivos y pide ayuda a un vendedor para encontrar un buen par de tenis para correr." },
            image: "assets/esportes/placeholder.png"
        },
        "Torcendo em um evento esportivo": {
            "pt-BR": { goal: "Seu time marcou um gol! Comemore com a pessoa sentada ao seu lado." },
            "en-US": { name: "Cheering at a sports event", goal: "Your team scored a goal! Celebrate with the person sitting next to you." },
            "es-MX": { name: "Animar en un evento deportivo", goal: "¡Tu equipo metió un gol! Celebra con la persona sentada a tu lado." },
            image: "assets/esportes/placeholder.png"
        },
        "Entendendo as regras": {
            "pt-BR": { goal: "Você está assistindo a um jogo de críquete com um amigo, mas não entende as regras. Peça ao seu amigo para explicar o que está acontecendo." },
            "en-US": { name: "Understanding the rules", goal: "You are watching a cricket match with a friend but don't understand the rules. Ask your friend to explain what is happening." },
            "es-MX": { name: "Entender las reglas", goal: "Estás viendo un partido de críquet con un amigo pero no entiendes las reglas. Pídele a tu amigo que te explique qué está pasando." },
            image: "assets/esportes/placeholder.png"
        },
        "Reclamando com o juiz (educadamente)": {
            "pt-BR": { goal: "Você está jogando um jogo amistoso e discorda de uma marcação do juiz. Aproxime-se dele e questione a decisão de forma respeitosa." },
            "en-US": { name: "Complaining to the referee (politely)", goal: "You are playing a friendly game and disagree with a call the referee made. Approach them and respectfully question the decision." },
            "es-MX": { name: "Quejarse con el árbitro (amablemente)", goal: "Estás jugando un partido amistoso y no estás de acuerdo con una decisión del árbitro. Acércate a él y cuestiona la decisión respetuosamente." },
            image: "assets/esportes/placeholder.png"
        },
        "Consolando um amigo após uma derrota": {
            "pt-BR": { goal: "O time do seu amigo acabou de perder um jogo importante. Ofereça palavras de encorajamento e diga que eles jogaram bem." },
            "en-US": { name: "Consoling a friend after a loss", goal: "Your friend's team just lost an important game. Offer words of encouragement and tell them they played well." },
            "es-MX": { name: "Consolar a un amigo después de una derrota", goal: "El equipo de tu amigo acaba de perder un partido importante. Ofrécele palabras de aliento y dile que jugaron bien." },
            image: "assets/esportes/placeholder.png"
        }
    }
};