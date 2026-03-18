import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react'

export function HallazgosSection({ data = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 animate-pulse">
            <div className="h-4 w-24 bg-white/20 rounded mb-3" />
            <div className="h-6 w-3/4 bg-white/20 rounded mb-2" />
            <div className="h-4 w-full bg-white/20 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const safeData = Array.isArray(data) ? data : []

  // Categorizar hallazgos
  const insights = safeData.filter(h => h.tipo?.toLowerCase() === 'insight' || !h.tipo)
  const alertas = safeData.filter(h => h.tipo?.toLowerCase() === 'alerta')
  const logros = safeData.filter(h => h.tipo?.toLowerCase() === 'logro')

  const getIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'alerta': return AlertTriangle
      case 'logro': return CheckCircle
      default: return Lightbulb
    }
  }

  const getColors = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'alerta': return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' }
      case 'logro': return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' }
      default: return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-blue-500/30">
          <Lightbulb className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Hallazgos e Insights</h1>
          <p className="text-white/60">Observaciones y recomendaciones del mes</p>
        </div>
      </motion.div>

      {/* Resumen rápido */}
      {safeData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-blue-500/20 border border-blue-500/30 p-4 flex items-center gap-4"
          >
            <Lightbulb className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{insights.length}</p>
              <p className="text-sm text-white/60">Insights</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-4 flex items-center gap-4"
          >
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{logros.length}</p>
              <p className="text-sm text-white/60">Logros</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-amber-500/20 border border-amber-500/30 p-4 flex items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertas.length}</p>
              <p className="text-sm text-white/60">Alertas</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lista de hallazgos */}
      <div className="space-y-4">
        {safeData.map((hallazgo, index) => {
          const Icon = getIcon(hallazgo.tipo)
          const colors = getColors(hallazgo.tipo)

          return (
            <motion.div
              key={hallazgo.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl ${colors.bg} border ${colors.border} p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white/10`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  {/* Título */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {hallazgo.titulo || hallazgo.hallazgo || 'Sin título'}
                  </h3>
                  
                  {/* Descripción */}
                  {hallazgo.descripcion && (
                    <p className="text-white/70 mb-4">{hallazgo.descripcion}</p>
                  )}

                  {/* Recomendación */}
                  {hallazgo.recomendacion && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/10">
                      <ArrowRight className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/80">{hallazgo.recomendacion}</p>
                    </div>
                  )}

                  {/* Plataforma */}
                  {hallazgo.plataforma && (
                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                      {hallazgo.plataforma}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {safeData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center"
        >
          <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50">No hay hallazgos registrados para este mes</p>
        </motion.div>
      )}
    </div>
  )
}
