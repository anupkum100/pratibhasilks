import { PS_EMAIL, PS_PHONE } from "../data/constants";

export default function InvoiceHeader({ invoice }) {

    return <div className="bg-[var(--color-primary)] p-4">

        <div className="flex justify-between gap-6">

            <div>
                <h3 className="text-2xl tracking-wide text-gray-200">
                    Pratibha Silks
                </h3>

                <p className="text-[var(--color-accent)] mt-2">
                    Drape Yourself in Elegance
                </p>

                <div className="mt-2 text-sm space-y-1 text-gray-200">
                    <p>Pune, Maharashtra</p>
                    <p>{PS_EMAIL}</p>
                    <p>{PS_PHONE}</p>
                </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-md text-gray-200">
                <h3 className="text-2xl">
                    INVOICE
                </h3>

                <div className="space-y-1 text-sm ">
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