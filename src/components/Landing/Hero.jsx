import { ArrowRight } from "lucide-react";
import { getImageFromId } from "../../data/util";

export default function Hero() {
    return <section className="relative min-h-[92vh] flex items-end">

        {/* Mobile Image */}
        <img
            src={getImageFromId("hero2_myuypn.png")}
            alt="Premium saree"
            className="absolute inset-0 w-full h-full object-cover md:hidden"
        />

        {/* Desktop Image */}
        <img
            src={getImageFromId("hero_desktop_p8y3h4.png")}
            alt="Premium saree"
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="relative z-10 px-5 pb-14 md:px-20 max-w-4xl text-white">
            <p className="text-xs tracking-[0.45em] uppercase text-[#D8B46A] mb-5">
                Handpicked Indian Drapes
            </p>

            <h2 className="font-serif text-[4rem] md:text-[7rem] leading-[0.9] tracking-tight">
                Not just worn.
                <br />
                Remembered.
            </h2>

            <p className="mt-6 max-w-xl text-white/80 text-base md:text-lg">
                Sarees curated like heirlooms — rich in texture, graceful in fall,
                and made for moments that deserve attention.
            </p>

            <button className="mt-8 bg-white text-black px-7 py-4 rounded-full inline-flex items-center gap-3 font-medium">
                Enter the Collection <ArrowRight size={18} />
            </button>
        </div>
    </section>
}