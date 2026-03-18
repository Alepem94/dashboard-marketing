import { motion } from 'framer-motion'
import { Users, Eye, Heart, TrendingUp, Image, DollarSign } from 'lucide-react'
import { KPICard, KPIMini, KPICardSkeleton } from '../ui/KPICard'
import { AreaChartComponent, ChartSkeleton } from '../ui/Charts'
import { PostsGrid } from '../ui/PostCard'
import { formatNumber, formatCurrency, formatPercent, calcularVariacion } from '../../hooks/useSheetData'

const platformConfig = {
  facebook: {
    name: 'Facebook',
    emoji: '📘',
    color: '#1877f2',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  instagram: {
    name: 'Instagram',
    emoji: '📸',
    color: '#e4405f',
    gradient: 'from-pink-500/20 to-purple-600/5',
  },
  tiktok: {
    name: 'TikTok',
    emoji: '🎵',
    color: '#00f2ea',
    gradient: 'from-cyan-500/20 to-pink-500/5',
  },
}

export function SocialSection({ platform, data, posts, historical, loading }) {
  const config = platformConfig[platform] || platformConfig.facebook

  if (loading) {
    return <SocialSkeleton config={config} />
  }

  // Calcular variaciones con mes anterior
  const prevData = historical?.[1] || {}

  // Preparar datos de tendencia
  const trendData = historical?.slice(0, 6).reverse().map(d => ({
    mes: d.mes?.split('-')[1] || '',
    followers: Number(d.followers || 0),
    alcance: Number(d.alcance || 0),
    engagement: Number(d.engagement_rate || 0),
  })) || []

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <h2 className="text-2xl font-bold">{config.name}</h2>
          <p className="text-zinc-400 mt-1">Métricas y rendimiento del mes</p>
        </div>
      </motion.div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Seguidores"
          value={formatNumber(data.followers)}
          variation={calcularVariacion(data.followers, prevData.followers)}
          icon={Users}
          color="indigo"
          delay={0}
        />
        <KPICard
          title="Alcance"
          value={formatNumber(data.alcance)}
          variation={calcularVariacion(data.alcance, prevData.alcance)}
          icon={Eye}
          color="emerald"
          delay={0.1}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(data.interacciones)}
          variation={calcularVariacion(data.interacciones, prevData.interacciones)}
          icon={Heart}
          color="rose"
          delay={0.2}
        />
        <KPICard
          title="Engagement Rate"
          value={formatPercent(data.engagement_rate)}
          variation={calcularVariacion(data.engagement_rate, prevData.engagement_rate)}
          icon={TrendingUp}
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Secondary Metrics + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Métricas Adicionales</h3>
          <div className="space-y-4">
            <KPIMini 
              label="Impresiones" 
              value={formatNumber(data.impresiones)} 
            />
            <KPIMini 
              label="Nuevos Seguidores" 
              value={formatNumber(data.nuevos_seguidores)} 
              positive={Number(data.nuevos_seguidores) > 0}
            />
            <KPIMini 
              label="Publicaciones" 
              value={data.publicaciones || '0'} 
            />
            {data.inversion_paid && Number(data.inversion_paid) > 0 && (
              <>
                <hr className="border-white/5" />
                <KPIMini 
                  label="Inversión Paid" 
                  value={formatCurrency(data.inversion_paid)} 
                  icon={DollarSign}
                />
                <KPIMini 
                  label="Resultados Paid" 
                  value={formatNumber(data.resultados_paid)} 
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-white/5 bg-surface-900/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            Evolución de Alcance
          </h3>
          <AreaChartComponent
            data={trendData}
            dataKey="alcance"
            xAxisKey="mes"
            color={config.color}
            height={280}
          />
        </motion.div>
      </div>

      {/* Top Posts */}
      {posts && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-400" />
            Top Posts del Mes
          </h3>
          <PostsGrid posts={posts} />
        </motion.div>
      )}

      {/* Empty state for posts */}
      {(!posts || posts.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/5 bg-surface-900/30 p-12 text-center"
        >
          <Image className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No hay posts destacados para este mes</p>
        </motion.div>
      )}
    </div>
  )
}

function SocialSkeleton({ config }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded mt-2 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <KPICardSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6 animate-pulse">
          <div className="h-5 w-40 bg-white/10 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-white/5 rounded" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  )
}
