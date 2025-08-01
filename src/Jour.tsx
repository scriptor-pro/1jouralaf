import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSession } from '@supabase/auth-helpers-react'

type Tache = {
  id: number
  titre: string
  energie: number
  deadline: string
}

export default function Jour() {
  const session = useSession()
  const [taches, setTaches] = useState<Tache[]>([])
  const [neurotype, setNeurotype] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0] // format YYYY-MM-DD

  useEffect(() => {
    if (!session) return

    const fetchNeurotypeAndTaches = async () => {
      const { data: profil } = await supabase
        .from('profils')
        .select('neurotype')
        .eq('id', session.user.id)
        .single()

      if (!profil) return

      setNeurotype(profil.neurotype)

      const { data: tachesBrutes } = await supabase
        .from('taches')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('deadline', today)

      if (!tachesBrutes) return

      // Tri selon le neurotype
      let triées = [...tachesBrutes]
      if (profil.neurotype === 'TDAH') {
        triées.sort((a, b) => a.energie - b.energie)
      } else if (profil.neurotype === 'Autiste') {
        triées.sort((a, b) => a.id - b.id)
      } else if (profil.neurotype === 'TDAH+Autiste') {
        triées.sort((a, b) => {
          if (a.energie === b.energie) return a.id - b.id
          return a.energie - b.energie
        })
      }

      setTaches(triées)
    }

    fetchNeurotypeAndTaches()
  }, [session, today])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🗓️ Aujourd’hui : {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h1>

      {neurotype && (
        <p>Tri adapté à ton profil : <strong>{neurotype}</strong></p>
      )}

      <h2>Tâches du jour</h2>
      {taches.length === 0 ? (
        <p>Tu n’as rien prévu pour aujourd’hui. Profite ou ajoute quelque chose ✨</p>
      ) : (
        <ul>
          {taches.map((t) => (
            <li key={t.id}>
              {t.titre} — ⚡ énergie : {t.energie}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
