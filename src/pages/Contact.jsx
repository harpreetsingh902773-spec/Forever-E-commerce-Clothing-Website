import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets/frontend_assets/assets";
import Title from "../components/Title";

const API_URL = import.meta.env.VITE_PAYMENT_API || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");
const inputClass = "w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-black";

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const form = event.currentTarget;
    const message = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your message.");
      form.reset();
      toast.success("Your message has been received.");
    } catch (error) {
      toast.error(error.message || "Could not reach the contact service. Check that the local server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="border-t pt-8 pb-16">
      <div className="mb-8 text-center text-2xl">
        <Title title1="GET IN" title2="TOUCH" />
      </div>

      <section className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <img src={assets.contact_img} alt="Clothing from the Forever collection" className="h-64 w-full object-cover sm:h-80" />
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">We are here to help</p>
            <h1 className="mt-2 text-2xl font-medium">How can we help you?</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
              Send us a question about shopping or an order. Include the email you used at checkout if you need help with a recent purchase.
            </p>
            <p className="mt-5 text-sm text-gray-600">
              Need to check an order? <Link to="/Orders" className="text-black underline underline-offset-2">View your orders</Link>.
            </p>
          </div>
        </div>

        <div className="border border-gray-200 p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-medium">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block">Your name</span>
              <input className={inputClass} name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block">Email address</span>
              <input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block">Subject</span>
              <input className={inputClass} name="subject" type="text" minLength={3} maxLength={120} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block">Message</span>
              <textarea className={`${inputClass} min-h-36 resize-y`} name="message" minLength={10} maxLength={4000} required />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black px-6 py-3 text-sm text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
          <p className="mt-4 text-xs leading-5 text-gray-500">Messages are saved on the local shop server for follow-up.</p>
        </div>
      </section>
    </main>
  );
}

export default Contact;
