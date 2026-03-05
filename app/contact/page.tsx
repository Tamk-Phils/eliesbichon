import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
    title: "Contact Us | Ellie's Bichon Frise Sanctuary",
    description: "Get in touch with Ellie's Bichon Frise Sanctuary. We'd love to answer your questions about our available puppies, the adoption process, and our health guarantee.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <section className="bg-cream-100 border-b border-cream-200 py-20 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-4">Get In Touch</h1>
                    <p className="text-brown-800/60 text-lg">
                        Questions about our puppies or adoption process? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>
            <ContactForm />
        </div>
    );
}
