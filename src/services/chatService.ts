import { Message } from '../types/chat';

// Print de depuración para ver si la API key se está leyendo correctamente
declare const importMeta: ImportMeta;
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
console.log('[DEBUG] API_KEY:', API_KEY);

const SYSTEM_PROMPT = "Eres un asistente amigable y comprensivo para estudiantes universitarios. Siempre debes responder con empatía, validando cómo se siente el estudiante, y luego ofrecer una sugerencia concreta y sencilla para mejorar su bienestar emocional o su rendimiento académico. Mantén las respuestas breves, humanas y en un tono positivo. Usa lenguaje claro y cercano, en español.";

export async function sendMessageToGPT(messages: Message[]): Promise<string> {
  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    // Print de depuración para la respuesta de la API
    console.log('[DEBUG] Respuesta de la API:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] Error body:', errorText);
      throw new Error('Error en la respuesta de la API');
    }

    const data = await response.json();
    console.log('[DEBUG] Data de la API:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error al enviar mensaje a GPT:', error);
    throw error;
  }
} 