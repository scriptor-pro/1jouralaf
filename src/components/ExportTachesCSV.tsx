import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function ExportTachesCSV() {
  const session = useSession()

  const exporter = async () => {
    if (!session) return

    const { data: taches, error } = await supabase
      .from('taches')
      .select('*')
      .eq('user_id', session.user.id)

    if (error || !taches) {
      alert('Erreur lors de l’export')
      return
    }

    // Génération du contenu CSV
    const enTete = 'id,titre,energie,deadline,created_at\n'
    const lignes = taches.map(t =>
      [t.id, `"${t.titre}"`, t.energie, t.deadline, t.created_at].join(',')
    )

    const contenu = enTete + lignes.join('\n')
    const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' })

    // Téléchargement
    const url = URL.createObjectURL(blob)
    const lien = document.createElement('a')
    lien.href = url
    lien.setAttribute('download', 'mes-taches.csv')
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
  }

  return (
    <button onClick={exporter}>
      📤 Exporter mes tâches (.csv)
    </button>
  )
}
