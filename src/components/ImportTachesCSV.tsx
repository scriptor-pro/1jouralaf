import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'
import Papa from 'papaparse'
import { useState } from 'react'

export default function ImportTachesCSV() {
  const session = useSession()
  const [message, setMessage] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !session) return

    setMessage('⏳ Analyse du fichier en cours...')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const lignes = results.data as any[]

        const tachesValides = lignes
          .map((t) => ({
            titre: t.titre?.trim(),
            energie: parseInt(t.energie),
            deadline: t.deadline,
            user_id: session.user.id,
          }))
          .filter((t) =>
            t.titre &&
            [1, 2, 3].includes(t.energie) &&
            /^\d{4}-\d{2}-\d{2}$/.test(t.deadline)
          )

        if (tachesValides.length === 0) {
          setMessage("❌ Aucun élément valide trouvé dans ce fichier.")
          return
        }

        const { error } = await supabase.from('taches').insert(tachesValides)

        if (error) {
          setMessage("❌ Erreur lors de l'import : " + error.message)
        } else {
          setMessage(`✅ ${tachesValides.length} tâche(s) importée(s) avec succès !`)
        }
      },
      error: function () {
        setMessage("❌ Erreur de lecture du fichier.")
      }
    })
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📥 Importer des tâches (.csv)</h2>
      <p>Format attendu : <code>titre,energie,deadline</code></p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        aria-label="Importer un fichier CSV de tâches"
      />
      {message && <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>{message}</p>}
    </div>
  )
}
