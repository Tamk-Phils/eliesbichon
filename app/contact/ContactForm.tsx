"use client";

import { useState } from "react";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";

const contactInfo = [
    { icon: Mail, label: "Email", value: "adminsupport@eliesbichon.com" },
    { icon: Phone, label: "Phone", value: "(213) 849-3395" },
];

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setError("");
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to send");
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch {
            setStatus("error");
            setError("Something went wrong. Please try again or email us directly.");
        }
    };

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-8 md:gap-10">
            {/* Contact info */}
            <div>
                <h2 className="font-display text-2xl font-bold text-brown-900 mb-6">Contact Information</h2>
                <div className="space-y-4 mb-8">
                    {contactInfo.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 p-4 bg-cream-100 border border-cream-200 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-sand-500/15 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-sand-600" />
                            </div>
                            <div>
                                <p className="text-xs text-brown-800/50 font-medium">{label}</p>
                                <p className="text-brown-900 font-medium">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl overflow-hidden h-48 bg-cream-200">
                    <img
                        src="https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=600&q=80"
                        alt="Bichon Frise puppy looking up at camera"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Form */}
            <div>
                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="font-display text-2xl font-bold text-brown-900 mb-2">Message Sent!</h3>
                        <p className="text-brown-800/60">We&apos;ll get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { field: "name", label: "Your Name", type: "text" },
                                { field: "email", label: "Email Address", type: "email" },
                            ].map(({ field, label, type }) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-brown-800 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        required
                                        value={form[field as keyof typeof form]}
                                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-cream-100 border border-cream-200 rounded-xl text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1">Subject</label>
                            <input
                                type="text"
                                required
                                value={form.subject}
                                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-cream-100 border border-cream-200 rounded-xl text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1">Message</label>
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-cream-100 border border-cream-200 rounded-xl text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors resize-none"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            {status === "loading" ? "Sending…" : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
