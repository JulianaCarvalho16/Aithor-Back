const express = require("express");
const axios = require("axios");
const autenticarToken = require("../middleware/authMiddleware");
const admin = require("firebase-admin");

const chatRoutes = express.Router();
const openRouterKey = process.env.OPENROUTER_API_KEY;


const extractText = (openRouterData) => {
  try {
    return (
      openRouterData.choices?.[0]?.message?.content ||
      "Desculpe, não consegui entender!"
    );
  } catch {
    return "Desculpe, não consegui entender!";
  }
};

chatRoutes.post("/", autenticarToken, async (req, res) => {
  const { message, styles, taste } = req.body;   
  const userId = req.user.uid;

  try {
    const prompt = `Você é um chatbot ${styles}. O usuário gosta de ${taste ||
      "nenhum gosto informado"}. Responda de forma natural.\n\nUsuário: ${message}\nChatbot:`;

    const { data } = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-sonnet:beta",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = extractText(data);

    await db.collection("conversas").add({
      userId,
      message,
      response,
      styles,
      taste,
      createdAt: admin.firestore.Timestamp.now(),
    });

    return res.json({ response });
  } catch (err) {
    console.error("Erro no OpenRouter:", err.message);
    return res.status(500).json({ error: "Erro na resposta do chatbot." });
  }
});

module.exports = chatRoutes;
