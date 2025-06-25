const { auth, db } = require('../config/firebase');

exports.autenticarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('Token inválido', err);
    return res.status(401).json({ message: 'Token inválido' });
  }
};
