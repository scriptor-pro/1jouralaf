import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

type Tache = {
  id: number
  titre: string
  energie: number
  deadline: string
}

export default function GererTaches() {
  const session = useSession()
  const [taches, setTaches] = useState<Tache[]>([])
  const [enEdition, setEnEdition] = useState<Tache | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session) chargerTaches()
  }, [session])

  const chargerTaches = async () => {
    const { data } = await supabase
      .from('taches')
      .select('*')
      .eq('user_id', session?.user.id)
      .order('deadline', { ascending: true })

    if (data) setTaches(data)
  }

  const supprimerTache = async (id: number) => {
    const ok = window.confirm('Supprimer cette tâche ?')
    if (!ok) return

    const { error } = await supabase
      .from('taches')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage("❌ Erreur lors de la suppression")
    } else {
      setMessage("✅ Tâche supprimée")
      setTaches((prev) => prev.filter(t => t.id !== id))
      if (enEdition?.id === id) setEnEdition(null)
    }
  }

  const modifierTache = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enEdition) return

    const { error } = await supabase
      .from('taches')
      .update({
        titre: enEdition.titre,
        energie: enEdition.energie,
        deadline: enEdition.deadline,
      })
      .eq('id', enEdition.id)

    if (error) {
      setMessage("❌ Erreur lors de la modification")
    } else {
      setMessage("✅ Tâche modifiée")
      setEnEdition(null)
      chargerTaches()
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🧰 Gérer mes tâches</h1>
      {message && <p style={{ marginTop: '1rem', color: '#444' }}>{message}</p>}

      {taches.length === 0 ? (
        <p>Tu n’as encore rien saisi. Va sur <a href="/ajout">/ajout</a> pour commencer !</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {taches.map(t => (
            <li key={t.id} style={{ listStyle: 'none', margin: '1rem 0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <strong>{t.titre}</strong> — ⚡ {t.energie} — 📆 {new Date(t.deadline).toLocaleDateString('fr-FR')}
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => setEnEdition(t)} aria-label="Modifier">✏️ Modifier</button>
                <button onClick={() => supprimerTache(t.id)} style={{ marginLeft: '0.5rem' }} aria-label="Supprimer">🗑️ Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {enEdition && (
        <form onSubmit={modifierTache} style={{ marginTop: '2rem' }}>
          <h2>✏️ Modifier la tâche</h2>
          <label>
            Titre
            <input
              type="text"
              value={enEdition.titre}
              onChange={(e) => setEnEdition({ ...enEdition, titre: e.target.value })}
              required
            />
          </label>

          <label>
            Énergie
            <select
              value={enEdition.energie}
              onChange={(e) => setEnEdition({ ...enEdition, energie: parseInt(e.target.value) })}
            >
              <option value={1}>1 - légère</option>
              <option value={2}>2 - correcte</option>
              <option value={3}>3 - lourde</option>
            </select>
          </label>

          <label>
            Deadline
            <input
              type="date"
              value={enEdition.deadline}
              onChange={(e) => setEnEdition({ ...enEdition, deadline: e.target.value })}
              required
            />
          </label>

          <button type="submit" style={{ marginTop: '1rem' }}>Enregistrer</button>
          <button type="button" onClick={() => setEnEdition(null)} style={{ marginLeft: '1rem' }}>Annuler</button>
        </form>
      )}
    </main>
  )
}
