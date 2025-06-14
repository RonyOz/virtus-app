// test.js
import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.OPENAI_API_KEY;

const payload = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content:
        "Eres un asistente amable para estudiantes universitarios. Responde con empatía y sugiere algo pequeño para mejorar el ánimo o estudiar mejor.",
    },
    {
      role: "user",
      content: "Me siento muy estresado con mis tareas esta semana.",
    },
  ],
};

async function chatWithGPT() {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content;

    console.log("\n🤖 Respuesta del chatbot:");
    console.log(message || "Sin respuesta.");
  } catch (error) {
    console.error("❌ Error al contactar a la API:", error.message);
  }
}

chatWithGPT();
