"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sand-500/15 mb-4">
                        <PawPrint className="w-7 h-7 text-sand-600" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-brown-900 mb-1">Reset Password</h1>
                    <p className="text-brown-800/60 text-sm">
                        We&apos;ll send a reset link to your email
                    </p>
                </div>

                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
                    {sent ? (
                        <div className="text-center py-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="font-semibold text-brown-900 mb-2">Check your inbox</h2>
                            <p className="text-sm text-brown-800/60 mb-4">
                                We sent a password reset link to <strong>{email}</strong>.
                                Check your inbox and spam folder.
                            </p>
                            <p className="text-xs text-brown-800/40">
                                Didn&apos;t receive it? Contact us at{" "}
                                <a href="mailto:adminsupport@eliesbichon.com" className="text-sand-600 hover:underline">
                                    adminsupport@eliesbichon.com
                                </a>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brown-800 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-800/30" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors"
                            >
                                {loading ? "Sending…" : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-brown-800/60 mt-4">
                    <Link href="/login" className="inline-flex items-center gap-1 text-sand-600 font-medium hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
