const FAQS = [
  {
    q: "What's included in the template?",
    a: "A Next.js 14 app with Supabase auth, Stripe subscriptions, a Drizzle-typed Postgres schema, a polished landing page, and a dashboard — all wired up and ready to customise.",
  },
  {
    q: "Can I use a different database?",
    a: "Supabase is Postgres under the hood, so Drizzle will happily talk to any Postgres instance. Swap the DATABASE_URL and you're set.",
  },
  {
    q: "Do I need to know a lot of code?",
    a: "No. The template is designed for vibecoding with AI — file layouts, naming, and conventions are set up so your assistant knows exactly where to add features.",
  },
  {
    q: "How do payments work?",
    a: "We use Stripe Checkout for upgrades and the Stripe Billing Portal for plan changes and cancellations. Webhooks keep your database in sync automatically.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Frequently asked
        </h2>
      </div>
      <div className="mx-auto mt-10 max-w-3xl divide-y rounded-xl border bg-card">
        {FAQS.map(({ q, a }) => (
          <div key={q} className="p-6">
            <h3 className="font-medium">{q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
