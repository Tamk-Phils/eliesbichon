import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/context";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eliesbichon.com"), // Update if domain differs
  title: {
    default: "Ellie's Bichon Frise Sanctuary | Healthy, Happy Puppies",
    template: "%s | Ellie's Bichon Frise Sanctuary",
  },
  description:
    "Find your perfect Bichon Frise companion. We raise happy, healthy, AKC-registered puppies with love, socialization, and a comprehensive health guarantee.",
  keywords: ["Bichon Frise", "puppies for sale", "adoption", "breeder", "healthy puppies", "AKC registered puppies"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ellie's Bichon Frise Sanctuary",
    title: "Ellie's Bichon Frise Sanctuary | Perfect Companions",
    description: "Raising happy, healthy Bichon Frise puppies with love and dedication. Find your forever companion today.",
    url: "https://www.eliesbichon.com",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Ellie's Bichon Frise Sanctuary Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ellie's Bichon Frise Sanctuary",
    description: "Premium Bichon Frise puppies raised in a loving home environment.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
