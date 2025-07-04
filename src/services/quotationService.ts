// services/quotationService.ts
import { QuotationHistoryItem } from '../mocks/mocksDatos'
import { API_CONFIG, API_ENDPOINTS } from '../config/apiConfig'

export class QuotationService {
  /**
   * Obtiene el historial de una cotización desde la API
   * @param quotationId ID de la cotización
   * @returns Promise con el historial de la cotización
   */
  static async getQuotationHistory(quotationId: string): Promise<QuotationHistoryItem[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.QUOTATION_HISTORY(quotationId)}`, {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Mapear la respuesta de la API al formato esperado por el frontend
      return data.map((item: any) => ({
        id: item.id.toString(),
        fecha: item.fecha,
        accion: item.accion,
        usuario: item.usuario ? {
          id: item.usuario.id.toString(),
          nombre: item.usuario.nombre
        } : undefined,
        detalles: item.detalles
      }))
    } catch (error) {
      console.error('Error fetching quotation history:', error)
      throw error
    }
  }

  /**
   * Actualiza el estado de una cotización
   * @param quotationId ID de la cotización
   * @param newState Nuevo estado
   * @param userId ID del usuario que realiza el cambio
   */
  static async updateQuotationState(
    quotationId: string, 
    newState: string, 
    userId: string
  ): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.QUOTATION_STATE(quotationId)}`, {
        method: 'PATCH',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({
          estado: newState,
          usuario_id: parseInt(userId)
        })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error updating quotation state:', error)
      throw error
    }
  }

  /**
   * Actualiza los detalles de una cotización
   * @param quotationId ID de la cotización
   * @param details Nuevos detalles
   */
  static async updateQuotationDetails(
    quotationId: string, 
    details: any[]
  ): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.QUOTATION_DETAILS(quotationId)}`, {
        method: 'PATCH',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(details)
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error updating quotation details:', error)
      throw error
    }
  }
}

export default QuotationService
