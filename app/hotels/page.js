import HotelsPage from "@/components/pages/HotelsPage";
import { hotels } from "@/lib/hotels";

export const metadata = {
  title: "Hoteller | Hotel Barndomshjemmet",
  description: "Vælg et hotel og åbn en dynamisk detaljeside.",
};

export default function HotelsRoutePage() {
  return <HotelsPage hotels={hotels} />;
}
