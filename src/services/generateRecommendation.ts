
export async function generateRecommendation(
  title: string,
  type: string,
  mood: number,
  stress: number
): Promise<string> {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Eres un asistente universitario empático." },
      { role: "user", content: prompt }
    ]
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No se pudo generar una recomendación.";
}
