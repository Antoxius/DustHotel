import hotelData from "@/data/hotel.json";
import amenities from "@/data/amenities.json";
import tags from "@/data/tags.json";

export const hotel = {
  ...hotelData,
  tags,
  amenities,
};

export const getAllHotelSlugs = () => [hotel.slug];

export const getHotelBySlug = (slug) => (slug === hotel.slug ? hotel : undefined);
