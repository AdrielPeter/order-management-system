import { OrderTypes } from "@/types/orderTypes";
import { api } from "./api";

export const createOrder = async (orderData:OrderTypes) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}