import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'
import clsx from 'clsx'

export function DataTable({ 
  columns, 
  data,
  title,
  emptyMessage = 'No hay datos disponibles'
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="py-12 text-center text-zinc-500">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-surface-900/50 overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col, index) => (
                <th 
                  key={index}
                  className={clsx(
                    'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400',
                    col.align === 'right' ? 'text-right' : 'text-left'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex}
                    className={clsx(
                      'px-6 py-4',
                      col.align === 'right' && 'text-right',
                      col.mono && 'font-mono'
                    )}
                  >
                    {col.render 
                      ? col.render(row[col.accessor], row) 
                      : row[col.accessor]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// Celda de variación con color
export function VariationCell({ value, format = 'percent' }) {
  const isPositive = value > 0
  const isNegative = value < 0
  
  const formatted = format === 'percent' 
    ? `${value >= 0 ? '+' : ''}${value?.toFixed(1)}%`
    : value

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium',
      isPositive && 'text-emerald-400',
      isNegative && 'text-red-400',
      !isPositive && !isNegative && 'text-zinc-500'
    )}>
      {isPositive && <ChevronUp className="w-4 h-4" />}
      {isNegative && <ChevronDown className="w-4 h-4" />}
      {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
      {formatted}
    </span>
  )
}

// Celda de progreso
export function ProgressCell({ value, max = 100 }) {
  const percentage = Math.min((value / max) * 100, 100)
  const isComplete = percentage >= 100
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={clsx(
            'h-full rounded-full',
            isComplete ? 'bg-emerald-500' : 'bg-indigo-500'
          )}
        />
      </div>
      <span className={clsx(
        'text-sm font-mono w-14 text-right',
        isComplete ? 'text-emerald-400' : 'text-zinc-400'
      )}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}

// Badge de estado
export function StatusBadge({ status, variant = 'default' }) {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  }

  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      variants[variant]
    )}>
      {status}
    </span>
  )
}

// Tabla de metas
export function MetasTable({ data }) {
  const columns = [
    { 
      header: 'Plataforma', 
      accessor: 'plataforma',
      render: (val) => (
        <span className="font-medium">{val}</span>
      )
    },
    { 
      header: 'Objetivo', 
      accessor: 'objetivo',
    },
    { 
      header: 'Meta', 
      accessor: 'meta',
      align: 'right',
      mono: true,
    },
    { 
      header: 'Resultado', 
      accessor: 'resultado',
      align: 'right',
      mono: true,
    },
    { 
      header: 'Cumplimiento', 
      accessor: 'cumplimiento',
      align: 'right',
      render: (val) => {
        const value = parseFloat(val)
        return (
          <ProgressCell value={value} max={100} />
        )
      }
    },
  ]

  return (
    <DataTable 
      title="Metas vs Resultados"
      columns={columns}
      data={data}
    />
  )
}

// Skeleton de tabla
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-900/50 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-white/5">
        <div className="h-5 w-32 bg-white/10 rounded" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div 
                key={j} 
                className="h-4 bg-white/10 rounded flex-1"
                style={{ maxWidth: j === 0 ? '150px' : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
