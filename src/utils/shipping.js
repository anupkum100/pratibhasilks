export const FREE_SHIPPING_THRESHOLD = 5000; // TODO: Configure this from .env
export const BASE_SAREE_SHIPPING = 120;
export const ADDITIONAL_SAREE_SHIPPING = 100;

export const getSellingPrice = (product) => {
  const listedPrice = Number(product?.price || 0);
  const offerPrice = Number(product?.offerPrice || 0);

  return offerPrice > 0 && offerPrice < listedPrice
    ? offerPrice
    : listedPrice;
};

export const calculateShipping = ({
  product,
  products,
  quantity = 1,
  state,
  pincode,
}) => {
  const cartProducts = Array.isArray(products)
    ? products.filter(Boolean)
    : product
      ? [product]
      : [];

  const safeQuantity = Math.max(
    1,
    cartProducts.length || Number(quantity) || 1
  );

  const subtotal = cartProducts.length
    ? cartProducts.reduce(
      (total, cartProduct) => total + getSellingPrice(cartProduct),
      0
    )
    : getSellingPrice(product) * safeQuantity;

  const isFreeShipping = subtotal > FREE_SHIPPING_THRESHOLD;
  const hasValidPincode = /^\d{6}$/.test(String(pincode || ""));
  const hasState = String(state || "").trim().length > 0;

  if (!hasValidPincode || !hasState) {
    return {
      subtotal,
      baseCharge: 0,
      additionalCharge: 0,
      shippingCharge: 0,
      total: subtotal,
      isFreeShipping,
      zoneLabel: "",
      canCalculate: false,
    };
  }

  const baseCharge = BASE_SAREE_SHIPPING;
  const additionalCharge =
    safeQuantity > 1
      ? (safeQuantity - 1) * ADDITIONAL_SAREE_SHIPPING
      : 0;

  const shippingCharge = isFreeShipping
    ? 0
    : baseCharge + additionalCharge;

  return {
    subtotal,
    baseCharge,
    additionalCharge,
    shippingCharge,
    total: subtotal + shippingCharge,
    isFreeShipping,
    zoneLabel: "India",
    canCalculate: true,
  };
};
