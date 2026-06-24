export function MobileMeta({ label, value }) {
    return (
        <div className="bg-[#F8F3EC] rounded-2xl p-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7B4F]">
                {label}
            </p>

            <p className="mt-1 text-[#181818] font-medium break-words">{value}</p>
        </div>
    );
}