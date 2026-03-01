"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

export default function NewPuppyPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "", age: "", gender: "female", fee: "", status: "available", description: "",
    });
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploading(true);
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (res.ok) {
                const { url } = await res.json();
                setImages((prev) => [...prev, url]);
            }
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const { error: err } = await supabase.from("puppies").insert({
            ...form,
            fee: parseFloat(form.fee),
            images,
        });
        if (err) {
            setError(err.message);
            setSaving(false);
        } else {
            router.push("/admin/puppies");
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <Link href="/admin/puppies" className="inline-flex items-center gap-1 text-sm text-brown-800/60 hover:text-sand-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="font-display text-3xl font-bold text-brown-900 mb-6">Add New Puppy</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { field: "name", label: "Name", type: "text" },
                            { field: "age", label: "Age (e.g. 8 weeks)", type: "text" },
                            { field: "fee", label: "Adoption Fee ($)", type: "number" },
                        ].map(({ field, label, type }) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-brown-800 mb-1">{label}</label>
                                <input type={type} required value={form[field as keyof typeof form]}
                                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1">Gender</label>
                            <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-800 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors">
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brown-800 mb-1">Description</label>
                        <textarea rows={4} value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Describe the puppy's personality and traits…"
                            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 placeholder:text-brown-800/30 focus:outline-none focus:border-sand-400 transition-colors resize-none" />
                    </div>
                </div>

                {/* Image upload */}
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5">
                    <h2 className="font-semibold text-brown-900 mb-3">Photos</h2>
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cream-200 rounded-xl hover:border-sand-400 transition-colors">
                        <Upload className="w-6 h-6 text-brown-800/40 mb-2" />
                        <span className="text-sm text-brown-800/50">{uploading ? "Uploading…" : "Click to upload photos"}</span>
                        <input type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {images.map((url, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-brown-900/70 rounded-full flex items-center justify-center">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={saving}
                    className="w-full py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors">
                    {saving ? "Saving…" : "Add Puppy"}
                </button>
            </form>
        </div>
    );
}
