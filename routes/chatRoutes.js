// routes/chatRoutes.js
const express = require('express');
const axios   = require('axios');
const { db }  = require('../config/firebase');          // db correto
const { autenticarToken } = require('../middlewere/authMiddlewere');
const { Timestamp } = require('@google-cloud/firestore');

const chatRoutes = express.Router();

const huggingFaceApi   = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B';
const huggingFaceToken = process.env.HUGGINGFACE_API_KEY;

chatRoutes.post('/', autenticarToken, async (req, res) => {
  const { mensagem, estilo, gosto } = req.body;
  const userId = req.user.uid;

  try {
    const prompt = `Usuario: ${mensagem}\nEstilo: ${estilo}\nGosto: ${gosto || 'Nenhum informado'}\nChatbot`;
    const hfResponse = await axios.post(
      huggingFaceApi,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${huggingFaceToken}` } }
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
      createdAt: Timestamp.now(),                        // use Timestamp do Firestore
    });

    return res.json({ resposta });
  } catch (err) {
    console.error('Erro ao se comunicar com Hugging Face:', err.message);
    return res.status(500).json({ error: 'Erro na resposta do chatbot.' });
  }
});

module.exports = chatRoutes;
