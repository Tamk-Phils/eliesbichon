import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// We use sessionStorage so each browser TAB has its own independent session.
// This lets you be logged in as admin in one tab and a regular user in another.
function createTabIsolatedClient() {
    if (typeof window === "undefined") {
        // Server-side: no storage
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    // Each browser tab gets a unique key scoped to that tab's sessionStorage
    // sessionStorage is per-tab (not shared across tabs, but persists on refresh)
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: {
                getItem: (key) => sessionStorage.getItem(key),
                setItem: (key, value) => sessionStorage.setItem(key, value),
                removeItem: (key) => sessionStorage.removeItem(key),
            },
            storageKey: "sb-session",
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
}

export const supabase = createTabIsolatedClient();
