import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageFromId } from "../data/util";

const collections = [
  {
    label: "New",
    imageId: "hero3_wmp0og",
    to: "/products?arrival=New&sort=latest",
  },
  {
    label: "Professional",
    imageId: "ChatGPT_Image_Aug_6_2026_10_59_17_AM_qvfkn2.png",
    to: "/products?occasions=Work,Office&categories=Office Wear",
  },
  {
    label: "Festive",
    imageId: "ChatGPT_Image_Aug_6_2026_11_14_09_AM_joh94s.png",
    to: "/products?occasions=Festive",
  },
  {
    label: "Party",
    imageId: "ChatGPT_Image_Aug_6_2026_11_19_59_AM_gltkdp.png",
    to: "/products?occasions=Wedding,Party&categories=Wedding Collection,Luxury",
  },
];

export default function Collections() {
  useEffect(() => {
    document.title = "Collections | Pratibha Silks";
  }, []);

  return (
    <main className="collections-page bg-[#f6efe4] text-[#171717] overflow-hidden">
      <section className="collections-hero relative min-h-[calc(100vh-60px)] w-full overflow-hidden bg-[#111] text-white">
        <img
          src={getImageFromId("ChatGPT_Image_Aug_6_2026_11_25_42_AM_wb5wan")}
          alt=""
          aria-hidden="true"
          className="collections-hero-backdrop absolute inset-0 h-full w-full object-cover opacity-0"
        />
        <img
          src={getImageFromId("ChatGPT_Image_Aug_6_2026_11_25_42_AM_wb5wan")}
          alt="Pratibha Silks curated seasonal saree collection"
          className="collections-hero-primary absolute inset-0 h-full w-full object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.18),rgba(0,0,0,0.64))]" />

        <div className="relative z-10 flex min-h-[calc(100vh-60px)] flex-col justify-between px-5 py-8 md:px-10 md:py-12 lg:px-14">
          <div className="flex items-start justify-between gap-6 text-xs uppercase tracking-[0.38em] text-white/65">
            <span className="hidden md:block">Curated Saree Stories</span>
          </div>

          <div className="max-w-[1500px]">
            <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.42em] text-[#E7C982]">
              <Sparkles size={15} />
              Collections
            </p>
            <h1 className="collections-hero-title font-serif text-[4.6rem] leading-[0.76] md:text-[9rem] lg:text-[clamp(10rem,10vw,18rem)]">
              Dress the moment.
            </h1>
          </div>

          <div className="grid gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Editorial edits for work, festivals, celebrations, new arrivals
              and the rotating Naina collection.
            </p>
            <Link
              to="/products"
              className="collections-pill group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#171717]"
            >
              View all sarees
              <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {collections.map((collection) => (
        <CollectionBlock
          key={collection.label}
          collection={collection}
        />
      ))}
    </main>
  );
}

function CollectionBlock({ collection }) {
  return (
    <section className="collection-block relative w-full bg-[#08070a] text-white">
      <Link
        to={collection.to}
        className="group collection-image-panel collection-editorial-panel relative block min-h-[105svh] overflow-hidden text-white md:min-h-[118vh] lg:min-h-[125vh]"
      >
        <img
          src={getImageFromId(collection.imageId)}
          alt=""
          aria-hidden="true"
          className="collection-backdrop absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl saturate-125"
        />
        <img
          src={getImageFromId(collection.imageId)}
          alt={`${collection.label} collection`}
          className="collection-image collection-primary-image absolute inset-0 h-full w-full object-contain transition duration-1000"
        />
        <div className="collection-fade-layer absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#08070a]/95 via-[#08070a]/58 to-transparent" />
        <div className="collection-fade-layer absolute inset-y-0 right-0 w-[34%] bg-gradient-to-l from-[#08070a]/82 via-[#08070a]/26 to-transparent" />
        <div className="collection-fade-layer absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/46 to-transparent" />
        <div className="collection-fade-layer absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/68 to-transparent" />
        <div className="collection-fade-layer absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.18),rgba(0,0,0,0.02)_52%,rgba(0,0,0,0.18))]" />

        <div className="collection-editorial-content relative z-10 flex min-h-[105svh] flex-col justify-between px-5 py-8 md:min-h-[118vh] md:px-10 md:py-12 lg:min-h-[125vh] lg:px-14">
          <div className="flex items-start justify-between gap-6" />

          <div className="collection-editorial-copy max-w-[32rem] border-l border-white/20 pl-5 md:pl-7">
            <p className="text-sm uppercase tracking-[0.42em] text-[#E7C982]">
              {collection.label}
            </p>
            <span className="collections-pill mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#171717] transition group-hover:bg-[#E7C982]">
              View sarees
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
