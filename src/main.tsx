import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './lib/supabaseClient'

import App from './App'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Jour from './pages/Jour'
<Route path="/jour" element={<Jour />} />
import TableauDeBord from './pages/TableauDeBord'
<Route path="/tableau" element={<TableauDeBord />} />
import GererTaches from './pages/GererTaches'
<Route path="/taches" element={<GererTaches />} />

// Tu peux ajouter ici : import Jour from './pages/Jour' etc.

import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          {/* Exemple : <Route path="/jour" element={<Jour />} /> */}
        </Routes>
      </BrowserRouter>
    </SessionContextProvider>
  </React.StrictMode>
)

