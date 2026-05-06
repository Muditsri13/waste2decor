const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= CHATBOT ENDPOINT =================
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ reply: "Prompt is required." });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are EcoBot, a helpful AI assistant specialized in upcycling, recycling, and sustainable living. Give concise and practical advice.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    res.json({ reply: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to my AI brain right now." });
  }
});

// ================= DAILY TRIVIA ENDPOINT =================
router.get("/trivia", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI that generates exactly one fascinating eco-friendly trivia fact, and exactly one short motivational quote about sustainability. Output MUST be in strictly valid JSON format like: { \"trivia\": \"Your trivia fact\", \"quote\": \"Your motivational quote\" }",
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0.9,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);
  } catch (error) {
    console.error("OpenAI Trivia Error:", error);
    // Fallback if AI fails
    res.json({
      trivia: "Recycling one aluminum can saves enough energy to run a TV for three hours.",
      quote: "The greatest threat to our planet is the belief that someone else will save it."
    });
  }
});

module.exports = router;
