import {
  Instagram, Search
} from "lucide-react";
import { useState } from "react";
import Hero from "../components/Landing/Hero";
import Intro from "../components/Landing/Intro";
import OtherInfo from "../components/Landing/OtherInfo";
import SareeTypesPreview from "../components/Landing/SareePreview";
import ShopByOccasion from "../components/Landing/ShopByOccasion";
import Story from "../components/Landing/Story";
import Trust from "../components/Landing/Trust";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-[#F8F3EC] text-[#181818] overflow-hidden">
      {/* MOBILE LUXURY TOP BAR */}
      <div className="hidden sticky top-0 z-50 bg-[#F8F3EC]/90 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#9A7B4F]">
            Pratibha
          </p>
          <h1 className="font-serif text-xl leading-none">Silks</h1>
        </div>

        <div className="flex gap-3">
          <Search size={20} />
          <Instagram size={20} />
        </div>
      </div>

      <Hero />

      <Trust />

      <Intro />

      <ShopByOccasion />

      <Story />

      <SareeTypesPreview />

      <OtherInfo />

    </main>
  );
}