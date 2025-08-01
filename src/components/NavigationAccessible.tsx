import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'

export default function NavigationAccessible() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  return (
    <nav aria-label="Menu principal">
      <ul style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        listStyle: 'none',
        padding: '1rem',
        backgroundColor: '#f7f7f7',
        borderBottom: '2px solid #ccc'
      }}>
        <li><a href="/" role="link">🏠 Accueil</a></li>
        {!session && (
          <>
            <li><a href="/connexion" role="link">🔐 Connexion</a></li>
            <li><a href="/inscription" role="link">📝 Inscription</a></li>
<li><a href="/tableau" role="link">🧭 Tableau de bord</a></li>

          </>
        )}
        {session && (
          <>
            <li><a href="/jour" role="link">📅 Mon jour</a></li>
            <li><a href="/ajout" role="link">➕ Ajouter tâche</a></li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0077aa',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                aria-label="Se déconnecter"
              >
                🚪 Déconnexion
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
