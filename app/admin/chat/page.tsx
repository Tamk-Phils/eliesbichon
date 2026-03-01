"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { Send, MessageCircle, User, RefreshCw } from "lucide-react";

interface Conversation {
    id: string;
    user_id: string;
    userEmail?: string;
    userName?: string;
}

interface Message {
    id: string;
    content: string;
    is_admin: boolean;
    sender_id: string;
    created_at: string;
}

export default function AdminChatPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Fetch conversations and hydrate with user info via a separate query
    const loadConversations = useCallback(async () => {
        setLoadingConvs(true);
        const { data: convs } = await supabase
            .from("conversations")
            .select("id, user_id")
            .order("created_at", { ascending: false });

        if (!convs || convs.length === 0) {
            setConversations([]);
            setLoadingConvs(false);
            return;
        }

        // Fetch user info for all conversation owners in one shot
        const userIds = convs.map((c) => c.user_id);
        const { data: users } = await supabase
            .from("users")
            .select("id, email, name")
            .in("id", userIds);

        const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

        const enriched: Conversation[] = convs.map((c) => ({
            id: c.id,
            user_id: c.user_id,
            userEmail: userMap[c.user_id]?.email ?? "Unknown",
            userName: userMap[c.user_id]?.name ?? undefined,
        }));

        setConversations(enriched);
        setLoadingConvs(false);
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // When a conversation is selected, load its messages and subscribe to new ones
    useEffect(() => {
        if (!selected) return;

        supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", selected)
            .order("created_at", { ascending: true })
            .then(({ data }) => setMessages((data as Message[]) ?? []));

        const ch = supabase
            .channel(`admin-chat-${selected}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected}` },
                (p) => setMessages((m) => {
                    // Avoid duplicates (optimistic + realtime)
                    const exists = m.some((msg) => msg.id === (p.new as Message).id);
                    return exists ? m : [...m, p.new as Message];
                })
            )
            .subscribe();

        return () => { supabase.removeChannel(ch); };
    }, [selected]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selected || !user) return;
        setSending(true);
        const content = input.trim();
        setInput(""); // Clear immediately for better UX

        const { data: newMsg, error } = await supabase
            .from("messages")
            .insert({ conversation_id: selected, sender_id: user.id, content, is_admin: true })
            .select()
            .single();

        if (!error && newMsg) {
            // Optimistically add to state (realtime will dedupe)
            setMessages((m) => {
                const exists = m.some((msg) => msg.id === newMsg.id);
                return exists ? m : [...m, newMsg as Message];
            });

            // Push notification
            const conv = conversations.find((c) => c.id === selected);
            if (conv?.user_id) {
                fetch("/api/push", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: conv.user_id, message: `New message from Ellie's Sanctuary: ${content.slice(0, 80)}` }),
                }).catch(() => { });
            }
        } else if (error) {
            // Restore input if insert failed
            setInput(content);
        }
        setSending(false);
    };

    const selectedConv = conversations.find((c) => c.id === selected);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Sidebar: Conversation List ── */}
            <div className="w-64 border-r border-cream-200 bg-cream-100 flex flex-col shrink-0">
                <div className="px-4 py-4 border-b border-cream-200 flex items-center justify-between">
                    <h1 className="font-semibold text-brown-900 text-sm">Conversations</h1>
                    <button onClick={loadConversations} className="p-1 rounded-lg hover:bg-cream-200 text-brown-800/50 hover:text-brown-800 transition-colors" title="Refresh">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="space-y-1 p-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-10 text-brown-800/40 text-xs px-4">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No conversations yet
                        </div>
                    ) : (
                        conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelected(c.id)}
                                className={`w-full text-left px-4 py-3.5 border-b border-cream-200/60 transition-colors ${selected === c.id
                                    ? "bg-sand-500/10 border-l-[3px] border-l-sand-500"
                                    : "hover:bg-cream-200/50 border-l-[3px] border-l-transparent"
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-sand-500/20 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-sand-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-brown-900 truncate">
                                            {c.userName || c.userEmail}
                                        </p>
                                        {c.userName && (
                                            <p className="text-xs text-brown-800/50 truncate">{c.userEmail}</p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ── Chat Area ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-cream-50">
                {selected ? (
                    <>
                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-cream-200 bg-cream-100 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sand-500/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-sand-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-brown-900 text-sm">
                                    {selectedConv?.userName || selectedConv?.userEmail || "User"}
                                </p>
                                {selectedConv?.userName && (
                                    <p className="text-xs text-brown-800/50">{selectedConv.userEmail}</p>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center py-12 text-brown-800/30 text-sm">
                                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    No messages yet — say hello!
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.is_admin
                                        ? "bg-sand-600 text-cream-50 rounded-br-sm"
                                        : "bg-white border border-cream-200 text-brown-800 rounded-bl-sm"
                                        }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-xs mt-1 ${msg.is_admin ? "text-cream-50/50" : "text-brown-800/40"}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-5 py-4 border-t border-cream-200 bg-cream-100">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Reply as admin…"
                                    className="flex-1 px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown-800 placeholder:text-brown-800/40 focus:outline-none focus:border-sand-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !input.trim()}
                                    className="w-10 h-10 bg-sand-600 hover:bg-sand-700 disabled:opacity-50 text-cream-50 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-brown-800/30 gap-3">
                        <MessageCircle className="w-12 h-12 opacity-20" />
                        <p className="text-sm">Select a conversation from the left to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
