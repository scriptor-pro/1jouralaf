import React, { useState } from 'react';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, motDePasse })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Connexion réussie.');
      } else {
        setMessage(data.message || '❌ Échec de la connexion.');
      }
    } catch (err) {
      setMessage('❌ Erreur de connexion au serveur.');
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Adresse e-mail</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />

        <label htmlFor="motDePasse">Mot de passe</label>
        <input
          type="password"
          id="motDePasse"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: '0.5rem 1rem' }}
        >
          Se connecter
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
