import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  PS_PHONE,
  PS_EMAIL,
  PS_PHONE_WHATSAPP,
} from "../data/constants";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occasion: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const createWhatsappMessage = () => {
    const message = `Hello Pratibha Silks,

Name: ${formData.name}
Email: ${formData.email}
Occasion: ${formData.occasion}

Requirement:
${formData.message}`;

    return `https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}&text=${encodeURIComponent(
      message
    )}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.open(createWhatsappMessage(), "_blank");
  };

  const inputClass = `
    w-full
    bg-[#F8F3EC]
    rounded-xl md:rounded-2xl
    px-4 py-3 md:px-5 md:py-4
    outline-none
    border border-transparent
    focus:border-[#D8B46A]
    text-sm md:text-base
  `;

  return (
    <main className="bg-[#F8F3EC] text-[#181818]">
      <section className="max-w-7xl mx-auto px-5 pt-10 md:pt-20 pb-10 md:pb-14">
        <p className="text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.45em] uppercase text-[#9A7B4F]">
          Personal Assistance
        </p>

        <h1 className="font-serif text-[2.75rem] md:text-7xl mt-4 leading-none max-w-4xl">
          Tell us the occasion.
          <br />
          We'll help you find the saree.
        </h1>

        <p className="max-w-2xl mt-5 md:mt-6 text-[#6B5F54] text-sm md:text-lg leading-6 md:leading-8">
          Whether you're shopping for a wedding, festive celebration,
          office event or a special gift, we're here to help you choose
          the perfect drape.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-14 md:pb-20">
        <div className="grid lg:grid-cols-[420px_1fr] gap-6 md:gap-8">
          <div className="bg-[#181818] text-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10">
            <p className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.35em] uppercase text-[#D8B46A]">
              Get In Touch
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-4">
              We'd love to help.
            </h2>

            <div className="space-y-5 md:space-y-6 mt-8 md:mt-10">
              <ContactItem
                icon={<Phone size={18} />}
                label="Call Us"
                value={
                  <a href={`tel:${PS_PHONE}`}>
                    {PS_PHONE}
                  </a>
                }
              />

              <ContactItem
                icon={<Mail size={18} />}
                label="Email"
                value={
                  <a
                    href={`mailto:${PS_EMAIL}`}
                    className="break-all"
                  >
                    {PS_EMAIL}
                  </a>
                }
              />

              <ContactItem
                icon={<MapPin size={18} />}
                label="Location"
                value="Pune, Maharashtra"
              />
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}&text=Hello`}
              target="_blank"
              rel="noreferrer"
              className="
                mt-8 md:mt-10
                bg-[#25D366]
                text-black
                rounded-full
                py-3 md:py-4
                px-5 md:px-6
                text-sm md:text-base
                font-semibold
                flex items-center justify-center gap-3
                hover:scale-[1.02]
                transition
              "
            >
              <MessageCircle size={18} />
              Chat On WhatsApp
            </a>
          </div>

          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)] border border-black/5">
            <p className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.35em] uppercase text-[#9A7B4F]">
              Personal Consultation
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-4">
              Tell us what you're looking for
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-7 md:mt-10 space-y-4 md:space-y-5"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />

              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Occasion</option>
                <option>Wedding</option>
                <option>Festive</option>
                <option>Office Wear</option>
                <option>Party Wear</option>
                <option>Gift</option>
              </select>

              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us the fabric, colour, budget or occasion you're shopping for..."
                className={`
                  ${inputClass}
                  h-32 md:h-40
                  resize-none
                `}
              />

              <button
                type="submit"
                className="
                  w-full
                  bg-[#181818]
                  text-white
                  rounded-full
                  py-3 md:py-4
                  text-sm md:text-base
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Send Requirement On WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="text-center px-5 pb-14 md:pb-20">
        <p className="text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.45em] uppercase text-[#9A7B4F]">
          Pratibha Silks
        </p>

        <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight max-w-4xl mx-auto">
          Every great saree starts with a conversation.
        </h2>
      </section>
    </main>
  );
}

function ContactItem({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="text-[#D8B46A] mt-1">
        {icon}
      </div>

      <div>
        <p className="text-white/50 text-xs md:text-sm">
          {label}
        </p>

        <div className="text-base md:text-lg">
          {value}
        </div>
      </div>
    </div>
  );
}