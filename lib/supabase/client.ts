import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// We use localStorage so the session is shared across all tabs and persists on restart.
function createPersistentClient() {
    if (typeof window === "undefined") {
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: localStorage,
            storageKey: "sb-session",
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
}

export const supabase = createPersistentClient();
