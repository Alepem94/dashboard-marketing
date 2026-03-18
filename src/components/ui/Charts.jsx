import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatNumber, formatCurrency } from '../../hooks/useSheetData'

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  facebook: '#1877f2',
  instagram: '#e4405f',
  tiktok: '#000000',
  google: '#4285f4',
}

const GRADIENT_COLORS = [
  { start: '#6366f1', end: '#8b5cf6' },
  { start: '#10b981', end: '#34d399' },
  { start: '#f59e0b', end: '#fbbf24' },
  { start: '#06b6d4', end: '#22d3ee' },
]

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl"
    >
      <p className="text-xs text-zinc-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-zinc-300">{entry.name}:</span>
          <span className="text-sm font-mono font-semibold text-white">
            {formatter ? formatter(entry.value) : formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export function AreaChartComponent({ 
  data, 
  dataKey, 
  xKey = 'mes',
  title,
  color = COLORS.primary,
  height = 300,
  showGrid = true,
  formatter = formatNumber,
}) {
  const gradientId = `gradient-${dataKey}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          )}
          <XAxis 
            dataKey={xKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={formatter}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function MultiLineChart({ 
  data, 
  lines = [],
  xKey = 'mes',
  title,
  height = 300,
  formatter = formatNumber,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={formatter}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
          />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || GRADIENT_COLORS[index % GRADIENT_COLORS.length].start}
              strokeWidth={2}
              dot={{ fill: line.color || GRADIENT_COLORS[index % GRADIENT_COLORS.length].start, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function HorizontalBarChart({
  data,
  dataKey,
  nameKey = 'name',
  title,
  height = 300,
  color = COLORS.primary,
  formatter = formatNumber,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={formatter}
          />
          <YAxis 
            type="category"
            dataKey={nameKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[0, 8, 8, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function GroupedBarChart({
  data,
  bars = [],
  xKey = 'name',
  title,
  height = 300,
  formatter = formatNumber,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={formatter}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
          />
          {bars.map((bar, index) => (
            <Bar 
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color || GRADIENT_COLORS[index % GRADIENT_COLORS.length].start}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function DonutChart({
  data,
  title,
  height = 300,
  colors = Object.values(COLORS),
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom"
            formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div 
      className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 animate-pulse"
      style={{ height }}
    >
      <div className="h-5 w-32 bg-white/10 rounded mb-6" />
      <div className="h-full bg-white/5 rounded-xl" />
    </div>
  )
}
