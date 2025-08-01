import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const utilisateurs = [
  {
    id: 1,
    email: 'test@example.com',
    motDePasseHash: '$2b$12$S1hIQ0VwZ8X4S3jTiR0o4OEkhrfrv8WXaD5hjdd5V0r65tN2uF8Fq' // "motdepasse"
  }
];

const CLE_SECRETE_JWT = process.env.JWT_SECRET || 'dev_secret_key';
const DUREE_EXPIRATION = '1h'; // ajustable selon ton besoin

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  const utilisateur = utilisateurs.find(u => u.email === email);
  if (!utilisateur) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasseHash);
  if (!motDePasseValide) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  const token = jwt.sign(
    { id: utilisateur.id, email: utilisateur.email },
    CLE_SECRETE_JWT,
    { expiresIn: DUREE_EXPIRATION }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,           // mettre false si tu testes en HTTP local
    sameSite: 'Strict',
    maxAge: 60 * 60 * 1000  // 1 heure
  });

  res.json({ message: 'Connexion réussie.' });
});

export default router;
