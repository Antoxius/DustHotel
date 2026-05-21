import RatePage from "@/components/pages/RatePage";
import { hotel, hotels } from "@/lib/hotels";

export const metadata = {
  title: "Bedøm ophold | Hotel Barndomshjemmet",
  description: "Del din oplevelse af hotellet.",
};

export default async function RateRoutePage({ searchParams }) {
  const params = await searchParams;
  const requestedSlug = params?.hotel;
  const defaultHotelSlug = hotels.some((item) => item.slug === requestedSlug) ? requestedSlug : hotel.slug;

  return <RatePage hotels={hotels} defaultHotelSlug={defaultHotelSlug} />;
}
