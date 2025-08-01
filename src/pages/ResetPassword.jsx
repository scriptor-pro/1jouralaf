import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3000/auth/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('🎉 Ton mot de passe a été mis à jour.');
      } else {
        setMessage(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setMessage('Erreur de connexion au serveur.');
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h1>Réinitialiser mon mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Nouveau mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          disabled={isSubmitting}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !password}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Réinitialiser
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
