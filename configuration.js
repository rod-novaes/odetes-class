/**
 * =================================================================
 *  ARQUIVO CORRIGIDO E MIGRADO PARA GOOGLE GEMINI E ELEVENLABS
 * =================================================================
 * - CORREÇÃO: Resolvido o erro 'contents is not specified' na primeira chamada da API.
 * - Todas as funções de texto usam o modelo gemini-1.5-flash-latest.
 * - A lógica de prompt foi corrigida usando o campo 'systemInstruction' para garantir a imersão da IA.
 * - Adicionada uma nova função para se conectar à API da ElevenLabs para TTS de alta qualidade.
 */

// --- FUNÇÃO AUXILIAR PARA CONVERTER O HISTÓRICO PARA O FORMATO DO GEMINI ---
function convertHistoryToGeminiFormat(history) {
    // Converte o histórico de [{role: 'user'/'assistant', content: '...'}]
    // para o formato do Gemini: [{role: 'user'/'model', parts: [{text: '...'}]}]
    return history.map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }]
    }));
}


/**
 * Obtém uma resposta da API do Google Gemini para continuar o diálogo.
 */
async function getAIResponse(userMessage, history, apiKey, scenario, settings) {
    // O modelo que funcionou no seu teste foi o gemini-1.5-flash. Usaremos a tag 'latest' para atualizações.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[settings.language] || "English";

    let proficiencyInstruction = '';
    switch (settings.proficiency) {
        case 'basic':
            proficiencyInstruction = "Because the user is at a BASIC level, you MUST use simple vocabulary (A1-A2), short sentences, and avoid idioms.";
            break;
        case 'intermediate':
            proficiencyInstruction = "Because the user is at an INTERMEDIATE level, you can use common vocabulary and sentence structures (B1-B2).";
            break;
        case 'advanced':
            proficiencyInstruction = "Because the user is at an ADVANCED level, you are encouraged to use rich, natural, and nuanced vocabulary (C1).";
            break;
    }

    const systemPrompt = `You are a helpful and immersive role-playing AI assistant for a language student. Your entire response MUST be in ${targetLanguage}.
    Your primary goal is to act as a character in a scenario and maintain a realistic conversation. Your character and the user's goal are defined below.
    CRITICAL RULE: You MUST NOT correct the user's errors during the dialogue. Your role is to understand and respond naturally to keep the scenario immersive. Feedback will be provided separately, not by you.
    LANGUAGE ADAPTATION: ${proficiencyInstruction}
    SCENARIO DETAILS:
    - Your Character's Role: Act as the character implied by the user's goal.
    - Current Scenario Name: "${scenario.name}"
    - User's Goal: "${scenario.goal}"
    CONVERSATION RULES:
    1. Guide the user toward their goal step-by-step.
    2. ALWAYS end your response with a direct question or a clear choice to keep the conversation moving.
    3. When the user successfully achieves their goal, congratulate them and end your final message with the exact tag: [Scenario Complete]
    CRITICAL DIALOGUE RULE: Your spoken dialogue responses MUST NOT contain any formatting characters like asterisks (*), underscores (_), or hash symbols (#). Convey all emphasis and emotion naturally through word choice and sentence structure alone`;
    
    // Adiciona a nova mensagem do usuário ao histórico para formar a conversa completa
    const fullHistory = [...history];
    if (userMessage) {
        fullHistory.push({ role: 'user', content: userMessage });
    }

    // *** INÍCIO DA CORREÇÃO ***
    let contents;
    // Se a conversa ainda não começou, o histórico está vazio.
    // Enviamos um "kick-start" para a IA com uma primeira mensagem de usuário vazia.
    if (fullHistory.length === 0) {
        contents = [{ role: 'user', parts: [{ text: 'Please start the conversation based on your instructions.' }] }];
    } else {
        // Se a conversa já começou, convertemos o histórico normalmente.
        contents = convertHistoryToGeminiFormat(fullHistory);
    }
    // *** FIM DA CORREÇÃO ***
    
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                contents: contents,
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                }
            }) 
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            if (data.promptFeedback?.blockReason) {
                console.error("API call blocked due to:", data.promptFeedback.blockReason);
                return "I'm sorry, I can't respond to that. Let's try something else. What would you like to do next?";
            }
            throw new Error("The API did not return a valid response.");
        }
    } catch (error) { console.error("Error in getAIResponse:", error); throw error; }
}

/**
 * Obtém um feedback detalhado sobre a performance do usuário da API do Gemini.
 */
