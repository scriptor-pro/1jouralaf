import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import loginRoute from './routes/auth.login.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
app.use('/', dashboardRoutes); // ou app.use('/api', dashboardRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', loginRoute);

// Test public route
app.get('/', (req, res) => {

res.send("Bienvenue sur l'API 1 jour à la fois");


});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});
