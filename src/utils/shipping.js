export const FREE_SHIPPING_THRESHOLD = 5000;
export const ADDITIONAL_SAREE_SHIPPING = 100;

const SHIPPING_ZONES = {
  MAHARASHTRA: {
    states: ["maharashtra"],
    charge: 120,
    label: "Maharashtra",
  },
  NEARBY: {
    states: [
      "goa",
      "gujarat",
      "madhya pradesh",
      "karnataka",
      "telangana",
      "chhattisgarh",
    ],
    charge: 150,
    label: "Nearby state",
  },
  REST_OF_INDIA: {
    charge: 180,
    label: "Rest of India",
  },
};

export const getSellingPrice = (product) => {
  const listedPrice = Number(product?.price || 0);
  const offerPrice = Number(product?.offerPrice || 0);

  return offerPrice > 0 && offerPrice < listedPrice
    ? offerPrice
    : listedPrice;
};

export const getShippingZone = (state) => {
  const normalizedState = String(state || "").trim().toLowerCase();

  if (!normalizedState) return null;

  if (SHIPPING_ZONES.MAHARASHTRA.states.includes(normalizedState)) {
    return SHIPPING_ZONES.MAHARASHTRA;
  }

  if (SHIPPING_ZONES.NEARBY.states.includes(normalizedState)) {
    return SHIPPING_ZONES.NEARBY;
  }

  return SHIPPING_ZONES.REST_OF_INDIA;
};

export const calculateShipping = ({
  product,
  quantity = 1,
  state,
  pincode,
}) => {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const sellingPrice = getSellingPrice(product);
  const subtotal = sellingPrice * safeQuantity;
  const isFreeShipping = subtotal > FREE_SHIPPING_THRESHOLD;
  const hasValidPincode = /^\d{6}$/.test(String(pincode || ""));
  const shippingZone = getShippingZone(state);

  if (!hasValidPincode || !shippingZone) {
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

  const baseCharge = shippingZone.charge;
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
    zoneLabel: shippingZone.label,
    canCalculate: true,
  };
};
