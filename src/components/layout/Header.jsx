import { motion } from 'framer-motion'
import { ChevronDown, RefreshCw, Menu } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header({ 
  brandName, 
  brandLogo,
  brandColor,
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
    <header className="sticky top-0 z-30 bg-surface-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Menu button (mobile) + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {brandLogo ? (
              <img 
                src={brandLogo} 
                alt={brandName} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ 
                  backgroundColor: brandColor ? `${brandColor}20` : 'rgba(99, 102, 241, 0.2)',
                  color: brandColor || '#818cf8'
                }}
              >
                {brandName?.charAt(0)?.toUpperCase() || 'M'}
              </div>
            )}
            <h1 className="text-lg font-semibold hidden sm:block">{brandName || 'Dashboard'}</h1>
          </div>
        </div>

        {/* Right: Month selector + Refresh */}
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800 border border-white/5 hover:border-white/10 transition-colors min-w-[160px]"
            >
              <span className="text-sm font-medium capitalize">
                {formatMonth(selectedMonth)}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && months.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-800 border border-white/10 shadow-xl overflow-hidden"
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
                          ? 'bg-accent-600/20 text-accent-400' 
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
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
            className="p-2 rounded-xl bg-surface-800 border border-white/5 hover:border-white/10 transition-colors disabled:opacity-50"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
