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
  const [tachesJour, setTachesJour] = useState<Tache[]>([])
  const [tachesRetard, setTachesRetard] = useState<Tache[]>([])
  const [neurotype, setNeurotype] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    if (!session) return

    const chargerTaches = async () => {
      const { data: profil } = await supabase
        .from('profils')
        .select('neurotype')
        .eq('id', session.user.id)
        .single()

      if (!profil) return
      setNeurotype(profil.neurotype)

      const { data: taches } = await supabase
        .from('taches')
        .select('*')
        .eq('user_id', session.user.id)
        .lte('deadline', today)

      if (!taches) return

      // Filtrage
      const jour = taches.filter((t) => t.deadline === today)
      const retard = taches.filter((t) => t.deadline < today)

      // Fonction de tri personnalisée selon le neurotype
      const triPersonnalise = (liste: Tache[]) => {
        const copie = [...liste]
        if (profil.neurotype === 'TDAH') {
          return copie.sort((a, b) => a.energie - b.energie)
        }
        if (profil.neurotype === 'Autiste') {
          return copie.sort((a, b) => a.id - b.id)
        }
        if (profil.neurotype === 'TDAH+Autiste') {
          return copie.sort((a, b) => {
            if (a.energie === b.energie) return a.id - b.id
            return a.energie - b.energie
          })
        }
        return copie
      }

      setTachesJour(triPersonnalise(jour))
      setTachesRetard(triPersonnalise(retard))
    }

    chargerTaches()
  }, [session, today])

  const formatDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🗓️ Aujourd’hui : {formatDate}</h1>
      {neurotype && <p>Profil : <strong>{neurotype}</strong></p>}

      {tachesRetard.length > 0 && (
        <>
          <h2 style={{ color: '#aa0000' }}>⏰ Tâches en retard (pas de pression)</h2>
          <ul>
            {tachesRetard.map((t) => (
              <li key={t.id}>
                {t.titre} — ⚡ {t.energie} — prévu pour le {new Date(t.deadline).toLocaleDateString('fr-FR')}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Tâches pour aujourd’hui</h2>
      {tachesJour.length === 0 ? (
        <p>Tu n’as rien prévu pour aujourd’hui. C’est très bien aussi 🌿</p>
      ) : (
        <ul>
          {tachesJour.map((t) => (
            <li key={t.id}>
              {t.titre} — ⚡ {t.energie}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
