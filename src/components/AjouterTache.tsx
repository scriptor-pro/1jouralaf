import { useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function AjouterTache() {
  const session = useSession()
  const [titre, setTitre] = useState('')
  const [energie, setEnergie] = useState(1)
  const [deadline, setDeadline] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!titre || !deadline || !energie || !session) {
      setMessage("Tous les champs sont obligatoires.")
      return
    }

    const { error } = await supabase.from('taches').insert({
      titre,
      energie,
      deadline,
      user_id: session.user.id,
    })

    if (error) {
      setMessage(`Erreur : ${error.message}`)
    } else {
      setMessage('✅ Tâche ajoutée !')
      setTitre('')
      setEnergie(1)
      setDeadline('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Ajouter une tâche</h2>

      <label htmlFor="titre">Nom de la tâche</label>
      <input
        id="titre"
        type="text"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      <label htmlFor="energie">Niveau d’énergie requis</label>
      <select
        id="energie"
        value={energie}
        onChange={(e) => setEnergie(parseInt(e.target.value))}
      >
        <option value={1}>1 - Facile, petite tâche</option>
        <option value={2}>2 - Gère, mais demande de l'énergie</option>
        <option value={3}>3 - Grosse dépense énergétique</option>
      </select>

      <label htmlFor="deadline">Date limite</label>
      <input
        id="deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <button type="submit" style={{ marginTop: '1rem' }}>
        Ajouter
      </button>

      {message && <p style={{ marginTop: '1rem', color: '#555' }}>{message}</p>}
    </form>
  )
}