async function getFeedbackForConversation(history, apiKey, language, settings, interactionMode) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[language] || "English";

    let feedbackFocusInstruction = '';
    switch (settings.proficiency) {
        case 'basic':
            feedbackFocusInstruction = "The user is at a BASIC level. In your feedback, focus on fundamental errors: simple verb tenses (past/present/future), articles (a/an/the), basic prepositions, and word order. Keep your explanations very simple and encouraging.";
            break;
        case 'intermediate':
            feedbackFocusInstruction = "The user is at an INTERMEDIATE level. In your feedback, focus on more complex areas: correct use of verb tenses (e.g., perfect tenses), phrasal verbs, sentence connectors, and suggesting more varied vocabulary. Explain why the natural phrases are better.";
            break;
        case 'advanced':
            feedbackFocusInstruction = "The user is at an ADVANCED level. Provide detailed and nuanced feedback. Focus on subtle errors, awkward phrasing, tone, style, and the use of idiomatic language. Suggest sophisticated alternatives to make their speech sound more native.";
            break;
    }
    
    let feedbackModeInstruction = '';
    if (interactionMode === 'voice') {
        feedbackModeInstruction = `CRITICAL: This conversation was conducted via voice input. Therefore, you MUST completely ignore all punctuation and capitalization errors in your analysis. Do not correct them or mention them in the feedback. Focus ONLY on grammar, word choice, and natural phrasing.`;
    }

    const systemPrompt = `You are an expert English language tutor. A student has just completed a role-playing conversation. Your task is to provide constructive, detailed, and encouraging feedback. Your response MUST be in ${targetLanguage}. Analyze ONLY the user's messages.
    IMPORTANT INSTRUCTION: You MUST tailor your feedback to the user's proficiency level.
    **User's Proficiency Level: ${settings.proficiency.toUpperCase()}**
    **Your Focus Area:** ${feedbackFocusInstruction}
    ${feedbackModeInstruction}
    Please structure your feedback in three sections using Markdown:
    ### 👍 What You Did Well
    Start with a positive and encouraging comment, acknowledging their effort and success in achieving the goal.
    ### ✒️ Grammar & Spelling Corrections
    For each correction, use a bullet point (*). Show the user's original phrase, then the corrected version, and briefly explain why, according to their proficiency level. Use **bold** for the corrected part. If no errors, state "No corrections needed, fantastic work!".
    ### ✨ Better & More Natural Phrases
    For each suggestion, use a bullet point (*). Suggest more natural-sounding phrases they could have used. Explain why they are better (e.g., more common, more polite, more idiomatic). Use **bold** for the suggested phrase.
    Your response must be ONLY the feedback, formatted clearly.`;

    const conversationText = history.filter(msg => msg.role === 'user').map(msg => `Student: ${msg.content}`).join('\n');
    const userPrompt = `Analyze this transcript:\n\n${conversationText}`;

    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            }) 
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("The API did not return valid feedback.");
        }
    } catch (error) { console.error("Error in getFeedbackForConversation:", error); throw error; }
}

/**
 * Converte um texto para áudio usando a API da ElevenLabs.
 */
async function getAudioFromElevenLabs(textToSpeak, apiKey) {
    const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // ID da voz "Rachel", uma voz popular e clara.
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: textToSpeak,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.3,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`ElevenLabs API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        return await response.blob();

    } catch (error) {
        console.error("Error in getAudioFromElevenLabs:", error);
        throw error;
    }
}


// --- Funções Auxiliares Migradas para Google Gemini ---

async function translateText(textToTranslate, apiKey, language) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[language] || "English";
    const systemPrompt = `You are an expert translator. Translate the following English text to Brazilian Portuguese. CRITICAL RULE: The text may contain special placeholders like %%PROTECTED_0%%, %%PROTECTED_1%%, etc. You MUST keep these placeholders EXACTLY as they are in the translated text. DO NOT translate, alter, or remove these placeholders under any circumstances. Provide only the direct translation.`;
    
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                contents: [{ role: 'user', parts: [{ text: textToTranslate }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            }) 
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("The API did not return a valid translation.");
        }
    } catch (error) { console.error("Error in translateText:", error); throw error; }
}

async function getScenarioTitle(goalText, apiKey, language) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[language] || "English";
    const systemPrompt = `You are an expert in creating concise titles. Read the following text, which describes a goal for a role-playing scenario. Your task is to create a short, descriptive title in ${targetLanguage} for this scenario. The title should be a maximum of 5-7 words. Respond ONLY with the title itself, without any extra words, quotes, or explanations.`;
    
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                contents: [{ role: 'user', parts: [{ text: goalText }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            }) 
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text.trim().replace(/["']/g, "");
        } else {
            throw new Error("The API did not return a valid title.");
        }
    } catch (error) {
        console.error("Error in getScenarioTitle:", error);
        return "Custom Scenario";
    }
}

async function validateScenarioGoal(goalText, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const systemPrompt = `You are an expert assistant that validates goals for role-playing scenarios. The user will provide a text describing a situation they want to practice. Your task is to analyze this text and determine if it represents a clear, actionable conversation scenario with a specific objective. Your response MUST BE ONLY a valid JSON object with the following structure: { "isValid": boolean, "reason": "A brief, user-friendly explanation in Brazilian Portuguese" }. RULES: 1. If the text is a clear scenario (e.g., "order a pizza with specific toppings", "return a broken item to a store"), set "isValid" to true and "reason" to an empty string "". 2. If the text is gibberish ("aaa"), too vague ("talk"), a general question ("what is the capital of France?"), or not a conversational scenario, set "isValid" to false. 3. For invalid scenarios, the "reason" must be a short, helpful message in Brazilian Portuguese explaining why it's invalid. Examples: "O objetivo não está claro. Tente ser mais específico.", "Isso não parece ser um cenário de conversa. Por favor, descreva uma situação.", "Por favor, escreva um objetivo com mais detalhes.". Do not add any text, explanations, or markdown formatting outside of the JSON object.`;
    
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                contents: [{ role: 'user', parts: [{ text: goalText }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                }
            }) 
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            const content = data.candidates[0].content.parts[0].text;
            return JSON.parse(content);
        } else {
            throw new Error("The API did not return a valid JSON object.");
        }
    } catch (error) {
        console.error("Error in validateScenarioGoal:", error);
        return { isValid: false, reason: "Não foi possível validar o cenário. Verifique sua conexão e tente novamente." };
    }
}