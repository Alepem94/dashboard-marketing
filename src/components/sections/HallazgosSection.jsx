import { motion } from 'framer-motion'
import { Lightbulb, Target, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

const typeConfig = {
  insight: {
    icon: Lightbulb,
    color: 'amber',
    label: 'Insight',
    gradient: 'from-amber-500/20 to-orange-500/5',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  recomendacion: {
    icon: Target,
    color: 'emerald',
    label: 'Recomendación',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  alerta: {
    icon: AlertTriangle,
    color: 'red',
    label: 'Alerta',
    gradient: 'from-red-500/20 to-rose-500/5',
    border: 'border-red-500/20',
    iconColor: 'text-red-400',
  },
  logro: {
    icon: CheckCircle,
    color: 'indigo',
    label: 'Logro',
    gradient: 'from-indigo-500/20 to-purple-500/5',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
}

const priorityConfig = {
  alta: { color: 'text-red-400 bg-red-500/20', label: 'Alta' },
  media: { color: 'text-amber-400 bg-amber-500/20', label: 'Media' },
  baja: { color: 'text-emerald-400 bg-emerald-500/20', label: 'Baja' },
}

export function HallazgosSection({ data = [], loading }) {
  if (loading) {
    return <HallazgosSkeleton />
  }

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl">💡</span>
          <div>
            <h2 className="text-2xl font-bold">Hallazgos y Recomendaciones</h2>
            <p className="text-zinc-400 mt-1">Insights del análisis mensual</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/5 bg-surface-900/30 p-12 text-center"
        >
          <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No hay hallazgos registrados para este mes</p>
        </motion.div>
      </div>
    )
  }

  // Agrupar por tipo
  const insights = data.filter(h => h.tipo?.toLowerCase() === 'insight')
  const recomendaciones = data.filter(h => h.tipo?.toLowerCase() === 'recomendacion')
  const alertas = data.filter(h => h.tipo?.toLowerCase() === 'alerta')
  const logros = data.filter(h => h.tipo?.toLowerCase() === 'logro')

  // Ordenar por prioridad
  const sortByPriority = (items) => {
    const priorityOrder = { alta: 0, media: 1, baja: 2 }
    return [...items].sort((a, b) => 
      (priorityOrder[a.prioridad?.toLowerCase()] || 2) - 
      (priorityOrder[b.prioridad?.toLowerCase()] || 2)
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">💡</span>
        <div>
          <h2 className="text-2xl font-bold">Hallazgos y Recomendaciones</h2>
          <p className="text-zinc-400 mt-1">Insights del análisis mensual</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard type="insight" count={insights.length} />
        <StatCard type="recomendacion" count={recomendaciones.length} />
        <StatCard type="alerta" count={alertas.length} />
        <StatCard type="logro" count={logros.length} />
      </div>

      {/* Alertas primero (si hay) */}
      {alertas.length > 0 && (
        <Section 
          title="Alertas" 
          items={sortByPriority(alertas)} 
          type="alerta" 
        />
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Section 
          title="Insights" 
          items={sortByPriority(insights)} 
          type="insight" 
        />
      )}

      {/* Recomendaciones */}
      {recomendaciones.length > 0 && (
        <Section 
          title="Recomendaciones" 
          items={sortByPriority(recomendaciones)} 
          type="recomendacion" 
        />
      )}

      {/* Logros */}
      {logros.length > 0 && (
        <Section 
          title="Logros" 
          items={sortByPriority(logros)} 
          type="logro" 
        />
      )}
    </div>
  )
}

function StatCard({ type, count }) {
  const config = typeConfig[type] || typeConfig.insight
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-2xl border bg-gradient-to-br p-5',
        config.gradient,
        config.border
      )}
    >
      <Icon className={clsx('w-5 h-5 mb-2', config.iconColor)} />
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm text-zinc-400">{config.label}s</div>
    </motion.div>
  )
}

function Section({ title, items, type }) {
  const config = typeConfig[type] || typeConfig.insight

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className={clsx('text-lg font-semibold flex items-center gap-2', config.iconColor)}>
        <config.icon className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="grid gap-4">
        {items.map((item, index) => (
          <HallazgoCard key={index} item={item} type={type} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

function HallazgoCard({ item, type, index }) {
  const config = typeConfig[type] || typeConfig.insight
  const priority = priorityConfig[item.prioridad?.toLowerCase()]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        'rounded-2xl border bg-gradient-to-br p-6 group hover:scale-[1.01] transition-transform',
        config.gradient,
        config.border
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="font-semibold text-lg">{item.titulo}</h4>
        {priority && (
          <span className={clsx(
            'px-2.5 py-1 rounded-full text-xs font-medium shrink-0',
            priority.color
          )}>
            {priority.label}
          </span>
        )}
      </div>
      
      <p className="text-zinc-400 leading-relaxed">{item.descripcion}</p>

      {/* Action hint */}
      {type === 'recomendacion' && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-zinc-500 group-hover:text-accent-400 transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>Acción sugerida</span>
        </div>
      )}
    </motion.div>
  )
}

function HallazgosSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💡</span>
        <div>
          <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded mt-2 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl border border-white/5 bg-surface-900/50 p-5 animate-pulse">
            <div className="w-5 h-5 bg-white/10 rounded mb-2" />
            <div className="h-8 w-12 bg-white/10 rounded mb-1" />
            <div className="h-4 w-16 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-white/5 bg-surface-900/50 p-6 animate-pulse">
            <div className="h-6 w-48 bg-white/10 rounded mb-3" />
            <div className="h-4 w-full bg-white/5 rounded mb-2" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
