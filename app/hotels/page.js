import { redirect } from "next/navigation";
import { hotel } from "@/lib/hotels";

export const metadata = {
  title: "Hotellet | Hotel Barndomshjemmet",
  description: "Se hotelprofilen for Hotel Barndomshjemmet.",
};

export default function HotelsRoutePage() {
  redirect(`/hotels/${hotel.slug}`);
}
