const details = [
    {
        label: "Fabric",
        key: "fabric",
    },
    {
        label: "Occasion",
        key: "occasions",
    },
    {
        label: "Colour",
        key: "color",
    },
    {
        label: "Blouse Included",
        key: "blouseIncluded",
    }
];

export default function ProductSpecification({ productDetails }) {
    return <section className="mt-16">
        <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

            <div className="px-6 md:px-8 py-5 border-b border-black/5">

                <p className="text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                    Product Specifications
                </p>

                <h2 className="font-serif text-3xl mt-2">
                    Details & Craftsmanship
                </h2>

            </div>

            <div className="grid md:grid-cols-2">

                {details.map((item, index) => (
                    <div
                        key={item.label}
                        className="
      flex items-center justify-between
      px-6 md:px-8
      py-5
      border-b border-black/5
      md:nth-even:border-l
    "
                    >
                        <div className="flex items-center gap-3">

                            <div className="h-3 w-3 rounded-full bg-[#F8F3EC]" />

                            <span className="text-[#6B5F54] text-sm md:text-base">
                                {item.label}
                            </span>

                        </div>

                        <span style={{ color: item.key === "color" ? productDetails.colorHex : "" }} className="font-semibold text-[#181818] text-sm md:text-base text-right">
                            {item.key === "blouseIncluded" ? (productDetails[item.key] ? "Yes" : "No") : productDetails[item.key]}
                        </span>

                    </div>
                ))}

            </div>

        </div>
    </section>
}