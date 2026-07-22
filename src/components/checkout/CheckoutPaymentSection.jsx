import { CreditCard } from "lucide-react";

export default function CheckoutPaymentSection({ register }) {
  return (
    <div className="mt-8 rounded-[1.75rem] border border-[#9A7B4F]/20 bg-[#FFFDF9] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B5F54]">
        Payment method
      </p>

      <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-2xl border border-black/10 p-4">
        <input
          type="radio"
          value="ONLINE"
          {...register("paymentMethod")}
        />

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-white">
          <CreditCard size={18} />
        </span>

        <span>
          <strong className="block text-sm">Pay securely online</strong>
          <small className="text-[#6B5F54]">
            UPI, cards and supported payment options
          </small>
        </span>
      </label>
    </div>
  );
}
