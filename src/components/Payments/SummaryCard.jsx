export function SummaryCard({ title, value }) {
    return (
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] border border-black/5">
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9A7B4F]">
                {title}
            </p>

            <p className="font-serif text-3xl md:text-4xl mt-3">{value}</p>
        </div>
    );
}