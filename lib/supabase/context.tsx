"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: "user" | "admin" | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: null,
    loading: true,
    signOut: async () => { },
});

/**
 * Extract role from user_metadata (stored in JWT — no DB query needed).
 * Falls back to "user" if not set. Also tries the users table as secondary source.
 */
function extractRole(user: User | null): "user" | "admin" {
    if (!user) return "user";
    // Primary: role stored in user_metadata (set during seed/signup)
    const metaRole = user.user_metadata?.role;
    if (metaRole === "admin") return "admin";
    return "user";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<"user" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);

    // Try to upgrade role from DB in background (best-effort — fails gracefully when schema not set up)
    const syncRoleFromDB = useCallback(async (userId: string, currentRole: "user" | "admin") => {
        try {
            const { data } = await supabase
                .from("users")
                .select("role")
                .eq("id", userId)
                .maybeSingle();
            if (data?.role === "admin") setRole("admin");
            else if (data?.role === "user" && currentRole !== "admin") setRole("user");
            // If DB call fails or returns null, keep the metadata-derived role
        } catch {
            // Table doesn't exist yet — silently keep metadata role
        }
    }, []);

    const registerPushSubscription = useCallback(async (userId: string) => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey || vapidPublicKey.includes("TODO")) return;
            const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });
            // Best-effort — silently skip if table doesn't exist
            await supabase.from("push_subscriptions").upsert({
                user_id: userId,
                subscription: JSON.stringify(subscription),
                updated_at: new Date().toISOString(),
            }).throwOnError();
        } catch {
            // Push permission denied, VAPID missing, or table not set up — silently ignore
        }
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const metaRole = extractRole(session.user);
                setRole(metaRole);
                syncRoleFromDB(session.user.id, metaRole);
                registerPushSubscription(session.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const metaRole = extractRole(session.user);
                setRole(metaRole);
                syncRoleFromDB(session.user.id, metaRole);
                registerPushSubscription(session.user.id);
            } else {
                setRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [syncRoleFromDB, registerPushSubscription]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
