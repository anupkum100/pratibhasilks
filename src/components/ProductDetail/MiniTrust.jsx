export default function MiniTrust({ icon, title }) {
    return (
        <div className="bg-[#F8F3EC] rounded-2xl p-3 text-center text-[#6B5F54]">
            <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#9A7B4F]">
                {icon}
            </div>

            <p className="text-xs">{title}</p>
        </div>
    );
}