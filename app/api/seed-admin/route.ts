import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "adminsupport@eliesbichon.com";
const ADMIN_PASSWORD = "Phil$7872";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SEED_SECRET ?? "setup-sanctuary-2024"}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attempt sign up first (ignore if already exists)
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    );

    await anonClient.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: { data: { role: "admin", name: "Admin" } },
    });

    // Sign in to get access_token
    const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });

    if (loginError || !loginData.session) {
        return NextResponse.json({
            error: loginError?.message ?? "Login failed — check Supabase email confirmation settings",
            hint: "Go to Supabase Dashboard → Authentication → Providers → Email → disable 'Confirm email'",
        }, { status: 400 });
    }

    // Create an authenticated client using the access token
    const authedClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${loginData.session.access_token}` } },
        }
    );

    // Set the session explicitly so auth.updateUser works
    await authedClient.auth.setSession({
        access_token: loginData.session.access_token,
        refresh_token: loginData.session.refresh_token,
    });

    // Update user_metadata to store role = "admin"
    const { data: updateData, error: updateError } = await authedClient.auth.updateUser({
        data: { role: "admin", name: "Admin" },
    });

    if (updateError) {
        return NextResponse.json({
            success: false,
            error: updateError.message,
            userId: loginData.user.id,
        }, { status: 400 });
    }

    // Best-effort: also upsert the DB users table row
    await authedClient.from("users").upsert(
        { id: loginData.user.id, email: ADMIN_EMAIL, name: "Admin", role: "admin" },
        { onConflict: "id" }
    );

    return NextResponse.json({
        success: true,
        userId: loginData.user.id,
        role: updateData?.user?.user_metadata?.role,
        message: `✅ Admin ready! Login with: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`,
    });
}
