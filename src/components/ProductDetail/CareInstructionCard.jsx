import { Shirt, Droplets, Sun, ShieldCheck } from "lucide-react";
const defaultInstruction = [
    "First wash dry clean",
    "Separate wash with mild shampoo",
    "Do not machine wash"
]

export default function CareInstructionsCard({
    careInstructions = [],
}) {
    // if (!careInstructions?.length) return null;

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-[#E8DCCB] bg-[#FFFCF8] p-0 md:p-8">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A46B] via-[#E8D2A8] to-[#C9A46B]" />

            {/* Header */}
            <div className="px-6 md:px-8 py-6 border-b border-black/5">
                <p className="text-xs tracking-[0.3em] uppercase text-[#9A7B4F]">
                    Care Guide
                </p>

                <h3 className="font-serif text-4xl mt-2">
                    Preserve the Beauty
                </h3>

                <p className="text-[#6B5F54] mt-3 text-sm leading-6">
                    Handcrafted sarees deserve gentle care to preserve
                    their colour, texture and elegance for years.
                </p>
            </div>

            {/* Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-black/5">
                <CareIcon
                    icon={<Shirt size={20} />}
                    title="Gentle Handling"
                />

                <CareIcon
                    icon={<Droplets size={20} />}
                    title="Mild Wash"
                />

                <CareIcon
                    icon={<Sun size={20} />}
                    title="Shade Dry"
                />

                <CareIcon
                    icon={<ShieldCheck size={20} />}
                    title="Long Lasting"
                />
            </div>

            {/* Instructions */}
            <div className="p-6 md:p-8">
                <div className="space-y-4">
                    {[...defaultInstruction, ...careInstructions].map((instruction, index) => (
                        <div
                            key={index}
                            className="flex gap-4 items-start"
                        >
                            <div className="h-7 w-7 flex-shrink-0 rounded-full bg-[#F8F3EC] flex items-center justify-center text-xs font-medium text-[#9A7B4F]">
                                {index + 1}
                            </div>

                            <p className="text-[#4F453C] leading-7">
                                {instruction}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CareIcon({ icon, title }) {
    return (
        <div className="p-5 md:p-6 text-center border-r last:border-r-0 border-black/5">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#F8F3EC] text-[#9A7B4F] flex items-center justify-center">
                {icon}
            </div>

            <p className="text-sm font-medium mt-3">
                {title}
            </p>
        </div>
    );
}