import { Routes, Route, Navigate } from 'react-router-dom'
import { BrandSelector } from './pages/BrandSelector'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      {/* Página inicial: selector de marca */}
      <Route path="/" element={<BrandSelector />} />
      
      {/* Dashboard con marca seleccionada */}
      <Route path="/dashboard/:marcaId/*" element={<Dashboard />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
