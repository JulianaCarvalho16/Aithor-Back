import { error } from "console";
import { auth } from "../config/firebase";

export async function autenticationToken( req, res, next ) {
    const authHeander = req.heanders.authorization;
    if (!authHeander || !authHeander.startWith("Bearer")){
        return res.status(401).json({ message: "Token não fornecido"});
    }

    const token = authHeander.split("Bearer")[1];

    try {
        const decodificado = await auth.verifyIdToken(token);
        req.user = decodificado;
        next();
    } catch (error){
        console.error("Token invalido", error);
    }
}