"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, ClipboardList, Users, MessageCircle } from "lucide-react";

interface Stats {
    puppies: number;
    requests: number;
    pending: number;
    users: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ puppies: 0, requests: 0, pending: 0, users: 0 });

    useEffect(() => {
        async function loadStats() {
            const [{ count: puppies }, { count: requests }, { count: pending }, { count: users }] =
                await Promise.all([
                    supabase.from("puppies").select("*", { count: "exact", head: true }),
                    supabase.from("adoption_requests").select("*", { count: "exact", head: true }),
                    supabase.from("adoption_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
                    supabase.from("users").select("*", { count: "exact", head: true }),
                ]);
            setStats({
                puppies: puppies ?? 0,
                requests: requests ?? 0,
                pending: pending ?? 0,
                users: users ?? 0,
            });
        }
        loadStats();
    }, []);

    const cards = [
        { icon: PawPrint, label: "Total Puppies", value: stats.puppies, color: "bg-sand-500/15 text-sand-600" },
        { icon: ClipboardList, label: "Total Requests", value: stats.requests, color: "bg-blue-100 text-blue-600" },
        { icon: ClipboardList, label: "Pending Reviews", value: stats.pending, color: "bg-amber-100 text-amber-600" },
        { icon: Users, label: "Registered Users", value: stats.users, color: "bg-emerald-100 text-emerald-600" },
    ];

    return (
        <div className="p-8">
            <h1 className="font-display text-3xl font-bold text-brown-900 mb-2">Overview</h1>
            <p className="text-brown-800/50 mb-8">Welcome to the sanctuary admin panel.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {cards.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-cream-100 border border-cream-200 rounded-2xl p-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="font-display text-3xl font-bold text-brown-900">{value}</p>
                        <p className="text-sm text-brown-800/60 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5">
                <h2 className="font-semibold text-brown-900 mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                    {[
                        { href: "/admin/puppies/new", label: "Add New Puppy", icon: PawPrint },
                        { href: "/admin/requests", label: "Review Requests", icon: ClipboardList },
                        { href: "/admin/chat", label: "View Messages", icon: MessageCircle },
                    ].map(({ href, label, icon: Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className="flex items-center gap-3 p-3 rounded-xl border border-cream-200 hover:border-sand-400 hover:bg-sand-500/5 transition-colors"
                        >
                            <Icon className="w-4 h-4 text-sand-600" />
                            <span className="text-sm font-medium text-brown-800">{label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
