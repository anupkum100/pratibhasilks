import { getImageFromId } from "../../data/util";

const occasions = [
    {
        title: "For the First Look",
        text: "Soft silks, graceful borders and quiet elegance.",
        src: "moods1_mf9jjx.png",
    },
    {
        title: "For the Celebration",
        text: "Festive drapes made for lights, laughter and portraits.",
        src: "moods2_ta60ok.png",
    },
    {
        title: "For Everyday Royalty",
        text: "Comfortable weaves with a premium handpicked feel.",
        src: "moods3_n2dbym.png"
    },
    {
        title: "For the First Look",
        text: "Soft silks, graceful borders and quiet elegance.",
        src: "moods1_mf9jjx.png",
    },
    {
        title: "For the Celebration",
        text: "Festive drapes made for lights, laughter and portraits.",
        src: "moods2_ta60ok.png",
    },
    {
        title: "For Everyday Royalty",
        text: "Comfortable weaves with a premium handpicked feel.",
        src: "moods3_n2dbym.png"
    },
];

export default function ShopByOccasion() {
    return <section className="pl-5 md:px-10 pb-20">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pr-5">
            {occasions.map((item, index) => (
                <div
                    key={item.title}
                    className="min-w-[82%] md:min-w-[30%] md:h-[1400px] h-[520px] rounded-[2rem] overflow-hidden relative group"
                >
                    <img
                        src={getImageFromId(item.src)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-7 left-6 right-6 text-white">
                        <h3 className="font-serif text-4xl leading-tight">
                            {item.title}
                        </h3>
                        <p className="mt-3 text-white/75">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
}