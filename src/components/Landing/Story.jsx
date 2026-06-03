import { getImageFromId } from "../../data/util";

export default function Story() {
    return <section className="grid md:grid-cols-2 bg-[#181818] text-white">
        <div className="min-h-[560px] relative">
            <img
                src={getImageFromId("skeleton_a24yxr.png")}
                alt="Saree story"
                className="absolute inset-0 w-full h-full object-contain"
            />
        </div>

        <div className="px-6 md:px-16 py-10 flex flex-col justify-center">
            <p className="text-xs tracking-[0.45em] uppercase text-[#D8B46A]">
                Why It Feels Premium
            </p>

            <h2 className="font-serif text-5xl md:text-7xl mt-4 leading-none">
                We don’t sell catalogues. We curate wardrobes.
            </h2>

            <div className="mt-10 space-y-7">
                <LuxuryPoint
                    title="Texture-first presentation"
                    text="Every saree should show fabric, border, pallu and close-up detail."
                />

                <LuxuryPoint
                    title="Occasion-led discovery"
                    text="Customers browse by wedding, festive, work and gifting mood."
                />

                <LuxuryPoint
                    title="Trust built into the page"
                    text="Invoice QR, authenticity note, WhatsApp help and real fabric shots."
                />
            </div>
        </div>
    </section>
}

function LuxuryPoint({ title, text }) {
    return (
        <div className="border-l border-[#D8B46A] pl-5">
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="text-white/60 mt-2">{text}</p>
        </div>
    );
}