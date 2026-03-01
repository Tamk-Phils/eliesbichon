import type { Metadata } from "next";
import { Truck, Plane, CheckCircle, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping & Delivery",
    description: "Information about how we safely transport your Bichon Frise puppy to your home.",
};

const options = [
    {
        icon: Truck,
        title: "Ground Transport",
        desc: "A dedicated pet nanny drives your puppy directly to your door. Available within a ~500 mile radius of our location. The safest, most comfortable option.",
        price: "From $300",
    },
    {
        icon: Plane,
        title: "Flight Nanny",
        desc: "A professional pet escort accompanies your puppy in-cabin on a flight. Much safer than cargo shipping. Available anywhere in the continental US.",
        price: "From $500",
    },
    {
        icon: MapPin,
        title: "Local Pickup",
        desc: "Pick up your puppy in person from our home. We encourage this — it gives you a chance to meet the parents and see our environment.",
        price: "Free",
    },
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <section className="bg-cream-100 border-b border-cream-200 py-20 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-900 mb-4">Shipping & Delivery</h1>
                    <p className="text-brown-800/60 text-lg">
                        We never ship puppies in cargo. Every puppy travels with a dedicated escort.
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 mb-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-cream-200 shadow-xl">
                    <img
                        src="/images/shipping.png"
                        alt="Bichon Frise puppy in a safe travel carrier"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    {options.map(({ icon: Icon, title, desc, price }) => (
                        <div key={title} className="bg-cream-100 border border-cream-200 rounded-2xl p-6">
                            <div className="w-11 h-11 rounded-xl bg-sand-500/15 flex items-center justify-center mb-4">
                                <Icon className="w-5 h-5 text-sand-600" />
                            </div>
                            <h2 className="font-display text-xl font-bold text-brown-900 mb-2">{title}</h2>
                            <p className="text-sm text-brown-800/70 leading-relaxed mb-4">{desc}</p>
                            <span className="text-sand-600 font-semibold text-sm">{price}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6">
                    <h2 className="font-display text-2xl font-bold text-brown-900 mb-4">What to Expect</h2>
                    <ul className="space-y-3">
                        {[
                            "You receive a health certificate and vaccination records before travel.",
                            "Puppies travel in airline-approved carriers with familiar bedding and a blanket with mom's scent.",
                            "You'll receive real-time GPS tracking updates during ground transport.",
                            "Flight nanny will text or call with updates at each airport.",
                            "We book direct flights where possible to minimize travel time.",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-brown-800/70">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
