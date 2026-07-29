import { getImageFromId } from "../../data/util";
import { Link } from "react-router-dom";

const occasions = [
    {
        title: "For Weddings & Celebrations",
        text: "Rich silks, statement borders and timeless drapes crafted for unforgettable moments.",
        src: "moods1_mf9jjx.png",
        sku: "BG_PS_FAPP_0004"
    },
    {
        title: "For Festivals & Traditions",
        text: "Celebrate every ritual with vibrant colours, heritage weaves and festive elegance.",
        src: "moods2_ta60ok.png",
        sku: "KO_CC_OIOP_0014"
    },
    {
        title: "For Office & Gatherings",
        text: "Sophisticated textures and lightweight comfort designed for modern everyday grace.",
        src: "moods3_n2dbym.png",
        sku: "KO_CC_OIOP_0013"
    },
    {
        title: "For Housewarming & Family Events",
        text: "Effortlessly elegant sarees that blend tradition, comfort and personal style.",
        src: "ChatGPT_Image_Jun_14_2026_10_57_13_PM_iqakqv",
        sku: "KO_SC_RFIP_0019"
    },
    {
        title: "For Gifting Someone Special",
        text: "Thoughtfully chosen drapes that carry stories, heritage and lasting memories.",
        src: "a294db30-9af0-4332-ad65-0c7e72e95e24_r4zudx",
        sku: "KO_CL_XLTP_0013"
    },
    {
        title: "For Your Signature Collection",
        text: "Exclusive pieces curated for women who appreciate artistry beyond fashion.",
        src: "ChatGPT_Image_Jun_15_2026_10_51_54_AM_x6hdxn",
        sku: "KO_TS_OOPP_0017"
    },
];

export default function ShopByOccasion() {
    return <section className="pl-5 md:px-10 pb-20">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pr-5">
            {occasions.map((item) => (
                <div
                    key={item.title}
                    className="min-w-[82%] md:min-w-[30%] md:h-[1400px] h-[520px] rounded-[2rem] overflow-hidden relative group"
                >
                    <Link to={`/product/${item.sku}`} target="_blank">
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
                    </Link>

                </div>
            ))}
        </div>
    </section>
}