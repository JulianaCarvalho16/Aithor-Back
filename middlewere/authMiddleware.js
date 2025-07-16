const jwt = require("jsonwebtoken");
require("dotenv").config();

const autenticarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = autenticarToken;