import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function FormulaireConnexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Erreur : ${error.message}`)
    } else {
      setMessage('✅ Connexion réussie ! Redirection...')
      navigate('/jour')
    }
  }

  return (
    <form onSubmit={handleConnexion} style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Connexion</h2>

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Mot de passe</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" style={{ marginTop: '1rem' }}>Se connecter</button>

      <p style={{ marginTop: '1rem', color: '#555' }}>{message}</p>
    </form>
  )
}
