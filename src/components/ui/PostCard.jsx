import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Eye, Play, ExternalLink } from 'lucide-react'
import { formatNumber } from '../hooks/useSheetData'
import clsx from 'clsx'

// Iconos de plataforma
const platformIcons = {
  facebook: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
}

const platformColors = {
  facebook: 'bg-blue-600',
  instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
  tiktok: 'bg-black',
}

export function PostCard({ post, index = 0 }) {
  const {
    plataforma,
    imagen_url,
    descripcion,
    alcance,
    interacciones,
    tipo,
    post_url,
  } = post

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/5 bg-surface-900/50 overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-surface-800 overflow-hidden">
        {imagen_url ? (
          <img 
            src={imagen_url} 
            alt={descripcion}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        
        {/* Badge de plataforma */}
        <div className={clsx(
          'absolute top-3 left-3 p-2 rounded-full text-white',
          platformColors[plataforma?.toLowerCase()] || 'bg-zinc-700'
        )}>
          {platformIcons[plataforma?.toLowerCase()] || <Eye className="w-5 h-5" />}
        </div>

        {/* Badge de tipo */}
        {tipo && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white">
            {tipo}
          </div>
        )}

        {/* Link externo */}
        {post_url && (
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Descripción */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-[40px]">
          {descripcion || 'Sin descripción'}
        </p>

        {/* Métricas */}
        <div className="flex items-center gap-4 text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-mono">{formatNumber(alcance)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-mono">{formatNumber(interacciones)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Grid de posts
export function PostsGrid({ posts, title }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <p className="text-zinc-500 text-center py-8">No hay posts destacados</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} index={index} />
        ))}
      </div>
    </div>
  )
}

// Skeleton
export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-900/50 overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="flex gap-4">
          <div className="h-4 bg-white/10 rounded w-16" />
          <div className="h-4 bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function PostsGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
