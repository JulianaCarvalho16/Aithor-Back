require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/postgres");
const connectMongo = require("./config/mongodb");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.sync();
    await connectMongo();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao iniciar o servidor:", err.message);
  }
};

startServer();
