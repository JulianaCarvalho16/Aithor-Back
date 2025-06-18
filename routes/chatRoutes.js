import express from "express";
import axios from "axios";
import { db } from "../middlewere/authMiddlewere";
import { autenticarToken } from "../middlewere/authMiddlewere";
import { Timestamp } from "@google-cloud/firestore";

const routes = express.Router();
const huggingFaceApi = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B"
const huggingFaceToken = process.env.HUGGINGFACE_API_KEY;

routes.post("/", autenticarToken, async( req, res) => {
    const { mensagem, estilo, gosto} = req.body;
    const userId = req.user.uid;
    try {
        const prompt = `Usuario: ${mensagem} \nEstilo: ${estilo} \nGosto: ${gosto || "Nenhum informado"} \nChatbot`;
    const hfResponse = await axios.post(
        huggingFaceApi,
        {inputs: prompt},
        {
            headers: {
                Authorization: `Bearer ${huggingFaceToken}`,
                "Content-Type": "application/json"
            },
        }
    );

    const resposta = hfResponse.data?.[0]?.generated_text?.replace(prompt, "") || "Descupa, não consegui entender!";

    await db.collection("conversas").add({
        userId,
        mensagem,
        resposta,
        estilo,
        gosto,
        Timestamp: new Date(),
        
    })
        res.json({ resposta });
    } catch (error){
        console.error("Erro ao se comunicar com Hugging Face:", error.message);
        res.status(500).json({ error: "Erro na resposta do chatbot."})
    }
})


export default routes;