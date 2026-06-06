export default function FAQ() {
    const faqs = [
        {
            question: "Are your sarees authentic?",
            answer:
                "Yes. Every saree is carefully sourced and inspected before dispatch.",
        },
        {
            question: "Do colours vary from photos?",
            answer:
                "Slight colour variation may occur due to lighting and screen settings.",
        },
        {
            question: "Do you offer Cash on Delivery?",
            answer:
                "Availability depends on delivery location and order value.",
        },
        {
            question: "How do I care for silk sarees?",
            answer:
                "We recommend dry cleaning to preserve fabric quality and longevity.",
        },
        {
            question: "Can I request additional photos?",
            answer:
                "Absolutely. Contact us via WhatsApp and we'll share more images or videos.",
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-5 py-16 md:py-24">
            <p className="text-xs tracking-[0.4em] uppercase text-[#9A7B4F]">
                Customer Support
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-4">
                Frequently Asked Questions
            </h1>

            <div className="mt-10 space-y-4">
                {faqs.map((faq) => (
                    <div
                        key={faq.question}
                        className="bg-white rounded-[1.5rem] p-6 shadow-md"
                    >
                        <h3 className="font-semibold text-lg text-[#181818]">
                            {faq.question}
                        </h3>

                        <p className="text-[#6B5F54] mt-3 leading-7">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}