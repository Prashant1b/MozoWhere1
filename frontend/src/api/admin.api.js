import { api } from "./axios";

export const adminApi = {
  listOrders: () => api.get("/admin/orders"),
  updateOrderStatus: (id, orderStatus) =>
    api.put(`/admin/orders/${id}/status`, { orderStatus }),
  listBulkOrders: () => api.get("/bulk-orders"),
};
