import { apiCall } from "./api";

export const getProductBySku = (sku) => apiCall(`/api/products/${encodeURIComponent(sku)}`);
export const getPublicOrder = (orderNumber, token) => apiCall(`/api/orders/public/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`);

const unwrap = (res) => {
    if (res?.error) throw new Error(res.error.message);
    return res;
};

export const createCheckoutOrder = async (payload, idempotencyKey) =>
    unwrap(await apiCall("/api/checkout/create-order", "POST", payload, {
        "X-Idempotency-Key": idempotencyKey,
    }));

export const verifyCheckoutPayment = async (payload) =>
    unwrap(await apiCall("/api/checkout/verify-payment", "POST", payload));

export const cancelCheckoutOrder = async (payload) =>
    unwrap(await apiCall("/api/checkout/cancel-order", "POST", payload));
