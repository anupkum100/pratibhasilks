import CheckoutField from "./CheckoutField";
import PincodeLocationSelector from "./PincodeLocationSelector";

export default function DeliveryAddressSection({
  register,
  errors,
  normalizedPincode,
  postOffices,
  selectedLocality,
  showLocalities,
  isLookingUpPincode,
  pincodeLookupError,
  manualAddressMode,
  onPincodeChange,
  onToggleLocalities,
  onSelectLocality,
  onUseManualAddress,
}) {
  return (
    <div className="mt-9 grid gap-5 md:grid-cols-2">
      <CheckoutField
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        required
	        error={errors.fullName?.message}
	        {...register("fullName", {
	          setValueAs: (value) => String(value || "").trim(),
	          validate: (value) =>
	            String(value || "").trim().length >= 2 ||
	            "Full name should be at least 2 characters",
	        })}
	      />

      <CheckoutField
        label="Mobile number"
	        inputMode="numeric"
	        type="tel"
	        autoComplete="tel"
	        required
        error={errors.phone?.message}
        {...register("phone", {
          required: "Mobile is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Enter a valid Indian mobile number",
          },
        })}
      />

      <CheckoutField
        label="Email (optional)"
        type="email"
        autoComplete="email"
        className="md:col-span-2"
	        error={errors.email?.message}
	        {...register("email", {
	          setValueAs: (value) => String(value || "").trim(),
	          pattern: {
	            value: /^\S+@\S+\.\S+$/,
            message: "Enter a valid email",
          },
        })}
      />

      <CheckoutField
        label="Address line 1"
        placeholder="House, flat, building and street"
        autoComplete="address-line1"
        className="md:col-span-2"
        required
	        error={errors.addressLine1?.message}
	        {...register("addressLine1", {
	          setValueAs: (value) => String(value || "").trim(),
	          validate: (value) =>
	            String(value || "").trim().length >= 5 ||
	            "Address line 1 should be at least 5 characters",
	        })}
	      />

      <CheckoutField
        label="Address line 2"
        placeholder="Area, locality or post office"
        autoComplete="address-line2"
        required={manualAddressMode}
	        error={errors.addressLine2?.message}
	        {...register("addressLine2", {
	          setValueAs: (value) => String(value || "").trim(),
	          validate: (value) =>
	            !manualAddressMode ||
            String(value || "").trim().length > 0 ||
            "Locality or area is required",
        })}
      />

      <CheckoutField
	        label="Landmark"
	        placeholder="Nearby landmark"
	        {...register("landmark", {
	          setValueAs: (value) => String(value || "").trim(),
	        })}
	      />

      <div className="relative md:col-span-2">
        <CheckoutField
	          label="PIN code"
	          placeholder="Enter 6-digit PIN code"
	          inputMode="numeric"
	          type="tel"
          maxLength={6}
          autoComplete="postal-code"
          required
          error={errors.pincode?.message}
          {...register("pincode", {
            required: "PIN code is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Enter a valid 6-digit PIN code",
            },
            onChange: onPincodeChange,
          })}
        />

        <PincodeLocationSelector
          normalizedPincode={normalizedPincode}
          postOffices={postOffices}
          selectedLocality={selectedLocality}
          showLocalities={showLocalities}
          isLookingUpPincode={isLookingUpPincode}
          pincodeLookupError={pincodeLookupError}
          manualAddressMode={manualAddressMode}
          onToggleLocalities={onToggleLocalities}
          onSelectLocality={onSelectLocality}
          onUseManualAddress={onUseManualAddress}
        />
      </div>

      <CheckoutField
        label="City / District"
        placeholder="City or district"
        autoComplete="address-level2"
        required
	        error={errors.city?.message}
	        {...register("city", {
	          setValueAs: (value) => String(value || "").trim(),
	          validate: (value) =>
	            String(value || "").trim().length >= 2 ||
	            "City should be at least 2 characters",
	        })}
	      />

      <CheckoutField
        label="State"
        placeholder="State"
        autoComplete="address-level1"
        required
	        error={errors.state?.message}
	        {...register("state", {
	          setValueAs: (value) => String(value || "").trim(),
	          validate: (value) =>
	            String(value || "").trim().length >= 2 ||
	            "State should be at least 2 characters",
	        })}
	      />

      <CheckoutField
        label="Order note (optional)"
	        as="textarea"
	        rows={3}
	        className="md:col-span-2"
	        {...register("customerNotes", {
	          setValueAs: (value) => String(value || "").trim(),
	        })}
	      />
    </div>
  );
}
