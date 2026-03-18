import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Papa from 'papaparse'

const SHEET_ID = import.meta.env.VITE_SHEET_ID

function getSheetURL(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
}

export function BrandSelector() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadBrands() {
      try {
        const response = await fetch(getSheetURL('_CONFIG'))
        const csvText = await response.text()
        
        const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true })
        
        setBrands(data.filter(row => row.marca_id && row.nombre))
        setLoading(false)
      } catch (err) {
        console.error('Error loading brands:', err)
        setError('No se pudieron cargar las marcas. Verifica la configuración del Google Sheet.')
        setLoading(false)
      }
    }
    
    loadBrands()
  }, [])

  const handleSelectBrand = (marcaId) => {
    navigate(`/dashboard/${marcaId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-white/30 border-t-yellow-400 rounded-full mx-auto mb-4"
          />
          <p className="text-white/80">Cargando marcas...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-3">Error de Conexión</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative overflow-hidden">
      {/* Decorative circles - estilo Megalimentos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] border-[30px] border-red-400/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] border-[30px] border-red-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo Mega Alimentos */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <img 
            src="https://megaalimentos.com/wp-content/uploads/2024/02/logo.svg" 
            alt="Mega Alimentos"
            className="h-16 md:h-20 mx-auto mb-6 drop-shadow-2xl"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-weight="bold" fill="white">MEGA</text></svg>'
            }}
          />
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
            Dashboard de Marketing
          </h1>
          <p className="text-white/80 text-lg mt-3">
            Selecciona una marca para ver sus reportes
          </p>
        </motion.div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.marca_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectBrand(brand.marca_id)}
              className="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: brand.color_primario }}
              />
              
              {/* Logo */}
              <div className="relative h-28 flex items-center justify-center mb-6">
                {brand.logo_url ? (
                  <img 
                    src={brand.logo_url}
                    alt={brand.nombre}
                    className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                    style={{ backgroundColor: brand.color_primario }}
                  >
                    {brand.nombre?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Brand name */}
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                {brand.nombre}
              </h2>

              {/* CTA */}
              <div 
                className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105"
                style={{ 
                  backgroundColor: `${brand.color_primario}15`,
                  color: brand.color_primario 
                }}
              >
                <span>Ver Dashboard</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Color indicator bar */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: brand.color_primario }}
              />
            </motion.button>
          ))}
        </div>

        {/* Empty state */}
        {brands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
          >
            <p className="text-white/80">
              No hay marcas configuradas. Agrega marcas en la hoja <code className="bg-white/20 px-2 py-1 rounded">_CONFIG</code> del Google Sheet.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-white/60 text-sm"
        >
          © {new Date().getFullYear()} Mega Alimentos • Dashboard de Reportes
        </motion.p>
      </div>
    </div>
  )
}
