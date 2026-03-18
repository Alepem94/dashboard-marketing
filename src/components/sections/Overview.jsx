import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  Heart, 
  TrendingUp, 
  DollarSign,
  MousePointer,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
} from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { AreaChartComponent, MultiLineChart } from '../ui/Charts'
import { MetasTable, TableSkeleton } from '../ui/DataTable'
import { formatNumber, formatCurrency, formatPercent } from '../../hooks/useSheetData'

// TikTok icon
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

export function Overview({ data, historical, loading, theme }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton />
      </div>
    )
  }

  const { kpis, metas, facebook, instagram, tiktok } = data

  // Calcular totales de redes sociales
  const totalSeguidores = 
    (parseFloat(facebook?.seguidores) || 0) + 
    (parseFloat(instagram?.seguidores) || 0) + 
    (parseFloat(tiktok?.seguidores) || 0)

  const totalAlcance = 
    (parseFloat(facebook?.alcance) || 0) + 
    (parseFloat(instagram?.alcance) || 0) + 
    (parseFloat(tiktok?.alcance) || 0)

  const totalInteracciones = 
    (parseFloat(facebook?.interacciones) || 0) + 
    (parseFloat(instagram?.interacciones) || 0) + 
    (parseFloat(tiktok?.interacciones) || 0)

  // Preparar datos para gráficas
  const seguidoresData = (historical?.facebook || []).map((fb, index) => ({
    mes: fb.mes,
    Facebook: parseFloat(fb.seguidores) || 0,
    Instagram: parseFloat(historical?.instagram?.[index]?.seguidores) || 0,
    TikTok: parseFloat(historical?.tiktok?.[index]?.seguidores) || 0,
  })).slice(-6)

  return (
    <div className="space-y-6">
      {/* KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Seguidores Totales"
          value={formatNumber(totalSeguidores)}
          variation={parseFloat(kpis?.var_seguidores)}
          icon={Users}
          delay={0}
        />
        <KPICard
          title="Alcance Total"
          value={formatNumber(totalAlcance)}
          variation={parseFloat(kpis?.var_alcance)}
          icon={Eye}
          delay={1}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(totalInteracciones)}
          variation={parseFloat(kpis?.var_interacciones)}
          icon={Heart}
          delay={2}
        />
        <KPICard
          title="Engagement Rate"
          value={kpis?.engagement_rate || '0'}
          suffix="%"
          variation={parseFloat(kpis?.var_engagement)}
          icon={TrendingUp}
          delay={3}
        />
      </div>

      {/* Resumen por plataforma */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlatformCard
          platform="Facebook"
          icon={Facebook}
          color="#1877F2"
          data={facebook}
          delay={0}
        />
        <PlatformCard
          platform="Instagram"
          icon={Instagram}
          color="#E4405F"
          data={instagram}
          delay={1}
        />
        <PlatformCard
          platform="TikTok"
          icon={TikTokIcon}
          color="#000000"
          data={tiktok}
          delay={2}
        />
      </div>

      {/* Gráfica de evolución */}
      {seguidoresData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Evolución de Seguidores
          </h3>
          <MultiLineChart
            data={seguidoresData}
            lines={[
              { dataKey: 'Facebook', name: 'Facebook', color: '#1877F2' },
              { dataKey: 'Instagram', name: 'Instagram', color: '#E4405F' },
              { dataKey: 'TikTok', name: 'TikTok', color: '#ffffff' },
            ]}
            height={300}
          />
        </motion.div>
      )}

      {/* Tabla de Metas */}
      {Array.isArray(metas) && metas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetasTable data={metas} />
        </motion.div>
      )}
    </div>
  )
}

// Tarjeta de plataforma
function PlatformCard({ platform, icon: Icon, color, data, delay = 0 }) {
  const seguidores = parseFloat(data?.seguidores) || 0
  const alcance = parseFloat(data?.alcance) || 0
  const interacciones = parseFloat(data?.interacciones) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/15 transition-colors"
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h3 className="text-lg font-semibold text-white">{platform}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Seguidores</span>
          <span className="font-mono font-semibold text-white">{formatNumber(seguidores)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Alcance</span>
          <span className="font-mono font-semibold text-white">{formatNumber(alcance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Interacciones</span>
          <span className="font-mono font-semibold text-white">{formatNumber(interacciones)}</span>
        </div>
      </div>
    </motion.div>
  )
}
