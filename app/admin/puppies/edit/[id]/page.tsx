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
    const [previewImages, setPreviewImages] = useState<{ url: string; file?: File; uploadedUrl?: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        supabase.from("puppies").select("*").eq("id", id).single().then(({ data }) => {
            if (data) {
                setForm({ name: data.name, age: data.age, gender: data.gender, fee: String(data.fee), status: data.status, description: data.description ?? "" });
                setPreviewImages((data.images ?? []).map((url: string) => ({ url, uploadedUrl: url })));
            }
        });
    }, [id]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newPreviews = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const uploadFiles = async () => {
        setUploading(true);
        const uploadedUrls: string[] = [];
        const updatedPreviews = [...previewImages];

        for (let i = 0; i < updatedPreviews.length; i++) {
            if (updatedPreviews[i].uploadedUrl) {
                uploadedUrls.push(updatedPreviews[i].uploadedUrl!);
                continue;
            }

            if (!updatedPreviews[i].file) continue;

            const formData = new FormData();
            formData.append("file", updatedPreviews[i].file!);
            try {
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    const { url } = await res.json();
                    updatedPreviews[i].uploadedUrl = url;
                    uploadedUrls.push(url);
                } else {
                    const data = await res.json();
                    throw new Error(data.error || "Upload failed");
                }
            } catch (err: any) {
                setError(`Failed to upload ${updatedPreviews[i].file?.name}: ${err.message}`);
                setUploading(false);
                return null;
            }
        }
        setUploading(false);
        return uploadedUrls;
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => {
            const next = [...prev];
            if (next[index].file) {
                URL.revokeObjectURL(next[index].url);
            }
            next.splice(index, 1);
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const images = await uploadFiles();
        if (!images) return;

        const { error: err } = await supabase.from("puppies").update({ 
            ...form, 
            fee: parseFloat(form.fee), 
            images 
        }).eq("id", id);
        
        if (err) { 
            setError(err.message); 
            setSaving(false); 
        } else {
            router.push("/admin/puppies");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/puppies" className="inline-flex items-center gap-1 text-sm text-brown-800/60 hover:text-sand-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-6">Edit Puppy</h1>
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
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cream-200 rounded-xl hover:border-sand-400 transition-colors mb-4">
                        <Upload className="w-6 h-6 text-brown-800/40 mb-2" />
                        <span className="text-sm text-brown-800/50">{uploading ? "Uploading…" : "Click to select more photos"}</span>
                        <input type="file" className="sr-only" multiple accept="image/*" onChange={handleImageSelect} disabled={uploading || saving} />
                    </label>
                    {previewImages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {previewImages.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-cream-200">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(i)}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-brown-900/70 rounded-full flex items-center justify-center hover:bg-brown-900 transition-colors">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={saving || uploading}
                    className="w-full py-3 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors shadow-sm active:scale-[0.98]">
                    {saving ? "Saving…" : uploading ? "Uploading Photos…" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
