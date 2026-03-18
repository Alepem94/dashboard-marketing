import { motion } from 'framer-motion'
import { Smile, Meh, Frown, Quote } from 'lucide-react'
import clsx from 'clsx'

export function SentimentGauge({ positivo, neutro, negativo }) {
  const total = positivo + neutro + negativo
  const posPercent = (positivo / total) * 100
  const neuPercent = (neutro / total) * 100
  const negPercent = (negativo / total) * 100

  // Determinar sentimiento dominante
  const dominant = positivo >= neutro && positivo >= negativo 
    ? 'positivo' 
    : neutro >= negativo 
      ? 'neutro' 
      : 'negativo'

  const dominantEmoji = {
    positivo: '😊',
    neutro: '😐',
    negativo: '😟',
  }

  const dominantColor = {
    positivo: 'text-emerald-400',
    neutro: 'text-amber-400',
    negativo: 'text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Análisis de Sentimiento</h3>
      
      {/* Emoji dominante grande */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-7xl mb-3"
        >
          {dominantEmoji[dominant]}
        </motion.div>
        <p className={clsx('text-xl font-semibold capitalize', dominantColor[dominant])}>
          Sentimiento {dominant}
        </p>
      </div>

      {/* Barra de progreso segmentada */}
      <div className="h-4 rounded-full overflow-hidden flex mb-6 bg-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${posPercent}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-emerald-500 h-full"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${neuPercent}%` }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-amber-500 h-full"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${negPercent}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-red-500 h-full"
        />
      </div>

      {/* Desglose */}
      <div className="grid grid-cols-3 gap-4">
        <SentimentItem 
          icon={Smile}
          label="Positivo"
          value={posPercent}
          color="emerald"
          emoji="😊"
        />
        <SentimentItem 
          icon={Meh}
          label="Neutro"
          value={neuPercent}
          color="amber"
          emoji="😐"
        />
        <SentimentItem 
          icon={Frown}
          label="Negativo"
          value={negPercent}
          color="red"
          emoji="😟"
        />
      </div>
    </motion.div>
  )
}

function SentimentItem({ label, value, color, emoji }) {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <div className={clsx(
      'rounded-xl p-4 border text-center',
      colorClasses[color]
    )}>
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-2xl font-bold font-mono">
        {value.toFixed(0)}%
      </div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  )
}

// Carrusel de comentarios destacados
export function CommentsCarousel({ comments = [] }) {
  if (!comments || comments.length === 0) {
    return null
  }

  // Parsear comentarios si vienen como string separado por |
  const commentList = typeof comments === 'string' 
    ? comments.split('|').map(c => c.trim())
    : comments

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Quote className="w-5 h-5 text-indigo-400" />
        Comentarios Destacados
      </h3>
      
      <div className="space-y-4">
        {commentList.slice(0, 5).map((comment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-4 border-l-2 border-indigo-500/50"
          >
            <p className="text-zinc-300 italic">"{comment}"</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Resumen cualitativo
export function QualitativeSummary({ text }) {
  if (!text) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-surface-900/50 p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Resumen Cualitativo</h3>
      <p className="text-zinc-400 leading-relaxed">{text}</p>
    </motion.div>
  )
}

// Skeleton
export function SentimentSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6 animate-pulse">
      <div className="h-5 w-40 bg-white/10 rounded mb-6" />
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-white/10 rounded-full" />
      </div>
      <div className="h-4 bg-white/10 rounded-full mb-6" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
