import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import { formatNumber, formatPercent } from '../../hooks/useSheetData'

export function KPICard({ 
  title, 
  value, 
  variation,
  subtitle,
  icon: Icon,
  prefix = '',
  suffix = '',
  onClick,
  delay = 0,
  color = 'white',
  size = 'default'
}) {
  const isPositive = variation > 0
  const isNegative = variation < 0
  const isNeutral = variation === 0 || variation === null || variation === undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 transition-all duration-300 hover:bg-white/15 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/20">
            {Icon && <Icon className="w-5 h-5 text-white" />}
          </div>
          
          {onClick && (
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-white/70 mb-1 uppercase tracking-wide">
          {title}
        </p>

        {/* Value */}
        <div className="flex items-end gap-2 mb-1">
          <span className={`font-bold font-mono tracking-tight text-white ${size === 'large' ? 'text-4xl' : 'text-3xl'}`}>
            {prefix}{value}{suffix}
          </span>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-white/60 mb-2">{subtitle}</p>
        )}

        {/* Variation */}
        {variation !== undefined && variation !== null && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-emerald-500/30 text-emerald-300' : ''} ${isNegative ? 'bg-red-500/30 text-red-300' : ''} ${isNeutral ? 'bg-white/20 text-white/70' : ''}`}>
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {isNeutral && <Minus className="w-4 h-4" />}
            <span>{formatPercent(variation)}</span>
            <span className="text-xs opacity-70">vs mes anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Versión mini para desglose
export function KPIMini({ label, value, variation, icon: Icon, positive }) {
  const isPositive = variation > 0 || positive
  const isNegative = variation < 0

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-white/10">
            <Icon className="w-4 h-4 text-white/70" />
          </div>
        )}
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono font-semibold text-white">{value}</span>
        {variation !== undefined && variation !== null && (
          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : ''} ${isNegative ? 'text-red-400' : ''} ${!isPositive && !isNegative ? 'text-white/50' : ''}`}>
            {formatPercent(variation)}
          </span>
        )}
      </div>
    </div>
  )
}

// Skeleton loader
export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-white/20" />
      </div>
      <div className="h-4 w-24 bg-white/20 rounded mb-2" />
      <div className="h-9 w-32 bg-white/20 rounded mb-3" />
      <div className="h-6 w-28 bg-white/20 rounded-full" />
    </div>
  )
}
