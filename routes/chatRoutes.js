import express from "express";
import axios from "axios";
import { db } from "../middlewere/authMiddlewere";
import { autenticarToken } from "../middlewere/authMiddlewere";

const routes = express.Router();

routes.post("/", autenticarToken, async(req, res) => {
    const { mensagem, estilo, gostos} = req.body;
    const userId = req.user.uid;

    try {
        const rasaResponse = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
            sender: userId,
            message: messagem
        });

        const resposta = rasaResponse.data?.[0]?.text || "Não entendi, poderia repetir?";

        await db.collection("conversas").add({
            userId,
            mensagem,
            resposta,
            estilo,
            gostos,
            Timestamp: new Date(),
        });

        res.json({ resposta })
    } catch (error){
        console.error("Erro ao se comunicar com Rasa:", error.message);
        res.status(500).json("Erro na resposta do chatbot");
    }
});

export default routes;