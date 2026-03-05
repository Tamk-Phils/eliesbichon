"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { Send, MessageCircle } from "lucide-react";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    is_admin: boolean;
}

export default function ChatPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;
        async function init() {
            // Upsert conversation — safe if one already exists (UNIQUE user_id)
            const { data: conv } = await supabase
                .from("conversations")
                .upsert({ user_id: user!.id }, { onConflict: "user_id" })
                .select("id")
                .single();
            if (!conv) return;
            setConversationId(conv.id);

            const { data: msgs } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conv.id)
                .order("created_at", { ascending: true });
            setMessages((msgs as Message[]) ?? []);
        }
        init();
    }, [user]);

    useEffect(() => {
        if (!conversationId) return;
        const channel = supabase
            .channel(`chat-${conversationId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => {
                        // ULTRA-ROBUST: Filter out any existing message with same ID before adding
                        // This prevents duplicates even if optimistic update and realtime collide
                        const exists = prev.some(m => m.id === newMsg.id);
                        if (exists) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !conversationId || !user) return;

        const content = input.trim();
        const msgId = crypto.randomUUID();
        setInput("");
        setSending(true);

        // Optimistic insert
        const optimisticMsg: Message = {
            id: msgId,
            content,
            sender_id: user.id,
            created_at: new Date().toISOString(),
            is_admin: false
        };

        setMessages(prev => {
            // Ensure no duplicate ID even in optimistic state
            if (prev.some(m => m.id === msgId)) return prev;
            return [...prev, optimisticMsg];
        });

        const { error } = await supabase.from("messages").insert({
            id: msgId,
            conversation_id: conversationId,
            sender_id: user.id,
            content,
            is_admin: false,
        });

        if (!error && msgId) {
            // Push notification to Admin (best effort)
            fetch("/api/push", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "ADMINS", // Targets all users with 'admin' role
                    message: `New message from ${user.email}: ${content.slice(0, 80)}`
                }),
            }).catch(() => { });

            // Reliable Fallback: Email notification to Admin
            fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.email?.split('@')[0] || "User",
                    email: user.email || "No email",
                    subject: "New Chat Message from User",
                    message: content
                }),
            }).catch(() => { console.error("Failed to send admin email alert"); });
        } else if (error) {
            console.error("Error sending message:", error);
            // Remove optimistic message and restore input on failure
            setMessages(prev => prev.filter(m => m.id !== msgId));
            setInput(content);
        }

        setSending(false);
    };

    if (loading) return <div className="min-h-screen bg-cream-50 flex items-center justify-center"><div className="skeleton w-32 h-8 rounded-lg" /></div>;

    return (
        <div className="h-[calc(100vh-64px)] bg-cream-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-cream-100 border-b border-cream-200 px-4 sm:px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-sand-600" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-brown-900">Chat with Ellie&apos;s Sanctuary</h1>
                        <p className="text-xs text-brown-800/50">We typically respond within a few hours</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-cream-50/30">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-16 text-brown-800/40">
                            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>Start a conversation — we&apos;re here to help!</p>
                        </div>
                    )}
                    {messages.map((msg) => {
                        const isMe = !msg.is_admin;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe
                                        ? "bg-sand-600 text-cream-50 rounded-br-sm"
                                        : "bg-cream-100 border border-cream-200 text-brown-800 rounded-bl-sm"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className={`text-xs mt-1 ${isMe ? "text-cream-50/60" : "text-brown-800/40"}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-cream-100 border-t border-cream-200 px-4 sm:px-6 py-4">
                <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/40 focus:outline-none focus:border-sand-400 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={sending || !input.trim()}
                        className="w-10 h-10 flex items-center justify-center bg-sand-600 hover:bg-sand-700 disabled:opacity-50 text-cream-50 rounded-xl transition-colors shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
