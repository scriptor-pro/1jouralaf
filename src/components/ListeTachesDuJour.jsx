import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function ListeTachesDuJour() {
  const session = useSession()
  const [taches, setTaches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) chargerTachesDuJour()
  }, [session])

  const chargerTachesDuJour = async () => {
    setLoading(true)
    const today = new Date()
    const debut = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const fin = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    const { data, error } = await supabase
      .from('taches')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('created_at', debut)
      .lte('created_at', fin)
      .order('created_at', { ascending: true })

    if (!error) setTaches(data)
    setLoading(false)
  }

  const labelEnergie = (niveau) =>
    niveau === 1 ? '🟢 Faible énergie' : niveau === 2 ? '🟡 Moyenne énergie' : '🔴 Haute énergie'

  return (
    <div>
      <h3>Tâches créées aujourd’hui</h3>
      {loading && <p>Chargement...</p>}
      {!loading && taches.length === 0 && <p>Aucune tâche pour aujourd’hui.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {taches.map(t => (
          <li key={t.id} style={{
            borderLeft: `5px solid ${t.energie === 1 ? '#4CAF50' : t.energie === 2 ? '#FFC107' : '#F44336'}`,
            background: '#fff', borderRadius: '4px',
            padding: '0.5rem 1rem', marginBottom: '0.5rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <strong>{t.titre}</strong> — {labelEnergie(t.energie)}<br />
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              ajoutée le {new Date(t.created_at).toLocaleDateString('fr-FR')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
