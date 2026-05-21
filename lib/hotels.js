import hotelsData from "@/data/hotels.json";

export const hotels = hotelsData;
export const hotel = hotels[0];

export const getAllHotelSlugs = () => hotels.map((item) => item.slug);

export const getHotelBySlug = (slug) =>
	hotels.find((item) => item.slug === slug || item.legacySlugs?.includes(slug));
