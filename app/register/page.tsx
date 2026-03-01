"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) {
            setError(err.message);
            setLoading(false);
            return;
        }
        if (data.user) {
            // Create user profile row
            await supabase.from("users").insert({
                id: data.user.id,
                email,
                name,
                role: "user",
            });
        }
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sand-500/15 mb-4">
                        <PawPrint className="w-7 h-7 text-sand-600" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-brown-900 mb-1">Create Account</h1>
                    <p className="text-brown-800/60 text-sm">Join Ellie&apos;s Sanctuary to start your adoption journey</p>
                </div>

                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Smith"
                                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-brown-800/60 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-sand-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
