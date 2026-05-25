export default function InvoiceFooter({ downloadInvoice }) {
    return <div className="mt-12 border-t border-[var(--color-border)] py-8 text-center">

        <h3 className="text-2xl font-bold text-[var(--color-primary)]">
            Thank You For Shopping With Us ❤️
        </h3>

        <p className="text-[var(--color-text-muted)] mt-3">
            For support or order queries, contact us on WhatsApp.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
                // onClick={downloadInvoice}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all text-white px-6 py-3 rounded-full font-medium shadow-lg">
                Download Invoice
            </button>
        </div>
    </div>
}