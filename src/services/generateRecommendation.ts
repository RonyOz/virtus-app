export async function generateRecommendation(
  title: string,
  type: string,
  mood: number,
  stress: number
): Promise<string> {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  if (!API_KEY) {
    console.error('API_KEY no encontrada en las variables de entorno');
    return 'Error: No se encontró la API key de OpenAI. Por favor, asegúrate de:\n1. Crear un archivo .env en la raíz del proyecto\n2. Agregar VITE_OPENAI_API_KEY=tu-api-key\n3. Reiniciar el servidor de desarrollo';
  }

  const prompt = `
Eres un asistente que ayuda a planear tareas y actividades universitarias.

Actividad:
- Título: ${title}
- Tipo: ${type}

Estado del estudiante:
- Estrés: ${stress}/10
- Ánimo: ${mood}/10

¿Qué recomendación breve le darías sobre cómo abordar esta actividad?
Devuelve solo el texto de la sugerencia.
`;

  try {
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Eres un asistente universitario empático que da recomendaciones personalizadas basadas en el estado emocional y el tipo de actividad." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en la respuesta de la API:', errorData);
      if (response.status === 401) {
        return 'Error: API key inválida. Por favor, verifica que tu API key de OpenAI sea correcta.';
      }
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content;

    if (!recommendation) {
      throw new Error('No se recibió una recomendación válida');
    }

    return recommendation;
  } catch (error) {
    console.error('Error al generar recomendación:', error);
    return 'Lo siento, hubo un error al generar la recomendación. Por favor, intenta de nuevo.';
  }
}
