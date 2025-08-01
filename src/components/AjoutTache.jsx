import { useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function AjoutTache() {
  const session = useSession()
  const [titre, setTitre] = useState('')
  const [energie, setEnergie] = useState('')
  const [message, setMessage] = useState('')

  const ajouterTache = async (e) => {
    e.preventDefault()
    if (!session) return

    const { data, error } = await supabase.from('taches').insert([
      {
        titre,
        energie: parseInt(energie),
        user_id: session.user.id
      }
    ])

    if (error) {
      setMessage(`❌ Erreur : ${error.message}`)
    } else {
      setMessage('✅ Tâche ajoutée avec succès !')
      setTitre('')
      setEnergie('')
    }
  }

  return (
    <form onSubmit={ajouterTache} style={{ marginBottom: '2rem' }}>
      <h3>Ajouter une tâche</h3>
      <label>Titre :</label>
      <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />
      <label>Énergie :</label>
      <select value={energie} onChange={(e) => setEnergie(e.target.value)} required>
        <option value="">Choisir...</option>
        <option value="1">1 - Faible</option>
        <option value="2">2 - Moyenne</option>
        <option value="3">3 - Haute</option>
      </select>
      <button type="submit">Ajouter</button>
      <p>{message}</p>
    </form>
  )
}
