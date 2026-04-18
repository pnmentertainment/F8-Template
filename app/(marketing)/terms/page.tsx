import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <article className="container prose prose-slate mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">
        <em>
          Last updated: {new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </em>
      </p>

      <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
        <strong>⚠️ Placeholder:</strong> This is template boilerplate. Have
        a lawyer review real terms before going live — especially the
        liability, refund, and termination sections.
      </p>

      <h2>1. Acceptance</h2>
      <p>
        By creating an account you agree to these terms. If you don&apos;t
        agree, don&apos;t use the service.
      </p>

      <h2>2. The service</h2>
      <p>
        We provide access to <strong>Your Product Name</strong>. Features,
        pricing, and availability can change. We&apos;ll give reasonable
        notice of material changes.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You&apos;re responsible for keeping your login credentials secure
        and for everything that happens under your account. You must be at
        least 13 years old to sign up.
      </p>

      <h2>4. Payment</h2>
      <p>
        Paid plans renew automatically until cancelled. You can cancel at
        any time from the billing page — you keep access until the end of
        the current period. Fees are non-refundable unless required by law.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Don&apos;t use the service for anything illegal, abusive, or that
        breaks it for other users. We can suspend accounts that do.
      </p>

      <h2>6. Termination</h2>
      <p>
        You can delete your account at any time. We can terminate accounts
        for breach of these terms with notice where reasonable.
      </p>

      <h2>7. Liability</h2>
      <p>
        The service is provided &quot;as is&quot;. Our total liability for
        anything related to the service is capped at what you paid us in
        the 12 months before the claim.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@example.com">hello@example.com</a>.
      </p>
    </article>
  );
}
