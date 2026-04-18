import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "F8 — ship your SaaS faster",
    template: "%s · F8",
  },
  description:
    "A starter template for shipping SaaS products: Supabase auth, Stripe payments, a polished landing page, and a dashboard — ready to customise.",
  openGraph: {
    title: "F8 — ship your SaaS faster",
    description:
      "Auth, payments, and a polished dashboard — all wired up with Next.js, Supabase and Stripe.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
