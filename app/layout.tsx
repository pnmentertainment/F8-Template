import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "F8 — ship your SaaS faster",
  description:
    "A starter template for shipping SaaS products: Supabase auth, Stripe payments, a polished landing page, and a dashboard — ready to customise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
