import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import { formatNumber, formatPercent } from '../hooks/useSheetData'
import clsx from 'clsx'

export function KPICard({ 
  title, 
  value, 
  variacion, 
  icon: Icon,
  prefix = '',
  suffix = '',
  onClick,
  delay = 0,
  color = 'accent',
  size = 'default'
}) {
  const isPositive = variacion > 0
  const isNegative = variacion < 0
  const isNeutral = variacion === 0 || variacion === null

  const colorClasses = {
    accent: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
    success: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    warning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    info: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  }

  const iconColorClasses = {
    accent: 'text-indigo-400 bg-indigo-500/20',
    success: 'text-emerald-400 bg-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/20',
    info: 'text-cyan-400 bg-cyan-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={clsx(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6',
        'transition-shadow duration-300 hover:shadow-lg hover:shadow-black/20',
        colorClasses[color],
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={clsx(
            'p-3 rounded-xl',
            iconColorClasses[color]
          )}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          
          {onClick && (
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-zinc-400 mb-1 uppercase tracking-wide">
          {title}
        </p>

        {/* Value */}
        <div className="flex items-end gap-2 mb-3">
          <span className={clsx(
            'font-bold font-mono tracking-tight',
            size === 'large' ? 'text-4xl' : 'text-3xl'
          )}>
            {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
          </span>
        </div>

        {/* Variation */}
        {variacion !== undefined && (
          <div className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium',
            isPositive && 'bg-emerald-500/20 text-emerald-400',
            isNegative && 'bg-red-500/20 text-red-400',
            isNeutral && 'bg-zinc-500/20 text-zinc-400'
          )}>
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {isNeutral && <Minus className="w-4 h-4" />}
            <span>{variacion !== null ? formatPercent(variacion) : 'Sin datos'}</span>
            <span className="text-xs opacity-70">vs mes anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Versión mini para desglose
export function KPIMini({ label, value, variacion, icon: Icon }) {
  const isPositive = variacion > 0
  const isNegative = variacion < 0

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-white/5">
            <Icon className="w-4 h-4 text-zinc-400" />
          </div>
        )}
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono font-semibold">
          {typeof value === 'number' ? formatNumber(value) : value}
        </span>
        {variacion !== undefined && variacion !== null && (
          <span className={clsx(
            'text-xs font-medium',
            isPositive && 'text-emerald-400',
            isNegative && 'text-red-400',
            !isPositive && !isNegative && 'text-zinc-500'
          )}>
            {formatPercent(variacion)}
          </span>
        )}
      </div>
    </div>
  )
}

// Skeleton loader
export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-white/10" />
      </div>
      <div className="h-4 w-24 bg-white/10 rounded mb-2" />
      <div className="h-9 w-32 bg-white/10 rounded mb-3" />
      <div className="h-6 w-28 bg-white/10 rounded-full" />
    </div>
  )
}
