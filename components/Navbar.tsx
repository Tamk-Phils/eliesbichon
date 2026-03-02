"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, PawPrint, LogIn, LogOut, LayoutDashboard, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/supabase/context";

const resources = [
    { label: "Health Guarantee", href: "/health-guarantee" },
    { label: "Care & Training", href: "/care-and-training" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
];

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Puppies", href: "/browse" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, role, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setResourcesOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-cream-200"
                : "bg-cream-50"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110">
                            <img
                                src="/logo.png"
                                alt="Ellie's Sanctuary Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="font-display text-base sm:text-lg font-semibold text-brown-900 leading-tight">
                            Ellie&apos;s<br />
                            <span className="text-sand-600 text-[10px] sm:text-sm font-normal">Bichon Frise Sanctuary</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                    ? "text-sand-600 bg-cream-100"
                                    : "text-brown-800 hover:text-sand-600 hover:bg-cream-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Resources Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setResourcesOpen((o) => !o)}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 transition-colors"
                            >
                                Resources
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {resourcesOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-cream-50 border border-cream-200 rounded-xl shadow-lg py-1 animate-fade-in">
                                    {resources.map((r) => (
                                        <Link
                                            key={r.href}
                                            href={r.href}
                                            onClick={() => setResourcesOpen(false)}
                                            className="block px-4 py-2 text-sm text-brown-800 hover:text-sand-600 hover:bg-cream-100 transition-colors"
                                        >
                                            {r.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {role === "admin" && (
                                    <Link
                                        href="/admin"
                                        className="px-3 py-2 text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 rounded-lg transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 rounded-lg transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/chat"
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 rounded-lg transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Chat
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brown-800 hover:text-sand-600 hover:bg-cream-100 rounded-lg transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-semibold text-cream-50 bg-sand-600 hover:bg-sand-700 rounded-lg transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen((o) => !o)}
                        className="md:hidden p-2 rounded-lg text-brown-800 hover:bg-cream-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-cream-200 bg-cream-50 animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                    ? "text-sand-600 bg-cream-100"
                                    : "text-brown-800 hover:text-sand-600 hover:bg-cream-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-1 border-t border-cream-200">
                            <p className="px-3 py-1 text-xs font-semibold text-brown-800/50 uppercase tracking-wide">
                                Resources
                            </p>
                            {resources.map((r) => (
                                <Link
                                    key={r.href}
                                    href={r.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-sm text-brown-800 hover:text-sand-600 hover:bg-cream-100 transition-colors"
                                >
                                    {r.label}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-1 border-t border-cream-200">
                            {user ? (
                                <>
                                    {role === "admin" && (
                                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:bg-cream-100">Admin</Link>
                                    )}
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:bg-cream-100">Dashboard</Link>
                                    <Link href="/chat" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:bg-cream-100">Chat</Link>
                                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:bg-cream-100">Sign out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-800 hover:bg-cream-100">Sign in</Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)} className="block mx-3 mt-1 px-4 py-2 text-center text-sm font-semibold text-cream-50 bg-sand-600 rounded-lg">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
