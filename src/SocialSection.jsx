import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Eye, ExternalLink } from 'lucide-react'
import { formatNumber } from '../../hooks/useSheetData'

export function PostCard({ post, delay = 0, platformColor = '#ffffff' }) {
  const likes = parseFloat(post?.likes) || parseFloat(post?.interacciones) || 0
  const comments = parseFloat(post?.comentarios) || 0
  const shares = parseFloat(post?.compartidos) || 0
  const views = parseFloat(post?.vistas) || parseFloat(post?.alcance) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden hover:bg-white/15 transition-all"
    >
      {/* Imagen del post */}
      {post?.imagen_url && (
        <div className="relative aspect-square bg-black/20">
          <img 
            src={post.imagen_url} 
            alt={post.titulo || 'Post'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          {/* Overlay con ranking */}
          {post?.ranking && (
            <div 
              className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: platformColor }}
            >
              #{post.ranking}
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        {/* Título / Descripción */}
        {(post?.titulo || post?.descripcion) && (
          <p className="text-sm text-white/80 line-clamp-2 mb-3">
            {post.titulo || post.descripcion}
          </p>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-2">
          {likes > 0 && (
            <MetricBadge icon={Heart} value={formatNumber(likes)} label="likes" />
          )}
          {comments > 0 && (
            <MetricBadge icon={MessageCircle} value={formatNumber(comments)} label="comments" />
          )}
          {shares > 0 && (
            <MetricBadge icon={Share2} value={formatNumber(shares)} label="shares" />
          )}
          {views > 0 && (
            <MetricBadge icon={Eye} value={formatNumber(views)} label="views" />
          )}
        </div>

        {/* Link al post */}
        {post?.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-colors"
          >
            <span>Ver post</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function MetricBadge({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/10">
      <Icon className="w-3.5 h-3.5 text-white/50" />
      <span className="text-sm font-mono font-medium text-white">{value}</span>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/20 rounded w-3/4" />
        <div className="h-4 bg-white/20 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-white/20 rounded" />
          <div className="h-8 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  )
}
