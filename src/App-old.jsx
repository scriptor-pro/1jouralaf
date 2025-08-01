import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Accueil() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenue sur 1 jour à la fois</h1>
      <p>Ceci est une page de test de l'application React.</p>
      <Link to="/test">Aller à une autre page</Link>
    </div>
  );
}

function PageTest() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Page de test</h1>
      <p>Le routage fonctionne 🎉</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/test" element={<PageTest />} />
    </Routes>
  );
}
