import { api } from "./axios";

export const cartApi = {
  getMyCart: () => api.get("/cart"),
  add: ({ variantId, quantity = 1 }) => api.post("/cart/add", { variantId, quantity }),
  updateQty: ({ variantId, quantity }) => api.put("/cart/item", { variantId, quantity }),
  removeItem: (variantId) => api.delete(`/cart/item/${variantId}`),
  clear: () => api.delete("/cart/clear"),
};