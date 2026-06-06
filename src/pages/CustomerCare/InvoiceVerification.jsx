export default function InvoiceVerification() {
    return (
        <div className="max-w-4xl mx-auto px-5 py-16 md:py-24 text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-[#9A7B4F]">
                Authenticity
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-4">
                Invoice Verification
            </h1>

            <div className="bg-white rounded-[2rem] p-10 mt-10 shadow-lg">
                <p className="text-[#6B5F54] leading-8">
                    Every Pratibha Silks order comes with a unique invoice number and QR
                    code for authenticity verification.
                </p>

                <div className="mt-8">
                    <input
                        placeholder="Enter Invoice Number"
                        className="w-full border rounded-xl p-4"
                    />
                </div>

                <button className="mt-5 bg-[#181818] text-white px-8 py-4 rounded-full">
                    Verify Invoice
                </button>

                <p className="text-sm text-[#6B5F54] mt-6">
                    Verification results will confirm invoice validity and order details.
                </p>
            </div>
        </div>
    );
}