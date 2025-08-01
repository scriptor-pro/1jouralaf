import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function FormulaireInscription() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [neurotype, setNeurotype] = useState('')
  const [message, setMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    let score = 0
    if (value.length >= 8) score++
    if (/[A-Z]/.test(value)) score++
    if (/[0-9]/.test(value)) score++
    if (/[^A-Za-z0-9]/.test(value)) score++
    setPasswordStrength(score)
  }

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!email || !password || !neurotype) {
      setMessage('Merci de remplir tous les champs.')
      return
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      setMessage(`Erreur : ${signUpError.message}`)
      return
    }

    const user = authData?.user
    const userId = user?.id ?? authData.session?.user?.id

    if (!userId) {
      setMessage("Erreur lors de l'inscription.")
      return
    }

    const { error: insertError } = await supabase.from('profils').insert({
      id: userId,
      neurotype
    })

    if (insertError) {
      setMessage(`Utilisateur créé, mais profil non enregistré : ${insertError.message}`)
    } else {
      setMessage('✅ Compte créé avec succès ! Vérifie ta boîte mail pour confirmer.')
    }
  }

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Faible'
      case 2:
        return 'Moyen'
      case 3:
      case 4:
        return 'Fort'
      default:
        return ''
    }
  }

  return (
    <form onSubmit={handleInscription} style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Inscription</h2>

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
        onChange={(e) => handlePasswordChange(e.target.value)}
        required
      />
      <div style={{ fontSize: '0.9rem', color: passwordStrength < 2 ? 'red' : 'green' }}>
        Force du mot de passe : {getStrengthLabel()}
      </div>

      <label>Je suis :</label>
      <select value={neurotype} onChange={(e) => setNeurotype(e.target.value)} required>
        <option value="">Choisir...</option>
        <option value="TDAH">TDAH</option>
        <option value="Autiste">Autiste</option>
        <option value="TDAH+Autiste">TDAH + Autiste</option>
      </select>

      <button type="submit" style={{ marginTop: '1rem' }}>Créer mon compte</button>

      <p style={{ marginTop: '1rem', color: '#555' }}>{message}</p>
    </form>
  )
}
