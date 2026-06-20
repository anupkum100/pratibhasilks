export function ColorSelector({ form, onChange, colors }) {
    const updateField = (name, value) => {
        onChange({
            target: {
                name,
                value,
            },
        });
    };

    const selectColor = (color) => {
        updateField("color", color.name);
        updateField("colorHex", color.hex);
    };

    return (
        <div className="md:col-span-2 rounded-[1.75rem] border border-[#E8DCCB] bg-[#FFFCF8] p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#A27B48]">
                        Saree Colour
                    </p>
                    <h4 className="font-serif text-2xl mt-1 text-[#1F1A14]">
                        Choose Colour
                    </h4>
                </div>

                {form.colorHex && (
                    <div
                        className="h-12 w-12 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: form.colorHex }}
                    />
                )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-11 gap-3 mb-6">
                {colors.map((color) => {
                    const active = form.colorHex === color.hex;

                    return (
                        <button
                            type="button"
                            key={color.name}
                            onClick={() => selectColor(color)}
                            className={`
                                h-8 w-8 rounded-full border transition-all
                                ${active
                                    ? "border-[#1A1A1A] scale-110 shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                                    : "border-black/10 hover:scale-105"
                                }
                            `}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    );
                })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[11px] uppercase tracking-[0.25em] text-[#7B6B5C]">
                        Colour Name
                    </label>
                    <input
                        name="color"
                        value={form.color || ""}
                        onChange={onChange}
                        placeholder="Eg. Royal Blue"
                        className="mt-2 w-full rounded-2xl border border-[#DDD2C4] bg-[#F7F1E9] px-5 py-4 text-[#181818] outline-none focus:border-[#B88A44]"
                    />
                </div>

                <div>
                    <label className="text-[11px] uppercase tracking-[0.25em] text-[#7B6B5C]">
                        Colour Hex
                    </label>
                    <input
                        name="colorHex"
                        value={form.colorHex || ""}
                        onChange={onChange}
                        placeholder="Eg. #B46A55"
                        className="mt-2 w-full rounded-2xl border border-[#DDD2C4] bg-[#F7F1E9] px-5 py-4 text-[#181818] outline-none focus:border-[#B88A44]"
                    />
                </div>
            </div>
        </div>
    );
}