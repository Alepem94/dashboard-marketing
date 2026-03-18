import { motion } from 'framer-motion'
import { Search, Monitor, Video, MousePointerClick, DollarSign, Target, TrendingUp } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { GroupedBarChart, DonutChart, ChartSkeleton } from '../ui/Charts'
import { DataTable, TableSkeleton } from '../ui/DataTable'
import { formatNumber, formatCurrency, formatPercent } from '../../hooks/useSheetData'

const campaignIcons = {
  search: Search,
  display: Monitor,
  video: Video,
}

const campaignColors = {
  search: '#818cf8',
  display: '#34d399',
  video: '#f472b6',
}

export function GoogleAdsSection({ data = [], historical, loading }) {
  if (loading) {
    return <GoogleAdsSkeleton />
  }

  // Calcular totales
  const totals = data.reduce((acc, row) => ({
    impresiones: acc.impresiones + Number(row.impresiones || 0),
    clics: acc.clics + Number(row.clics || 0),
    inversion: acc.inversion + Number(row.inversion || 0),
    conversiones: acc.conversiones + Number(row.conversiones || 0),
  }), { impresiones: 0, clics: 0, inversion: 0, conversiones: 0 })

  const avgCTR = totals.impresiones > 0 
    ? (totals.clics / totals.impresiones) * 100 
    : 0

  const avgCPA = totals.conversiones > 0 
    ? totals.inversion / totals.conversiones 
    : 0

  // Datos para gráfica de barras por tipo de campaña
  const chartData = data.map(row => ({
    tipo: row.tipo_campana || 'Otro',
    clics: Number(row.clics || 0),
    conversiones: Number(row.conversiones || 0),
    inversion: Number(row.inversion || 0),
  }))

  // Datos para donut de distribución de inversión
  const donutData = data.map(row => ({
    name: row.tipo_campana || 'Otro',
    value: Number(row.inversion || 0),
    color: campaignColors[row.tipo_campana?.toLowerCase()] || '#94a3b8',
  }))

  // Columnas para la tabla
  const tableColumns = [
    { 
      key: 'tipo_campana', 
      label: 'Tipo',
      render: (val) => (
        <div className="flex items-center gap-2">
          {getCampaignIcon(val)}
          <span className="capitalize">{val}</span>
        </div>
      )
    },
    { key: 'impresiones', label: 'Impresiones', render: formatNumber },
    { key: 'clics', label: 'Clics', render: formatNumber },
    { key: 'ctr', label: 'CTR', render: (v) => formatPercent(v) },
    { key: 'cpc', label: 'CPC', render: (v) => formatCurrency(v) },
    { key: 'inversion', label: 'Inversión', render: (v) => formatCurrency(v) },
    { key: 'conversiones', label: 'Conv.', render: formatNumber },
    { key: 'cpa', label: 'CPA', render: (v) => formatCurrency(v) },
    { 
      key: 'roas', 
      label: 'ROAS',
      render: (v) => v ? `${Number(v).toFixed(2)}x` : '-'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Google Ads</h2>
          <p className="text-zinc-400 mt-1">Rendimiento de campañas publicitarias</p>
        </div>
      </motion.div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Impresiones"
          value={formatNumber(totals.impresiones)}
          icon={Monitor}
          color="indigo"
          delay={0}
        />
        <KPICard
          title="Clics"
          value={formatNumber(totals.clics)}
          subtitle={`CTR: ${avgCTR.toFixed(2)}%`}
          icon={MousePointerClick}
          color="emerald"
          delay={0.1}
        />
        <KPICard
          title="Inversión Total"
          value={formatCurrency(totals.inversion)}
          icon={DollarSign}
          color="amber"
          delay={0.2}
        />
        <KPICard
          title="Conversiones"
          value={formatNumber(totals.conversiones)}
          subtitle={`CPA: ${formatCurrency(avgCPA)}`}
          icon={Target}
          color="rose"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Performance por tipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-white/5 bg-surface-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            Rendimiento por Tipo de Campaña
          </h3>
          <GroupedBarChart
            data={chartData}
            bars={[
              { dataKey: 'clics', color: '#818cf8', name: 'Clics' },
              { dataKey: 'conversiones', color: '#34d399', name: 'Conversiones' },
            ]}
            xAxisKey="tipo"
            height={280}
          />
        </motion.div>

        {/* Donut - Distribución de inversión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Distribución de Inversión
          </h3>
          <DonutChart
            data={donutData}
            height={280}
          />
        </motion.div>
      </div>

      {/* Detailed Table */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DataTable
            title="Detalle por Campaña"
            columns={tableColumns}
            data={data}
          />
        </motion.div>
      )}

      {/* Empty state */}
      {data.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-surface-900/30 p-12 text-center"
        >
          <Monitor className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No hay datos de Google Ads para este mes</p>
        </motion.div>
      )}
    </div>
  )
}

function getCampaignIcon(tipo) {
  const Icon = campaignIcons[tipo?.toLowerCase()] || Monitor
  const color = campaignColors[tipo?.toLowerCase()] || '#94a3b8'
  return <Icon className="w-4 h-4" style={{ color }} />
}

function GoogleAdsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
        <div>
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded mt-2 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <KPICardSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>

      <TableSkeleton />
    </div>
  )
}
