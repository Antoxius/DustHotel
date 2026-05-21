import Link from "next/link";
import { hotel } from "@/lib/hotels";

const navItems = [
  { href: "/", label: "Forside" },
  { href: `/hotels/${hotel.slug}`, label: "Hotellet" },
  { href: "/rate", label: "Bedøm ophold" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-secondary/70 bg-primary/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-text-light min-w-0">
          <span className="font-display text-2xl sm:text-3xl leading-none font-semibold tracking-[0.06em] shrink-0">M&M</span>
          <span className="hidden text-xs sm:text-sm font-medium tracking-[0.04em] text-text-light/80 sm:inline truncate">
            Hotel Barndomshjemmet
          </span>
        </Link>

        <nav aria-label="Hovednavigation" className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium tracking-[0.03em] text-text-light transition hover:text-accent whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
