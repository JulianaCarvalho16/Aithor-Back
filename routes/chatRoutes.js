const express = require("express");
const axios = require("axios");
const autenticarToken = require("../middlewere/authMiddleware");
const Conversation = require("../models/Conversation");

const chatRoutes = express.Router();
const togetherKey = process.env.TOGETHER_API_KEY;

const extractText = (openRouterData) => {
  try {
    return openRouterData.choices?.[0]?.message?.content || "Desculpe, não consegui entender!";
  } catch {
    return "Desculpe, não consegui entender!";
  }
};

chatRoutes.post("/message", autenticarToken, async (req, res) => {
  const { message, styles = "neutro", taste = "sem preferências" } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado ou token inválido." });
  }

 const prompt = `Você é um chatbot ${styles}. O usuário gosta de ${taste}. Responda de forma natural.\n\nUsuário: ${message}\nChatbot:`;

  try {
    const { data } = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        prompt: prompt,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${togetherKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    const reply = data.choices?.[0]?.text?.trim() || "Não consegui entender!";

    const conversation = new Conversation({
      userId,
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ],
      styles,
      taste,
    });

    await conversation.save();

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Erro completo do chatbot:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao gerar resposta do chatbot." });
  }
});

module.exports = chatRoutes;