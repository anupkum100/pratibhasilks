export default function AdditionalInformation({ productDetails }) {
    if (!productDetails?.additionalInformation) return null;

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-[#E8DCCB] bg-[#FFFCF8] p-6 md:p-8">

            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A46B] via-[#E8D2A8] to-[#C9A46B]" />

            <p className="text-[11px] uppercase tracking-[0.35em] text-[#A27B48]">
                Additional Information
            </p>

            <h3 className="font-serif text-2xl mt-2 text-[#1F1A14]">
                A Note From Pratibha Silks
            </h3>

            <div className="mt-5">
                <p className="leading-8 text-[#5E5247] text-[15px]">
                    {productDetails.additionalInformation}
                </p>
            </div>

        </div>
    );
}