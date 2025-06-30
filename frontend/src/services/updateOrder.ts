import { api } from "./api"

export const updateOrder = async (id: string, newStatus: string) => {
  try{
    const response = await api.put(`/orders/${id}`, {
      state: newStatus,
    })
    
    return response
  }
  catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}