// API_ENDPOINTS keys used here: /user/commerce/products/pagination, /user/commerce/orders, /user/commerce/orders/:id/pay-sandbox, /user/commerce/me/orders, /user/commerce/me/entitlements
import { extractApiData } from "@/lib/auth";
import type { Order, Product } from "@/types/learning";
import apiService from "./api.service";

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  return { data: (body?.data || []) as T[], total: Number(body?.total || 0) };
}

export const commerceService = {
  products: async (skip = 0, take = 20) => {
    const res = await apiService.post("/user/commerce/products/pagination", { skip, take, where: {} });
    return paginationPayload<Product>(res);
  },

  createOrder: async (productId: string, priceId: string) => {
    const res = await apiService.post("/user/commerce/orders", { productId, priceId });
    return extractApiData<Order>(res);
  },

  paySandbox: async (orderId: string) => {
    const res = await apiService.post(`/user/commerce/orders/${orderId}/pay-sandbox`);
    return extractApiData<Order>(res);
  },

  myOrders: async () => {
    const res = await apiService.get("/user/commerce/me/orders");
    const data = extractApiData<Order[] | { data?: Order[] }>(res);
    return Array.isArray(data) ? data : data?.data || [];
  },

  myEntitlements: async () => {
    const res = await apiService.get("/user/commerce/me/entitlements");
    return extractApiData<any[]>(res);
  },
};
