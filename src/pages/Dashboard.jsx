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

export function Dashboard() {
  const { marcaId } = useParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  } : {}

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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">Error al cargar datos</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-surface-800 hover:bg-surface-700 rounded-xl font-medium transition-colors"
            >
              Volver
            </button>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-accent-600 hover:bg-accent-500 rounded-xl font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header
          brandName={brandConfig?.nombre}
          brandLogo={brandConfig?.logo_url}
          brandColor={brandConfig?.color_primario}
          months={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
          onMenuClick={() => setSidebarOpen(true)}
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
