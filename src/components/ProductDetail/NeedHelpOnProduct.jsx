import {
    Mail, Phone
} from "lucide-react";
import { PS_EMAIL, PS_PHONE } from "../../data/constants";

export function NeedHelpOnProduct() {
    return <section className="mt-16 bg-[#181818] text-white rounded-[2rem] p-6 md:p-10">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
                <p className="text-xs tracking-[0.4em] uppercase text-[#D8B46A]">
                    Need Help?
                </p>

                <h2 className="font-serif text-4xl md:text-5xl mt-4">
                    Not sure if this is the one?
                </h2>

                <p className="text-white/60 mt-5 leading-7">
                    Talk to us before you buy. We can help with fabric,
                    styling, occasion suitability and delivery questions.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <a
                    href={`tel:+${PS_PHONE}`}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition"
                >
                    <Phone className="text-[#D8B46A]" />
                    <div>
                        <p className="text-white/50 text-sm">Call Us</p>
                        <p className="font-medium">{PS_PHONE}</p>
                    </div>
                </a>

                <a
                    href={`mailto:${PS_EMAIL}`}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition"
                >
                    <Mail className="text-[#D8B46A]" />
                    <div>
                        <p className="text-white/50 text-sm">Email Us</p>
                        <p className="font-medium break-all">{PS_EMAIL}</p>
                    </div>
                </a>
            </div>
        </div>
    </section>
}