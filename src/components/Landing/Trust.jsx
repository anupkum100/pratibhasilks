import {
    Heart, ShieldCheck, Sparkles, Truck
} from "lucide-react";
export default function Trust() {
    return <section className="px-4 -mt-8 relative z-20">
        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl grid grid-cols-2 md:grid-cols-4 overflow-hidden">
            <TrustItem icon={<Sparkles />} title="Curated Pieces" />
            <TrustItem icon={<ShieldCheck />} title="Authentic Fabrics" />
            <TrustItem icon={<Truck />} title="PAN India Delivery" />
            <TrustItem icon={<Heart />} title="Style Support" />
        </div>
    </section>
}

function TrustItem({ icon, title }) {
    return (
        <div className="p-5 text-center border-r border-b md:border-b-0 border-black/5">
            <div className="mx-auto mb-3 h-11 w-11 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#9A7B4F]">
                {icon}
            </div>
            <p className="text-sm font-medium">{title}</p>
        </div>
    );
}