import { motion } from 'framer-motion'
import { Users, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'
import { DataTable, VariationCell } from '../ui/DataTable'
import { GroupedBarChart } from '../ui/Charts'
import { formatNumber } from '../../hooks/useSheetData'

export function CompetenciaSection({ data = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 animate-pulse">
          <div className="h-64 bg-white/10 rounded-xl" />
        </div>
      </div>
    )
  }

  const safeData = Array.isArray(data) ? data : []

  // Preparar datos para gráfica
  const chartData = safeData.map(c => ({
    name: c.competidor || 'Sin nombre',
    Seguidores: parseFloat(c.seguidores) || 0,
    Interacciones: parseFloat(c.interacciones) || 0,
  }))

  // Columnas para tabla
  const columns = [
    { 
      label: 'Competidor', 
      key: 'competidor',
      render: (val) => (
        <span className="font-medium text-white">{val || 'Sin nombre'}</span>
      )
    },
    { 
      label: 'Plataforma', 
      key: 'plataforma',
    },
    { 
      label: 'Seguidores', 
      key: 'seguidores',
      align: 'right',
      mono: true,
      render: (val) => formatNumber(val)
    },
    { 
      label: 'Var. Seg.', 
      key: 'var_seguidores',
      align: 'right',
      render: (val) => <VariationCell value={val} />
    },
    { 
      label: 'Interacciones', 
      key: 'interacciones',
      align: 'right',
      mono: true,
      render: (val) => formatNumber(val)
    },
    { 
      label: 'Engagement', 
      key: 'engagement_rate',
      align: 'right',
      render: (val) => val ? `${val}%` : '-'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-orange-500/30">
          <Users className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Análisis de Competencia</h1>
          <p className="text-white/60">Comparativa con competidores principales</p>
        </div>
      </motion.div>

      {/* Gráfica comparativa */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Comparativa de Seguidores e Interacciones</h3>
          <GroupedBarChart
            data={chartData}
            bars={[
              { dataKey: 'Seguidores', name: 'Seguidores', color: '#60a5fa' },
              { dataKey: 'Interacciones', name: 'Interacciones', color: '#f97316' },
            ]}
            xKey="name"
            height={300}
          />
        </motion.div>
      )}

      {/* Tabla de competidores */}
      {safeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataTable
            title="Detalle de Competidores"
            columns={columns}
            data={safeData}
          />
        </motion.div>
      )}

      {/* Empty state */}
      {safeData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center"
        >
          <BarChart3 className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50">No hay datos de competencia para este mes</p>
        </motion.div>
      )}
    </div>
  )
}
