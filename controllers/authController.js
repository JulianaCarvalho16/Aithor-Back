const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password, style } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(), 
      password: hashed,
      style
    });

    const token = jwt.sign({ id: user.id, email: user.email, estilo: user.estilo }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Usuário registrado", token, name: user.name });
  } catch (err) {
    console.error("Erro no registro:", err.message);
    res.status(500).json({ error: "Erro no registro" });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, name: user.name }); 
  } catch (err) {
    console.error("Erro no login:", err.message);
    res.status(500).json({ error: "Erro no login" });
  }
};