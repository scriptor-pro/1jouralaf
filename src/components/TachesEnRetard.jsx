import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function TachesEnRetard() {
  const session = useSession()
  const [taches, setTaches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) chargerTachesEnRetard()
  }, [session])

  const chargerTachesEnRetard = async () => {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('taches')
      .select('*')
      .eq('user_id', session.user.id)
      .lt('deadline', today)
      .order('deadline', { ascending: true })

    if (!error) setTaches(data)
    setLoading(false)
  }

  return (
    <div>
      <h3>🔄 Tâches à reprendre en douceur</h3>
      {loading && <p>Chargement...</p>}
      {!loading && taches.length === 0 && <p>Pas de tâche en retard 🧘 Tu gères.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {taches.map(t => (
          <li key={t.id} style={{
            borderLeft: '5px solid #b3b3e6',
            backgroundColor: '#f5f5ff',
            padding: '1rem', marginBottom: '0.5rem',
            borderRadius: '6px'
          }}>
            <strong>{t.titre}</strong><br />
            <span>🔄 Prévue le {new Date(t.deadline).toLocaleDateString('fr-FR')}</span><br />
            <em style={{ color: '#666' }}>
              Pas encore faite, mais toujours possible. Tu peux t’y remettre doucement.
            </em>
          </li>
        ))}
      </ul>
    </div>
  )
}
