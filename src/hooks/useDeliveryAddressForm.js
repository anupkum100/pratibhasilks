import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const ADDRESS_DRAFT_KEY = "ps_checkout_address_draft";

const defaultAddressValues = {
  paymentMethod: "ONLINE",
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  customerNotes: "",
};

const createPincodeError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const readAddressDraft = () => {
  try {
    const draft = sessionStorage.getItem(ADDRESS_DRAFT_KEY);
    return draft ? JSON.parse(draft) : {};
  } catch {
    return {};
  }
};

const isDeliveryPostOffice = (postOffice) => {
  const deliveryStatus = String(postOffice?.DeliveryStatus || "").trim().toLowerCase();
  return deliveryStatus !== "non-delivery";
};

const lookupPincode = async (pincode) => {
  let response;

  try {
    response = await fetch(
      `https://api.postalpincode.in/pincode/${encodeURIComponent(pincode)}`
    );
  } catch {
    throw createPincodeError(
      "PIN code lookup is currently unavailable.",
      "LOOKUP_UNAVAILABLE"
    );
  }

  if (!response.ok) {
    throw createPincodeError(
      "PIN code lookup is currently unavailable.",
      "LOOKUP_UNAVAILABLE"
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw createPincodeError(
      "PIN code lookup is currently unavailable.",
      "LOOKUP_UNAVAILABLE"
    );
  }

  const lookupResult = result?.[0];

  if (
    lookupResult?.Status !== "Success" ||
    !Array.isArray(lookupResult?.PostOffice) ||
    lookupResult.PostOffice.length === 0
  ) {
    throw createPincodeError(
      "No delivery location found for this PIN code.",
      "UNKNOWN_PINCODE"
    );
  }

  const deliveryPostOffices = lookupResult.PostOffice.filter(isDeliveryPostOffice);

  if (deliveryPostOffices.length === 0) {
    throw createPincodeError(
      "This PIN code is not serviceable for delivery.",
      "NON_SERVICEABLE_PINCODE"
    );
  }

  return deliveryPostOffices;
};

export function useDeliveryAddressForm(options) {
  const defaultValues = options?.defaultValues;
  const [showLocalities, setShowLocalities] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [manualAddressMode, setManualAddressMode] = useState(
    defaultValues?.addressSource === "MANUAL"
  );

  const mergedDefaultValues = useMemo(
    () => ({
      ...defaultAddressValues,
      ...readAddressDraft(),
      ...(defaultValues || {}),
    }),
    [defaultValues]
  );

  const form = useForm({
    defaultValues: mergedDefaultValues,
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    clearErrors,
    setError,
    getValues,
    reset,
  } = form;

  useEffect(() => {
    reset(mergedDefaultValues);
    setManualAddressMode(mergedDefaultValues.addressSource === "MANUAL");
  }, [mergedDefaultValues, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      try {
        sessionStorage.setItem(
          ADDRESS_DRAFT_KEY,
          JSON.stringify({
            ...values,
            addressSource: manualAddressMode ? "MANUAL" : "PINCODE_API",
          })
        );
      } catch {
        // Draft persistence is best-effort only.
      }
    });

    return () => subscription.unsubscribe();
  }, [manualAddressMode, watch]);

  const pincode = watch("pincode");
  const city = watch("city");
  const state = watch("state");

  const normalizedPincode = String(pincode || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  const {
    data: postOffices = [],
    isFetching: isLookingUpPincode,
    error: pincodeLookupError,
  } = useQuery({
    queryKey: ["pincode-lookup", normalizedPincode],
    queryFn: () => lookupPincode(normalizedPincode),
    enabled: normalizedPincode.length === 6,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (
      normalizedPincode.length === 6 &&
      pincodeLookupError?.code === "LOOKUP_UNAVAILABLE"
    ) {
      setManualAddressMode(true);
      setShowLocalities(false);
      setSelectedLocality(null);
    }
  }, [normalizedPincode, pincodeLookupError]);

  const applyLocation = (location) => {
    if (!location) return;

    const locality =
      location.Name ||
      location.Block ||
      location.Division ||
      "";
    const detectedCity =
      location.District ||
      location.Division ||
      location.Region ||
      "";

    setSelectedLocality(location);
    setManualAddressMode(false);
    setValue("addressLine2", locality, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("city", detectedCity, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("state", location.State || "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors(["pincode", "addressLine2", "city", "state"]);
    setShowLocalities(false);
  };

  const handlePincodeChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setValue("pincode", value, {
      shouldDirty: true,
      shouldValidate: value.length === 6,
    });

    setSelectedLocality(null);
    setManualAddressMode(false);
    setShowLocalities(value.length === 6);

    setValue("addressLine2", "", { shouldDirty: true });
    setValue("city", "", { shouldDirty: true });
    setValue("state", "", { shouldDirty: true });

    if (value.length < 6) {
      clearErrors("pincode");
    }
  };

  const enableManualAddress = () => {
    setManualAddressMode(true);
    setSelectedLocality(null);
    setShowLocalities(false);
    clearErrors(["addressLine2", "city", "state"]);
  };

  const validateDeliveryAddress = () => {
    const values = getValues();
    const hasResolvedAddress = [
      values.addressLine2,
      values.city,
      values.state,
    ].every((value) => String(value || "").trim().length > 0);

    if (normalizedPincode.length !== 6) {
      setError("pincode", {
        type: "validate",
        message: "Enter a valid 6-digit PIN code.",
      });
      return false;
    }

    if (
      pincodeLookupError &&
      pincodeLookupError.code !== "LOOKUP_UNAVAILABLE"
    ) {
      setError("pincode", {
        type: "validate",
        message: pincodeLookupError.message,
      });
      return false;
    }

    // PIN API success requires a selected locality unless a resolved address
    // was restored from the cart preparation step.
    if (
      !manualAddressMode &&
      !pincodeLookupError &&
      postOffices.length > 0 &&
      !selectedLocality &&
      !hasResolvedAddress
    ) {
      setError("pincode", {
        type: "validate",
        message: "Select a locality or choose manual address entry.",
      });
      setShowLocalities(true);
      return false;
    }

    return true;
  };

  const getAddressPayload = () => {
    const values = getValues();

    return {
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      landmark: values.landmark,
      pincode: values.pincode,
      city: values.city,
      state: values.state,
      customerNotes: values.customerNotes,
      addressSource: manualAddressMode ? "MANUAL" : "PINCODE_API",
    };
  };

  return {
    ...form,
    city,
    state,
    normalizedPincode,
    postOffices,
    selectedLocality,
    showLocalities,
    isLookingUpPincode,
    pincodeLookupError,
    manualAddressMode,
    shippingLocation: [city, state].filter(Boolean).join(", "),
    validateDeliveryAddress,
    getAddressPayload,
    onPincodeChange: handlePincodeChange,
    onToggleLocalities: () => setShowLocalities((current) => !current),
    onSelectLocality: applyLocation,
    onUseManualAddress: enableManualAddress,
  };
}

export { defaultAddressValues };
