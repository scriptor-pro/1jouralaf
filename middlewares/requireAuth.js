import jwt from 'jsonwebtoken';

const CLE_SECRETE_JWT = process.env.JWT_SECRET || 'dev_secret_key';

export function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, CLE_SECRETE_JWT);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}
