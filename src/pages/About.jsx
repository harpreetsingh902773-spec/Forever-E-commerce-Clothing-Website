import { Link } from "react-router-dom";
import { assets } from "../assets/assets/frontend_assets/assets";
import Title from "../components/Title";
import OurPollcy from "../components/OurPollcy";

function About() {
  return (
    <main className="border-t pt-8 pb-16">
      <div className="mb-8 text-center text-2xl">
        <Title title1="ABOUT" title2="US" />
      </div>

      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <img src={assets.about_img} alt="A look at the Forever clothing collection" className="h-full max-h-[520px] w-full object-cover" />
        <div className="space-y-5 text-sm leading-7 text-gray-600">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Style for every day</p>
          <h1 className="text-3xl font-medium leading-tight text-gray-900">Good clothes. Easy choices.</h1>
          <p>
            Forever is an online clothing store built to make finding your next favourite piece simple. Browse everyday essentials, explore new styles, and choose the size that feels right for you.
          </p>
          <p>
            We bring our collections together in one place, with clear product details and a straightforward shopping experience from discovery through checkout.
          </p>
          <div className="border-l-2 border-black py-1 pl-4 text-gray-800">
            Thoughtful shopping should feel uncomplicated.
          </div>
          <Link to="/Collection" className="inline-block bg-black px-6 py-3 text-xs text-white hover:bg-gray-800">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 text-2xl">
          <Title title1="WHAT" title2="MATTERS" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="border border-gray-200 p-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">01</p>
            <h2 className="mt-3 font-medium">Easy discovery</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Find pieces for different styles and occasions in one simple collection.</p>
          </article>
          <article className="border border-gray-200 p-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">02</p>
            <h2 className="mt-3 font-medium">A clear experience</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Product details, sizes, and your order summary stay easy to review.</p>
          </article>
          <article className="border border-gray-200 p-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">03</p>
            <h2 className="mt-3 font-medium">Here to help</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Questions about shopping or an order? Send a note through our contact page.</p>
          </article>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 text-2xl">
          <Title title1="THE" title2="EXPERIENCE" />
        </div>
        <OurPollcy />
      </section>
    </main>
  );
}

export default About;
