"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Puppy {
    id: string;
    name: string;
    fee: number;
    images: string[];
}

const inputCls = "w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-sm text-brown-800 focus:outline-none focus:border-sand-400 transition-colors";
const labelCls = "block text-sm font-medium text-brown-800 mb-1";
const selectCls = inputCls + " cursor-pointer";
const sectionCls = "bg-cream-100 border border-cream-200 rounded-2xl p-5 space-y-4";
const sectionTitle = "font-semibold text-brown-900 mb-3 text-base";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className={labelCls}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
            {children}
        </div>
    );
}

export default function DepositCheckoutPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [puppy, setPuppy] = useState<Puppy | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        // Applicant Info
        first_name: "", last_name: "", email: "", phone: "",
        preferred_contact: "email",
        address: "", city: "", state: "", zip: "",
        // Household & Lifestyle
        residence_type: "house", rent_or_own: "own",
        household_members: "", other_pets: "", yard_fencing: "",
        // Employment & Availability
        occupation: "", work_hours: "", daytime_care: "",
        // Puppy Preferences
        size_preference: "", age_preference: "no_preference",
        gender_preference: "", adoption_reason: "",
        // Care & Commitment
        pet_experience: "", vet_info: "",
        financial_ability: false, spay_neuter: false, training_commitment: false,
        // Legal
        policies_ack: false, home_visit_consent: false, signature: "",
        // Payment
        payment_method: "zelle", notes: "",
    });

    const set = (field: string, value: string | boolean) =>
        setForm((f) => ({ ...f, [field]: value }));

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!id) return;
        supabase.from("puppies").select("id, name, fee, images").eq("id", id).single()
            .then(({ data }) => {
                setPuppy(data);
                if (data && user) {
                    // Pre-fill name and email from auth user metadata if available
                    const meta = user.user_metadata;
                    if (meta?.name) {
                        const parts = (meta.name as string).split(" ");
                        setForm((f) => ({
                            ...f,
                            first_name: parts[0] ?? "",
                            last_name: parts.slice(1).join(" ") ?? "",
                        }));
                    }
                    setForm((f) => ({ ...f, email: user.email ?? "" }));
                }
            });
    }, [id, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !puppy) return;
        if (!form.financial_ability || !form.spay_neuter || !form.training_commitment || !form.policies_ack || !form.home_visit_consent) {
            setError("Please check all required consent checkboxes before submitting.");
            return;
        }
        setSubmitting(true);
        setError("");
        const { error: err } = await supabase.from("adoption_requests").insert({
            user_id: user.id,
            puppy_id: puppy.id,
            status: "pending",
            ...form,
        });

        if (err) {
            setError(err.message);
            setSubmitting(false);
        } else {
            try {
                const sentAt = new Date().toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

                function row(label: string, value: string) {
                    return `<tr>
                        <td style="padding:6px 0;font-size:12px;font-weight:600;color:#A89B6D;text-transform:uppercase;letter-spacing:1px;width:160px;vertical-align:top">${label}</td>
                        <td style="padding:6px 0;font-size:14px;color:#3E2723;vertical-align:top">${value || "—"}</td>
                    </tr>`;
                }
                function section(title: string, rows: string) {
                    return `<tr><td colspan="2" style="padding:20px 0 0"><p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#A89B6D;font-weight:700;border-bottom:1px solid #F1EBD8;padding-bottom:6px">${title}</p><table width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;
                }

                const htmlBody = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#FCFBF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FCFBF8;padding:40px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(62,39,35,0.08);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#4E342E 0%,#3E2723 100%);padding:32px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C2B280;font-weight:600;">Ellie's Bichon Frise Sanctuary</p>
    <h1 style="margin:0;font-size:24px;font-weight:700;color:#FCFBF8;">🐾 New Adoption Application</h1>
    <p style="margin:10px 0 0;font-size:13px;color:#C2B280;">Submitted ${sentAt}</p>
  </td></tr>

  <!-- Puppy Badge -->
  <tr><td style="padding:28px 40px 0;">
    <div style="background:#F9F6EE;border:1px solid #F1EBD8;border-radius:12px;padding:16px 20px;display:inline-block;width:100%;box-sizing:border-box;">
      <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#A89B6D;font-weight:600;">Applying for</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#3E2723;">${puppy.name} <span style="font-size:15px;font-weight:400;color:#A89B6D;">· $${puppy.fee.toLocaleString()}</span></p>
    </div>
  </td></tr>

  <!-- Section data -->
  <tr><td style="padding:20px 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${section("👤 Applicant", [
                    row("Name", `${form.first_name} ${form.last_name}`),
                    row("Email", form.email),
                    row("Phone", form.phone),
                    row("Preferred Contact", form.preferred_contact),
                    row("Address", `${form.address}, ${form.city}, ${form.state} ${form.zip}`),
                ].join(""))}
      ${section("🏡 Household", [
                    row("Residence", `${form.residence_type} (${form.rent_or_own})`),
                    row("Household Members", form.household_members),
                    row("Other Pets", form.other_pets || "None"),
                    row("Yard / Fencing", form.yard_fencing),
                ].join(""))}
      ${section("💼 Employment", [
                    row("Occupation", form.occupation),
                    row("Work Hours", form.work_hours),
                    row("Daytime Care", form.daytime_care),
                ].join(""))}
      ${section("🐕 Preferences", [
                    row("Size Preference", form.size_preference || "No preference"),
                    row("Age Preference", form.age_preference),
                    row("Gender Preference", form.gender_preference || "No preference"),
                    row("Reason for Adoption", form.adoption_reason),
                ].join(""))}
      ${section("❤️ Care & Commitment", [
                    row("Pet Experience", form.pet_experience),
                    row("Vet Info", form.vet_info),
                    row("Financial Ability", form.financial_ability ? "✅ Confirmed" : "Not confirmed"),
                    row("Spay / Neuter", form.spay_neuter ? "✅ Agreed" : "Not agreed"),
                    row("Training", form.training_commitment ? "✅ Committed" : "Not committed"),
                ].join(""))}
      ${section("💳 Payment", [
                    row("Method", form.payment_method.replace(/_/g, " ")),
                    row("Deposit Amount", "$500"),
                    row("Notes", form.notes || "None"),
                ].join(""))}
      ${section("⚖️ Legal", [
                    row("Policies Acknowledged", form.policies_ack ? "✅ Yes" : "No"),
                    row("Home Visit Consent", form.home_visit_consent ? "✅ Yes" : "No"),
                    row("Signature", form.signature),
                ].join(""))}
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F9F6EE;border-top:1px solid #F1EBD8;padding:20px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#A89B6D;">Log into the <strong>Admin Portal → Requests</strong> to approve or reject this application.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

                await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: `${form.first_name} ${form.last_name}`,
                        email: form.email,
                        subject: `New Adoption Application: ${puppy.name}`,
                        htmlBody,
                    }),
                });
            } catch (emailErr) {
                console.error("Email notification failed:", emailErr);
            }
            setSubmitted(true);
        }
    };

    if (loading || !puppy) return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
            <div className="skeleton w-32 h-8 rounded-lg" />
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                <h1 className="font-display text-3xl font-bold text-brown-900 mb-2">Application Submitted!</h1>
                <p className="text-brown-800/60 mb-6">
                    We&apos;ve received your adoption application for <strong>{puppy.name}</strong>.
                    We&apos;ll reach out within 24–48 hours via {form.preferred_contact} to discuss next steps.
                </p>
                <Link href="/dashboard" className="inline-block px-6 py-3 bg-sand-600 hover:bg-sand-700 text-cream-50 font-semibold rounded-xl transition-colors">
                    View My Dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <Link href={`/puppies/${id}`} className="inline-flex items-center gap-1 text-sm text-brown-800/60 hover:text-sand-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to {puppy.name}
                </Link>

                {/* Puppy summary */}
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-cream-100 border border-cream-200 rounded-2xl p-4 text-center">
                        <div className="w-24 h-24 rounded-xl bg-cream-200 overflow-hidden mx-auto mb-3">
                            {puppy.images?.[0]
                                ? <img src={puppy.images[0]} alt={puppy.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                            }
                        </div>
                        <h3 className="font-display font-bold text-brown-900">{puppy.name}</h3>
                        <p className="text-sand-600 font-bold mt-1">${puppy.fee?.toLocaleString()}</p>
                        <p className="text-xs text-brown-800/50 mt-1">Deposit: $500</p>
                    </div>
                    <div className="sm:col-span-2">
                        <h1 className="font-display text-3xl font-bold text-brown-900 mb-2">Adoption Application</h1>
                        <p className="text-brown-800/60 text-sm leading-relaxed">
                            Complete this form to apply for {puppy.name}. A $500 deposit is required to reserve your puppy.
                            We accept Zelle, Chime, Apple Pay, PayPal, and CashApp.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── 1. Applicant Information ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Applicant Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="First Name" required>
                                <input type="text" required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Last Name" required>
                                <input type="text" required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Email Address" required>
                                <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Phone Number" required>
                                <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Preferred Contact Method" required>
                                <select value={form.preferred_contact} onChange={(e) => set("preferred_contact", e.target.value)} className={selectCls}>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="text">Text</option>
                                </select>
                            </Field>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Field label="Street Address" required>
                                <input type="text" required value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls + " sm:col-span-3"} />
                            </Field>
                            <Field label="City" required>
                                <input type="text" required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="State" required>
                                <input type="text" required value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="ZIP / Postal Code" required>
                                <input type="text" required value={form.zip} onChange={(e) => set("zip", e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                    </div>

                    {/* ── 2. Household & Lifestyle ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Household & Lifestyle</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Type of Residence" required>
                                <select value={form.residence_type} onChange={(e) => set("residence_type", e.target.value)} className={selectCls}>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="farm">Farm</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Do you rent or own?" required>
                                <select value={form.rent_or_own} onChange={(e) => set("rent_or_own", e.target.value)} className={selectCls}>
                                    <option value="own">Own</option>
                                    <option value="rent">Rent (landlord permission required)</option>
                                </select>
                            </Field>
                        </div>
                        <Field label="Household Members (adults, children and ages)" required>
                            <textarea rows={2} required value={form.household_members} onChange={(e) => set("household_members", e.target.value)} placeholder="e.g. 2 adults, 1 child age 7" className={inputCls + " resize-none"} />
                        </Field>
                        <Field label="Other Pets (species, breed, age, vaccination status)">
                            <textarea rows={2} value={form.other_pets} onChange={(e) => set("other_pets", e.target.value)} placeholder="e.g. 1 neutered male cat, 4 yrs, fully vaccinated — or None" className={inputCls + " resize-none"} />
                        </Field>
                        <Field label="Yard / Fencing Availability" required>
                            <input type="text" required value={form.yard_fencing} onChange={(e) => set("yard_fencing", e.target.value)} placeholder="e.g. Fully fenced backyard, 6ft privacy fence" className={inputCls} />
                        </Field>
                    </div>

                    {/* ── 3. Employment & Availability ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Employment & Availability</h2>
                        <Field label="Occupation & Employment Status" required>
                            <input type="text" required value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="e.g. Nurse, full-time employed" className={inputCls} />
                        </Field>
                        <Field label="Work Hours / Time Away" required>
                            <input type="text" required value={form.work_hours} onChange={(e) => set("work_hours", e.target.value)} placeholder="e.g. 9am–5pm Mon–Fri, remote Fridays" className={inputCls} />
                        </Field>
                        <Field label="Daytime Puppy Care — Who will care for the puppy during the day?" required>
                            <textarea rows={2} required value={form.daytime_care} onChange={(e) => set("daytime_care", e.target.value)} placeholder="e.g. Partner works from home, or puppy will attend doggy daycare" className={inputCls + " resize-none"} />
                        </Field>
                    </div>

                    {/* ── 4. Puppy Preferences ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Puppy Preferences</h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Field label="Breed / Size Preference">
                                <input type="text" value={form.size_preference} onChange={(e) => set("size_preference", e.target.value)} placeholder="e.g. Small, Bichon Frise" className={inputCls} />
                            </Field>
                            <Field label="Age Preference">
                                <select value={form.age_preference} onChange={(e) => set("age_preference", e.target.value)} className={selectCls}>
                                    <option value="puppy">Puppy</option>
                                    <option value="young">Young (1–3 yrs)</option>
                                    <option value="adult">Adult</option>
                                    <option value="senior">Senior</option>
                                    <option value="no_preference">No Preference</option>
                                </select>
                            </Field>
                            <Field label="Gender Preference">
                                <input type="text" value={form.gender_preference} onChange={(e) => set("gender_preference", e.target.value)} placeholder="Male, Female, or No preference" className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Reason for Adoption" required>
                            <textarea rows={2} required value={form.adoption_reason} onChange={(e) => set("adoption_reason", e.target.value)} placeholder="e.g. Family pet, companionship, emotional support" className={inputCls + " resize-none"} />
                        </Field>
                    </div>

                    {/* ── 5. Care & Commitment ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Care & Commitment</h2>
                        <Field label="Experience with Pets" required>
                            <textarea rows={3} required value={form.pet_experience} onChange={(e) => set("pet_experience", e.target.value)} placeholder="Tell us about any previous or current pet ownership, training experience, etc." className={inputCls + " resize-none"} />
                        </Field>
                        <Field label="Veterinarian Info" required>
                            <input type="text" required value={form.vet_info} onChange={(e) => set("vet_info", e.target.value)} placeholder="e.g. Riverside Animal Clinic, Dr. Martin — or 'Will find local vet'" className={inputCls} />
                        </Field>
                        <div className="space-y-3 pt-1">
                            {[
                                { field: "financial_ability", label: "I confirm I have the financial ability to cover food, routine vet care, grooming, and emergency needs." },
                                { field: "spay_neuter", label: "I agree to spay or neuter this puppy at the appropriate age as recommended by my veterinarian." },
                                { field: "training_commitment", label: "I am committed to providing proper training and socialization for this puppy." },
                            ].map(({ field, label }) => (
                                <label key={field} className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form[field as keyof typeof form] as boolean}
                                        onChange={(e) => set(field, e.target.checked)}
                                        className="mt-0.5 w-4 h-4 accent-sand-600 shrink-0"
                                    />
                                    <span className="text-sm text-brown-800">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── 6. Deposit Payment Method ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Deposit Payment Method</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { value: "zelle", label: "Zelle" },
                                { value: "chime", label: "Chime" },
                                { value: "apple_pay", label: "Apple Pay" },
                                { value: "paypal", label: "PayPal" },
                                { value: "cashapp", label: "CashApp" },
                            ].map(({ value, label }) => (
                                <label key={value} className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${form.payment_method === value ? "border-sand-500 bg-sand-500/10 text-sand-600 font-medium" : "border-cream-200 text-brown-800/70 hover:border-sand-400"}`}>
                                    <input type="radio" name="payment_method" value={value} checked={form.payment_method === value} onChange={(e) => set("payment_method", e.target.value)} className="sr-only" />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── 7. Additional Notes ── */}
                    <div className={sectionCls}>
                        <Field label="Additional Notes (optional)">
                            <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything else you'd like us to know?" className={inputCls + " resize-none"} />
                        </Field>
                    </div>

                    {/* ── 8. Legal & Consent ── */}
                    <div className={sectionCls}>
                        <h2 className={sectionTitle}>Legal & Consent</h2>
                        <div className="space-y-3">
                            {[
                                { field: "policies_ack", label: "I have read and agree to the Ellie's Bichon Frise Sanctuary adoption policies and rescue guidelines." },
                                { field: "home_visit_consent", label: "I consent to a reference check or home visit if deemed necessary by the sanctuary." },
                            ].map(({ field, label }) => (
                                <label key={field} className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form[field as keyof typeof form] as boolean}
                                        onChange={(e) => set(field, e.target.checked)}
                                        className="mt-0.5 w-4 h-4 accent-sand-600 shrink-0"
                                    />
                                    <span className="text-sm text-brown-800">{label}</span>
                                </label>
                            ))}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <Field label="Signature (type your full legal name)" required>
                                <input type="text" required value={form.signature} onChange={(e) => set("signature", e.target.value)} placeholder="Jane Smith" className={inputCls} />
                            </Field>
                            <Field label="Date">
                                <input type="text" readOnly value={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} className={inputCls + " bg-cream-100 cursor-not-allowed"} />
                            </Field>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-sand-600 hover:bg-sand-700 disabled:opacity-60 text-cream-50 font-semibold rounded-xl transition-colors text-base"
                    >
                        {submitting ? "Submitting…" : "Submit Adoption Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}
