import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://eliesbichon.com";

    // Static routes
    const routes = [
        "",
        "/about",
        "/browse",
        "/contact",
        "/faq",
        "/shipping",
        "/health-guarantee",
        "/care-and-training",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic puppy routes
    try {
        const { data: puppies } = await supabase
            .from("puppies")
            .select("id, updated_at")
            .eq("status", "available");

        const puppyRoutes = (puppies || []).map((puppy) => ({
            url: `${baseUrl}/puppies/${puppy.id}`,
            lastModified: puppy.updated_at || new Date().toISOString(),
            changeFrequency: "daily" as const,
            priority: 0.7,
        }));

        return [...routes, ...puppyRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
