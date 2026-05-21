"use client";

import HotelCard from "@/components/HotelCard";

export default function HotelsPage({ hotels }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-3 pb-16 pt-8 sm:px-4 sm:pt-10 lg:px-8">
      <section className="mb-6 rounded-3xl border border-secondary/65 bg-gradient-to-br from-[#2B1838] to-[#4A2A5C] p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Vælg et hotel</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-text-light sm:text-4xl lg:text-5xl">
          Flere hoteller, én detaljerute
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm lg:text-base leading-relaxed text-text-light/85">
          Klik på et hotelkort for at åbne den dynamiske detaljeside for netop det hotel.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.slug} hotel={hotel} />
        ))}
      </section>
    </main>
  );
}
