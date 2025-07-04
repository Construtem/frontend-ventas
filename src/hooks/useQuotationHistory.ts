// hooks/useQuotationHistory.ts
import { useState, useEffect } from 'react'
import { QuotationHistoryItem, getQuotationHistory } from '../mocks/mocksDatos'
import QuotationService from '../services/quotationService'
import { API_CONFIG } from '../config/apiConfig'

interface UseQuotationHistoryProps {
  quotationId: string
  useMockData?: boolean // Flag para usar datos mock o API real
}

interface UseQuotationHistoryReturn {
  history: QuotationHistoryItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useQuotationHistory = ({ 
  quotationId, 
  useMockData = API_CONFIG.USE_MOCK_DATA 
}: UseQuotationHistoryProps): UseQuotationHistoryReturn => {
  const [history, setHistory] = useState<QuotationHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      let historyData: QuotationHistoryItem[]

      if (useMockData) {
        // Usar datos mock
        historyData = getQuotationHistory(quotationId)
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
      } else {
        // Usar API real
        historyData = await QuotationService.getQuotationHistory(quotationId)
      }

      setHistory(historyData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching quotation history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quotationId) {
      fetchHistory()
    }
  }, [quotationId, useMockData])

  return {
    history,
    loading,
    error,
    refetch: fetchHistory
  }
}

export default useQuotationHistory
