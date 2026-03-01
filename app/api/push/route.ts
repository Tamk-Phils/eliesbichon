import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

webpush.setVapidDetails(
    process.env.VAPID_CONTACT_EMAIL ?? "mailto:adminsupport@eliesbichon.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId, message } = await req.json();

        let targetUserIds = [userId];

        if (userId === "ADMINS") {
            const { data: admins } = await supabaseAdmin
                .from("users")
                .select("id")
                .eq("role", "admin");
            targetUserIds = admins?.map(a => a.id) ?? [];
        }

        if (targetUserIds.length === 0) {
            return NextResponse.json({ success: true, sent: 0 });
        }

        const { data: subs } = await supabaseAdmin
            .from("push_subscriptions")
            .select("subscription")
            .in("user_id", targetUserIds);

        if (!subs || subs.length === 0) {
            return NextResponse.json({ success: true, sent: 0 });
        }

        const payload = JSON.stringify({
            title: "Ellie's Bichon Frise Sanctuary",
            body: message,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
        });

        const results = await Promise.allSettled(
            subs.map(async ({ subscription }) => {
                const sub = JSON.parse(subscription);
                await webpush.sendNotification(sub, payload);
            })
        );

        const sent = results.filter((r) => r.status === "fulfilled").length;
        return NextResponse.json({ success: true, sent });
    } catch (error) {
        console.error("Push error:", error);
        return NextResponse.json({ error: "Push failed" }, { status: 500 });
    }
}
