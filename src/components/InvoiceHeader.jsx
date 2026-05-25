import { PS_EMAIL, PS_PHONE } from "../data/constants";

export default function InvoiceHeader({ invoice }) {

    return <div className="bg-[var(--color-primary)] text-white p-4">

        <div className="flex justify-between gap-6">

            <div>
                <h3 className="text-2xl tracking-wide text-white">
                    Pratibha Silks
                </h3>

                <p className="text-[var(--color-accent)] mt-2">
                    Drape Yourself in Elegance
                </p>

                <div className="mt-5 text-sm space-y-1 text-gray-200">
                    <p>Pune, Maharashtra</p>
                    <p>{PS_EMAIL}</p>
                    <p>{PS_PHONE}</p>
                </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h2 className="text-2xl mb-3 text-white">
                    INVOICE
                </h2>

                <div className="space-y-2 text-sm">
                    <p>
                        <span className="text-[var(--color-accent)]">
                            Invoice ID:
                        </span>{" "}
                        #{invoice.invoiceId}
                    </p>

                    <p>
                        <span className="text-[var(--color-accent)]">
                            Order Date:
                        </span>{" "}
                        {invoice.orderDate}
                    </p>

                    <p>
                        <span className="text-[var(--color-accent)]">
                            Payment:
                        </span>{" "}
                        Paid
                    </p>
                </div>
            </div>

        </div>
    </div>
}