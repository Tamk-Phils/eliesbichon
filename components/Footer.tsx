import Link from "next/link";
import { PawPrint, Heart, Phone, Mail, MapPin } from "lucide-react";

const footerSections = [
    {
        title: "Our Puppies",
        links: [
            { label: "Browse All Puppies", href: "/browse" },
            { label: "About Our Sanctuary", href: "/about" },
            { label: "Adoption Process", href: "/faq" },
            { label: "Contact Us", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Health Guarantee", href: "/health-guarantee" },
            { label: "Care & Training", href: "/care-and-training" },
            { label: "Shipping & Delivery", href: "/shipping" },
            { label: "FAQ", href: "/faq" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign In", href: "/login" },
            { label: "Create Account", href: "/register" },
            { label: "My Dashboard", href: "/dashboard" },
            { label: "My Chat", href: "/chat" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-brown-900 text-cream-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                            <PawPrint className="w-6 h-6 text-sand-500" />
                            <span className="font-display text-lg font-semibold text-cream-50">
                                Ellie&apos;s Bichon Frise
                            </span>
                        </div>
                        <p className="text-sm text-cream-200/70 mb-4 leading-relaxed text-center md:text-left">
                            Raising happy, healthy Bichon Frise puppies with love and dedication.
                            Your forever companion awaits.
                        </p>
                        <div className="space-y-2 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 text-sm text-cream-200/70">
                                <Mail className="w-4 h-4 text-sand-500 shrink-0" />
                                <span>adminsupport@eliesbichon.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-cream-200/70">
                                <Phone className="w-4 h-4 text-sand-500 shrink-0" />
                                <span>(213) 849-3395</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-cream-200/70">
                                <MapPin className="w-4 h-4 text-sand-500 shrink-0" />
                                <span>United States</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold text-cream-50 mb-4 text-sm uppercase tracking-wide text-center md:text-left">
                                {section.title}
                            </h4>
                            <ul className="space-y-2 text-center md:text-left">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-cream-200/70 hover:text-sand-400 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-cream-200/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-cream-200/50">
                        © {new Date().getFullYear()} Ellie&apos;s Bichon Frise Sanctuary. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-cream-200/50">
                        Made with <Heart className="w-4 h-4 text-sand-500 mx-1" /> for Bichon lovers
                    </div>
                </div>
            </div>
        </footer>
    );
}
