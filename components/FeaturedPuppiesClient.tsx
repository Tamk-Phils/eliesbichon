"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import PuppyCard from "@/components/PuppyCard";
import { ArrowRight } from "lucide-react";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    fee: number;
    status: string;
    images: string[];
    description?: string;
}

export default function FeaturedPuppiesClient() {
    const [puppies, setPuppies] = useState<Puppy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPuppies() {
            const { data } = await supabase
                .from("puppies")
                .select("id, name, age, gender, fee, status, images, description")
                .eq("status", "available")
                .order("created_at", { ascending: false })
                .limit(3);
            setPuppies(data ?? []);
            setLoading(false);
        }
        fetchPuppies();
    }, []);

    return (
        <section className="py-20 bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.p
                        className="text-sm font-semibold text-sand-600 uppercase tracking-widest mb-2"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Meet Our Puppies
                    </motion.p>
                    <motion.h2
                        className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-4"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Available Now
                    </motion.h2>
                    <motion.p
                        className="text-brown-800/60 max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Each of our Bichon Frise puppies is raised with love, socialized
                        from birth, and ready to join your family.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton rounded-2xl h-80" />
                        ))}
                    </div>
                ) : puppies.length === 0 ? (
                    <div className="text-center py-16 text-brown-800/50">
                        <p className="text-lg">No puppies available right now.</p>
                        <p className="text-sm mt-1">Please check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {puppies.map((puppy, i) => (
                            <motion.div
                                key={puppy.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <PuppyCard puppy={puppy} />
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link
                        href="/browse"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-sand-500 text-sand-600 font-semibold rounded-xl hover:bg-sand-500/10 transition-colors"
                    >
                        View All Available Puppies
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
