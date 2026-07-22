import {
  CreditCard,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

export default function CheckoutActions({
  activeCheckout,
  submitting,
  cancellingReservation,
  unavailableToCurrentCustomer,
  isLookingUpPincode,
  productIsSold,
  productIsReserved,
  onRetryPayment,
  onCancelReservation,
}) {
  if (activeCheckout) {
    return (
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onRetryPayment}
          disabled={submitting || cancellingReservation}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#181818] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#B8B3AD] disabled:hover:translate-y-0"
        >
          {submitting ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <CreditCard size={17} />
          )}
          {submitting ? "Opening payment..." : "Retry payment"}
        </button>

        <button
          type="button"
          onClick={onCancelReservation}
          disabled={submitting || cancellingReservation}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#181818]/20 bg-white px-6 py-4 text-sm font-semibold text-[#181818] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:text-[#9A948D] disabled:hover:translate-y-0"
        >
          {cancellingReservation && (
            <LoaderCircle size={17} className="animate-spin" />
          )}
          {cancellingReservation
            ? "Cancelling..."
            : "Cancel reservation"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="submit"
      disabled={
        submitting ||
        unavailableToCurrentCustomer ||
        isLookingUpPincode
      }
      className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#181818] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#B8B3AD] disabled:hover:translate-y-0"
    >
      {submitting ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        <LockKeyhole size={17} />
      )}

      {submitting
        ? "Preparing secure payment..."
        : productIsSold
          ? "Sold out"
          : productIsReserved
            ? "Reserved — payment in progress"
            : "Proceed to secure payment"}
    </button>
  );
}
