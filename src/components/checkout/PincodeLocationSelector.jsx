import {
  Check,
  ChevronDown,
  LoaderCircle,
  MapPin,
  PencilLine,
} from "lucide-react";

export default function PincodeLocationSelector({
  normalizedPincode,
  postOffices,
  selectedLocality,
  showLocalities,
  isLookingUpPincode,
  pincodeLookupError,
  manualAddressMode,
  onToggleLocalities,
  onSelectLocality,
  onUseManualAddress,
}) {
  if (normalizedPincode.length !== 6) return null;

  if (isLookingUpPincode) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-[#9A7B4F]">
        <LoaderCircle size={14} className="animate-spin" />
        Finding delivery locations...
      </div>
    );
  }

  if (pincodeLookupError || postOffices.length === 0) {
    return (
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-900">
          We could not fetch locations for this PIN code.
        </p>
        <p className="mt-1 text-xs leading-5 text-amber-800">
          You can still continue by entering your locality, city and state manually.
        </p>
        {!manualAddressMode && (
          <button
            type="button"
            onClick={onUseManualAddress}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-900"
          >
            <PencilLine size={14} />
            Enter address manually
          </button>
        )}
      </div>
    );
  }

  if (manualAddressMode) {
    return (
      <div className="mt-3 rounded-2xl border border-[#9A7B4F]/20 bg-[#FFFDF9] p-4 text-xs text-[#6B5F54]">
        Manual address entry is enabled. Please enter locality, city and state below.
      </div>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggleLocalities}
        className="flex w-full items-center justify-between rounded-2xl border border-[#9A7B4F]/20 bg-[#FFFDF9] px-4 py-3.5 text-left transition hover:border-[#9A7B4F]/50"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
            {selectedLocality ? <Check size={16} /> : <MapPin size={16} />}
          </span>

          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.14em] text-[#9A7B4F]">
              {selectedLocality
                ? "Selected locality"
                : `${postOffices.length} localities found`}
            </span>

            <span className="mt-0.5 block truncate text-sm font-medium text-[#181818]">
              {selectedLocality
                ? `${selectedLocality.Name}, ${selectedLocality.District}`
                : "Choose your post office or locality"}
            </span>
          </span>
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-[#9A7B4F] transition-transform ${
            showLocalities ? "rotate-180" : ""
          }`}
        />
      </button>

      <button
        type="button"
        onClick={onUseManualAddress}
        className="mt-2 text-xs font-medium text-[#7A633F] underline underline-offset-4"
      >
        My locality is not listed — enter manually
      </button>

      {showLocalities && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-[1.5rem] border border-black/10 bg-white p-2 pt-0 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
          <div className="sticky top-0 z-10 rounded-xl bg-white px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F]">
              Select delivery locality
            </p>
          </div>

          {postOffices.map((location, index) => {
            const key = [
              location.Name,
              location.BranchType,
              location.Pincode,
              index,
            ].join("-");

            const isSelected =
              selectedLocality?.Name === location.Name &&
              selectedLocality?.BranchType === location.BranchType;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectLocality(location)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                  isSelected ? "bg-[#F2EADD]" : "hover:bg-[#F8F3EC]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-[#181818] text-white"
                      : "bg-[#F8F3EC] text-[#9A7B4F]"
                  }`}
                >
                  {isSelected ? <Check size={14} /> : <MapPin size={14} />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#181818]">
                    {location.Name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6B5F54]">
                    {[location.Block, location.District, location.State]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
