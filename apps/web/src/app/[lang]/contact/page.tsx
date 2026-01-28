import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage() {
  return (
    <section className="rounded-2xl bg-[#f6f2ea] px-6 py-12 text-[#0f1230] shadow-lg sm:px-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white px-8 py-10 shadow-md sm:px-12 sm:py-12">
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Contact Us</h1>
        <ContactForm />
      </div>
    </section>
  );
}
