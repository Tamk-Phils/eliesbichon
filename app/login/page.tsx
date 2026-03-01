"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            // Role is stored in user_metadata (JWT) — no DB call needed
            const role = data.user?.user_metadata?.role;
            if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sand-500/15 mb-4">
                        <PawPrint className="w-7 h-7 text-sand-600" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-brown-900 mb-1">Welcome Back</h1>
                    <p className="text-brown-800/60 text-sm">Sign in to your Ellie&apos;s Sanctuary account</p>
                </div>

                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-brown-800">Password</label>
                                <Link href="/forgot-password" className="text-xs text-sand-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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
                            <LogIn className="w-4 h-4" />
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-brown-800/60 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-sand-600 font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
