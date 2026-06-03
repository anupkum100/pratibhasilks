import { Sparkles, ShieldCheck, Heart, Scissors } from "lucide-react";

const aboutImage =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop";

export default function About() {
  return (
    <main className="bg-[#F8F3EC] text-[#181818]">
      <section className="max-w-7xl mx-auto px-5 pt-10 md:pt-20 pb-10 md:pb-14">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#9A7B4F]">
            The Story
          </p>

          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">
            A saree is never just fabric.
          </h2>
        </div>

        <div className="space-y-6 text-[#6B5F54] leading-8 text-base md:text-lg">
          <p>
            Rooted in the timeless traditions of Indian craftsmanship,
            Pratibha Silks brings together elegance, texture and occasion-led
            styling for women who see sarees as an expression of identity.
          </p>

          <p>
            Every piece is selected with attention to fabric, fall, border,
            colour and mood — because a saree should feel as beautiful in
            memory as it looks in a photograph.
          </p>
        </div>
      </section>

      {/* Promise Cards */}
      <section className="max-w-7xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <PromiseCard
            icon={<Sparkles />}
            title="Curated Drapes"
            text="Handpicked styles for meaningful occasions."
          />

          <PromiseCard
            icon={<ShieldCheck />}
            title="Authenticity First"
            text="Clear product details, invoice support and honest fabric notes."
          />

          <PromiseCard
            icon={<Scissors />}
            title="Craft Focus"
            text="Celebrating weave, border, fabric and finish."
          />

          <PromiseCard
            icon={<Heart />}
            title="Personal Touch"
            text="WhatsApp support to help you choose better."
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
              graceful and easy to explore.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-5 py-20 text-center max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
          Pratibha Silks
        </p>

        <h2 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">
          For every woman who believes elegance should feel effortless.
        </h2>
      </section>
    </main>
  );
}

function PromiseCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 md:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.06)] border border-black/5">
      <div className="h-11 w-11 rounded-full bg-[#F8F3EC] text-[#9A7B4F] flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="font-serif text-2xl leading-tight">
        {title}
      </h3>

      <p className="text-sm text-[#6B5F54] mt-3 leading-6">
        {text}
      </p>
    </div>
  );
}