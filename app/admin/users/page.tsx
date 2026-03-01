"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Shield, ShieldOff } from "lucide-react";

interface AppUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from("users").select("*").order("created_at", { ascending: false }).then(({ data }) => {
            setUsers((data as AppUser[]) ?? []);
            setLoading(false);
        });
    }, []);

    const toggleRole = async (id: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        await supabase.from("users").update({ role: newRole }).eq("id", id);
        setUsers((u) => u.map((x) => (x.id === id ? { ...x, role: newRole } : x)));
    };

    const deleteUser = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to permanently delete user ${email}? This cannot be undone.`)) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/delete-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ userId: id }),
            });

            const result = await res.json();
            if (result.success) {
                setUsers((u) => u.filter((x) => x.id !== id));
                alert("User deleted successfully.");
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="font-display text-3xl font-bold text-brown-900 mb-6">Users</h1>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : (
                <div className="bg-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-cream-200/50 border-b border-cream-200">
                            <tr>
                                {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-brown-800/60 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-200">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-brown-900">{u.name || "—"}</td>
                                    <td className="px-4 py-3 text-sm text-brown-800/70">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${u.role === "admin" ? "bg-sand-500/20 text-sand-700" : "bg-cream-200 text-brown-800/70"
                                            }`}>{u.role}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-brown-800/50">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleRole(u.id, u.role)}
                                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-cream-200 hover:border-sand-400 text-brown-800/70 hover:text-sand-600 transition-colors">
                                                {u.role === "admin" ? <><ShieldOff className="w-3.5 h-3.5" /> Demote</> : <><Shield className="w-3.5 h-3.5" /> Promote</>}
                                            </button>
                                            <button onClick={() => deleteUser(u.id, u.email)}
                                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-red-100 hover:border-red-300 text-red-600 hover:bg-red-50 transition-all">
                                                Delete
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
