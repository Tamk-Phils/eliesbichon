"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, PawPrint, CheckCircle, XCircle } from "lucide-react";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    fee: number;
    status: string;
    images: string[];
}

interface Toast { message: string; type: "success" | "error" }

export default function AdminPuppies() {
    const router = useRouter();
    const [puppies, setPuppies] = useState<Puppy[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPuppies = useCallback(async () => {
        const { data, error } = await supabase.from("puppies").select("*").order("created_at", { ascending: false });
        if (error) {
            showToast("Failed to load puppies: " + error.message, "error");
        } else {
            setPuppies((data as Puppy[]) ?? []);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchPuppies(); }, [fetchPuppies]);

    const deletePuppy = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        const { error } = await supabase.from("puppies").delete().eq("id", id);
        setDeletingId(null);
        if (error) {
            showToast(`Failed to delete ${name}: ${error.message}`, "error");
        } else {
            setPuppies((p) => p.filter((x) => x.id !== id));
            showToast(`${name} deleted successfully.`, "success");
        }
    };

    const statusColor = (s: string) =>
        s === "available" ? "bg-emerald-100 text-emerald-700" :
            s === "reserved" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";

    return (
        <div className="p-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border ${toast.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                    {toast.type === "success"
                        ? <CheckCircle className="w-4 h-4 shrink-0" />
                        : <XCircle className="w-4 h-4 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-3xl font-bold text-brown-900">Puppies</h1>
                    <p className="text-brown-800/50 text-sm mt-1">{puppies.length} total listings</p>
                </div>
                <Link
                    href="/admin/puppies/new"
                    className="flex items-center gap-2 px-4 py-2 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Puppy
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
            ) : puppies.length === 0 ? (
                <div className="text-center py-20 text-brown-800/40">
                    <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No puppies yet. Add your first listing!</p>
                    <Link href="/admin/puppies/new" className="inline-block mt-4 px-4 py-2 bg-sand-600 text-cream-50 rounded-xl text-sm font-semibold hover:bg-sand-700 transition-colors">
                        Add First Puppy
                    </Link>
                </div>
            ) : (
                <div className="bg-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-cream-200/50 border-b border-cream-200">
                            <tr>
                                {["Name", "Age", "Gender", "Fee", "Status", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-brown-800/60 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-200">
                            {puppies.map((p) => (
                                <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden shrink-0">
                                                {p.images?.[0]
                                                    ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                    : <img src="https://images.unsplash.com/photo-1555934716-071cf997c143?auto=format&fit=crop&w=100&q=70" alt="Bichon Frise" className="w-full h-full object-cover" />
                                                }
                                            </div>
                                            <span className="font-medium text-brown-900 text-sm">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-brown-800/70">{p.age}</td>
                                    <td className="px-4 py-3 text-sm text-brown-800/70 capitalize">{p.gender}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-brown-900">${p.fee?.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor(p.status)}`}>{p.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {/* Edit button — uses router.push for reliability */}
                                            <button
                                                onClick={() => router.push(`/admin/puppies/edit/${p.id}`)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cream-200 hover:bg-sand-500/20 text-brown-800 hover:text-sand-700 transition-colors"
                                                title="Edit puppy"
                                            >
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            {/* Delete button — shows spinner while deleting */}
                                            <button
                                                onClick={() => deletePuppy(p.id, p.name)}
                                                disabled={deletingId === p.id}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                                title="Delete puppy"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                {deletingId === p.id ? "Deleting…" : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
