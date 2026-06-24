import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, onPrev, onNext }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-8">
            <button
                onClick={onPrev}
                disabled={page === 1}
                className="h-11 w-11 rounded-full bg-white disabled:opacity-40 flex items-center justify-center shadow-md"
            >
                <ChevronLeft size={18} />
            </button>

            <p className="text-sm text-[#6B5F54]">
                Page <span className="text-[#181818] font-medium">{page}</span> of{" "}
                {totalPages}
            </p>

            <button
                onClick={onNext}
                disabled={page === totalPages}
                className="h-11 w-11 rounded-full bg-white disabled:opacity-40 flex items-center justify-center shadow-md"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}