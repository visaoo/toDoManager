const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  // const { userId } = req.body;

  console.debug('[MIDDLEWARE] Verificando TOKEN: ', { token });

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = isTokenValid(token);

    console.debug('[MIDDLEWARE] Token válido, usuário autorizado: ', decoded);

    req.user = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function isTokenValid(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (error) {
        console.error(error)
        return null;
    }
}

module.exports = authMiddleware;