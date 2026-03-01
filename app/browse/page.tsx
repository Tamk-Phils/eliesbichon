import type { Metadata } from "next";
import BrowsePuppiesClient from "@/components/BrowsePuppiesClient";

export const metadata: Metadata = {
    title: "Browse Puppies",
    description: "Browse all available Bichon Frise puppies at Ellie's Sanctuary. Filter by availability and find your perfect companion.",
};

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-2">
                    Our Available Puppies
                </h1>
                <p className="text-brown-800/60 mb-6">
                    All of our Bichon Frise puppies are raised with love and come health-guaranteed.
                </p>
            </div>
            <BrowsePuppiesClient />
        </div>
    );
}
