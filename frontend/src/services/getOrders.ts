import { api } from "./api";

export const getOrders = async (filters?: { state?: string; controlNumber?: string }) => {
  const params = new URLSearchParams()

  if (filters?.state) params.append("state", filters.state)
  if (filters?.controlNumber) params.append("controlNumber", filters.controlNumber)

  const response = await api.get(`/orders?${params.toString()}`)
  return response.data
}
