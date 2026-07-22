import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import AnalyticsTracker from './components/googleAnalitycs/AnaliticsTracker.ts'

const root = document.getElementById('root')!
const app = (
  <BrowserRouter>
    <AnalyticsTracker/>
    <AuthProvider>
      <App initialData={window.__INITIAL_DATA__} />
    </AuthProvider>
  </BrowserRouter>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
