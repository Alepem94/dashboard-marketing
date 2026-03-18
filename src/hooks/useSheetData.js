import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'

// ID del Google Sheet - Cambiar por el tuyo
const SHEET_ID = import.meta.env.VITE_SHEET_ID || 'TU_SHEET_ID_AQUI'

// URLs de cada hoja publicada como CSV
const getSheetUrl = (sheetName) => {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
}

// Nombres de las hojas en tu Google Sheet
const SHEETS = {
  CONFIG: '_CONFIG',
  MESES: '_MESES',
  KPIS: 'KPIs_Globales',
  METAS: 'Metas',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  GOOGLE_ADS: 'GoogleAds',
  TOP_POSTS: 'TopPosts',
  SENTIMENT: 'Sentiment',
  COMPETENCIA: 'Competencia',
  HALLAZGOS: 'Hallazgos',
}

// Parsear CSV a array de objetos
const parseCSV = (csvText) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    })
  })
}

// Fetch de una hoja específica
const fetchSheet = async (sheetName) => {
  try {
    const response = await fetch(getSheetUrl(sheetName))
    if (!response.ok) throw new Error(`Error fetching ${sheetName}`)
    const csvText = await response.text()
    return await parseCSV(csvText)
  } catch (error) {
    console.error(`Error loading ${sheetName}:`, error)
    return []
  }
}

// Hook principal para cargar todos los datos
export function useSheetData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Cargar todas las hojas en paralelo
      const [
        config,
        meses,
        kpis,
        metas,
        facebook,
        instagram,
        tiktok,
        googleAds,
        topPosts,
        sentiment,
        competencia,
        hallazgos,
      ] = await Promise.all([
        fetchSheet(SHEETS.CONFIG),
        fetchSheet(SHEETS.MESES),
        fetchSheet(SHEETS.KPIS),
        fetchSheet(SHEETS.METAS),
        fetchSheet(SHEETS.FACEBOOK),
        fetchSheet(SHEETS.INSTAGRAM),
        fetchSheet(SHEETS.TIKTOK),
        fetchSheet(SHEETS.GOOGLE_ADS),
        fetchSheet(SHEETS.TOP_POSTS),
        fetchSheet(SHEETS.SENTIMENT),
        fetchSheet(SHEETS.COMPETENCIA),
        fetchSheet(SHEETS.HALLAZGOS),
      ])

      setData({
        config,
        meses,
        kpis,
        metas,
        facebook,
        instagram,
        tiktok,
        googleAds,
        topPosts,
        sentiment,
        competencia,
        hallazgos,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, error, refetch: loadData }
}

// Hook para filtrar datos por marca y mes
export function useFilteredData(data, marca, mes) {
  const [filtered, setFiltered] = useState(null)

  useEffect(() => {
    if (!data || !marca) {
      setFiltered(null)
      return
    }

    const filterByBrandAndMonth = (arr, monthRequired = true) => {
      if (!arr) return []
      return arr.filter(row => {
        const matchBrand = row.marca === marca
        const matchMonth = !monthRequired || !mes || row.mes === mes
        return matchBrand && matchMonth
      })
    }

    // Obtener mes anterior para cálculos de variación
    const getPreviousMonth = (currentMonth) => {
      if (!currentMonth) return null
      const [year, month] = currentMonth.split('-').map(Number)
      const prevMonth = month === 1 ? 12 : month - 1
      const prevYear = month === 1 ? year - 1 : year
      return `${prevYear}-${String(prevMonth).padStart(2, '0')}`
    }

    const prevMes = getPreviousMonth(mes)

    // Filtrar datos
    const kpisActual = filterByBrandAndMonth(data.kpis).find(r => r.mes === mes)
    const kpisAnterior = filterByBrandAndMonth(data.kpis).find(r => r.mes === prevMes)

    setFiltered({
      config: data.config?.find(c => c.marca_id === marca),
      meses: data.meses?.filter(m => m.marca === marca).map(m => m.mes),
      kpis: {
        actual: kpisActual,
        anterior: kpisAnterior,
      },
      metas: filterByBrandAndMonth(data.metas),
      facebook: {
        actual: data.facebook?.find(r => r.marca === marca && r.mes === mes),
        anterior: data.facebook?.find(r => r.marca === marca && r.mes === prevMes),
        historico: data.facebook?.filter(r => r.marca === marca).sort((a, b) => a.mes?.localeCompare(b.mes)),
      },
      instagram: {
        actual: data.instagram?.find(r => r.marca === marca && r.mes === mes),
        anterior: data.instagram?.find(r => r.marca === marca && r.mes === prevMes),
        historico: data.instagram?.filter(r => r.marca === marca).sort((a, b) => a.mes?.localeCompare(b.mes)),
      },
      tiktok: {
        actual: data.tiktok?.find(r => r.marca === marca && r.mes === mes),
        anterior: data.tiktok?.find(r => r.marca === marca && r.mes === prevMes),
        historico: data.tiktok?.filter(r => r.marca === marca).sort((a, b) => a.mes?.localeCompare(b.mes)),
      },
      googleAds: filterByBrandAndMonth(data.googleAds),
      topPosts: filterByBrandAndMonth(data.topPosts),
      sentiment: filterByBrandAndMonth(data.sentiment)?.[0],
      competencia: filterByBrandAndMonth(data.competencia),
      hallazgos: filterByBrandAndMonth(data.hallazgos),
    })
  }, [data, marca, mes])

  return filtered
}

// Utilidad para calcular variación porcentual
export function calcularVariacion(actual, anterior) {
  if (!actual || !anterior || anterior === 0) return null
  return ((actual - anterior) / anterior) * 100
}

// Utilidad para formatear números grandes
export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined) return '-'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toFixed(decimals)
}

// Utilidad para formatear moneda
export function formatCurrency(num) {
  if (num === null || num === undefined) return '-'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Utilidad para formatear porcentaje
export function formatPercent(num, decimals = 1) {
  if (num === null || num === undefined) return '-'
  return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`
}
