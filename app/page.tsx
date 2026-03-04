import type { Metadata } from "next";
import HomeHeroClient from "@/components/HomeHeroClient";
import FeaturedPuppiesClient from "@/components/FeaturedPuppiesClient";
import { Shield, Heart, Baby, Award } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ellie's Bichon Frise Sanctuary — Find Your Perfect Companion",
  description:
    "Raising happy, healthy, and AKC-registered Bichon Frise puppies with love and dedication. Browse our available puppies and find your forever companion today.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ellie's Bichon Frise Sanctuary",
  "image": "https://www.eliesbichon.com/logo.png",
  "description": "Raising happy, healthy, AKC-registered Bichon Frise puppies with love and dedication.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "email": "adminsupport@eliesbichon.com",
  "telephone": "+12138493395",
  "url": "https://www.eliesbichon.com"
};

const features = [
  { icon: Shield, title: "Health Guarantee", desc: "Every puppy comes with a comprehensive health guarantee covering genetic conditions." },
  { icon: Heart, title: "Raised With Love", desc: "Our puppies are socialized from day one in a loving home environment." },
  { icon: Baby, title: "Expert Care", desc: "Vaccinated, microchipped, and vet-checked before going to their new homes." },
  { icon: Award, title: "AKC Registered", desc: "Champion bloodlines with full registration papers available." },
];

// Real Bichon Frise Unsplash photos
const GALLERY = [
  { id: "g1", url: "https://images.unsplash.com/photo-1652900186700-1266fdafd5a7?auto=format&fit=crop&w=400&q=80", alt: "Bichon Frise puppy" },
  { id: "g2", url: "https://images.unsplash.com/photo-1687632922201-164b5f753635?auto=format&fit=crop&w=400&q=80", alt: "Fluffy Bichon Frise" },
  { id: "g3", url: "https://images.unsplash.com/photo-1728154638500-2a7b5df27639?auto=format&fit=crop&w=400&q=80", alt: "Bichon Frise playing" },
  { id: "g4", url: "https://images.unsplash.com/photo-1665932561487-726ebfb2c74f?auto=format&fit=crop&w=400&q=80", alt: "Adorable Bichon Frise" },
  { id: "g5", url: "https://images.unsplash.com/photo-1731315099269-38d767b7e50a?auto=format&fit=crop&w=400&q=80", alt: "Bichon Frise portrait" },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeHeroClient />

      {/* Features strip */}
      <section className="py-16 bg-cream-100 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-sand-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-sand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-brown-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-brown-800/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedPuppiesClient />

      {/* Photo gallery strip */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-brown-900 text-center mb-3">
            Life at the Sanctuary
          </h2>
          <p className="text-brown-800/60 text-center mb-8 max-w-xl mx-auto">
            Peek inside the daily lives of our fluffy Bichon Frise family.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {GALLERY.map(({ id, url, alt }) => (
              <div key={id} className="rounded-2xl overflow-hidden h-44 bg-cream-200">
                <img src={url} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-16 bg-cream-100 border-y border-cream-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden h-72">
            <img
              src="https://images.unsplash.com/photo-1700684072190-23b8b87900cc?auto=format&fit=crop&w=700&q=80"
              alt="Ellie with her Bichon Frise dogs"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-sand-600 uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="font-display text-4xl font-bold text-brown-900 mb-4">
              Bred With Care, Placed With Love
            </h2>
            <p className="text-brown-800/70 leading-relaxed mb-6">
              Every Bichon Frise puppy at our sanctuary is raised in a home environment with
              constant human interaction. We believe a well-socialized puppy is a happy puppy —
              and a happy puppy makes for a happy family.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl transition-colors text-sm"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1728154638508-9a45e9007506?auto=format&fit=crop&w=1400&q=60"
            alt="Bichon Frise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brown-900/70" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-50 mb-4">
            Ready to Meet Your New Best Friend?
          </h2>
          <p className="text-cream-200/70 mb-8 text-lg">
            Browse our available Bichon Frise puppies and start your adoption journey today.
          </p>
          <a
            href="/browse"
            className="inline-block px-8 py-4 bg-sand-500 hover:bg-sand-600 text-cream-50 font-semibold rounded-xl transition-colors text-lg"
          >
            Browse Available Puppies
          </a>
        </div>
      </section>
    </>
  );
}
