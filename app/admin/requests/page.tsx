"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Clock, ChevronDown, Loader2 } from "lucide-react";

interface Toast { message: string; type: "success" | "error" }

interface Request {
    id: string;
    status: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    payment_method: string;
    notes: string;
    user_id: string;
    puppy: { name: string; images: string[] };
}

export default function AdminRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        async function fetch() {
            let q = supabase.from("adoption_requests")
                .select("*, puppy:puppies(name, images)")
                .order("created_at", { ascending: false });
            if (filter !== "all") q = q.eq("status", filter);
            const { data } = await q;
            setRequests((data as Request[]) ?? []);
            setLoading(false);
        }
        fetch();
    }, [filter]);

    const updateStatus = useCallback(async (id: string, status: string, userId: string, puppyName: string) => {
        setProcessingId(id);
        const { error } = await supabase.from("adoption_requests").update({ status }).eq("id", id);
        if (error) {
            showToast(`Failed to update: ${error.message}`, "error");
            setProcessingId(null);
            return;
        }
        // Update local state immediately
        setRequests((reqs) => reqs.map((r) => r.id === id ? { ...r, status } : r));
        showToast(
            status === "approved" ? `✓ ${puppyName} adoption approved!` : `✕ ${puppyName} adoption declined`,
            status === "approved" ? "success" : "error"
        );
        // Best-effort: notify user in DB and push
        const msg = status === "approved"
            ? `🎉 Great news! Your adoption request for ${puppyName} has been approved.`
            : `Your adoption request for ${puppyName} has been declined. Please contact us for more details.`;
        await supabase.from("notifications").insert({ user_id: userId, message: msg, read: false });
        await fetch("/api/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, message: msg }),
        }).catch(() => {/* ignore push failures */ });
        setProcessingId(null);
    }, []);

    const statusIcon = (s: string) =>
        s === "approved" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
            s === "rejected" ? <XCircle className="w-4 h-4 text-red-500" /> :
                <Clock className="w-4 h-4 text-amber-500" />;

    return (
        <div className="p-8">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                    {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                    {toast.message}
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-3xl font-bold text-brown-900">Adoption Requests</h1>
                <div className="flex gap-1 bg-cream-100 border border-cream-200 rounded-xl p-1">
                    {["all", "pending", "approved", "rejected"].map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? "bg-sand-600 text-cream-50 shadow-sm" : "text-brown-800/70 hover:text-brown-900"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20 text-brown-800/40"><p>No requests found.</p></div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => (
                        <details key={req.id} className="group bg-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
                            <summary className="flex items-center gap-4 p-4 cursor-pointer list-none">
                                <div className="w-12 h-12 rounded-xl bg-cream-200 overflow-hidden shrink-0">
                                    {req.puppy?.images?.[0] ? <img src={req.puppy.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-xl">🐾</span>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-brown-900 text-sm">{req.first_name} {req.last_name} → {req.puppy?.name}</p>
                                    <p className="text-xs text-brown-800/50">{req.email} · {new Date(req.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {statusIcon(req.status)}
                                    <span className="text-sm capitalize text-brown-800 font-medium">{req.status}</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-brown-800/40 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-4 pb-4 border-t border-cream-200 pt-4 space-y-3">
                                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                    {[
                                        { label: "Phone", value: req.phone },
                                        { label: "Address", value: `${req.address}, ${req.city}, ${req.state} ${req.zip}` },
                                        { label: "Payment Method", value: req.payment_method?.replace("_", " ") },
                                        { label: "Notes", value: req.notes || "—" },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-xs text-brown-800/50 font-medium mb-0.5">{label}</p>
                                            <p className="text-brown-800 capitalize">{value}</p>
                                        </div>
                                    ))}
                                </div>
                                {req.status === "pending" && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => updateStatus(req.id, "approved", req.user_id, req.puppy?.name)}
                                            disabled={processingId === req.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors"
                                        >
                                            {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "✓"} Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, "rejected", req.user_id, req.puppy?.name)}
                                            disabled={processingId === req.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors"
                                        >
                                            {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "✕"} Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
}
