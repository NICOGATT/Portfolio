import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import type { InitialData } from './types/prerender'
import './index.css'

export const render = (url: string, initialData: InitialData) =>
  renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <App initialData={initialData} />
      </AuthProvider>
    </StaticRouter>,
  )
