import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <section className="section-card soft-shadow rounded-3xl p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mt-2 font-display text-3xl font-black text-primary sm:text-4xl">Siden blev ikke fundet</h1>
        <p className="mt-3 text-sm text-foreground sm:text-base">
          Siden findes ikke, eller slug-værdien er ugyldig.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Tilbage til forsiden
        </Link>
      </section>
    </main>
  );
}
