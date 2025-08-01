import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'
import SliderEnergie from '../components/SliderEnergie'
// ...
<SliderEnergie />

type Tache = {
  id: number
  titre: string
  energie: number
  deadline: string
}

export default function TableauDeBord() {
  const session = useSession()
  const [taches, setTaches] = useState<Tache[]>([])
  const [neurotype, setNeurotype] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      const { data: profil } = await supabase
        .from('profils')
        .select('neurotype')
        .eq('id', session.user.id)
        .single()

      if (!profil) return
      setNeurotype(profil.neurotype)

      const { data: tachesData } = await supabase
        .from('taches')
        .select('*')
        .eq('user_id', session.user.id)
        .lte('deadline', today)

      if (tachesData) setTaches(tachesData)
    }

    fetchData()
  }, [session, today])

  const tachesRetard = taches.filter((t) => t.deadline < today)
  const tachesJour = taches.filter((t) => t.deadline === today)

  const proposerTache = (): Tache | null => {
    const toutes = [...tachesRetard, ...tachesJour]
    if (toutes.length === 0) return null

    if (neurotype === 'TDAH') {
      return toutes.sort((a, b) => a.energie - b.energie)[0]
    }
    if (neurotype === 'Autiste') {
      return toutes.sort((a, b) => a.id - b.id)[0]
    }
    if (neurotype === 'TDAH+Autiste') {
      return toutes
        .sort((a, b) => (a.energie === b.energie ? a.id - b.id : a.energie - b.energie))[0]
    }
    return toutes[0]
  }

  const tacheProposee = proposerTache()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>👋 Bienvenue dans ton tableau de bord</h1>
      {neurotype && <p>Profil identifié : <strong>{neurotype}</strong></p>}

      <section style={{ marginTop: '2rem' }}>
        <h2>📌 Une tâche que tu pourrais faire maintenant</h2>
        {tacheProposee ? (
          <p>
            👉 <strong>{tacheProposee.titre}</strong> (⚡ énergie {tacheProposee.energie})<br />
            prévue pour le {new Date(tacheProposee.deadline).toLocaleDateString('fr-FR')}
          </p>
        ) : (
          <p>Tu n’as rien à faire pour l’instant — c’est aussi très bien 🌿</p>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>⏰ Tâches en retard</h2>
        <p>{tachesRetard.length > 0 ? `${tachesRetard.length} tâche(s) en attente` : "Aucune, bravo !"}</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🧭 Accès rapide</h2>
        <ul>
          <li><Link to="/ajout">➕ Ajouter une tâche</Link></li>
          <li><Link to="/jour">📅 Voir ma journée</Link></li>
          <li><Link to="/connexion">🔐 Connexion</Link></li>
        </ul>
      </section>
    </main>
  )
}
