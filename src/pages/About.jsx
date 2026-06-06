import {
  Sparkles,
  ShieldCheck,
  Heart,
  Scissors,
  BookOpen,
  MapPin,
  Flower2,
} from "lucide-react";
import { getImageFromId } from "../data/util";

const motherSketchImage = "maa_vwso5v.png";
// Replace this later with your actual PNG path.
// Example: "/pratibha-jha-sketch.png"

export default function About() {
  return (
    <main className="bg-[#F8F3EC] text-[#181818] overflow-hidden">
      {/* Hero */}
      <section className="relative px-5 pt-14 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
              Born From Memory
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-5 leading-none max-w-4xl">
              A saree is never just fabric.
            </h1>

            <p className="mt-7 text-[#6B5F54] text-base md:text-lg leading-8 max-w-2xl">
              PratibhaSilks is born from memory, craft, and the quiet
              philosophy of a woman who believed sarees are not just garments,
              but living archives of emotion and geography.
            </p>
          </div>

          {/* Mother Sketch Placeholder */}
          <div className="relative">
            <div className="absolute -inset-6 bg-[#D8B46A]/20 rounded-full blur-3xl" />

            <div className="relative bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-black/5">
              <div className="aspect-[4/5] rounded-[2rem] bg-[#F8F3EC] overflow-hidden flex items-center justify-center">
                <img
                  src={getImageFromId(motherSketchImage)}
                  alt="Pratibha Jha"
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                  In Loving Memory
                </p>

                <h2 className="font-serif text-4xl mt-2">
                  Pratibha Jha
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Story */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="bg-white rounded-[2.5rem] p-7 md:p-14 shadow-[0_24px_80px_rgba(0,0,0,0.08)] border border-black/5">
          <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
            The Beginning
          </p>

          <div className="mt-8 space-y-7 text-[#6B5F54] leading-8 text-base md:text-lg">
            <p>
              It began with Pratibha Jha, a woman of warmth, curiosity, and
              joy, who lived in the silk city and saw the world through the
              language of textiles.
            </p>

            <p>
              For her, every saree carried meaning far beyond fabric. A border
              was never decoration alone — it was a story. It could echo
              wedding processions, temple rhythms, harvest fields, or the
              climate of a region shaped over centuries.
            </p>

            <blockquote className="border-l-2 border-[#D8B46A] pl-6 md:pl-8 py-3">
              <p className="font-serif text-3xl md:text-5xl leading-tight text-[#181818]">
                “A saree holds what a place remembers, and what a family passes
                forward.”
              </p>
            </blockquote>

            <p>
              She also believed that sarees carry motherhood across
              generations. To her, they were not possessions but emotional
              inheritances — threads that connect daughters, mothers, and
              daughters-in-law in ways words often cannot.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-5 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5 md:gap-7">
          <PhilosophyCard
            icon={<BookOpen />}
            title="Memory"
            text="Every drape is treated like a chapter — a way to hold stories that should not disappear."
          />

          <PhilosophyCard
            icon={<MapPin />}
            title="Geography"
            text="A weave, border or motif can carry the rhythm of a place, its climate, its rituals and its people."
          />

          <PhilosophyCard
            icon={<Heart />}
            title="Motherhood"
            text="Sarees become emotional inheritances, moving quietly from one generation to the next."
          />
        </div>
      </section>

      {/* 56 Sarees */}
      <section className="bg-[#181818] text-white px-5 py-20 md:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-[#D8B46A]">
              The First Collection
            </p>

            <h2 className="font-serif text-[6rem] md:text-[11rem] leading-none mt-4 text-[#D8B46A]">
              56
            </h2>

            <p className="text-white/50 text-sm tracking-[0.35em] uppercase">
              Sarees · Years · Chapters
            </p>
          </div>

          <div>
            <h3 className="font-serif text-4xl md:text-6xl leading-tight">
              The inaugural collection carries the number of her life.
            </h3>

            <p className="text-white/65 mt-7 leading-8 text-base md:text-lg">
              The first PratibhaSilks collection features 56 sarees,
              symbolizing the 56 years of Pratibha Jha’s life. Each saree is
              imagined as a chapter in her library of textiles — shaped by
              artisans who continue India’s handloom and hand-block heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Continuation */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
              What We Carry Forward
            </p>

            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">
              A curated celebration of India’s textile regions.
            </h2>
          </div>

          <div className="space-y-6 text-[#6B5F54] leading-8 text-base md:text-lg">
            <p>
              Founded in her memory, PratibhaSilks celebrates handloom and
              hand-block traditions from Bhagalpur, Bagru, Bengal, and other
              weaving regions of India.
            </p>

            <p>
              Each piece is chosen not only for craft, but for the story it
              represents — its weave, its border, and the culture embedded
              within it.
            </p>

            <p>
              This is not just a brand of sarees. It is an attempt to preserve a
              presence — where every drape becomes memory, and every weave
              becomes a voice that continues to live beyond time.
            </p>
          </div>
        </div>
      </section>

      {/* Promise Cards */}
      <section className="max-w-7xl mx-auto px-5 pb-20">
        <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 pb-3">
          <PromiseCard
            icon={<Sparkles />}
            title="Curated Drapes"
            text="Handpicked styles with story, region and occasion in mind."
          />

          <PromiseCard
            icon={<ShieldCheck />}
            title="Authenticity First"
            text="Clear product details, invoice support and honest fabric notes."
          />

          <PromiseCard
            icon={<Scissors />}
            title="Craft Focus"
            text="Celebrating weave, border, fabric, print and artisan finish."
          />

          <PromiseCard
            icon={<Heart />}
            title="Emotional Legacy"
            text="Every saree is chosen as something that can be remembered."
          />
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-6">
          <PromiseCard
            icon={<Sparkles />}
            title="Curated Drapes"
            text="Handpicked styles with story, region and occasion in mind."
          />

          <PromiseCard
            icon={<ShieldCheck />}
            title="Authenticity First"
            text="Clear product details, invoice support and honest fabric notes."
          />

          <PromiseCard
            icon={<Scissors />}
            title="Craft Focus"
            text="Celebrating weave, border, fabric, print and artisan finish."
          />

          <PromiseCard
            icon={<Heart />}
            title="Emotional Legacy"
            text="Every saree is chosen as something that can be remembered."
          />
        </div>
      </section>
      {/* Mission Vision */}
      <section className="bg-[#181818] text-white px-5 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="border border-white/10 rounded-[2rem] p-8 md:p-10">
            <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
              Our Mission
            </p>

            <h3 className="font-serif text-4xl mt-4">
              Make saree shopping feel personal again.
            </h3>

            <p className="text-white/65 mt-6 leading-7">
              We are dedicated to bringing elegant, authentic and thoughtfully
              selected sarees to women who value tradition, quality and
              emotional connection in what they wear.
            </p>
          </div>

          <div className="border border-white/10 rounded-[2rem] p-8 md:p-10 bg-white/5">
            <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
              Our Vision
            </p>

            <h3 className="font-serif text-4xl mt-4">
              Build a modern home for timeless Indian drapes.
            </h3>

            <p className="text-white/65 mt-6 leading-7">
              Our vision is to present India’s saree heritage through a modern,
              premium and mobile-first experience that feels trustworthy,
              graceful and deeply human.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-5 py-20 text-center max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
          PratibhaSilks
        </p>

        <h2 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">
          For every woman who believes a saree can remember what words cannot.
        </h2>
      </section>
    </main>
  );
}

function PhilosophyCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-[2rem] p-7 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.07)] border border-black/5">
      <div className="h-12 w-12 rounded-full bg-[#F8F3EC] text-[#9A7B4F] flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="font-serif text-3xl leading-tight">
        {title}
      </h3>

      <p className="text-sm text-[#6B5F54] mt-4 leading-6">
        {text}
      </p>
    </div>
  );
}

function PromiseCard({ icon, title, text }) {
  return (
    <div
      className="
        min-w-[78%]
        md:min-w-0
        snap-start
        bg-white
        rounded-[1.75rem]
        p-6 md:p-7
        shadow-[0_18px_50px_rgba(0,0,0,0.06)]
        border border-black/5
      "
    >
      <div className="h-12 w-12 rounded-full bg-[#F8F3EC] text-[#9A7B4F] flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="font-serif text-3xl md:text-2xl leading-tight">
        {title}
      </h3>

      <p className="text-sm text-[#6B5F54] mt-4 leading-6">
        {text}
      </p>
    </div>
  );
}