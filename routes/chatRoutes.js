const express = require("express");
const axios = require("axios");
const autenticarToken = require("../middlewere/authMiddleware");
const Conversation = require("../models/Conversation");
const User = require("../models/User"); 

const chatRoutes = express.Router();
const togetherKey = process.env.TOGETHER_API_KEY;

chatRoutes.post("/message", autenticarToken, async (req, res) => {
  const { message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado ou token inválido." });
  }

  try {
    const usuario = await User.findByPk(userId); 
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const styles = usuario.estilo || "neutro"; 
    const prompt = `Você é um chatbot com estilo ${styles}. Responda com naturalidade, carisma e coerência com essa personalidade. Evite repetir a mesma coisa que o usuário disser. Apenas responda de forma fluída e envolvente, como em uma conversa real.\n\n${message}`;

    const { data } = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        prompt: prompt,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${togetherKey}`,
          "Content-Type": "application/json",
        },
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
    });

    await conversation.save();

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Erro completo do chatbot:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao gerar resposta do chatbot." });
  }
});

module.exports = chatRoutes;