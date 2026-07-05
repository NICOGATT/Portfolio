import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'

function PublicLayout() {
  return (
    <div className="App">
      <Header />
      <div className="page-content">
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default PublicLayout
