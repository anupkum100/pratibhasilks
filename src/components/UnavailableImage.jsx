import { ImageOff } from "lucide-react";

export default function UnavailableImage({ className = "" }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-[#F8F3EC] text-center text-[#9A7B4F] ${className}`}
    >
      <ImageOff size={28} strokeWidth={1.5} />
      <p className="mt-2 px-2 text-[10px] uppercase tracking-[0.22em]">
        Image unavailable
      </p>
    </div>
  );
}
