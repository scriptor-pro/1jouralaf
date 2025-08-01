import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function SliderEnergie() {
  const session = useSession()
  const [energie, setEnergie] = useState<number>(3)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!session) return

    const fetchEnergie = async () => {
      const { data, error } = await supabase
        .from('profils')
        .select('energie_actuelle')
        .eq('id', session.user.id)
        .single()

      if (data && data.energie_actuelle !== null) {
        setEnergie(data.energie_actuelle)
      }
    }

    fetchEnergie()
  }, [session])

  const handleChange = async (val: number) => {
    setEnergie(val)
    const { error } = await supabase
      .from('profils')
      .update({ energie_actuelle: val })
      .eq('id', session.user.id)

    setMessage(error ? '❌ Erreur de mise à jour' : '✅ Énergie mise à jour')
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <label htmlFor="energie" style={{ display: 'block', marginBottom: '0.5rem' }}>
        💡 Mon niveau d’énergie actuel : {energie}
      </label>
      <input
        id="energie"
        type="range"
        min={0}
        max={5}
        value={energie}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        aria-valuetext={`${energie} sur 5`}
        aria-label="Énergie actuelle"
      />
      {message && <p style={{ fontSize: '0.9rem' }}>{message}</p>}
    </div>
  )
}
