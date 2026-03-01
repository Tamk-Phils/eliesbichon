import type { Metadata } from "next";
import { Heart, Home, Baby, Award } from "lucide-react";

export const metadata: Metadata = {
    title: "About Our Sanctuary",
    description: "Learn about Ellie's Bichon Frise Sanctuary — our story, our breeding philosophy, and the love we put into every puppy.",
};

const values = [
    { icon: Heart, title: "Raised With Love", desc: "Every puppy is treated as a member of our own family from birth." },
    { icon: Home, title: "Home Environment", desc: "Our puppies grow up in a warm home setting, not in kennels." },
    { icon: Baby, title: "Early Socialization", desc: "Puppies are exposed to sounds, people, and experiences from day one." },
    { icon: Award, title: "Champion Lines", desc: "Our breeding stock comes from champion AKC-registered bloodlines." },
];

// Real Bichon Frise photos
const BICHON = {
    story: "https://images.unsplash.com/photo-1731315099269-38d767b7e50a?auto=format&fit=crop&w=700&q=80",
    parent1: "https://images.unsplash.com/photo-1652900186700-1266fdafd5a7?auto=format&fit=crop&w=400&q=80",
    parent2: "https://images.unsplash.com/photo-1687632922201-164b5f753635?auto=format&fit=crop&w=400&q=80",
    parent3: "https://images.unsplash.com/photo-1728154638508-9a45e9007506?auto=format&fit=crop&w=400&q=80",
    gallery1: "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?auto=format&fit=crop&w=400&q=80",
    gallery2: "https://images.unsplash.com/photo-1700684072190-23b8b87900cc?auto=format&fit=crop&w=400&q=80",
    gallery3: "https://images.unsplash.com/photo-1665932561487-726ebfb2c74f?auto=format&fit=crop&w=400&q=80",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero */}
            <section className="bg-cream-100 border-b border-cream-200 py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-sm font-semibold text-sand-600 uppercase tracking-widest mb-3">Our Story</p>
                        <h1 className="font-display text-5xl sm:text-6xl font-bold text-brown-900 mb-6">
                            About Ellie&apos;s Sanctuary
                        </h1>
                        <p className="text-lg text-brown-800/70 leading-relaxed">
                            What started as a passion for the joyful, gentle Bichon Frise breed has grown into
                            a dedicated sanctuary committed to matching families with their perfect fluffy companions.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden h-72 lg:h-80 shadow-xl">
                            <img src={BICHON.story} alt="Bichon Frise at the sanctuary" className="w-full h-full object-cover" />
                        </div>
                        {/* Small inset */}
                        <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-2xl overflow-hidden border-4 border-cream-50 shadow-lg">
                            <img src={BICHON.gallery1} alt="Bichon Frise puppy" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="font-display text-3xl font-bold text-brown-900 mb-4">How It All Began</h2>
                    <div className="space-y-4 text-brown-800/70 leading-relaxed">
                        <p>
                            Ellie fell in love with Bichon Frises over a decade ago when she brought home her first
                            puppy, Bella. The breed&apos;s cheerful temperament, hypoallergenic coat, and unwavering
                            loyalty captured her heart completely.
                        </p>
                        <p>
                            After years of research, working with veterinarians, and participating in Bichon clubs,
                            Ellie launched her sanctuary with a simple mission: breed healthy, happy Bichon Frises
                            and find them loving forever homes.
                        </p>
                        <p>
                            Today, every puppy that leaves our care is vet-checked, vaccinated, microchipped, and
                            comes with our comprehensive health guarantee — because we believe every family deserves
                            a healthy, happy companion.
                        </p>
                    </div>
                </div>
                {/* Photo grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl overflow-hidden h-44 col-span-2">
                        <img src={BICHON.gallery2} alt="Bichon Frise family" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-2xl overflow-hidden h-36">
                        <img src={BICHON.gallery1} alt="Bichon Frise puppy" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-2xl overflow-hidden h-36">
                        <img src={BICHON.gallery3} alt="Bichon Frise playing" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-cream-100 border-y border-cream-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <h2 className="font-display text-3xl font-bold text-brown-900 text-center mb-10">
                        Our Breeding Philosophy
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
                                <div className="w-10 h-10 rounded-xl bg-sand-500/15 flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-sand-600" />
                                </div>
                                <h3 className="font-semibold text-brown-900 mb-2">{title}</h3>
                                <p className="text-sm text-brown-800/60 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Parents section */}
            <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="font-display text-3xl font-bold text-brown-900 mb-4">Meet Our Parent Dogs</h2>
                <p className="text-brown-800/60 mb-10 max-w-xl mx-auto">
                    Our breeding stock consists of health-tested, AKC-registered Bichon Frises with
                    champion pedigrees and outstanding temperaments.
                </p>
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { name: "Bella", role: "Dam", img: BICHON.parent1 },
                        { name: "Charlie", role: "Sire", img: BICHON.parent2 },
                        { name: "Daisy", role: "Dam", img: BICHON.parent3 },
                    ].map(({ name, role, img }) => (
                        <div key={name} className="bg-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
                            <div className="h-56 bg-cream-200">
                                <img src={img} alt={name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-display text-xl font-bold text-brown-900">{name}</h3>
                                <p className="text-sm text-sand-600">{role} · Bichon Frise</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
