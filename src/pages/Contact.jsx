
export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-5">
      <h1 className="text-5xl mb-8">Contact Us</h1>
      <form className="bg-white p-8 rounded-2xl shadow-lg space-y-5">
        <input className="w-full border p-4 rounded-xl" placeholder="Name" />
        <input className="w-full border p-4 rounded-xl" placeholder="Email" />
        <textarea className="w-full border p-4 rounded-xl h-40" placeholder="Message"></textarea>
        <button className="bg-[#6D071A] text-white px-8 py-4 rounded-xl">
          Send Message
        </button>
      </form>
    </div>
  )
}
