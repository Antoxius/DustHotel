import Link from "next/link";
import RatingBadge from "@/components/RatingBadge";

function SectionHeading({ children }) {
  return (
    <h2 className="font-display text-2xl text-primary sm:text-3xl">{children}</h2>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border-soft py-3.5 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted whitespace-nowrap">{label}</dt>
      <dd className="text-sm font-medium text-foreground sm:text-right break-words">{value ?? "Ikke oplyst"}</dd>
    </div>
  );
}

export default function HotelDetailsPage({ hotel }) {
  const b = hotel.bygningsdetaljer ?? {};
  const addr = hotel.address ?? {};
  const e = hotel.ejendomsdata ?? {};

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">

      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium tracking-[0.02em] text-ink-muted transition-colors hover:text-primary"
      >
        ← Tilbage til forsiden
      </Link>

      {/* ── Hero ── */}
      <section className="section-card soft-shadow mb-6 overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              {[addr.city, addr.country].filter(Boolean).join(", ") || hotel.city}
            </p>
            <h1 className="font-display text-3xl leading-tight text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
              {hotel.name}
            </h1>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm leading-relaxed text-foreground sm:text-base lg:text-lg">
              {hotel.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end sm:gap-3 lg:min-w-fit">
            <span className="rounded-full border border-accent/60 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-primary whitespace-nowrap">
              {hotel.priceRange} &nbsp;·&nbsp; fra ${hotel.nightlyRate}/nat
            </span>
            <RatingBadge score={hotel.rating} reviews={hotel.reviewCount} />
          </div>
        </div>

        {hotel.summary && (
          <p className="mt-4 sm:mt-6 border-t border-border-soft pt-4 sm:pt-5 text-xs sm:text-sm italic leading-relaxed text-ink-muted">
            &ldquo;{hotel.summary}&rdquo;
          </p>
        )}
      </section>

      {/* ── Highlights + Amenities ── */}
      <div className="mb-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <section className="section-card soft-shadow rounded-3xl p-6 sm:p-8">
          <SectionHeading>Højdepunkter</SectionHeading>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-secondary/40 bg-surface px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold tracking-wide text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="section-card soft-shadow rounded-3xl p-6 sm:p-8">
          <SectionHeading>Faciliteter</SectionHeading>
          <ul className="mt-3 sm:mt-4 grid gap-2.5">
            {hotel.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-start gap-2 rounded-xl border border-border-soft bg-text-light/80 px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-foreground"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent mt-0.5" />
                <span className="flex-1">{amenity}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Property Data ── */}
      {(e.antalVaerelser || e.boligareal || e.vejgetal || e.nuvarendePris) && (
        <section className="section-card soft-shadow mb-6 rounded-3xl p-6 sm:p-8">
          <SectionHeading>Ejendomsoplysninger</SectionHeading>
          <dl className="mt-4">
            {e.antalVaerelser && <DetailRow label="Værelser" value={e.antalVaerelser} />}
            {e.boligareal && <DetailRow label="Boligareal" value={`${e.boligareal} m²`} />}
            {e.vejgetal && <DetailRow label="Vejgetal areal" value={`${e.vejgetal} m²`} />}
            {e.mPrisPris && <DetailRow label="M² pris" value={`${e.mPrisPris.toLocaleString("da-DK")} kr.`} />}
            {e.nuvarendePris && (
              <DetailRow label="Nuværende pris" value={`${e.nuvarendePris.toLocaleString("da-DK")} kr. (${e.prisVurderingAar})`} />
            )}
            {e.senesteSalgspris && (
              <DetailRow label="Seneste salgspris" value={`${e.senesteSalgspris.toLocaleString("da-DK")} kr. (${e.senesteSalgsar})`} />
            )}
          </dl>
        </section>
      )}

      {/* ── Building Details ── */}
      <section className="section-card soft-shadow mb-6 rounded-3xl p-6 sm:p-8">
        <SectionHeading>Bygningsdetaljer</SectionHeading>
        <dl className="mt-4">
          <DetailRow
            label="Seneste ombygningsår"
            value={b.senesteOmbygningsaar}
          />
          <DetailRow
            label="Antal plan"
            value={b.antalPlan != null ? `${b.antalPlan} plan` : null}
          />
          <DetailRow
            label="Antal etager"
            value={b.antalEtager != null ? b.antalEtager : null}
          />
          <DetailRow
            label="Antal toiletter"
            value={b.antalToiletter}
          />
          <DetailRow
            label="Varmeinstallation"
            value={b.varmeinstallation}
          />
          <DetailRow
            label="Ydervægge"
            value={b.ydervaegg}
          />
          <DetailRow
            label="Vægtet areal"
            value={b.vaegtAtAreal != null ? `${b.vaegtAtAreal} m²` : null}
          />
          <DetailRow
            label="Tagtype"
            value={b.tagtype}
          />
        </dl>
      </section>

      {/* ── Contact / Address ── */}
      {(addr.street || addr.postalCode || addr.city || hotel.contact?.phone || hotel.contact?.email) && (
        <section className="section-card soft-shadow mb-6 rounded-3xl p-6 sm:p-8">
          <SectionHeading>Kontakt &amp; adresse</SectionHeading>
          <dl className="mt-4">
            {addr.street && (
              <DetailRow 
                label="Adresse" 
                value={[addr.street, addr.postalCode, addr.city].filter(Boolean).join(", ")} 
              />
            )}
            {addr.country && (
              <DetailRow label="Land" value={addr.country} />
            )}
            {hotel.contact?.phone && <DetailRow label="Telefon" value={hotel.contact.phone} />}
            {hotel.contact?.email && <DetailRow label="E-mail" value={hotel.contact.email} />}
          </dl>
        </section>
      )}

      {/* ── CTA ── */}
      <div className="mt-10 flex justify-center">
        <Link href="/rate" className="btn-primary px-10 py-3.5 text-base">
          Bedøm dit ophold
        </Link>
      </div>
    </main>
  );
}
