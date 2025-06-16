import express from "express";
import { db } from "../middlewere/authMiddlewere";

const router = express.Router();

function gerarResposta (mensagem, estio, gostos) {
    const base = {
        fofo: `Awn" Que lindo você dizer: ${mensagem}`,
        normal: `Boa! ${mensagem} me faz rir!`,
        formal: `${mensagem} registrada!`,
        serio: `ok. ${mensagem}.`,
        sarcastico: `claro, ${mensagem} super relevante.`
    };
}