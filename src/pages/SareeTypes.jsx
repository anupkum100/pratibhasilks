import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, MapPin, Search } from "lucide-react";
import { sareeTypes } from "../data/sareeTypes";
import { getImageFromId } from "../data/util";

export default function SareeTypes() {
    const [activeType, setActiveType] = useState(sareeTypes[0]);
    const [query, setQuery] = useState("");

    const filteredTypes = useMemo(() => {
        return sareeTypes.filter((item) =>
            `${item.name} ${item.region} ${item.mood}`
                .toLowerCase()
                .includes(query.toLowerCase())
        );
    }, [query]);

    return (
        <main className="bg-[#F8F3EC] text-[#181818] min-h-screen">
            <section className="px-5 pt-12 md:pt-20 pb-10 max-w-7xl mx-auto">
                <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
                    Textile Library
                </p>

                <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-none max-w-5xl">
                    Discover the stories behind India’s saree crafts.
                </h1>

                <p className="text-[#6B5F54] mt-6 max-w-2xl leading-7">
                    Explore regions, techniques and textile traditions that make every
                    saree more than fabric — a piece of living heritage.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-5">
                <div className="hidden lg:grid lg:grid-cols-[360px_1fr] gap-8">

                    <aside className="lg:sticky lg:top-28 h-fit">
                        <div className="bg-white rounded-[2rem] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.07)] border border-black/5">
                            <div className="flex items-center gap-3 bg-[#F8F3EC] rounded-full px-4 py-3 mb-5">
                                <Search size={17} className="text-[#9A7B4F]" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search craft or region"
                                    className="bg-transparent outline-none text-sm w-full"
                                />
                            </div>

                            <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
                                {filteredTypes.map((item, index) => {
                                    const active = activeType.name === item.name;

                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => setActiveType(item)}
                                            className={`w-full text-left rounded-[1.5rem] p-4 transition ${active
                                                ? "bg-[#181818] text-white"
                                                : "bg-[#F8F3EC] hover:bg-[#EFE6D8]"
                                                }`}
                                        >
                                            <h3 className="font-serif text-2xl mt-2">
                                                {item.name}
                                            </h3>

                                            <p
                                                className={`text-xs mt-1 ${active ? "text-white/55" : "text-[#6B5F54]"
                                                    }`}
                                            >
                                                {item.mood}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.1)] border border-black/5">
                        <div className="relative h-[480px] md:h-[620px]">
                            <img
                                src={getImageFromId(activeType.image)}
                                alt={activeType.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-sm">
                                <MapPin size={15} />
                                {activeType.region}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                                <p className="text-xs tracking-[0.4em] uppercase text-[#D8B46A]">
                                    {activeType.mood}
                                </p>

                                <h2 className="font-serif text-5xl md:text-7xl mt-3 leading-none">
                                    {activeType.name}
                                </h2>

                                <p className="text-white/75 mt-5 max-w-2xl leading-7">
                                    {activeType.intro}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 md:p-10 grid md:grid-cols-[1fr_0.9fr] gap-8">
                            <div>
                                <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                                    Craft Notes
                                </p>

                                <div className="mt-6 space-y-4">
                                    {activeType.details.map((detail) => (
                                        <div
                                            key={detail}
                                            className="flex gap-4 bg-[#F8F3EC] rounded-2xl p-4 items-center"
                                        >
                                            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#9A7B4F] flex-shrink-0">
                                                <Sparkles size={16} />
                                            </div>

                                            <p className="text-sm md:text-base text-[#6B5F54] leading-6">
                                                {detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#181818] text-white rounded-[2rem] p-6 md:p-8">
                                <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                                    Technique
                                </p>

                                <h3 className="font-serif text-3xl mt-3">
                                    How it is made
                                </h3>

                                <p className="text-white/65 mt-5 leading-7">
                                    {activeType.technique}
                                </p>

                                <button className="mt-8 bg-white text-black px-6 py-3 rounded-full inline-flex items-center gap-2 text-sm font-medium">
                                    Explore Collection
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            {/* Mobile Saree Type Stories */}
            <div className="lg:hidden px-5 pb-16 space-y-6">
                {filteredTypes.map((item, index) => (
                    <div
                        key={item.name}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5"
                    >
                        <div className="relative h-[420px]">
                            <img
                                src={getImageFromId(item.image)}
                                alt={item.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-xs flex items-center gap-1">
                                <MapPin size={13} />
                                {item.region}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                                    {item.mood}
                                </p>

                                <h2 className="font-serif text-5xl leading-none mt-2">
                                    {item.name}
                                </h2>

                                <p className="text-white/75 text-sm leading-6 mt-4">
                                    {item.intro}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            {item.details.slice(0, 2).map((detail) => (
                                <div
                                    key={detail}
                                    className="flex gap-3 bg-[#F8F3EC] rounded-2xl p-4"
                                >
                                    <Sparkles
                                        size={16}
                                        className="text-[#9A7B4F] mt-1 flex-shrink-0"
                                    />

                                    <p className="text-sm text-[#6B5F54] leading-6">
                                        {detail}
                                    </p>
                                </div>
                            ))}

                            <div className="bg-[#181818] text-white rounded-2xl p-5">
                                <p className="text-xs tracking-[0.3em] uppercase text-[#D8B46A]">
                                    Technique
                                </p>

                                <p className="text-white/70 text-sm leading-6 mt-3">
                                    {item.technique}
                                </p>
                            </div>

                            <button className="w-full bg-[#181818] text-white rounded-full py-3 text-sm">
                                Explore {item.name} Sarees
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main >
    );
}