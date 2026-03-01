"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

interface Form {
    name: string; age: string; gender: string; fee: string; status: string; description: string;
}

export default function EditPuppyPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [form, setForm] = useState<Form>({ name: "", age: "", gender: "female", fee: "", status: "available", description: "" });
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        supabase.from("puppies").select("*").eq("id", id).single().then(({ data }) => {
            if (data) {
                setForm({ name: data.name, age: data.age, gender: data.gender, fee: String(data.fee), status: data.status, description: data.description ?? "" });
                setImages(data.images ?? []);
            }
        });
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploading(true);
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (res.ok) { const { url } = await res.json(); setImages((prev) => [...prev, url]); }
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error: err } = await supabase.from("puppies").update({ ...form, fee: parseFloat(form.fee), images }).eq("id", id);
        if (err) { setError(err.message); setSaving(false); }
        else router.push("/admin/puppies");
    };

    return (
        <div className="p-8 max-w-2xl">
            <Link href="/admin/puppies" className="inline-flex items-center gap-1 text-sm text-brown-800/60 hover:text-sand-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="font-display text-3xl font-bold text-brown-900 mb-6">Edit Puppy</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[{ field: "name", label: "Name", type: "text" }, { field: "age", label: "Age", type: "text" }, { field: "fee", label: "Fee ($)", type: "number" }].map(({ field, label, type }) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-brown-800 mb-1">{label}</label>
                                <input type={type} required value={form[field as keyof Form]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors" />
                            </div>
                        ))}
                        {[{ field: "gender", label: "Gender", opts: ["female", "male"] }, { field: "status", label: "Status", opts: ["available", "reserved", "sold"] }].map(({ field, label, opts }) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-brown-800 mb-1">{label}</label>
                                <select value={form[field as keyof Form]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors">
                                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brown-800 mb-1">Description</label>
                        <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors resize-none" />
                    </div>
                </div>
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5">
                    <h2 className="font-semibold text-brown-900 mb-3">Photos</h2>
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
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
                    <label className="cursor-pointer flex items-center gap-2 text-sm text-sand-600 hover:text-sand-700">
                        <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload more photos"}
                        <input type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={saving}
                    className="w-full py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors">
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
