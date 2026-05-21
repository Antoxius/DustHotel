import { notFound } from "next/navigation";
import HotelDetailsPage from "@/components/pages/HotelDetailsPage";
import { getAllHotelSlugs, getHotelBySlug } from "@/lib/hotels";

export function generateStaticParams() {
  return getAllHotelSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);

  if (!hotel) {
    return { title: "Hotel ikke fundet | Hotel Barndomshjemmet" };
  }

  return {
    title: `${hotel.name} | Hotel Barndomshjemmet`,
    description: hotel.summary,
  };
}

export default async function HotelSlugRoutePage({ params }) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  return <HotelDetailsPage hotel={hotel} />;
}
