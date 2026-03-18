import { motion } from 'framer-motion'
import { Users, Eye, MousePointerClick, DollarSign, TrendingUp, Target } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { AreaChartComponent, MultiLineChart, ChartSkeleton } from '../ui/Charts'
import { MetasTable, TableSkeleton } from '../ui/DataTable'
import { formatNumber, formatCurrency, formatPercent, calcularVariacion } from '../../hooks/useSheetData'

export function Overview({ data, historical, loading }) {
  if (loading) {
    return <OverviewSkeleton />
  }

  const kpis = data?.kpis || {}
  const metas = data?.metas || []
  const prevKpis = historical?.kpis?.[1] || {}

  const trendData = historical?.kpis?.slice(0, 6).reverse().map(k => ({
    mes: k.mes?.split('-')[1] || '',
    comunidad: Number(k.comunidad_fb || 0) + Number(k.comunidad_ig || 0) + Number(k.comunidad_tk || 0),
    alcance: Number(k.alcance_total || 0),
    interaccion: Number(k.interaccion_total || 0),
  })) || []

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Resumen General</h2>
        <p className="text-zinc-400 mt-1">Vista consolidada de todas las plataformas</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Comunidad Total"
          value={formatNumber(
            Number(kpis.comunidad_fb || 0) + 
            Number(kpis.comunidad_ig || 0) + 
            Number(kpis.comunidad_tk || 0)
          )}
          variation={calcularVariacion(
            Number(kpis.comunidad_fb || 0) + Number(kpis.comunidad_ig || 0) + Number(kpis.comunidad_tk || 0),
            Number(prevKpis.comunidad_fb || 0) + Number(prevKpis.comunidad_ig || 0) + Number(prevKpis.comunidad_tk || 0)
          )}
          icon={Users}
          color="indigo"
          delay={0}
        />
        <KPICard
          title="Alcance Total"
          value={formatNumber(kpis.alcance_total)}
          variation={calcularVariacion(kpis.alcance_total, prevKpis.alcance_total)}
          icon={Eye}
          color="emerald"
          delay={0.1}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(kpis.interaccion_total)}
          variation={calcularVariacion(kpis.interaccion_total, prevKpis.interaccion_total)}
          icon={MousePointerClick}
          color="amber"
          delay={0.2}
        />
        <KPICard
          title="Inversión Total"
          value={formatCurrency(kpis.inversion_total)}
          variation={calcularVariacion(kpis.inversion_total, prevKpis.inversion_total)}
          icon={DollarSign}
          color="rose"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Tendencia de Alcance
          </h3>
          {trendData.length > 0 ? (
            <AreaChartComponent
              data={trendData}
              dataKey="alcance"
              xKey="mes"
              color="#818cf8"
              height={250}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">
              No hay datos históricos
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Comunidad vs Interacción
          </h3>
          {trendData.length > 0 ? (
            <MultiLineChart
              data={trendData}
              lines={[
                { dataKey: 'comunidad', color: '#818cf8', name: 'Comunidad' },
                { dataKey: 'interaccion', color: '#34d399', name: 'Interacciones' },
              ]}
              xKey="mes"
              height={250}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">
              No hay datos históricos
            </div>
          )}
        </motion.div>
      </div>

      {metas && metas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetasTable data={metas} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <PlatformSummaryCard
          platform="Facebook"
          emoji="📘"
          followers={formatNumber(kpis.comunidad_fb || 0)}
          color="blue"
        />
        <PlatformSummaryCard
          platform="Instagram"
          emoji="📸"
          followers={formatNumber(kpis.comunidad_ig || 0)}
          color="pink"
        />
        <PlatformSummaryCard
          platform="TikTok"
          emoji="🎵"
          followers={formatNumber(kpis.comunidad_tk || 0)}
          color="cyan"
        />
      </motion.div>
    </div>
  )
}

function PlatformSummaryCard({ platform, emoji, followers, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{emoji}</span>
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{platform}</span>
      </div>
      <div className="text-2xl font-bold">{followers}</div>
      <div className="text-sm text-zinc-400">seguidores</div>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-64 bg-white/5 rounded mt-2 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <KPICardSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <TableSkeleton />
    </div>
  )
}
