import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/chat", chatRoutes);

const PORT = process.env.PORT ||   3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});