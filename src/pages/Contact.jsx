import { useState } from "react";
import { PS_PHONE_WHATSAPP } from "../data/constants";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createWhatsappMessage = () => {
    const whatsappURL = "https://api.whatsapp.com/send?";

    let message = `Hi, I want to know more about PS Sarees.

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`;

    const encodedMessage = encodeURIComponent(message);

    return `${whatsappURL}phone=${PS_PHONE_WHATSAPP}&text=${encodedMessage}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappLink = createWhatsappMessage();

    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-5">
      <h1
        className="text-3xl md:text-5xl mb-4"
        style={{ color: "var(--color-primary)" }}
      >
        Contact Us
      </h1>

      <div className="text-center mb-6">

        <p className="text-gray-600 max-w-2xl mx-auto leading-">
          Looking for the perfect saree for your special occasion?
          Send us your requirements and we’ll help you find the
          elegance you deserve ✨
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg space-y-4 md:space-y-5"
        style={{
          borderTop: "4px solid var(--color-accent)",
        }}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base"
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what kind of saree you are looking for..."
          required
          className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl h-32 md:h-40 outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base"
        />

        <button
          type="submit"
          className="w-full md:w-auto text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] font-semibold text-sm md:text-base shadow-md"
          style={{
            backgroundColor: "var(--color-secondary)",
          }}
        >
          Send on WhatsApp
        </button>
      </form>
    </div>
  );
}