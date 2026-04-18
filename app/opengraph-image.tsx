import { ImageResponse } from "next/og";

export const alt = "F8 — ship your SaaS faster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0f172a",
          color: "white",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "#f1f5f9",
            color: "#0f172a",
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          F8
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          Ship your SaaS faster.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 960,
          }}
        >
          Auth, payments, and a polished dashboard — all wired up with
          Next.js, Supabase and Stripe.
        </div>
      </div>
    ),
    size,
  );
}
