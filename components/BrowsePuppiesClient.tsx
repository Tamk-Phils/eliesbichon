"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import PuppyCard from "@/components/PuppyCard";
import { Search, SlidersHorizontal } from "lucide-react";

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

const statuses = ["all", "available", "reserved", "sold"];
const genders = ["all", "male", "female"];

export default function BrowsePuppiesClient() {
    const [puppies, setPuppies] = useState<Puppy[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");

    const fetchPuppies = useCallback(async () => {
        let query = supabase
            .from("puppies")
            .select("id, name, age, gender, fee, status, images, description")
            .order("created_at", { ascending: false });

        if (statusFilter !== "all") query = query.eq("status", statusFilter);
        if (genderFilter !== "all") query = query.eq("gender", genderFilter);

        const { data } = await query;
        setPuppies(data ?? []);
        setLoading(false);
    }, [statusFilter, genderFilter]);

    useEffect(() => {
        fetchPuppies();
        // Realtime subscription
        const channel = supabase
            .channel("puppies-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "puppies" },
                () => fetchPuppies()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPuppies]);

    const filtered = puppies.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Filters Bar */}
            <div className="sticky top-16 z-10 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 sm:gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[280px] sm:min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-800/40" />
                        <input
                            type="text"
                            placeholder="Search by name…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-cream-100 border border-cream-200 rounded-lg text-sm text-brown-800 placeholder:text-brown-800/40 focus:outline-none focus:border-sand-400 transition-colors"
                        />
                    </div>
                    {/* Status filter */}
                    <div className="flex items-center gap-1 bg-cream-100 border border-cream-200 rounded-lg p-1">
                        {statuses.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-1 rounded text-xs font-medium capitalize transition-colors ${statusFilter === s
                                    ? "bg-sand-600 text-cream-50 shadow-sm"
                                    : "text-brown-800/70 hover:text-brown-900"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    {/* Gender filter */}
                    <div className="flex items-center gap-1 bg-cream-100 border border-cream-200 rounded-lg p-1">
                        {genders.map((g) => (
                            <button
                                key={g}
                                onClick={() => setGenderFilter(g)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-1 rounded text-xs font-medium capitalize transition-colors ${genderFilter === g
                                    ? "bg-sand-600 text-cream-50 shadow-sm"
                                    : "text-brown-800/70 hover:text-brown-900"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton rounded-2xl h-72" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-brown-800/50">
                        <p className="text-4xl mb-3">🐾</p>
                        <p className="text-lg font-medium">No puppies found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-brown-800/50 mb-6">
                            Showing {filtered.length} puppy{filtered.length !== 1 ? "ies" : ""}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((puppy) => (
                                <PuppyCard key={puppy.id} puppy={puppy} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
