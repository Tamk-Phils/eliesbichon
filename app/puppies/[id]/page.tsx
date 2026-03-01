import type { Metadata } from "next";
import PuppyDetailsClient from "@/components/PuppyDetailsClient";

export const metadata: Metadata = {
    title: "Puppy Details",
    description: "Learn more about this Bichon Frise puppy and start your adoption journey.",
};

export default function PuppyDetailsPage() {
    return <PuppyDetailsClient />;
}
