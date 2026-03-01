import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        // 1. Initialize Supabase client with Service Role Key for administrative actions
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // 2. Verify that the requester is an admin
        // We get the regular supabase client to check the requester's session
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No authorization header" }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            authHeader.replace("Bearer ", "")
        );

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 });
        }

        // Check if admin via app_metadata first (faster)
        let isAdmin = user.app_metadata?.role === 'admin';

        if (!isAdmin) {
            // Fallback: Check public.users table (more reliable if metadata isn't synced)
            const { data: userData } = await supabaseAdmin
                .from("users")
                .select("role")
                .eq("id", user.id)
                .single();

            isAdmin = userData?.role === 'admin';
        }

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
        }

        // 3. Get the user ID to delete from the request body
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Prevent admin from deleting themselves
        if (userId === user.id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // 4. Delete the user from Supabase Auth (this also deletes from public.users due to CASCADE)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Error deleting user:", deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete user API error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
