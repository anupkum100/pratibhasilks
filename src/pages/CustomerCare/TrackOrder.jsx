import { PS_PHONE_WHATSAPP } from "../../data/constants";

export default function TrackOrder() {
    return (
        <div className="max-w-4xl mx-auto px-5 py-16 md:py-24 text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-[#9A7B4F]">
                Order Tracking
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-4">
                Track Your Order
            </h1>

            <div className="bg-white rounded-[2rem] p-10 mt-10 shadow-lg">
                <p className="text-[#6B5F54] leading-8">
                    Tracking information is shared via WhatsApp and email once your order
                    is dispatched.
                </p>

                <p className="text-[#6B5F54] mt-6 leading-8">
                    If you haven't received tracking details, please contact our support
                    team.
                </p>

                <a
                    href={`https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-8 bg-[#181818] text-white px-8 py-4 rounded-full"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}