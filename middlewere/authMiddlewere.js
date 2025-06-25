// src/middleware/authMiddleware.js   (use sempre “middleware”, não “middlewere”)
const { auth, db } = require('../config/firebase');   // db já vem daqui
                                                       // ❌ não importe { error } de 'console'

exports.autenticarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;        // headers   ✅
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;                                // guarda quem é o usuário
    return next();                                     // passa para a próxima função
  } catch (err) {
    console.error('Token inválido', err);
    return res.status(401).json({ message: 'Token inválido' });
  }
};
