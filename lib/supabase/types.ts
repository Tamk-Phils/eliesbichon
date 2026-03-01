// Supabase database type definitions
// This provides a typed schema for our sanctuary database.
// For full auto-generated types, run: npx supabase gen types typescript --local

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    PostgrestVersion: "12";
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    role: "user" | "admin";
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    name?: string | null;
                    role?: "user" | "admin";
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string | null;
                    role?: "user" | "admin";
                };
            };
            puppies: {
                Row: {
                    id: string;
                    name: string;
                    age: string | null;
                    gender: "male" | "female" | null;
                    fee: number | null;
                    status: "available" | "reserved" | "sold";
                    images: string[];
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    age?: string | null;
                    gender?: "male" | "female" | null;
                    fee?: number | null;
                    status?: "available" | "reserved" | "sold";
                    images?: string[];
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    age?: string | null;
                    gender?: "male" | "female" | null;
                    fee?: number | null;
                    status?: "available" | "reserved" | "sold";
                    images?: string[];
                    description?: string | null;
                    updated_at?: string;
                };
            };
            adoption_requests: {
                Row: {
                    id: string;
                    user_id: string;
                    puppy_id: string | null;
                    status: "pending" | "approved" | "rejected";
                    full_name: string | null;
                    email: string | null;
                    phone: string | null;
                    address: string | null;
                    city: string | null;
                    state: string | null;
                    zip: string | null;
                    payment_method: string | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    puppy_id?: string | null;
                    status?: "pending" | "approved" | "rejected";
                    full_name?: string | null;
                    email?: string | null;
                    phone?: string | null;
                    address?: string | null;
                    city?: string | null;
                    state?: string | null;
                    zip?: string | null;
                    payment_method?: string | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    status?: "pending" | "approved" | "rejected";
                    full_name?: string | null;
                    email?: string | null;
                    phone?: string | null;
                    address?: string | null;
                    city?: string | null;
                    state?: string | null;
                    zip?: string | null;
                    notes?: string | null;
                };
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    message: string;
                    read: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    message: string;
                    read?: boolean;
                    created_at?: string;
                };
                Update: {
                    read?: boolean;
                };
            };
            conversations: {
                Row: {
                    id: string;
                    user_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    created_at?: string;
                };
                Update: Record<string, never>;
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    sender_id: string | null;
                    content: string;
                    is_admin: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    sender_id?: string | null;
                    content: string;
                    is_admin?: boolean;
                    created_at?: string;
                };
                Update: Record<string, never>;
            };
            push_subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    subscription: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    subscription: string;
                    updated_at?: string;
                };
                Update: {
                    subscription?: string;
                    updated_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
