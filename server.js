require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/postgres");
const connectMongo = require("./config/mongodb");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.sync();
    await connectMongo();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar:", err);
  }
};

startServer();
