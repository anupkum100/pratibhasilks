import { apiCall } from "./api";

export const getProductBySku = (sku) => apiCall(`/api/products/${encodeURIComponent(sku)}`);

export const createCheckoutOrder = (payload, idempotencyKey) => apiCall("/api/checkout/create-order", "POST", payload, { "X-Idempotency-Key": idempotencyKey });

export const verifyCheckoutPayment = (payload) => apiCall("/api/checkout/verify-payment", "POST", payload);

export const getPublicOrder = (orderNumber, token) => apiCall(`/api/orders/public/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`);
