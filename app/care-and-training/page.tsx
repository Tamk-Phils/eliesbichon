import type { Metadata } from "next";
import { Scissors, Apple, BookOpen, Activity } from "lucide-react";

export const metadata: Metadata = {
    title: "Care & Training",
    description: "Everything you need to know about grooming, nutrition, and training your Bichon Frise.",
};

const sections = [
    {
        icon: Scissors,
        title: "Grooming",
        content: [
            "Bichon Frises have a double-layered coat that requires regular maintenance. Plan for professional grooming every 6–8 weeks.",
            "Brush your Bichon at least 3 times per week to prevent matting using a slicker brush and metal comb.",
            "Bathe monthly with a gentle, hypoallergenic dog shampoo. Clean ears weekly and trim nails every 2–3 weeks.",
        ],
    },
    {
        icon: Apple,
        title: "Nutrition",
        content: [
            "We recommend a high-quality small-breed dry kibble as the foundation of diet. Avoid grains if your puppy shows any sensitivity.",
            "Puppies 8–12 weeks: 3–4 small meals per day. 3–6 months: 3 meals. 6+ months: 2 meals per day.",
            "Always provide fresh water. Avoid table scraps and human foods like grapes, onions, chocolate, and xylitol.",
        ],
    },
    {
        icon: BookOpen,
        title: "Training",
        content: [
            "Bichons are intelligent and eager to please — they respond beautifully to positive reinforcement. Never use harsh corrections.",
            "Start crate training immediately; it helps with housebreaking and gives your puppy a safe space.",
            "Enroll in puppy classes by 12–14 weeks for socialization. Bichons excel in agility, obedience, and therapy dog roles.",
        ],
    },
    {
        icon: Activity,
        title: "Exercise & Health",
        content: [
            "Bichons need moderate daily exercise — a 20–30 minute walk plus indoor playtime is ideal.",
            "Schedule annual vet visits, dental cleanings, and keep vaccinations current.",
            "Watch for breed-specific concerns: allergies, bladder stones, and patellar luxation. Early detection is key.",
        ],
    },
];

export default function CareAndTrainingPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <section className="bg-cream-100 border-b border-cream-200 py-20 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="font-display text-5xl font-bold text-brown-900 mb-4">Care & Training</h1>
                    <p className="text-brown-800/60 text-lg">
                        A guide to keeping your Bichon Frise happy, healthy, and well-behaved.
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 mb-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-cream-200 shadow-xl">
                    <img
                        src="/images/care-and-training.png"
                        alt="Bichon Frise puppy being groomed"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
                {sections.map(({ icon: Icon, title, content }) => (
                    <div key={title} className="bg-cream-100 border border-cream-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-sand-500/15 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-sand-600" />
                            </div>
                            <h2 className="font-display text-2xl font-bold text-brown-900">{title}</h2>
                        </div>
                        <ul className="space-y-3">
                            {content.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-brown-800/70 leading-relaxed">
                                    <span className="w-5 h-5 rounded-full bg-sand-500/20 text-sand-600 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    );
}
