"use client";

import { useEffect, useState } from "react";

const toneStyles = {
  excellent: "bg-accent/25 text-primary border-accent/70",
  good: "bg-secondary/20 text-primary border-secondary/45",
  average: "bg-surface-soft text-foreground border-border-soft",
  poor: "bg-[#f1dbe8] text-primary border-[#d2a7be]",
};

const gradeFromScore = (score) => {
  if (score >= 4.6) return "excellent";
  if (score >= 4.0) return "good";
  if (score >= 3.2) return "average";
  return "poor";
};

export default function RatingBadge({ score, reviews, hotelSlug }) {
  const tone = gradeFromScore(score);
  const [liveReviews, setLiveReviews] = useState(reviews);

  useEffect(() => {
    if (!hotelSlug) {
      return;
    }

    let isMounted = true;

    const updateCount = async () => {
      try {
        const response = await fetch(`/api/reviews?hotelSlug=${encodeURIComponent(hotelSlug)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();

        if (isMounted && Array.isArray(payload.reviews)) {
          setLiveReviews(payload.reviews.length);
        }
      } catch {
        // Ignore transient polling errors.
      }
    };

    updateCount();
    const timer = setInterval(updateCount, 5000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [hotelSlug]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold ${toneStyles[tone]}`}
      aria-label={`Bedømt til ${score} ud af 5 af ${liveReviews} gæster`}
    >
      <span className="leading-none">{score.toFixed(1)}</span>
      <span className="text-xs font-medium opacity-75 leading-none">/ 5</span>
      <span className="h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-current" />
      <span className="text-xs font-medium leading-none hidden sm:inline">{liveReviews} anmeldelser</span>
    </div>
  );
}
