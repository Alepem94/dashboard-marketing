import { motion } from 'framer-motion'
import { DollarSign, MousePointer, Eye, TrendingUp, Target, BarChart3 } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { DataTable, VariationCell } from '../ui/DataTable'
import { HorizontalBarChart, AreaChartComponent } from '../ui/Charts'
import { formatNumber, formatCurrency, formatPercent } from '../../hooks/useSheetData'

export function GoogleAdsSection({ data = [], historical = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Calcular totales de todas las campañas
  const safeData = Array.isArray(data) ? data : []
  
  const totals = safeData.reduce((acc, campaign) => ({
    impresiones: acc.impresiones + (parseFloat(campaign?.impresiones) || 0),
    clics: acc.clics + (parseFloat(campaign?.clics) || 0),
    conversiones: acc.conversiones + (parseFloat(campaign?.conversiones) || 0),
    costo: acc.costo + (parseFloat(campaign?.costo) || 0),
  }), { impresiones: 0, clics: 0, conversiones: 0, costo: 0 })

  const ctr = totals.impresiones > 0 ? (totals.clics / totals.impresiones) * 100 : 0
  const cpc = totals.clics > 0 ? totals.costo / totals.clics : 0
  const cpa = totals.conversiones > 0 ? totals.costo / totals.conversiones : 0

  // Datos para gráfica de rendimiento por campaña
  const campaignData = safeData.map(c => ({
    name: c.nombre_campana || c.campana || 'Sin nombre',
    value: parseFloat(c.conversiones) || 0,
  })).filter(c => c.value > 0)

  // Columnas para tabla
  const columns = [
    { 
      label: 'Campaña', 
      key: 'nombre_campana',
      render: (val, row) => (
        <span className="font-medium text-white">{val || row.campana || 'Sin nombre'}</span>
      )
    },
    { 
      label: 'Impresiones', 
      key: 'impresiones',
      align: 'right',
      mono: true,
      render: (val) => formatNumber(val)
    },
    { 
      label: 'Clics', 
      key: 'clics',
      align: 'right',
      mono: true,
      render: (val) => formatNumber(val)
    },
    { 
      label: 'CTR', 
      key: 'ctr',
      align: 'right',
      render: (val, row) => {
        const calcCTR = row.impresiones > 0 ? (row.clics / row.impresiones) * 100 : 0
        return `${calcCTR.toFixed(2)}%`
      }
    },
    { 
      label: 'Conversiones', 
      key: 'conversiones',
      align: 'right',
      mono: true,
      render: (val) => formatNumber(val)
    },
    { 
      label: 'Costo', 
      key: 'costo',
      align: 'right',
      mono: true,
      render: (val) => formatCurrency(val)
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
        <div className="p-3 rounded-xl bg-blue-500/30">
          <Target className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Google Ads</h1>
          <p className="text-white/60">Rendimiento de campañas publicitarias</p>
        </div>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Impresiones"
          value={formatNumber(totals.impresiones)}
          icon={Eye}
          delay={0}
        />
        <KPICard
          title="Clics"
          value={formatNumber(totals.clics)}
          subtitle={`CTR: ${ctr.toFixed(2)}%`}
          icon={MousePointer}
          delay={1}
        />
        <KPICard
          title="Conversiones"
          value={formatNumber(totals.conversiones)}
          subtitle={`CPA: ${formatCurrency(cpa)}`}
          icon={TrendingUp}
          delay={2}
        />
        <KPICard
          title="Inversión Total"
          value={formatCurrency(totals.costo)}
          subtitle={`CPC: ${formatCurrency(cpc)}`}
          icon={DollarSign}
          delay={3}
        />
      </div>

      {/* Gráfica de conversiones por campaña */}
      {campaignData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Conversiones por Campaña</h3>
          <HorizontalBarChart
            data={campaignData}
            dataKey="value"
            nameKey="name"
            color="#60a5fa"
            height={Math.max(200, campaignData.length * 50)}
          />
        </motion.div>
      )}

      {/* Tabla de campañas */}
      {safeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            title="Detalle de Campañas"
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
          <p className="text-white/50">No hay datos de campañas para este mes</p>
        </motion.div>
      )}
    </div>
  )
}
