export function InvoiceBillingDetails({ invoice }) {
    return <div className="grid grid-cols-2 gap-8 p-4 border-b border-[var(--color-border)]">

        <div>
            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                Billing Details
            </h3>

            <div className="space-y-1 text-[var(--color-text-dark)] text-sm">
                <p className="font-medium">
                    {invoice.customer}
                </p>

                <p>India</p>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                Shipping Details
            </h3>

            <div className="space-y-1 text-[var(--color-text-dark)] text-sm">
                <p>Standard Delivery</p>
                <p>Delivery in 4–7 Business Days</p>
                <p>Tracking Shared via WhatsApp</p>
            </div>
        </div>

    </div>
}