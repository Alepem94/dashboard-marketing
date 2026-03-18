import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { SentimentGauge, CommentsCarousel, QualitativeSummary, SentimentSkeleton } from '../ui/SentimentGauge'

export function SentimentSection({ data, loading }) {
  if (loading) {
    return <SentimentSectionSkeleton />
  }

  const hasData = data && (data.positivo || data.neutro || data.negativo)

  if (!hasData) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl">💬</span>
          <div>
            <h2 className="text-2xl font-bold">Análisis de Sentimiento</h2>
            <p className="text-zinc-400 mt-1">Percepción de la audiencia</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/5 bg-surface-900/30 p-12 text-center"
        >
          <MessageCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No hay datos de sentimiento para este mes</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">💬</span>
        <div>
          <h2 className="text-2xl font-bold">Análisis de Sentimiento</h2>
          <p className="text-zinc-400 mt-1">Percepción de la audiencia</p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Gauge */}
        <SentimentGauge
          positivo={Number(data.positivo || 0)}
          neutro={Number(data.neutro || 0)}
          negativo={Number(data.negativo || 0)}
        />

        {/* Comments Carousel */}
        <CommentsCarousel comments={data.comentarios_destacados} />
      </div>

      {/* Qualitative Summary */}
      {data.resumen_cualitativo && (
        <QualitativeSummary text={data.resumen_cualitativo} />
      )}

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6"
      >
        <h3 className="text-lg font-semibold mb-3 text-indigo-400">💡 Interpretación</h3>
        <p className="text-zinc-400 leading-relaxed">
          El análisis de sentimiento se basa en los comentarios y menciones de la marca en redes sociales. 
          Un sentimiento mayoritariamente positivo indica una buena recepción del contenido y la marca. 
          Los comentarios negativos deben ser monitoreados para identificar áreas de mejora.
        </p>
      </motion.div>
    </div>
  )
}

function SentimentSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💬</span>
        <div>
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-40 bg-white/5 rounded mt-2 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentSkeleton />
        <div className="rounded-2xl border border-white/5 bg-surface-900/50 p-6 animate-pulse">
          <div className="h-5 w-40 bg-white/10 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
