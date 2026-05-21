import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-secondary/70 bg-primary">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5 sm:gap-2 px-4 py-5 sm:py-6 lg:px-8">
        <p className="font-display text-xl sm:text-2xl leading-tight text-text-light">Hotel Barndomshjemmet</p>
        <p className="text-xs sm:text-sm text-text-light/80 leading-relaxed">
          Personlig hotelstemning med boutique-charme, varme nuancer og bløde kontraster.
          <Link href="/rate" className="ml-1 underline decoration-transparent transition hover:text-accent hover:decoration-accent">
            Del din anmeldelse
          </Link>
        </p>
      </div>
    </footer>
  );
}
