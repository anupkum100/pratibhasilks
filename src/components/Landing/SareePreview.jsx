import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageFromId } from "../../data/util";
import { sareeTypes } from "../../data/sareeTypes"

const previewTypes = [...sareeTypes].splice(1, 3)

export default function SareeTypesPreview() {
    return (
        <section className="bg-[#F8F3EC] text-[#181818] px-5 py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
                            Textile Library
                        </p>

                        <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-none">
                            Know the drape before you wear it.
                        </h2>

                        <p className="text-[#6B5F54] mt-5 max-w-2xl leading-7 text-sm md:text-base">
                            Explore saree crafts, weaving stories and regional textile
                            traditions before choosing your perfect piece.
                        </p>
                    </div>

                    <Link
                        to="/saree-types"
                        className="hidden md:inline-flex items-center gap-2 bg-[#181818] text-white px-6 py-4 rounded-full text-sm font-medium"
                    >
                        Explore All Types
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-3 gap-7">
                    {previewTypes.map((type) => (
                        <SareeTypeCard key={type.name} type={type} />
                    ))}
                </div>

                {/* Mobile Horizontal Editorial Rail */}
                <div className="md:hidden">
                    <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-3 -mx-5 px-5">
                        {previewTypes.map((type, index) => (
                            <Link
                                key={type.name}
                                to="/saree-types"
                                className={`
                  snap-start
                  flex-shrink-0
                  rounded-[2rem]
                  overflow-hidden
                  bg-white
                  shadow-[0_18px_55px_rgba(0,0,0,0.08)]
                  border border-black/5
                  ${index === 0 ? "min-w-[88%]" : "min-w-[76%]"}
                `}
                            >
                                <div
                                    className={`
                    relative
                    ${index === 0 ? "h-[500px]" : "h-[460px]"}
                  `}
                                >
                                    <img
                                        src={getImageFromId(type.image)}
                                        alt={type.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-xs flex items-center gap-1 max-w-[85%]">
                                        <MapPin size={13} />
                                        <span className="truncate">
                                            {type.region}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                        <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                                            {type.mood}
                                        </p>

                                        <h3
                                            className={`
                        font-serif leading-none mt-3
                        ${index === 0 ? "text-5xl" : "text-4xl"}
                      `}
                                        >
                                            {type.name}
                                        </h3>

                                        <p className="text-white/75 text-sm leading-6 mt-4 line-clamp-3">
                                            {type.intro}
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full text-sm font-medium">
                                            Explore Story
                                            <ArrowRight size={15} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-5">
                        {previewTypes.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full ${index === 0
                                    ? "w-10 bg-[#181818]"
                                    : "w-4 bg-[#D9D1C5]"
                                    }`}
                            />
                        ))}
                    </div>

                    <Link
                        to="/saree-types"
                        className="mt-7 w-full flex items-center justify-center gap-2 bg-[#181818] text-white py-4 rounded-full text-sm font-medium"
                    >
                        Explore All Saree Types
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SareeTypeCard({ type }) {
    return (
        <Link
            to="/saree-types"
            className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5"
        >
            <div className="relative h-[460px] overflow-hidden">
                <img
                    src={getImageFromId(type.image)}
                    alt={type.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-xs flex items-center gap-1 max-w-[85%]">
                    <MapPin size={13} />
                    <span className="truncate">{type.region}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                        {type.mood}
                    </p>

                    <h3 className="font-serif text-5xl mt-2 leading-none">
                        {type.name}
                    </h3>

                    <p className="text-white/75 text-sm leading-6 mt-4 line-clamp-3">
                        {type.intro}
                    </p>
                </div>
            </div>

            <div className="p-5 flex items-center justify-between">
                <span className="text-sm text-[#6B5F54]">
                    Learn craft story
                </span>

                <span className="h-10 w-10 rounded-full bg-[#181818] text-white flex items-center justify-center group-hover:scale-110 transition">
                    <ArrowRight size={16} />
                </span>
            </div>
        </Link>
    );
}