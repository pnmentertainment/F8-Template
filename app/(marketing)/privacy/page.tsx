import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className="container prose prose-slate mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>Privacy Policy</h1>
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
        <strong>⚠️ Placeholder:</strong> This is template boilerplate. Replace
        it with your real policy before going live. A lawyer or a service
        like Termly, iubenda, or Termageddon can generate one tailored to
        your stack.
      </p>

      <h2>Who we are</h2>
      <p>
        This website is operated by <strong>Your Company Name</strong>. If you
        have questions about this policy, contact us at{" "}
        <a href="mailto:hello@example.com">hello@example.com</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — email address and name when you
          sign up. Stored in Supabase.
        </li>
        <li>
          <strong>Billing data</strong> — subscription status and customer
          id. Payment details are handled by Stripe; we never see your card.
        </li>
        <li>
          <strong>Usage data</strong> — basic logs and error reports to keep
          the service running.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your data to run the service you signed up for, process
        payments, and contact you about your account. We do not sell it.
      </p>

      <h2>Sub-processors</h2>
      <ul>
        <li>Supabase — database and authentication.</li>
        <li>Stripe — payment processing.</li>
        <li>Vercel — hosting.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can export or delete your data at any time from your account
        settings, or by emailing us.
      </p>
    </article>
  );
}
