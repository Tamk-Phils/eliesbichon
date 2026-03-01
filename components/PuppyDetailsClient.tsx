"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Heart, MessageCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

export default function PuppyDetailsClient() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [puppy, setPuppy] = useState<Puppy | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from("puppies")
                .select("*")
                .eq("id", id)
                .single();
            setPuppy(data);
            setLoading(false);
        }
        fetch();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">
                <div className="skeleton rounded-3xl h-[480px]" />
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton rounded-xl h-10" />
                    ))}
                </div>
            </div>
        );
    }
    if (!puppy) {
        return (
            <div className="text-center py-32 text-brown-800/50">
                <p className="text-4xl mb-3">🐾</p>
                <p className="text-xl font-medium">Puppy not found</p>
                <Link href="/browse" className="text-sand-600 hover:underline mt-3 block">Back to browse</Link>
            </div>
        );
    }

    const images = puppy.images ?? [];
    const statusColor =
        puppy.status === "available" ? "bg-emerald-100 text-emerald-700" :
            puppy.status === "reserved" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700";

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/browse"
                    className="inline-flex items-center gap-1 text-sm text-brown-800/60 hover:text-sand-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Browse
                </Link>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Image gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative rounded-3xl overflow-hidden bg-cream-200 aspect-square sm:h-[480px] lg:h-[520px]">
                            {images.length > 0 ? (
                                <img
                                    src={images[imgIdx]}
                                    alt={`${puppy.name} photo ${imgIdx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                            )}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-50/90 border border-cream-200 flex items-center justify-center shadow hover:bg-cream-100 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-brown-800" />
                                    </button>
                                    <button
                                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-50/90 border border-cream-200 flex items-center justify-center shadow hover:bg-cream-100 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-brown-800" />
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-sand-500 opacity-100" : "border-transparent opacity-60 hover:opacity-80"
                                            }`}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <h1 className="font-display text-3xl sm:text-5xl font-bold text-brown-900">{puppy.name}</h1>
                            <span className={`inline-block w-fit text-xs sm:text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusColor}`}>
                                {puppy.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-brown-800/60 mb-6">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {puppy.age}</span>
                            <span className="capitalize">{puppy.gender}</span>
                            <span>Bichon Frise</span>
                        </div>

                        {puppy.description && (
                            <p className="text-brown-800/70 mb-6 leading-relaxed">{puppy.description}</p>
                        )}

                        <div className="bg-cream-100 border border-cream-200 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-brown-800/50 mb-1">Adoption Fee</p>
                            <p className="font-display text-3xl font-bold text-brown-900">${puppy.fee?.toLocaleString()}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { icon: Shield, label: "Health Guaranteed" },
                                { icon: Heart, label: "Vet Checked" },
                                { icon: Heart, label: "Vaccinated" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="bg-cream-100 border border-cream-200 rounded-xl p-3 text-center">
                                    <Icon className="w-5 h-5 text-sand-600 mx-auto mb-1" />
                                    <p className="text-xs text-brown-800/70 font-medium">{label}</p>
                                </div>
                            ))}
                        </div>

                        {puppy.status === "available" ? (
                            <div className="space-y-3">
                                {user ? (
                                    <>
                                        <Link
                                            href={`/checkout/deposit/${puppy.id}`}
                                            className="block w-full text-center py-3.5 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl transition-colors"
                                        >
                                            Start Adoption Process
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="flex items-center justify-center gap-2 w-full py-3.5 border border-cream-200 text-brown-800 font-semibold rounded-xl hover:bg-cream-100 transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Ask a Question
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block w-full text-center py-3.5 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl transition-colors"
                                    >
                                        Sign in to Adopt
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-cream-200 rounded-xl text-center text-brown-800/70">
                                <p className="font-medium">This puppy is no longer available.</p>
                                <Link href="/browse" className="text-sand-600 text-sm mt-1 block hover:underline">
                                    Browse other puppies
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
