const Conversation = require("../models/Conversation");
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: message }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content;

    const conversation = new Conversation({
      userId,
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: reply }
      ]
    });

    await conversation.save();

    res.json({ reply });
  } catch (err) {
  res.status(500).json({ error: "Erro no login" });
  }
};
