import { motion } from 'framer-motion'
import { ChevronDown, RefreshCw, Menu } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header({ 
  brandConfig,
  theme,
  months = [], 
  selectedMonth, 
  onMonthChange,
  onRefresh,
  isRefreshing,
  onMenuClick 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Formatear mes para mostrar (YYYY-MM → Mes Año)
  const formatMonth = (monthStr) => {
    if (!monthStr) return 'Seleccionar mes'
    const [year, month] = monthStr.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  }

  return (
    <header className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Brand info (visible on mobile) */}
        <div className="flex items-center gap-4">
          {/* Space for mobile menu button */}
          <div className="lg:hidden w-12" />

          {/* Brand name - mobile only */}
          <div className="lg:hidden flex items-center gap-3">
            {brandConfig?.logo_url ? (
              <img 
                src={brandConfig.logo_url} 
                alt={brandConfig?.nombre} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: theme?.primary || '#6366f1' }}
              >
                {brandConfig?.nombre?.charAt(0)?.toUpperCase() || 'M'}
              </div>
            )}
            <h1 className="text-lg font-semibold text-white">{brandConfig?.nombre || 'Dashboard'}</h1>
          </div>

          {/* Desktop: just show page context */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-white">
              {brandConfig?.nombre || 'Dashboard'}
            </h2>
            <p className="text-sm text-white/60">Reporte de Marketing Digital</p>
          </div>
        </div>

        {/* Right: Month selector + Refresh */}
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors min-w-[160px] text-white"
            >
              <span className="text-sm font-medium capitalize">
                {formatMonth(selectedMonth)}
              </span>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && months.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-2xl overflow-hidden z-50"
              >
                <div className="max-h-64 overflow-y-auto py-1">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        onMonthChange(month)
                        setIsOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors capitalize ${
                        month === selectedMonth 
                          ? 'bg-gray-100 font-semibold'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ 
                        color: month === selectedMonth ? theme?.primary : '#374151'
                      }}
                    >
                      {formatMonth(month)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 text-white"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
