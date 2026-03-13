import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error } = await supabase.storage
            .from("puppies")
            .upload(path, buffer, {
                contentType: file.type,
                cacheControl: "31536000",
                upsert: false,
            });

        if (error && error.message.includes("Bucket not found")) {
            // Attempt to create the bucket if missing
            const { error: createError } = await supabase.storage.createBucket("puppies", {
                public: true,
                allowedMimeTypes: ["image/*"],
                fileSizeLimit: 5242880, // 5MB
            });
            if (createError) {
                console.error("Failed to create bucket:", createError);
                return NextResponse.json({ error: "Storage bucket missing and could not be created. Please create a 'puppies' bucket in your Supabase dashboard." }, { status: 500 });
            }
            
            // Retry upload
            const { data: retryData, error: retryError } = await supabase.storage
                .from("puppies")
                .upload(path, buffer, {
                    contentType: file.type,
                    cacheControl: "31536000",
                    upsert: false,
                });
            
            if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 });
            
            const { data: { publicUrl } } = supabase.storage.from("puppies").getPublicUrl(retryData.path);
            return NextResponse.json({ url: publicUrl });
        }

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from("puppies")
            .getPublicUrl(data.path);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
