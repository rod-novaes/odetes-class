/**
 * =================================================================
 *  ARQUIVO DE CONFIGURAÇÃO FINAL - APONTANDO PARA O BACKEND ONLINE
 * =================================================================
 */

// Definimos a URL do nosso backend de produção em um só lugar.
// SE ESTIVER RODANDO LOCALMENTE, USE: 'http://localhost:3001'
//const BACKEND_URL = 'http://localhost:3001'; 

// URL de Produção (Use esta quando for publicar o site)
const BACKEND_URL = 'https://odete-backend-161452649665.southamerica-east1.run.app';

// URL Local (Use esta apenas para testes no seu computador)
//const BACKEND_URL = 'http://localhost:3001';

/**
 * Obtém uma resposta do nosso backend para continuar o diálogo.
 */
async function getAIResponse(userMessage, history, scenario, settings) {
  const API_URL = `${BACKEND_URL}/api/chat`;
  
  // Define uma mensagem de início baseada no idioma, caso userMessage seja nulo
  let finalMessage = userMessage;
  if (!finalMessage) {
      if (settings.language === 'es-MX') {
          finalMessage = 'Por favor, inicia el escenario según tu papel.';
      } else {
          finalMessage = 'Please start the scenario based on your role.';
      }
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history,
        message: finalMessage,
        scenario: scenario,
        settings: settings
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro do Servidor: ${errorData.error}`);
    }
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Erro ao chamar o backend em getAIResponse:", error);
    return `Erro de comunicação com o servidor. Verifique sua conexão.`;
  }
}

/**
 * Converte um texto para áudio usando nosso backend.
 */
async function getAudioFromServer(textToSpeak, language, gender) {
    const API_URL = `${BACKEND_URL}/api/tts`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: textToSpeak,
                language: language,
                gender: gender
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro do Servidor TTS: ${errorData.error}`);
        }
        const data = await response.json();
        const audioBytes = atob(data.audioContent);
        const audioBuffer = new Uint8Array(audioBytes.length);
        for (let i = 0; i < audioBytes.length; i++) {
            audioBuffer[i] = audioBytes.charCodeAt(i);
        }
        return new Blob([audioBuffer], { type: 'audio/mpeg' });
    } catch (error) {
        console.error("Erro em getAudioFromServer:", error);
        throw error;
    }
}

/**
 * Transcreve um Blob de áudio enviando-o para o nosso backend.
 */
async function getTranscriptionFromAudio(audioBlob) {
    const API_URL = `${BACKEND_URL}/api/stt`;
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro do Servidor STT: ${errorData.error}`);
        }
        const data = await response.json();
        return data.transcript;
    } catch (error) { 
        console.error("Erro em getTranscriptionFromAudio:", error); 
        throw error; 
    }
}

/**
 * Obtém um feedback detalhado sobre a performance do usuário chamando nosso backend.
 */
async function getFeedbackForConversation(history, language, settings, interactionMode) {
    const API_URL = `${BACKEND_URL}/api/feedback`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: history,
                language: language,
                settings: settings,
                interactionMode: interactionMode
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro do Servidor de Feedback: ${errorData.error}`);
        }
        const data = await response.json();
        return data.feedback;
    } catch (error) {
        console.error("Erro em getFeedbackForConversation:", error);
        throw error;
    }
}

/**
 * Traduz um texto chamando nosso backend.
 */
async function translateText(textToTranslate, language) {
    const API_URL = `${BACKEND_URL}/api/translate`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                textToTranslate: textToTranslate,
                language: language
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro do Servidor de Tradução: ${errorData.error}`);
        }
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("Erro em translateText:", error);
        throw error;
    }
}

/**
 * Valida um objetivo de cenário customizado chamando nosso backend.
 */
async function validateScenarioGoal(goalText) {
    const API_URL = `${BACKEND_URL}/api/validate-scenario`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goalText: goalText })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro do Servidor de Validação: ${errorData.reason}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro em validateScenarioGoal:", error);
        return { isValid: false, reason: "Não foi possível validar o cenário. Verifique sua conexão e tente novamente." };
    }
}

/**
 * Gera um título para um cenário customizado chamando nosso backend.
 */
async function getScenarioTitle(goalText, language) {
    const API_URL = `${BACKEND_URL}/api/generate-title`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goalText: goalText, language: language })
        });
        if (!response.ok) {
            throw new Error('Erro do Servidor de Titulação');
        }
        const data = await response.json();
        return data.title;
    } catch (error) {
        console.error("Erro em getScenarioTitle:", error);
        return "Custom Scenario";
    }
}

/**
 * Obtém o próximo nó narrativo e opções de ação baseado no estado do viajante.
 * Chamado pela Home Page para gerar a história infinita.
 */
async function getNarrativeFromAI(travelerState) {
    const API_URL = `${BACKEND_URL}/api/narrative`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ travelerState: travelerState })
        });
        
        if (!response.ok) {
            console.warn("Erro no backend de narrativa.");
            throw new Error("Falha ao gerar narrativa");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Erro em getNarrativeFromAI:", error);
        throw error;
    }
}