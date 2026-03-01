"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, KeyRound, CheckCircle } from "lucide-react";

function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(true);
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        async function handleRecovery() {
            setChecking(true);
            const hash = window.location.hash;
            const code = searchParams.get("code");

            try {
                // 1. Handle PKCE flow (?code=...)
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    setSessionReady(true);
                }
                // 2. Handle Implicit flow (#access_token=...)
                else if (hash.includes("access_token")) {
                    const params = new URLSearchParams(hash.substring(1));
                    const access_token = params.get("access_token");
                    const refresh_token = params.get("refresh_token");
                    if (access_token && refresh_token) {
                        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                        if (error) throw error;
                        setSessionReady(true);
                    }
                }
                // 3. Fallback: check if we already have a session from onAuthStateChange
                else {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) setSessionReady(true);
                }
            } catch (err: any) {
                console.error("Auth recovery error:", err);
                setError("Your password reset link is invalid or has expired.");
            } finally {
                setChecking(false);
            }
        }
        handleRecovery();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Double check session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError("Auth session missing! Please request a new link.");
            return;
        }

        if (password !== confirm) { setError("Passwords do not match."); return; }
        if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

        setLoading(true);
        setError("");

        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            setDone(true);
            setTimeout(() => router.push("/login"), 3000);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="skeleton w-12 h-12 rounded-full mx-auto mb-4" />
                    <p className="text-brown-800/40 text-sm">Verifying your reset link…</p>
                </div>
            </div>
        );
    }

    if (!sessionReady && !done) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-cream-100 border border-cream-200 rounded-2xl p-8 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                        <KeyRound className="w-7 h-7 text-red-600" />
                    </div>
                    <h2 className="font-semibold text-brown-900 mb-2">Invalid Reset Link</h2>
                    <p className="text-sm text-brown-800/60 mb-6">
                        The reset link is missing, invalid, or has expired. Please request a new password reset email.
                    </p>
                    <Link href="/forgot-password"
                        className="inline-block px-6 py-2.5 bg-sand-600 text-cream-50 rounded-xl font-medium hover:bg-sand-700 transition-colors">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sand-500/15 mb-4">
                        <PawPrint className="w-7 h-7 text-sand-600" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-brown-900 mb-1">New Password</h1>
                    <p className="text-brown-800/60 text-sm">Choose a strong password for your account</p>
                </div>

                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
                    {done ? (
                        <div className="text-center py-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="font-semibold text-brown-900 mb-2">Password updated!</h2>
                            <p className="text-sm text-brown-800/60">Redirecting you to sign in…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brown-800 mb-1.5">New Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-800/30" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brown-800 mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-800/30" />
                                    <input
                                        type="password"
                                        required
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors"
                            >
                                {loading ? "Updating…" : "Set New Password"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-brown-800/60 mt-4">
                    <Link href="/login" className="text-sand-600 font-medium hover:underline">Back to Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetForm />
        </Suspense>
    );
}
