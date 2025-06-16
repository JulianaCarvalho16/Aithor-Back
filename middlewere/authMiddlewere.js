import { auth } from "../config/firebase";

export async function autenticationToken( req, res, next ) {
    const token = req.heards.autentication.split("Bearer" [1]);

    if (!token) {
        return res.status(401).json({ error: "Token não encontrado"});
    }

    try {
        const decod = await auth.verifyIdToken(token);
        req.user = decod;
        next();
    } catch(error){
        console.error("Token invalido", error);
    }
}