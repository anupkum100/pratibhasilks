export default function ShippingPolicy() {
    return (
        <div className="max-w-5xl mx-auto px-5 py-16 md:py-24">
            <p className="text-xs tracking-[0.4em] uppercase text-[#9A7B4F]">
                Customer Support
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-4">
                Shipping Policy
            </h1>

            <div className="mt-10 bg-white rounded-[2rem] p-8 md:p-12 shadow-lg">
                <div className="space-y-8 text-[#6B5F54] leading-8">
                    <div>
                        <h2 className="text-2xl font-serif text-[#181818] mb-3">
                            Order Processing
                        </h2>

                        <p>
                            Orders are typically processed within 1–3 business days after
                            confirmation.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-serif text-[#181818] mb-3">
                            Delivery Timeline
                        </h2>

                        <p>
                            Domestic orders are generally delivered within 4–7 business days,
                            depending on location and courier service availability.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-serif text-[#181818] mb-3">
                            Shipping Charges
                        </h2>

                        <p>
                            We currently offer FREE shipping across India on all orders on order above 5000.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-serif text-[#181818] mb-3">
                            Order Tracking
                        </h2>

                        <p>
                            Tracking details will be shared via WhatsApp and email once your
                            order has been dispatched.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}