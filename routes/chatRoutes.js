// routes/chatRoutes.js
const express = require('express');
const axios   = require('axios');
const { db }  = require('../config/firebase');
const { autenticarToken } = require('../middlewere/authMiddlewere');
const { Timestamp } = require('@google-cloud/firestore');

const chatRoutes = express.Router();
const openRouterKey = process.env.OPENROUTER_API_KEY;

chatRoutes.post('/', autenticarToken, async (req, res) => {
  const { mensagem, estilo, gosto } = req.body;
  const userId = req.user.uid;

  try {
    const prompt = `Usuario: ${mensagem}\nEstilo: ${estilo}\nGosto: ${gosto || 'Nenhum informado'}\nChatbot`;
    const hfResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-sonnet:beta',
        mensages: [
          { role: 'system', content: prompt },
          { role: 'user', content: mensagem }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          'Content-Type': 'aplication/json',
          'HTTP-Referer': 'http://localhost:3001'
        }
      }
    );

    const resposta =
      hfResponse.data?.[0]?.generated_text?.replace(prompt, '') ||
      'Desculpa, não consegui entender!';

    await db.collection('conversas').add({
      userId,
      mensagem,
      resposta,
      estilo,
      gosto,
      createdAt: Timestamp.now(),
    });

    return res.json({ resposta });
  } catch (err) {
    console.error('Erro ao se comunicar com OpenRouter:', err.message);
    return res.status(500).json({ error: 'Erro na resposta do chatbot.' });
  }
});

module.exports = chatRoutes;
