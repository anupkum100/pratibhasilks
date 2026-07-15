import { forwardRef } from "react";

const CheckoutField = forwardRef(
  (
    {
	      label,
	      as,
	      error,
      className = "",
      containerClassName = "",
      required = false,
      ...inputProps
    },
    ref
	  ) => {
	    const Field = as === "textarea" ? "textarea" : "input";

	    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-[#181818]">
            {label}

            {required && (
              <span className="ml-1 text-red-600">*</span>
            )}
          </label>
        )}

	        <Field
	          ref={ref}
	          {...inputProps}
          className={`w-full rounded-2xl border bg-[#F8F3EC] px-4 py-3.5 text-sm text-[#181818] outline-none transition placeholder:text-[#6B5F54]/60 ${error
              ? "border-red-400 focus:border-red-500"
              : "border-black/10 focus:border-[#9A7B4F]"
            } ${className}`}
        />

        {error && (
          <p className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CheckoutField.displayName = "CheckoutField";

export default CheckoutField;
