import { motion } from 'framer-motion'
import { Smile, Meh, Frown } from 'lucide-react'

export function SentimentGauge({ positive = 0, neutral = 0, negative = 0 }) {
  const total = positive + neutral + negative
  
  const positivePercent = total > 0 ? (positive / total) * 100 : 0
  const neutralPercent = total > 0 ? (neutral / total) * 100 : 0
  const negativePercent = total > 0 ? (negative / total) * 100 : 0

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Análisis de Sentimiento</h3>
      
      {/* Barra de sentimiento */}
      <div className="h-4 rounded-full overflow-hidden flex mb-6 bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${positivePercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-emerald-500 h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${neutralPercent}%` }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="bg-amber-500 h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${negativePercent}%` }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="bg-red-500 h-full"
        />
      </div>

      {/* Leyenda con valores */}
      <div className="grid grid-cols-3 gap-4">
        <SentimentItem
          icon={Smile}
          label="Positivo"
          value={positive}
          percent={positivePercent}
          color="emerald"
        />
        <SentimentItem
          icon={Meh}
          label="Neutral"
          value={neutral}
          percent={neutralPercent}
          color="amber"
        />
        <SentimentItem
          icon={Frown}
          label="Negativo"
          value={negative}
          percent={negativePercent}
          color="red"
        />
      </div>
    </div>
  )
}

function SentimentItem({ icon: Icon, label, value, percent, color }) {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="text-center">
      <div className={`inline-flex p-3 rounded-xl mb-2 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-white font-mono">{percent.toFixed(0)}%</p>
      <p className="text-sm text-white/50">{label}</p>
      <p className="text-xs text-white/40 font-mono">{value} menciones</p>
    </div>
  )
}

export function SentimentGaugeSkeleton() {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 animate-pulse">
      <div className="h-5 w-48 bg-white/20 rounded mb-6" />
      <div className="h-4 bg-white/20 rounded-full mb-6" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-2" />
            <div className="h-8 w-16 bg-white/20 rounded mx-auto mb-1" />
            <div className="h-4 w-12 bg-white/20 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
