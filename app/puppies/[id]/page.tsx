import type { Metadata, ResolvingMetadata } from "next";
import PuppyDetailsClient from "@/components/PuppyDetailsClient";
import { supabase } from "@/lib/supabase/client";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id;

    const { data: puppy } = await supabase
        .from("puppies")
        .select("name, description")
        .eq("id", id)
        .single();

    if (!puppy) {
        return {
            title: "Puppy Not Found",
        };
    }

    return {
        title: `${puppy.name} | Bichon Frise Puppy`,
        description: puppy.description || `Meet ${puppy.name}, a beautiful Bichon Frise puppy looking for a loving home at Ellie's Sanctuary.`,
    };
}

export default function PuppyDetailsPage() {
    return <PuppyDetailsClient />;
}
