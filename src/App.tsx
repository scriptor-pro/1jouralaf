import NavigationAccessible from './components/NavigationAccessible'

export default function App() {
  return (
    <>
      <NavigationAccessible />
      <main style={{ padding: '2rem' }}>
        <h1>Bienvenue 🧠</h1>
        <p>
          Cette application t’aide à organiser ta journée si tu es TDAH, autiste ou les deux.
        </p>
        <p>
          Commence par t’inscrire, ou connecte-toi si tu as déjà un compte.
        </p>
      </main>
    </>
  )
}
