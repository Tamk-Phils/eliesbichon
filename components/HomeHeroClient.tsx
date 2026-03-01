"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Star } from "lucide-react";

const stats = [
    { icon: Heart, value: "200+", label: "Happy Families" },
    { icon: Shield, value: "100%", label: "Health Guaranteed" },
    { icon: Star, value: "5★", label: "Top Rated Sanctuary" },
];

// Real Bichon Frise photos from Unsplash
const BICHON_PHOTOS = {
    hero: "https://images.unsplash.com/photo-1722426874719-d8aa92ff7f2d?auto=format&fit=crop&w=900&q=85",
    inset: "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?auto=format&fit=crop&w=400&q=80",
};

export default function HomeHeroClient() {
    return (
        <section className="relative min-h-[95vh] flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={BICHON_PHOTOS.hero}
                    alt="Bichon Frise Sanctuary Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brown-900/90 via-brown-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-50" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center min-h-[95vh]">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-500/20 text-cream-50 text-sm font-medium mb-8 backdrop-blur-md border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-sand-400 animate-pulse" />
                            Beautiful Puppies available now
                        </span>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl sm:text-7xl lg:text-8xl font-bold text-cream-50 mb-6 sm:mb-8 leading-[1.05]"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Find Your Perfect{" "}
                        <span className="text-sand-400">Bichon Frise</span> Companion
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-cream-100/80 mb-8 sm:mb-10 leading-relaxed max-w-xl"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        At Ellie&apos;s Sanctuary, we raise cheerful Bichon Frise
                        puppies with love, care, and dedication. Healthy, socialized,
                        and ready to become your forever companion.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-sand-500 hover:bg-sand-600 text-cream-50 font-bold rounded-2xl transition-all hover:shadow-2xl hover:shadow-sand-500/30 active:scale-95 text-lg"
                        >
                            Browse Puppies
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 font-bold rounded-2xl hover:bg-white/20 transition-all text-lg"
                        >
                            Our Story
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                    <Icon className="w-6 h-6 text-sand-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-display font-bold text-cream-50 text-xl">{value}</div>
                                    <div className="text-sm text-cream-200/60 font-medium uppercase tracking-wider">{label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Inset photo floating far right - decorative */}
            <motion.div
                className="absolute top-1/2 -right-20 -translate-y-1/2 hidden xl:block z-10"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <div className="w-[400px] h-[550px] rounded-[40px] overflow-hidden border-[12px] border-white/5 backdrop-blur-xl shadow-2xl relative rotate-3">
                    <img
                        src={BICHON_PHOTOS.inset}
                        alt="Bichon Frise puppy close-up"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[28px]" />
                </div>
            </motion.div>

            {/* Decorative bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent pointer-events-none" />
        </section>
    );
}
