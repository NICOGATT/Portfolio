import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import AdminLoginPage from './features/admin/pages/AdminLoginPage'
import AdminMessagesPage from './features/admin/pages/AdminMessagesPage'
import AdminOverviewPage from './features/admin/pages/AdminOverviewPage'
import AdminProjectImagesPage from './features/admin/pages/AdminProjectImagesPage'
import AdminProjectsPage from './features/admin/pages/AdminProjectsPage'
import AdminTechnologiesPage from './features/admin/pages/AdminTechnologiesPage'
import HomePage from './features/public/pages/HomePage'
import ProjectDetailPage from './features/public/pages/ProjectDetailPage'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="technologies" element={<AdminTechnologiesPage />} />
          <Route path="images" element={<AdminProjectImagesPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />

          <Route path="proyectos" element={<Navigate replace to="/admin/projects" />} />
          <Route path="tecnologias" element={<Navigate replace to="/admin/technologies" />} />
          <Route path="imagenes" element={<Navigate replace to="/admin/images" />} />
          <Route path="mensajes" element={<Navigate replace to="/admin/messages" />} />
        </Route>
      </Route>

      <Route path="/login" element={<Navigate replace to="/admin/login" />} />
      <Route path="/dashboard" element={<Navigate replace to="/admin" />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
