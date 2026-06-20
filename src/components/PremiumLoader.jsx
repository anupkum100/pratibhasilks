const PremiumLoader = ({ isExiting }) => {
    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF7F2]/90 backdrop-blur-md transition-all duration-700 ease-out
        ${isExiting ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"}`}
        >
            <div
                className={`text-center px-8 transition-all duration-700 ease-out
          ${isExiting ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
            >
                <div className="mx-auto mb-5 h-16 w-16 rounded-full border border-[#B88A44]/30 bg-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <span className="font-serif text-2xl text-[#8B5A2B]">PS</span>
                </div>

                <p className="font-serif text-xl text-[#2A1F1A] tracking-wide">
                    Curating timeless weaves
                </p>

                <p className="mt-2 text-sm text-[#8A7A6D]">
                    Bringing handpicked sarees for you
                </p>

                <div className="mt-6 h-[2px] w-64 overflow-hidden rounded-full bg-[#E8D8C4]">
                    <div className="h-full w-1/3 animate-premiumLoad bg-gradient-to-r from-transparent via-[#B88A44] to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default PremiumLoader;