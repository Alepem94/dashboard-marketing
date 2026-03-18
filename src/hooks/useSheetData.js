import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'

const SHEET_ID = import.meta.env.VITE_SHEET_ID || 'TU_SHEET_ID_AQUI'

const getSheetUrl = (sheetName) => {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
}

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

export function useSheetData(marcaId) {
  const [data, setData] = useState({
    kpis: [],
    metas: [],
    facebook: [],
    instagram: [],
    tiktok: [],
    googleAds: [],
    topPosts: [],
    sentiment: [],
    competencia: [],
    hallazgos: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [availableMonths, setAvailableMonths] = useState([])
  const [brandConfig, setBrandConfig] = useState(null)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    try {
      const [
        config, meses, kpis, metas, facebook, instagram,
        tiktok, googleAds, topPosts, sentiment, competencia, hallazgos,
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

      const filterByBrand = (arr) => arr?.filter(row => row.marca === marcaId) || []
      
      const brandConf = config?.find(c => c.marca_id === marcaId)
      setBrandConfig(brandConf)
      
      const months = meses
        ?.filter(m => m.marca === marcaId)
        ?.map(m => m.mes)
        ?.sort((a, b) => b?.localeCompare(a)) || []
      setAvailableMonths(months)

      setData({
        kpis: filterByBrand(kpis),
        metas: filterByBrand(metas),
        facebook: filterByBrand(facebook),
        instagram: filterByBrand(instagram),
        tiktok: filterByBrand(tiktok),
        googleAds: filterByBrand(googleAds),
        topPosts: filterByBrand(topPosts),
        sentiment: filterByBrand(sentiment),
        competencia: filterByBrand(competencia),
        hallazgos: filterByBrand(hallazgos),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [marcaId])

  useEffect(() => {
    if (marcaId) {
      loadData()
    }
  }, [marcaId, loadData])

  const refresh = () => loadData(true)

  return { data, loading, error, refresh, isRefreshing, availableMonths, brandConfig }
}

export function calcularVariacion(actual, anterior) {
  if (!actual || !anterior || anterior === 0) return null
  return ((actual - anterior) / anterior) * 100
}

export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined) return '-'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toFixed(decimals)
}

export function formatCurrency(num) {
  if (num === null || num === undefined) return '-'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatPercent(num, decimals = 1) {
  if (num === null || num === undefined) return '-'
  return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`
}
