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
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-sand-400/20" />
            {/* Decorative orbs */}
            <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-sand-500/10 blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-sand-400/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
                {/* Text */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-500/15 text-sand-600 text-sm font-medium mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-sand-500 animate-pulse" />
                            Puppies available now
                        </span>
                    </motion.div>

                    <motion.h1
                        className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-brown-900 mb-6 leading-[1.1]"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Find Your Perfect{" "}
                        <span className="text-sand-600">Bichon Frise</span> Companion
                    </motion.h1>

                    <motion.p
                        className="text-lg text-brown-800/70 mb-8 leading-relaxed max-w-xl"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        At Ellie&apos;s Sanctuary, we raise fluffy, cheerful Bichon Frise
                        puppies with love, care, and dedication. Every puppy comes
                        health-guaranteed and ready to become your forever family member.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-sand-600/25 active:scale-95"
                        >
                            Browse Puppies
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-cream-200 text-brown-800 font-semibold rounded-xl hover:bg-cream-100 hover:border-sand-400 transition-all"
                        >
                            Our Story
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-cream-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-sand-500/15 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-sand-600" />
                                </div>
                                <div>
                                    <div className="font-display font-bold text-brown-900">{value}</div>
                                    <div className="text-xs text-brown-800/60">{label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Hero Image Area */}
                <motion.div
                    className="relative hidden lg:block"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {/* Main hero image */}
                    <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={BICHON_PHOTOS.hero}
                            alt="Adorable Bichon Frise puppy"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/30 to-transparent" />
                    </div>

                    {/* Inset photo top-left */}
                    <motion.div
                        className="absolute -top-4 -left-8 w-36 h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-cream-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <img
                            src={BICHON_PHOTOS.inset}
                            alt="Bichon Frise puppy close-up"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Floating badge */}
                    <motion.div
                        className="absolute -bottom-6 -left-6 bg-cream-50 rounded-2xl shadow-xl p-4 border border-cream-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-sand-600" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-brown-900">Health Guaranteed</div>
                                <div className="text-xs text-brown-800/60">Every single puppy</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
