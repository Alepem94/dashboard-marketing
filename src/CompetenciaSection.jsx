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
  primary: '#ffffff',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
}

const GRADIENT_COLORS = [
  { start: '#ffffff', end: '#ffffff' },
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
      className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl"
    >
      <p className="text-xs text-white/70 mb-2 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-white/80">{entry.name}:</span>
          <span className="text-sm font-mono font-semibold text-white">
            {formatter ? formatter(entry.value) : formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export function AreaChartComponent({ 
  data = [], 
  dataKey, 
  xKey = 'mes',
  title,
  color = '#ffffff',
  height = 300,
  showGrid = true,
  formatter = formatNumber,
}) {
  const gradientId = `gradient-${dataKey}-${Math.random().toString(36).substr(2, 9)}`

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/50">
        No hay datos disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        )}
        <XAxis 
          dataKey={xKey} 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
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
  )
}

export function MultiLineChart({ 
  data = [], 
  lines = [],
  xKey = 'mes',
  title,
  height = 300,
  formatter = formatNumber,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/50">
        No hay datos disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey={xKey} 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend 
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
        />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color || '#ffffff'}
            strokeWidth={2}
            dot={{ fill: line.color || '#ffffff', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            animationDuration={1500}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function HorizontalBarChart({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  title,
  height = 300,
  color = '#ffffff',
  formatter = formatNumber,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/50">
        No hay datos disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
        <XAxis 
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          tickFormatter={formatter}
        />
        <YAxis 
          type="category"
          dataKey={nameKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
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
  )
}

export function GroupedBarChart({
  data = [],
  bars = [],
  xKey = 'name',
  title,
  height = 300,
  formatter = formatNumber,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/50">
        No hay datos disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend 
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
        />
        {bars.map((bar, index) => (
          <Bar 
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            fill={bar.color || '#ffffff'}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({
  data = [],
  title,
  height = 300,
  colors = ['#ffffff', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'],
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/50">
        No hay datos disponibles
      </div>
    )
  }

  return (
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
              fill={entry.color || colors[index % colors.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom"
          formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div 
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 animate-pulse"
      style={{ height }}
    >
      <div className="h-5 w-32 bg-white/20 rounded mb-6" />
      <div className="h-full bg-white/10 rounded-xl" />
    </div>
  )
}
