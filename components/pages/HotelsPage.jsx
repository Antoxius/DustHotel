"use client";

import HotelCard from "@/components/HotelCard";

export default function HotelsPage({ hotels }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-3xl border border-amber-200 bg-surface p-6 sm:p-8">
        <h1 className="text-3xl font-black text-zinc-900 sm:text-4xl">Alle hoteller</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700 sm:text-base">
          Gennemse hoteller og åbn hvert hotel via slug-ruter til en dedikeret detaljeside.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.slug} hotel={hotel} />
        ))}
      </section>
    </main>
  );
}
