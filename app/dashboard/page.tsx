"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import Link from "next/link";
import { ClipboardList, Bell, PawPrint, CheckCircle, XCircle, Clock } from "lucide-react";

interface AdoptionRequest {
    id: string;
    status: string;
    created_at: string;
    puppy: { name: string; images: string[] };
}

interface Notification {
    id: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [tab, setTab] = useState<"requests" | "notifications">("requests");

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            const [{ data: reqs }, { data: notifs }] = await Promise.all([
                supabase
                    .from("adoption_requests")
                    .select("id, status, created_at, puppy:puppies(name, images)")
                    .eq("user_id", user!.id)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("notifications")
                    .select("id, message, read, created_at")
                    .eq("user_id", user!.id)
                    .order("created_at", { ascending: false })
                    .limit(20),
            ]);
            setRequests((reqs as unknown as AdoptionRequest[]) ?? []);
            setNotifications((notifs as Notification[]) ?? []);
        }
        fetchData();
    }, [user]);

    const markRead = async (id: string) => {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
        setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
    };

    const statusIcon = (s: string) =>
        s === "approved" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
            s === "rejected" ? <XCircle className="w-4 h-4 text-red-500" /> :
                <Clock className="w-4 h-4 text-amber-500" />;

    if (loading) return <div className="min-h-screen bg-cream-50 flex items-center justify-center"><div className="skeleton w-32 h-8 rounded-lg" /></div>;

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="font-display text-4xl font-bold text-brown-900 mb-2">My Dashboard</h1>
                <p className="text-brown-800/60 mb-8">Track your adoption requests and notifications.</p>

                {/* Tabs */}
                <div className="flex gap-1 bg-cream-100 border border-cream-200 rounded-xl p-1 w-fit mb-8">
                    {(["requests", "notifications"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-sand-600 text-cream-50 shadow-sm" : "text-brown-800/70 hover:text-brown-900"
                                }`}
                        >
                            {t === "requests" ? <ClipboardList className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                            {t}
                            {t === "notifications" && notifications.filter((n) => !n.read).length > 0 && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {notifications.filter((n) => !n.read).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {tab === "requests" ? (
                    requests.length === 0 ? (
                        <div className="text-center py-16 text-brown-800/50">
                            <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-medium">No adoption requests yet</p>
                            <Link href="/browse" className="text-sand-600 hover:underline text-sm mt-2 block">Browse available puppies</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-cream-100 border border-cream-200 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-cream-200 overflow-hidden shrink-0">
                                        {req.puppy?.images?.[0] ? (
                                            <img src={req.puppy.images[0]} alt={req.puppy.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-brown-900">{req.puppy?.name}</h3>
                                        <p className="text-xs text-brown-800/50 mt-0.5">{new Date(req.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {statusIcon(req.status)}
                                        <span className="text-sm font-medium capitalize text-brown-800">{req.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    notifications.length === 0 ? (
                        <div className="text-center py-16 text-brown-800/50">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-medium">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && markRead(n.id)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? "bg-cream-100 border-cream-200 opacity-70" : "bg-sand-500/5 border-sand-400/30 hover:bg-sand-500/10"
                                        }`}
                                >
                                    <p className="text-sm text-brown-800">{n.message}</p>
                                    <p className="text-xs text-brown-800/40 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
