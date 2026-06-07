export default function InvoiceFooter({ downloadInvoice }) {
    return <div className="mt-2 mb-4 border-t border-[var(--color-border)] py-2 text-center">

        <h3 className="text-2xl font-bold text-[var(--color-primary)]">
            Thank You For Shopping With Us ❤️
        </h3>

        <p className="text-[var(--color-text-muted)] mt-1">
            For support or order queries, contact us on WhatsApp.
        </p>

        <div className="mt-5 flex justify-center gap-2 flex-wrap no-print">
            <button
                onClick={downloadInvoice}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all text-white px-3 py-1 rounded-full shadow-lg">
                Download Invoice
            </button>
        </div>
    </div>
}