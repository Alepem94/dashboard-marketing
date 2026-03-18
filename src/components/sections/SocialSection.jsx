import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  Heart, 
  TrendingUp,
  Share2,
  MessageCircle,
  Video,
  Image,
  ThumbsUp,
  UserPlus,
} from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { AreaChartComponent } from '../ui/Charts'
import { PostCard, PostCardSkeleton } from '../ui/PostCard'
import { formatNumber, formatPercent } from '../../hooks/useSheetData'

const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    metrics: ['seguidores', 'alcance', 'interacciones', 'nuevos_seguidores', 'compartidos', 'comentarios'],
    icons: {
      seguidores: Users,
      alcance: Eye,
      interacciones: Heart,
      nuevos_seguidores: UserPlus,
      compartidos: Share2,
      comentarios: MessageCircle,
    }
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    metrics: ['seguidores', 'alcance', 'interacciones', 'nuevos_seguidores', 'guardados', 'comentarios'],
    icons: {
      seguidores: Users,
      alcance: Eye,
      interacciones: Heart,
      nuevos_seguidores: UserPlus,
      guardados: Heart,
      comentarios: MessageCircle,
    }
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    metrics: ['seguidores', 'vistas', 'likes', 'nuevos_seguidores', 'compartidos', 'comentarios'],
    icons: {
      seguidores: Users,
      vistas: Eye,
      likes: ThumbsUp,
      nuevos_seguidores: UserPlus,
      compartidos: Share2,
      comentarios: MessageCircle,
    }
  }
}

export function SocialSection({ platform, data, posts = [], historical = [], loading }) {
  const config = platformConfig[platform]
  
  if (!config) {
    return (
      <div className="text-center py-12 text-white/50">
        Plataforma no configurada
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Extraer métricas del data
  const seguidores = parseFloat(data?.seguidores) || 0
  const alcance = parseFloat(data?.alcance || data?.vistas) || 0
  const interacciones = parseFloat(data?.interacciones || data?.likes) || 0
  const nuevosSeguidores = parseFloat(data?.nuevos_seguidores) || 0

  // Variaciones
  const varSeguidores = parseFloat(data?.var_seguidores)
  const varAlcance = parseFloat(data?.var_alcance || data?.var_vistas)
  const varInteracciones = parseFloat(data?.var_interacciones || data?.var_likes)

  // Datos históricos para gráfica
  const chartData = Array.isArray(historical) 
    ? historical.map(h => ({
        mes: h.mes,
        value: parseFloat(h.seguidores) || 0
      })).slice(-6)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${config.color}30` }}
        >
          <Users className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{config.name}</h1>
          <p className="text-white/60">Métricas del mes actual</p>
        </div>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Seguidores"
          value={formatNumber(seguidores)}
          variation={varSeguidores}
          icon={Users}
          delay={0}
        />
        <KPICard
          title={platform === 'tiktok' ? 'Vistas' : 'Alcance'}
          value={formatNumber(alcance)}
          variation={varAlcance}
          icon={Eye}
          delay={1}
        />
        <KPICard
          title={platform === 'tiktok' ? 'Likes' : 'Interacciones'}
          value={formatNumber(interacciones)}
          variation={varInteracciones}
          icon={Heart}
          delay={2}
        />
        <KPICard
          title="Nuevos Seguidores"
          value={formatNumber(nuevosSeguidores)}
          icon={UserPlus}
          delay={3}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalle de métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Detalle de Métricas</h3>
          <div className="space-y-4">
            {data?.compartidos !== undefined && (
              <MetricRow 
                icon={Share2} 
                label="Compartidos" 
                value={formatNumber(data.compartidos)}
                color={config.color}
              />
            )}
            {data?.comentarios !== undefined && (
              <MetricRow 
                icon={MessageCircle} 
                label="Comentarios" 
                value={formatNumber(data.comentarios)}
                color={config.color}
              />
            )}
            {data?.guardados !== undefined && (
              <MetricRow 
                icon={Heart} 
                label="Guardados" 
                value={formatNumber(data.guardados)}
                color={config.color}
              />
            )}
            {data?.videos !== undefined && (
              <MetricRow 
                icon={Video} 
                label="Videos publicados" 
                value={data.videos}
                color={config.color}
              />
            )}
            {data?.publicaciones !== undefined && (
              <MetricRow 
                icon={Image} 
                label="Publicaciones" 
                value={data.publicaciones}
                color={config.color}
              />
            )}
            {data?.engagement_rate !== undefined && (
              <MetricRow 
                icon={TrendingUp} 
                label="Engagement Rate" 
                value={`${data.engagement_rate}%`}
                color={config.color}
              />
            )}
          </div>
        </motion.div>

        {/* Gráfica de evolución */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Evolución de Seguidores</h3>
            <AreaChartComponent
              data={chartData}
              dataKey="value"
              color={config.color}
              height={250}
            />
          </motion.div>
        )}
      </div>

      {/* Top Posts */}
      {posts && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Posts del Mes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post, index) => (
              <PostCard 
                key={post.id || index} 
                post={post} 
                delay={index}
                platformColor={config.color}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state para posts */}
      {(!posts || posts.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center"
        >
          <Image className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50">No hay posts destacados para este mes</p>
        </motion.div>
      )}
    </div>
  )
}

// Fila de métrica
function MetricRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-white/70">{label}</span>
      </div>
      <span className="font-mono font-semibold text-white">{value}</span>
    </div>
  )
}
