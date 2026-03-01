import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Frequently asked questions about adopting a Bichon Frise from Ellie's Sanctuary.",
};

const faqs = [
    {
        q: "How does the adoption process work?",
        a: "Browse our available puppies, select one you love, and submit an adoption application. Once approved, you'll place a deposit to reserve your puppy. The remaining balance is due before pickup or delivery.",
    },
    {
        q: "What does the adoption fee include?",
        a: "The adoption fee includes your puppy's first vet exam, age-appropriate vaccinations, deworming, microchipping, AKC registration paperwork, and a health certificate.",
    },
    {
        q: "Do you offer a health guarantee?",
        a: "Yes! We offer a comprehensive health guarantee covering genetic conditions for the first two years. See our Health Guarantee page for full details.",
    },
    {
        q: "Can puppies be shipped or delivered?",
        a: "Yes, we offer ground transport and flight nanny services. We do not ship puppies in cargo. See our Shipping page for detailed options and pricing.",
    },
    {
        q: "Are Bichon Frises good for families with children?",
        a: "Absolutely! Bichon Frises are gentle, playful, and patient — one of the best family dogs. They're also hypoallergenic, making them ideal for allergy sufferers.",
    },
    {
        q: "How much do your puppies typically cost?",
        a: "Our puppies range from $2,000–$4,000 depending on lineage, color, and gender. All puppies come with full registration papers.",
    },
    {
        q: "What should I prepare before bringing my puppy home?",
        a: "We recommend a crate, playpen, food and water bowls, puppy food (we'll provide our current brand), a collar and leash, and lots of love! We send home a care guide with every puppy.",
    },
    {
        q: "How do I schedule a visit?",
        a: "Contact us through our website to schedule a visit to meet our puppies and parent dogs in person. We welcome visits by appointment.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <section className="bg-cream-100 border-b border-cream-200 py-20 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <p className="text-sm font-semibold text-sand-600 uppercase tracking-widest mb-3">FAQ</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-brown-800/60 text-lg">
                        Everything you need to know about adopting a Bichon Frise from our sanctuary.
                    </p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                <div className="space-y-3">
                    {faqs.map(({ q, a }, i) => (
                        <details
                            key={i}
                            className="group bg-cream-100 border border-cream-200 rounded-2xl overflow-hidden"
                        >
                            <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-brown-900 hover:text-sand-600 transition-colors">
                                {q}
                                <ChevronDown className="w-5 h-5 text-brown-800/40 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <div className="px-5 pb-5 text-brown-800/70 leading-relaxed text-sm border-t border-cream-200 pt-4">
                                {a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-12 bg-sand-500/10 border border-sand-400/30 rounded-2xl p-6 text-center">
                    <p className="font-semibold text-brown-900 mb-2">Still have questions?</p>
                    <p className="text-brown-800/60 text-sm mb-4">
                        We&apos;re happy to help. Reach out and we&apos;ll get back to you quickly.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-6 py-2.5 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl text-sm transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
