import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.OPENAI_API_KEY;

const calendarEvents = [
  {
    id: '1',
    title: 'Examen de Cálculo',
    date: '2025-01-28',
    time: '10:00',
    type: 'academic',
    stress_level: 8,
    description: 'Examen final de cálculo diferencial'
  },
  {
    id: '2',
    title: 'Entrega de Proyecto',
    date: '2025-01-28',
    time: '15:00',
    type: 'academic',
    stress_level: 7,
    description: 'Proyecto final de programación'
  },
  {
    id: '3',
    title: 'Sesión de meditación',
    date: '2025-01-28',
    time: '18:00',
    type: 'wellness',
    description: 'Meditación grupal - Reducir estrés pre-examen'
  }
];

const userState = {
  stress: 7,
  mood: 4
};

const promptBase = `
Eres un asistente que ayuda a gestionar el calendario de un estudiante universitario.
Tu tarea es:
- Analizar los eventos del día.
- Detectar si la carga académica es alta.
- Recomendar pausas, actividades de bienestar o momentos de socialización si es necesario.
- Considerar el nivel de estrés y ánimo actual del usuario.

Devuelve una recomendación breve y empática.
`;

const generateRecommendation = async (events, state) => {
  const userPrompt = `
Eventos del día:
${events.map(e => `- ${e.title} (${e.type}) a las ${e.time} - estrés ${e.stress_level ?? 'N/A'}`).join('\n')}

Estado del usuario:
- Estrés: ${state.stress}/10
- Ánimo: ${state.mood}/10

¿Qué sugerencia personalizada darías para hoy?
`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: promptBase },
      { role: "user", content: userPrompt }
    ]
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content;
    console.log("🧠 Recomendación para el calendario:\n", response);
  } catch (error) {
    console.error("Error:", error);
  }
};

generateRecommendation(calendarEvents, userState);