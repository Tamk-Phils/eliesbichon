import type { Metadata } from "next";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Health Guarantee",
    description: "Ellie's Bichon Frise Sanctuary's comprehensive health guarantee policy.",
};

const includes = [
    "Congenital and hereditary conditions (2-year coverage)",
    "Viral diseases present at time of sale",
    "First vet exam within 72 hours of pickup",
    "Age-appropriate vaccinations",
    "Microchipping and AKC registration",
];

export default function HealthGuaranteePage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <section className="bg-cream-100 border-b border-cream-200 py-20 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="w-16 h-16 rounded-2xl bg-sand-500/15 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-sand-600" />
                    </div>
                    <h1 className="font-display text-5xl font-bold text-brown-900 mb-4">Health Guarantee</h1>
                    <p className="text-brown-800/60 text-lg">
                        We stand behind the health of every puppy we raise. Your peace of mind is our promise.
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 mb-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-cream-200 shadow-xl">
                    <img
                        src="/images/health-guarantee.png"
                        alt="Healthy Bichon Frise Puppy with Certificate"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6">
                    <h2 className="font-display text-2xl font-bold text-brown-900 mb-4">What&apos;s Covered</h2>
                    <ul className="space-y-3">
                        {includes.map((item) => (
                            <li key={item} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-brown-800/80 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-brown-900 mb-2">Guarantee Requirements</h3>
                            <ul className="text-sm text-brown-800/70 space-y-1.5 list-disc list-inside">
                                <li>Puppy must be seen by a licensed vet within 72 hours of arrival</li>
                                <li>Proof of vet records must be provided for any claim</li>
                                <li>Does not cover illness caused by environment, parasites, or accidents</li>
                                <li>Dietary changes from our recommended food must be gradual</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="font-display text-2xl font-bold text-brown-900 mb-4">Our Commitment</h2>
                    <div className="text-brown-800/70 space-y-4 leading-relaxed">
                        <p>
                            Each puppy undergoes a thorough veterinary examination before joining your family.
                            We work exclusively with USDA-licensed veterinarians and follow all recommended
                            health protocols for Bichon Frise puppies.
                        </p>
                        <p>
                            In the unlikely event that your puppy is diagnosed with a covered hereditary condition
                            within the guarantee period, we will work with you to either provide a replacement
                            puppy of equal value or offer a partial refund — your choice.
                        </p>
                        <p>
                            We are committed to your puppy&apos;s wellbeing long after they leave our care.
                            We&apos;re always just a message away.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
