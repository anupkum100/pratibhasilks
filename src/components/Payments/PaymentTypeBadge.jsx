
export function PaymentTypeBadge({ paymentType }) {
    return (
        <span className="rounded-full bg-[#F8F3EC] text-[#9A7B4F] px-3 py-1 text-xs">
            {paymentType}
        </span>
    );
}