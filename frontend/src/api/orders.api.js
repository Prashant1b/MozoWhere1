import { api } from "./axios";

export const ordersApi = {
  createFromCart: (shippingAddress, paymentMethod) => api.post("/orders", { shippingAddress, paymentMethod }),
  confirmCod: (orderId) => api.post(`/orders/${orderId}/cod`),
  myOrders: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
};
