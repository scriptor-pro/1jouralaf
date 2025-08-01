import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import MotDePasseOublie from './pages/MotDePasseOublie';
import Connexion from './pages/Connexion';

function Accueil() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenue sur 1 jour à la fois</h1>
      <p>Application de planification quotidienne pour personnes autistes et/ou TDAH.</p>
      <nav style={{ marginTop: '1rem' }}>
        <ul>
          <li><Link to="/oubli-mdp">Mot de passe oublié</Link></li>
          <li><Link to="/reset/faketoken123">Réinitialisation (test)</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/oubli-mdp" element={<MotDePasseOublie />} />
      <Route path="/reset/:token" element={<ResetPassword />} />
<Route path="/connexion" element={<Connexion />} />
    </Routes>
  );
}
