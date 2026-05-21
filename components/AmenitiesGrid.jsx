"use client";

import { getAmenityIcon, getAmenityLabel } from "@/utils/amenityIcons";

/**
 * Displays hotel amenities in a responsive grid with icons
 * @param {Array<string>} amenities - List of amenity descriptions
 */
export default function AmenitiesGrid({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Ingen faciliteter angivet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 auto-rows-auto gap-3 sm:gap-4">
      {amenities.map((amenity, index) => {
        const IconComponent = getAmenityIcon(amenity);
        const label = getAmenityLabel(amenity);

        return (
          <div
            key={`${amenity}-${index}`}
            className="group flex flex-col items-center gap-2 sm:gap-3 rounded-xl border border-border-soft bg-text-light/80 p-3 sm:p-4 transition-colors hover:bg-text-light hover:border-accent"
            title={amenity}
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <p className="text-center text-xs sm:text-sm font-medium text-foreground line-clamp-2">
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
