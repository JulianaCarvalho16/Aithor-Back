require("dotenv").config();
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

const seedData = [
  {
    userId: "uuid-user-001",
    messages: [
      { role: "user", content: "Oi, tudo bem?", timestamp: new Date("2025-07-07T10:00:00Z") },
      { role: "assistant", content: "Oi! Tudo sim, e com você?", timestamp: new Date("2025-07-07T10:00:02Z") }
    ],
    createdAt: new Date("2025-07-07T10:00:00Z"),
    updatedAt: new Date("2025-07-07T10:00:02Z")
  },
  {
    userId: "uuid-user-002",
    messages: [
      { role: "user", content: "Qual a previsão do tempo hoje?", timestamp: new Date() },
      { role: "assistant", content: "Hoje o dia será ensolarado com chances de chuva à tarde.", timestamp: new Date() }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "uuid-user-001",
    messages: [
      { role: "user", content: "Me diga uma curiosidade sobre o espaço", timestamp: new Date() },
      { role: "assistant", content: "Você sabia que um dia em Vênus é mais longo que um ano lá?", timestamp: new Date() }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Conversation.deleteMany(); // limpa a coleção
    await Conversation.insertMany(seedData);
    console.log("✅ Conversas inseridas com sucesso!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erro ao popular dados:", error);
  }
};

seedDB();
