import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    fee: number;
    status: string;
    images: string[];
    description?: string;
}

export default function PuppyCard({ puppy }: { puppy: Puppy }) {
    const imageUrl = puppy.images?.[0] ?? null;
    const statusColor =
        puppy.status === "available"
            ? "bg-emerald-100 text-emerald-700"
            : puppy.status === "reserved"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700";

    return (
        <Link href={`/puppies/${puppy.id}`} className="group block">
            <div className="bg-cream-100 rounded-2xl overflow-hidden border border-cream-200 hover:border-sand-400 hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-56 bg-cream-200 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={puppy.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1555934716-071cf997c143?auto=format&fit=crop&w=500&q=80"
                            alt="Bichon Frise puppy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    )}
                    <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor}`}
                    >
                        {puppy.status}
                    </span>
                </div>

                {/* Info */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-xl font-bold text-brown-900 group-hover:text-sand-600 transition-colors">
                            {puppy.name}
                        </h3>
                        <span className="text-lg font-bold text-sand-600">
                            ${puppy.fee?.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-brown-800/60 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {puppy.age}
                        </span>
                        <span className="capitalize">{puppy.gender}</span>
                    </div>

                    {puppy.description && (
                        <p className="text-sm text-brown-800/70 line-clamp-2 mb-3">
                            {puppy.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-brown-800/40">Bichon Frise</span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-sand-600 group-hover:gap-2 transition-all">
                            View Details <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
