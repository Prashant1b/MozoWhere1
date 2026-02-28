import { api } from "./axios";

export const ordersApi = {
  createFromCart: (shippingAddress, paymentMethod, couponCode) =>
    api.post("/orders", { shippingAddress, paymentMethod, couponCode }),
  confirmCod: (orderId) => api.post(`/orders/${orderId}/cod`),
  myOrders: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
};
