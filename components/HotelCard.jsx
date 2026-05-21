import Link from "next/link";
import RatingBadge from "./RatingBadge";
import styles from "./HotelCard.module.css";

export default function HotelCard({ hotel }) {
  const detailsHref = `/hotels/${encodeURIComponent(hotel.slug)}`;

  return (
    <article
      className={`${styles.card} ${styles.grain} relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1`}
      aria-labelledby={`hotel-card-${hotel.slug}`}
    >
      <div className="mb-4 flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-muted truncate">{hotel.city}</p>
          <h3 id={`hotel-card-${hotel.slug}`} className="font-display text-2xl sm:text-3xl leading-tight text-primary truncate">
            {hotel.name}
          </h3>
        </div>
        <p className="rounded-full border border-accent/60 bg-accent/20 px-2 sm:px-2.5 py-1 text-xs font-bold text-primary whitespace-nowrap shrink-0">
          {hotel.priceRange}
        </p>
      </div>

      <p className="mb-4 text-xs sm:text-sm lg:text-base text-foreground line-clamp-2">{hotel.summary}</p>

      <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
        {hotel.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border-soft bg-text-light/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-medium text-ink-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <RatingBadge score={hotel.rating} reviews={hotel.reviewCount} hotelSlug={hotel.slug} />
        <Link
          href={detailsHref}
          className="btn-secondary rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
        >
          Se detaljer
        </Link>
      </div>

      <Link
        href={detailsHref}
        aria-label={`Åbn ${hotel.name}`}
        className="absolute inset-0 z-0 rounded-2xl"
      />
    </article>
  );
}
