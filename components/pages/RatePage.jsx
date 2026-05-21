"use client";

import RatingForm from "@/components/RatingForm";

export default function RatePage({ hotels, defaultHotelSlug }) {
  const defaultHotel = hotels.find((hotel) => hotel.slug === defaultHotelSlug) ?? hotels[0];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:pt-10 sm:px-6 lg:px-8">
      <section className="section-card soft-shadow mb-6 rounded-3xl p-6 sm:p-8">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-primary">Bedøm dit ophold</h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-ink-muted">
          Indsend feedback med klient-side validering bygget med Zod for {defaultHotel?.name}.
        </p>
      </section>

      <RatingForm hotels={hotels} defaultHotelSlug={defaultHotel?.slug} />
    </main>
  );
}
