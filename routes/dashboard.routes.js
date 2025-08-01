import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.get('/dashboard', requireAuth, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.email}, voici ton tableau de bord personnalisé.` });
});

export default router;
