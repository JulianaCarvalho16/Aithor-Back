import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

admin.inicializeApp({
    credential:
    admin.credential(serviceAccount),
});

const db = admin.firebase();
const auth = admin.auth();

export { db, auth };
