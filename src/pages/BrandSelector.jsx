import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, ArrowRight, Loader2 } from 'lucide-react'
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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-accent-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Cargando marcas...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">Error de Conexión</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent-600 hover:bg-accent-500 rounded-xl font-medium transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/25"
          >
            <BarChart3 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Dashboard de Marketing
          </h1>
          <p className="text-zinc-400 text-lg">
            Selecciona una marca para ver su reporte
          </p>
        </div>

        {/* Brand Cards */}
        <div className="grid gap-4">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.marca_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleSelectBrand(brand.marca_id)}
              className="group w-full p-6 rounded-2xl border border-white/5 bg-surface-900/50 hover:bg-surface-800/50 hover:border-accent-500/30 transition-all duration-300 flex items-center gap-5 text-left"
            >
              {/* Logo o inicial */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ 
                  backgroundColor: brand.color_primario ? `${brand.color_primario}20` : 'rgba(99, 102, 241, 0.2)',
                  color: brand.color_primario || '#818cf8'
                }}
              >
                {brand.logo_url ? (
                  <img 
                    src={brand.logo_url} 
                    alt={brand.nombre} 
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  brand.nombre.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
                  {brand.nombre}
                </h2>
                <p className="text-sm text-zinc-500">
                  ID: {brand.marca_id}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>

        {/* Empty state */}
        {brands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-400">
              No hay marcas configuradas. Agrega marcas en la hoja <code className="text-accent-400">_CONFIG</code> del Google Sheet.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-zinc-600 text-sm mt-12"
        >
          Los datos se actualizan automáticamente desde Google Sheets
        </motion.p>
      </motion.div>
    </div>
  )
}
