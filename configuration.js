/**
 * =================================================================
 *  ARQUIVO CORRIGIDO
 * =================================================================
 * O systemPrompt da função getAIResponse foi simplificado para ser mais
 * robusto e evitar erros da API. A lógica permanece a mesma.
 */

/**
 * Obtém uma resposta da API da Groq para continuar o diálogo do cenário.
 */
async function getAIResponse(userMessage, history, apiKey, scenario, settings) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[settings.language] || "English";

    // Instrução de proficiência simplificada
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

    **CRITICAL RULE: You MUST NOT correct the user's errors during the dialogue.** Your role is to understand and respond naturally to keep the scenario immersive. Feedback will be provided separately, not by you.

    **LANGUAGE ADAPTATION:** ${proficiencyInstruction}

    **SCENARIO DETAILS:**
    - Your Character's Role: Act as the character implied by the user's goal.
    - Current Scenario Name: "${scenario.name}"
    - User's Goal: "${scenario.goal}"

    **CONVERSATION RULES:**
    1. Guide the user toward their goal step-by-step.
    2. ALWAYS end your response with a direct question or a clear choice to keep the conversation moving.
    3. When the user successfully achieves their goal, congratulate them and end your final message with the exact tag: [Scenario Complete]`;

    const messages = [{ role: 'system', content: systemPrompt }, ...history];
    if (userMessage) messages.push({ role: 'user', content: userMessage });
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return a valid response.");
    } catch (error) { console.error("Error in getAIResponse:", error); throw error; }
}

/**
 * Obtém um feedback detalhado sobre a performance do usuário.
 */
async function getFeedbackForConversation(history, apiKey, language, settings, interactionMode) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
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

    // NOVA INSTRUÇÃO CONDICIONAL PARA O MODO DE VOZ
    let feedbackModeInstruction = '';
    if (interactionMode === 'voice') {
        feedbackModeInstruction = `
        CRITICAL: This conversation was conducted via voice input. Therefore, you MUST completely ignore all punctuation and capitalization errors in your analysis. Do not correct them or mention them in the feedback. Focus ONLY on grammar, word choice, and natural phrasing.`;
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

    const conversationText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Analyze this transcript:\n\n${conversationText}` }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return valid feedback.");
    } catch (error) { console.error("Error in getFeedbackForConversation:", error); throw error; }
}

// --- Funções Inalteradas ---
async function translateText(textToTranslate, apiKey, language) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[language] || "English";
    const systemPrompt = `You are an expert translator. Translate the following ${targetLanguage} text to Brazilian Portuguese. Do not add any commentary, notes, or explanations. Provide only the direct translation of the text.`;
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: textToTranslate }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return a valid translation.");
    } catch (error) { console.error("Error in translateText:", error); throw error; }
}
async function getScenarioTitle(goalText, apiKey, language) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[language] || "English";
    const systemPrompt = `You are an expert in creating concise titles. Read the following text, which describes a goal for a role-playing scenario. Your task is to create a short, descriptive title in ${targetLanguage} for this scenario. The title should be a maximum of 5-7 words. Respond ONLY with the title itself, without any extra words, quotes, or explanations.`;
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: goalText }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim().replace(/["']/g, "");
        } else {
            throw new Error("The API did not return a valid title.");
        }
    } catch (error) {
        console.error("Error in getScenarioTitle:", error);
        return "Custom Scenario";
    }
}
async function validateScenarioGoal(goalText, apiKey) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const systemPrompt = `You are an expert assistant that validates goals for role-playing scenarios. The user will provide a text describing a situation they want to practice. Your task is to analyze this text and determine if it represents a clear, actionable conversation scenario with a specific objective. Your response MUST BE ONLY a valid JSON object with the following structure: { "isValid": boolean, "reason": "A brief, user-friendly explanation in Brazilian Portuguese" }. RULES: 1. If the text is a clear scenario (e.g., "order a pizza with specific toppings", "return a broken item to a store"), set "isValid" to true and "reason" to an empty string "". 2. If the text is gibberish ("aaa"), too vague ("talk"), a general question ("what is the capital of France?"), or not a conversational scenario, set "isValid" to false. 3. For invalid scenarios, the "reason" must be a short, helpful message in Brazilian Portuguese explaining why it's invalid. Examples: "O objetivo não está claro. Tente ser mais específico.", "Isso não parece ser um cenário de conversa. Por favor, descreva uma situação.", "Por favor, escreva um objetivo com mais detalhes.". Do not add any text, explanations, or markdown formatting outside of the JSON object.`;
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: goalText }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile', response_format: { type: "json_object" } }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Error in validateScenarioGoal:", error);
        return { isValid: false, reason: "Não foi possível validar o cenário. Verifique sua conexão e tente novamente." };
    }
}