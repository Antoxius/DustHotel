"use client";

import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import { hotel } from "@/lib/hotels";


export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 pb-12 sm:pb-16 pt-8 sm:pt-10 lg:px-8">
      <section className="soft-shadow mb-8 rounded-3xl border border-secondary/65 bg-gradient-to-br from-[#2B1838] to-[#4A2A5C] p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
          Koncept til hotelbedømmelser
        </p>
        <h1 className="font-display mt-3 sm:mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-text-light">
          Hotel Barndomshjemmet: et personligt boutiquehotel med varme nuancer
        </h1>
        <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm lg:text-base text-text-light/85 leading-relaxed">
          Siden fokuserer kun på Hotel Barndomshjemmet og er opdelt i genbrugelige JSX-komponenter
          med Next.js App Router og Zod-validering.
        </p>

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
          <Link
            href={`/hotels/${hotel.slug}`}
            className="btn-primary rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-[0.02em] transition text-center"
          >
            Se hotellet
          </Link>
          <Link
            href="/rate"
            className="rounded-full border border-text-light/70 bg-transparent px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-[0.02em] text-text-light transition hover:border-accent hover:text-accent text-center"
          >
            Indsend bedømmelse
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 sm:gap-4">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-primary">Hotelprofil</h2>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <HotelCard hotel={hotel} />
        </div>
      </section>
    </main>
  );
}
