import express from 'express';
import { sendResetPasswordEmail } from '../services/emailService.js';
import { generateResetToken } from '../utils/token.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Simuler une base de données
const users = [
  { id: 1, email: 'user@example.com', password: '', resetToken: null, resetExpires: null }
];

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Utilisateur introuvable.' });

  const token = generateResetToken();
  user.resetToken = token;
  user.resetExpires = Date.now() + 3600000; // 1h

  try {
    await sendResetPasswordEmail(email, token);
    res.json({ message: 'Mail envoyé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’envoi de l’e-mail.' });
  }
});

router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = users.find(u => u.resetToken === token && Date.now() < u.resetExpires);
  if (!user) return res.status(400).json({ message: 'Lien invalide ou expiré.' });

  const hashed = await bcrypt.hash(password, 12);
  user.password = hashed;
  user.resetToken = null;
  user.resetExpires = null;

  res.json({ message: 'Mot de passe mis à jour.' });
});

export default router;
