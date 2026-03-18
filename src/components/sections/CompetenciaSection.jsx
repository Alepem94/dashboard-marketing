import { motion } from 'framer-motion'
import { Users, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { HorizontalBarChart, ChartSkeleton } from '../ui/Charts'
import { DataTable, VariationCell, TableSkeleton } from '../ui/DataTable'
import { formatNumber, formatPercent } from '../../hooks/useSheetData'

const platformEmojis = {
  facebook: '📘',
  instagram: '📸',
  tiktok: '🎵',
  twitter: '🐦',
  youtube: '📺',
}

export function CompetenciaSection({ data = [], loading }) {
  if (loading) {
    return <CompetenciaSkeleton />
  }

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className="text-2xl font-bold">Análisis de Competencia</h2>
            <p className="text-zinc-400 mt-1">Comparativa con competidores</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/5 bg-surface-900/30 p-12 text-center"
        >
          <Activity className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No hay datos de competencia para este mes</p>
        </motion.div>
      </div>
    )
  }

  // Agrupar por red social
  const byPlatform = data.reduce((acc, row) => {
    const platform = row.red?.toLowerCase() || 'otro'
    if (!acc[platform]) acc[platform] = []
    acc[platform].push(row)
    return acc
  }, {})

  // Datos para gráfica de barras (followers por competidor)
  const chartData = data
    .filter(row => row.competidor && row.followers)
    .sort((a, b) => Number(b.followers) - Number(a.followers))
    .slice(0, 8)
    .map(row => ({
      name: row.competidor,
      value: Number(row.followers || 0),
    }))

  // Columnas para la tabla
  const tableColumns = [
    { 
      key: 'competidor', 
      label: 'Competidor',
      render: (val) => <span className="font-medium">{val}</span>
    },
    { 
      key: 'red', 
      label: 'Red',
      render: (val) => (
        <span className="flex items-center gap-1.5">
          {platformEmojis[val?.toLowerCase()] || '📱'}
          <span className="capitalize">{val}</span>
        </span>
      )
    },
    { key: 'followers', label: 'Seguidores', render: formatNumber },
    { 
      key: 'variacion', 
      label: 'Variación',
      render: (val) => <VariationCell value={val} />
    },
    { key: 'engagement', label: 'Engagement', render: (v) => v ? formatPercent(v) : '-' },
    { key: 'actividad', label: 'Actividad', render: (v) => v || '-' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">🎯</span>
        <div>
          <h2 className="text-2xl font-bold">Análisis de Competencia</h2>
          <p className="text-zinc-400 mt-1">Comparativa con competidores</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-5"
        >
          <div className="text-sm text-zinc-400 mb-1">Competidores Monitoreados</div>
          <div className="text-3xl font-bold">
            {new Set(data.map(d => d.competidor)).size}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-5"
        >
          <div className="text-sm text-zinc-400 mb-1">Redes Analizadas</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {Object.keys(byPlatform).length}
            <span className="text-lg">
              {Object.keys(byPlatform).map(p => platformEmojis[p] || '📱').join('')}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-5"
        >
          <div className="text-sm text-zinc-400 mb-1">Tendencia General</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {getTendencyIndicator(data)}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart - Top Followers */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Seguidores por Competidor
          </h3>
          <HorizontalBarChart
            data={chartData}
            height={Math.max(200, chartData.length * 40)}
          />
        </motion.div>
      )}

      {/* Detailed Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DataTable
          title="Detalle de Competidores"
          columns={tableColumns}
          data={data}
        />
      </motion.div>
    </div>
  )
}

function getTendencyIndicator(data) {
  const variations = data
    .map(d => parseFloat(d.variacion))
    .filter(v => !isNaN(v))
  
  if (variations.length === 0) return '—'
  
  const avgVariation = variations.reduce((a, b) => a + b, 0) / variations.length
  
  if (avgVariation > 2) {
    return (
      <>
        <TrendingUp className="w-6 h-6 text-emerald-400" />
        <span className="text-emerald-400">Creciendo</span>
      </>
    )
  } else if (avgVariation < -2) {
    return (
      <>
        <TrendingDown className="w-6 h-6 text-red-400" />
        <span className="text-red-400">Bajando</span>
      </>
    )
  } else {
    return <span className="text-zinc-400">Estable</span>
  }
}

function CompetenciaSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        <div>
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-40 bg-white/5 rounded mt-2 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-white/5 bg-surface-900/50 p-5 animate-pulse">
            <div className="h-4 w-32 bg-white/10 rounded mb-2" />
            <div className="h-8 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      <ChartSkeleton />
      <TableSkeleton />
    </div>
  )
}
