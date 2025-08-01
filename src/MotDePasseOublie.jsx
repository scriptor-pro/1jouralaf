import React, { useState } from 'react';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('📧 Si cet e-mail existe, un lien t’a été envoyé.');
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
      <h1>Mot de passe oublié</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Ton adresse e-mail</label>
        <input
          type="email"
          id="email"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Envoyer le lien
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
