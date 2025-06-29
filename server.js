const express = require  ("express");
const cors = require ("cors");
const bodyParser = require ("body-parser");
const chatRoutes = require ("./routes/chatRoutes");
const dotenv = require ("dotenv").config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/chat", chatRoutes);

const PORT = process.env.PORT ||   3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});