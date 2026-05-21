import RatePage from "@/components/pages/RatePage";
import { hotel } from "@/lib/hotels";

export const metadata = {
  title: "Bedøm ophold | Hotel Barndomshjemmet",
  description: "Del din oplevelse af hotellet.",
};

export default function RateRoutePage() {
  return <RatePage hotelName={hotel.name} />;
}
