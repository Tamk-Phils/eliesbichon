"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/context";
import { supabase } from "@/lib/supabase/client";
import {
    LayoutDashboard, PawPrint, ClipboardList, MessageCircle, Users, LogOut, Home, Menu, X,
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/puppies", label: "Puppies", icon: PawPrint },
    { href: "/admin/requests", label: "Requests", icon: ClipboardList },
    { href: "/admin/chat", label: "Chat", icon: MessageCircle },
    { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || role !== "admin")) {
            router.replace("/login");
        }
    }, [user, role, loading, router]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Guarantee admin's row exists in public.users
    useEffect(() => {
        if (user && role === "admin") {
            supabase
                .from("users")
                .upsert(
                    { id: user.id, email: user.email ?? "", role: "admin" },
                    { onConflict: "id" }
                )
                .then(() => { /* best effort */ });
        }
    }, [user, role]);

    if (loading || !user || role !== "admin") {
        return <div className="min-h-screen bg-brown-900 flex items-center justify-center"><div className="skeleton w-24 h-8 rounded-lg opacity-30" /></div>;
    }

    const NavContent = () => (
        <>
            <div className="px-4 py-5 border-b border-cream-200/10">
                <span className="font-display text-cream-50 font-bold text-sm leading-tight block">
                    Ellie&apos;s Sanctuary
                </span>
                <span className="text-cream-200/40 text-xs text-balance">Admin Panel</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-sand-600 text-cream-50" : "text-cream-200/70 hover:bg-cream-200/10 hover:text-cream-50"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
            <div className="px-2 pb-4 space-y-1 border-t border-cream-200/10 pt-3">
                <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cream-200/60 hover:text-cream-50 hover:bg-cream-200/10 transition-colors">
                    <Home className="w-4 h-4" /> View Site
                </Link>
                <button onClick={signOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cream-200/60 hover:text-cream-50 hover:bg-cream-200/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-cream-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden bg-brown-900 text-cream-50 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <span className="font-display font-bold text-sm">Ellie&apos;s Admin</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 -mr-2 text-cream-200/70 hover:text-white transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-brown-950/60 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                w-64 shrink-0 bg-brown-900 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:static lg:h-screen
            `}>
                <NavContent />
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
