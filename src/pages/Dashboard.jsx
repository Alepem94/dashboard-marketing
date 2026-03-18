import { useState, useEffect } from 'react'
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { useSheetData } from '../hooks/useSheetData'
import { Overview } from '../components/sections/Overview'
import { SocialSection } from '../components/sections/SocialSection'
import { GoogleAdsSection } from '../components/sections/GoogleAdsSection'
import { SentimentSection } from '../components/sections/SentimentSection'
import { CompetenciaSection } from '../components/sections/CompetenciaSection'
import { HallazgosSection } from '../components/sections/HallazgosSection'

// Función para generar CSS variables de la marca
function getBrandTheme(brandConfig) {
  const defaultTheme = {
    primary: '#6366f1',
    secondary: '#818cf8', 
    bgGradientFrom: '#18181b',
    bgGradientTo: '#09090b',
    sidebarBg: '#18181b',
  }

  if (!brandConfig) return defaultTheme

  const primary = brandConfig.color_primario || defaultTheme.primary
  const secondary = brandConfig.color_secundario || defaultTheme.secondary

  // Determinar colores de fondo basados en la marca
  const brandId = brandConfig.marca_id?.toLowerCase()
  
  const themes = {
    botanera: {
      primary: '#FF6B00',
      secondary: '#FFD700',
      bgGradientFrom: '#FF6B00',
      bgGradientTo: '#E85D00',
      sidebarBg: '#E85D00',
      textOnBg: 'white',
    },
    chamoy: {
      primary: '#7B2D8E',
      secondary: '#FFD700',
      bgGradientFrom: '#4B0082',
      bgGradientTo: '#2D004F',
      sidebarBg: '#3D0066',
      textOnBg: 'white',
    },
    pacific: {
      primary: '#0A2647',
      secondary: '#E31E24',
      bgGradientFrom: '#0A2647',
      bgGradientTo: '#051530',
      sidebarBg: '#0A2647',
      textOnBg: 'white',
    },
  }

  return themes[brandId] || {
    primary,
    secondary,
    bgGradientFrom: primary,
    bgGradientTo: adjustColor(primary, -30),
    sidebarBg: adjustColor(primary, -20),
    textOnBg: 'white',
  }
}

// Ajustar brillo del color
function adjustColor(hex, amount) {
  if (!hex) return '#18181b'
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

export function Dashboard() {
  const { marcaId } = useParams()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const { 
    data, 
    loading, 
    error, 
    refresh, 
    isRefreshing,
    availableMonths,
    brandConfig 
  } = useSheetData(marcaId)

  // Obtener tema de la marca
  const theme = getBrandTheme(brandConfig)

  // Seleccionar el mes más reciente por defecto
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth])

  // Filtrar datos por mes seleccionado
  const filteredData = selectedMonth ? {
    kpis: data.kpis?.find(k => k.mes === selectedMonth) || {},
    metas: data.metas?.filter(m => m.mes === selectedMonth) || [],
    facebook: data.facebook?.find(f => f.mes === selectedMonth) || {},
    instagram: data.instagram?.find(i => i.mes === selectedMonth) || {},
    tiktok: data.tiktok?.find(t => t.mes === selectedMonth) || {},
    googleAds: data.googleAds?.filter(g => g.mes === selectedMonth) || [],
    topPosts: data.topPosts?.filter(p => p.mes === selectedMonth) || [],
    sentiment: data.sentiment?.find(s => s.mes === selectedMonth) || {},
    competencia: data.competencia?.filter(c => c.mes === selectedMonth) || [],
    hallazgos: data.hallazgos?.filter(h => h.mes === selectedMonth) || [],
  } : {
    kpis: {},
    metas: [],
    facebook: {},
    instagram: {},
    tiktok: {},
    googleAds: [],
    topPosts: [],
    sentiment: {},
    competencia: [],
    hallazgos: [],
  }

  // Datos históricos para gráficas de tendencia
  const historicalData = {
    kpis: data.kpis || [],
    facebook: data.facebook || [],
    instagram: data.instagram || [],
    tiktok: data.tiktok || [],
    googleAds: data.googleAds || [],
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})` }}
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">Error al cargar datos</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors text-white"
            >
              Volver
            </button>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-white text-gray-800 hover:bg-white/90 rounded-xl font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        background: `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`,
        '--brand-primary': theme.primary,
        '--brand-secondary': theme.secondary,
      }}
    >
      {/* Sidebar */}
      <Sidebar 
        brandConfig={brandConfig}
        theme={theme}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}`}>
        {/* Header */}
        <Header
          brandConfig={brandConfig}
          theme={theme}
          months={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />

        {/* Content Area */}
        <main className="p-6">
          <Routes>
            <Route 
              index 
              element={<Navigate to="overview" replace />} 
            />
            <Route 
              path="overview" 
              element={
                <Overview 
                  data={filteredData} 
                  historical={historicalData}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="facebook" 
              element={
                <SocialSection 
                  platform="facebook"
                  data={filteredData.facebook}
                  posts={filteredData.topPosts?.filter(p => p.plataforma?.toLowerCase() === 'facebook')}
                  historical={historicalData.facebook}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="instagram" 
              element={
                <SocialSection 
                  platform="instagram"
                  data={filteredData.instagram}
                  posts={filteredData.topPosts?.filter(p => p.plataforma?.toLowerCase() === 'instagram')}
                  historical={historicalData.instagram}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="tiktok" 
              element={
                <SocialSection 
                  platform="tiktok"
                  data={filteredData.tiktok}
                  posts={filteredData.topPosts?.filter(p => p.plataforma?.toLowerCase() === 'tiktok')}
                  historical={historicalData.tiktok}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="google-ads" 
              element={
                <GoogleAdsSection 
                  data={filteredData.googleAds}
                  historical={historicalData.googleAds}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="sentiment" 
              element={
                <SentimentSection 
                  data={filteredData.sentiment}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="competencia" 
              element={
                <CompetenciaSection 
                  data={filteredData.competencia}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="hallazgos" 
              element={
                <HallazgosSection 
                  data={filteredData.hallazgos}
                  loading={loading}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
