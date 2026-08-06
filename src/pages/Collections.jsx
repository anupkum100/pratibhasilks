import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageFromId } from "../data/util";

const collections = [
  {
    label: "New",
    kicker: "Fresh arrivals",
    title: "First look. First choice.",
    text: "Recently added sarees, selected for women who like finding the next signature drape before everyone else.",
    imageId: "hero3_wmp0og",
    to: "/products?arrival=New&sort=latest",
    palette: "bg-[#e7efe9] text-[#171717]",
    overlay: "from-[#061719]/75 via-[#0c3e41]/10 to-transparent",
  },
  {
    label: "Professional",
    kicker: "Doctors / Teachers / Lawyers",
    title: "Authority, softened in silk.",
    text: "Composed sarees for clinics, classrooms, chambers and every room where presence matters before words do.",
    imageId: "ChatGPT_Image_Aug_6_2026_10_59_17_AM_qvfkn2.png",
    to: "/products?occasions=Work,Office&categories=Office Wear",
    palette: "bg-[#f0e8dc] text-[#171717]",
    overlay: "from-[#111]/70 via-[#111]/10 to-transparent",
  },
  {
    label: "Festive",
    kicker: "Ganpati / Dussehra / Diwali",
    title: "The season arrives in colour.",
    text: "Temple mornings, lit evenings, family rituals and sarees that hold the brightness of the day.",
    imageId: "ChatGPT_Image_Aug_6_2026_11_14_09_AM_joh94s.png",
    to: "/products?occasions=Festive",
    palette: "bg-[#250f08] text-white",
    overlay: "from-[#2b0d03]/80 via-[#8a390e]/20 to-transparent",
  },
  {
    label: "Occasion",
    kicker: "Marriage / Party / Office outing",
    title: "Dressed for being remembered.",
    text: "A sharper edit for celebrations, evening plans and work gatherings that deserve a little ceremony.",
    imageId: "ChatGPT_Image_Aug_6_2026_11_19_59_AM_gltkdp.png",
    to: "/products?occasions=Wedding,Party&categories=Wedding Collection,Luxury",
    palette: "bg-[#130f16] text-white",
    overlay: "from-[#110711]/80 via-[#3c1735]/20 to-transparent",
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
            {/* <span>Pratibha Silks</span> */}
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

      {collections.map((collection, index) => (
        <CollectionBlock
          key={collection.label}
          collection={collection}
          index={index}
        />
      ))}
    </main>
  );
}

function CollectionBlock({ collection, index }) {
  const isReverse = index % 2 === 1;
  const layoutClass = isReverse
    ? "lg:grid-cols-2 lg:[&>*:first-child]:order-2"
    : "lg:grid-cols-2";

  return (
    <section className={`collection-block relative w-full ${collection.palette}`}>
      <div className={`grid min-h-screen ${layoutClass}`}>
        <Link
          to={collection.to}
          className="group collection-image-panel relative min-h-[64vh] overflow-hidden lg:min-h-screen"
        >
          <img
            src={getImageFromId(collection.imageId)}
            alt={collection.title}
            className="collection-image absolute inset-0 h-full w-full object-cover transition duration-1000"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${collection.overlay}`} />
          <span className="absolute right-5 top-5 hidden max-w-[12rem] border border-white/25 bg-black/15 px-4 py-3 text-[10px] uppercase tracking-[0.34em] text-white/75 backdrop-blur md:block">
            Pratibha Silks
          </span>
          <span className="collection-buy-look absolute bottom-5 right-5 flex max-w-[15rem] items-center gap-3 rounded-full border border-white/35 bg-white px-4 py-3 text-[#171717] shadow-2xl transition md:bottom-8 md:right-8 md:px-5 md:py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
              <ArrowUpRight size={18} />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-sm font-semibold leading-none">
                Get the look
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-black/50">
                View sarees
              </span>
            </span>
          </span>
        </Link>

        <div className="collection-copy-panel relative flex min-h-[72vh] flex-col justify-between px-5 py-10 md:px-10 md:py-14 lg:min-h-screen lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute inset-y-10 left-5 w-px bg-current/10 md:left-10 lg:left-8 xl:left-12" />
          <div className="flex items-center justify-between gap-5">
            <p className="text-xs uppercase tracking-[0.42em] opacity-60">
              {collection.label}
            </p>
            <span className="h-px flex-1 bg-current opacity-15" />
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.32em] opacity-55">
              {collection.kicker}
            </p>
            <h2 className="collection-title font-serif text-[4.2rem] leading-[0.82] md:text-[7.5rem] lg:text-[clamp(4.8rem,5.3vw,7.25rem)]">
              {collection.title}
            </h2>
          </div>

          <div className="border-t border-current/15 pt-7">
            <p className="max-w-xl text-base leading-8 opacity-70 md:text-lg">
              {collection.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
