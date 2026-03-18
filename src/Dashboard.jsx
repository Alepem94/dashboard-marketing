import { motion } from 'framer-motion'
import { MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'
import { SentimentGauge, SentimentGaugeSkeleton } from '../ui/SentimentGauge'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { formatNumber } from '../../hooks/useSheetData'

export function SentimentSection({ data, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentGaugeSkeleton />
          <KPICardSkeleton />
        </div>
      </div>
    )
  }

  const positive = parseFloat(data?.positivo) || 0
  const neutral = parseFloat(data?.neutral) || 0
  const negative = parseFloat(data?.negativo) || 0
  const total = positive + neutral + negative

  const sentimentScore = total > 0 
    ? ((positive - negative) / total * 100).toFixed(1) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-purple-500/30">
          <MessageSquare className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Análisis de Sentimiento</h1>
          <p className="text-white/60">Percepción de la marca en redes sociales</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge de sentimiento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SentimentGauge
            positive={positive}
            neutral={neutral}
            negative={negative}
          />
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-6">
          <KPICard
            title="Total de Menciones"
            value={formatNumber(total)}
            icon={MessageSquare}
            delay={0}
          />
          <KPICard
            title="Sentiment Score"
            value={sentimentScore}
            suffix="%"
            icon={TrendingUp}
            subtitle={parseFloat(sentimentScore) > 0 ? 'Percepción positiva' : parseFloat(sentimentScore) < 0 ? 'Percepción negativa' : 'Percepción neutral'}
            delay={1}
          />
        </div>
      </div>

      {/* Comentarios destacados */}
      {(data?.comentario_positivo || data?.comentario_negativo) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.comentario_positivo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6"
            >
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Comentario Positivo Destacado
              </h4>
              <p className="text-white/80 italic">"{data.comentario_positivo}"</p>
            </motion.div>
          )}
          {data?.comentario_negativo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6"
            >
              <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Comentario Negativo Destacado
              </h4>
              <p className="text-white/80 italic">"{data.comentario_negativo}"</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty state */}
      {total === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center"
        >
          <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50">No hay datos de sentimiento para este mes</p>
        </motion.div>
      )}
    </div>
  )
}
