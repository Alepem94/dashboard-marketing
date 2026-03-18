import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'

export function DataTable({ 
  columns = [], 
  data = [],
  title,
  emptyMessage = 'No hay datos disponibles'
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
        {title && <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>}
        <div className="py-12 text-center text-white/50">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col, index) => (
                <th 
                  key={index}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/60 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.label || col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
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
                    className={`px-6 py-4 text-white ${col.align === 'right' ? 'text-right' : ''} ${col.mono ? 'font-mono' : ''}`}
                  >
                    {col.render 
                      ? col.render(row[col.key || col.accessor], row) 
                      : row[col.key || col.accessor]
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
  const numValue = parseFloat(value)
  const isPositive = numValue > 0
  const isNegative = numValue < 0
  
  if (isNaN(numValue)) {
    return <span className="text-white/50">-</span>
  }
  
  const formatted = format === 'percent' 
    ? `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`
    : value

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-400' : ''} ${isNegative ? 'text-red-400' : ''} ${!isPositive && !isNegative ? 'text-white/50' : ''}`}>
      {isPositive && <ChevronUp className="w-4 h-4" />}
      {isNegative && <ChevronDown className="w-4 h-4" />}
      {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
      {formatted}
    </span>
  )
}

// Celda de progreso
export function ProgressCell({ value, max = 100 }) {
  const numValue = parseFloat(value) || 0
  const percentage = Math.min((numValue / max) * 100, 100)
  const isComplete = percentage >= 100
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-white'}`}
        />
      </div>
      <span className={`text-sm font-mono w-14 text-right ${isComplete ? 'text-emerald-400' : 'text-white/70'}`}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}

// Badge de estado
export function StatusBadge({ status, variant = 'default' }) {
  const variants = {
    success: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/30 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/30 text-red-300 border-red-500/30',
    info: 'bg-blue-500/30 text-blue-300 border-blue-500/30',
    default: 'bg-white/20 text-white/70 border-white/20',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {status}
    </span>
  )
}

// Tabla de metas
export function MetasTable({ data = [] }) {
  const columns = [
    { 
      label: 'Plataforma', 
      key: 'plataforma',
      render: (val) => (
        <span className="font-medium text-white">{val}</span>
      )
    },
    { 
      label: 'Objetivo', 
      key: 'objetivo',
    },
    { 
      label: 'Meta', 
      key: 'meta',
      align: 'right',
      mono: true,
    },
    { 
      label: 'Resultado', 
      key: 'resultado',
      align: 'right',
      mono: true,
    },
    { 
      label: 'Cumplimiento', 
      key: 'cumplimiento',
      align: 'right',
      render: (val) => {
        const value = parseFloat(val) || 0
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
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-white/10">
        <div className="h-5 w-32 bg-white/20 rounded" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div 
                key={j} 
                className="h-4 bg-white/20 rounded flex-1"
                style={{ maxWidth: j === 0 ? '150px' : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
