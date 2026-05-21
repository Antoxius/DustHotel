import {
  Wifi,
  UtensilsCrossed,
  Car,
  Bed,
  Users,
  Baby,
  PawPrint,
  Heart,
  Utensils,
  Home,
  KeyRound,
  Droplet,
  Leaf,
  Sofa,
  Bike,
  Sun,
  Wind,
  Monitor,
  Coffee,
} from "lucide-react";

export const amenityIconMap = {
  // Wi-Fi related
  wifi: Wifi,
  "wi-fi": Wifi,

  // Food related
  morgenmad: UtensilsCrossed,
  breakfast: UtensilsCrossed,
  bar: Utensils,
  "fri bar": Utensils,
  coffee: Coffee,
  "morgenmad serveret": Coffee,

  // Parking
  parkering: Car,
  parking: Car,
  transport: Car,
  lufthavn: Car,

  // Room types
  værelser: Bed,
  rooms: Bed,
  "2-mandsværelser": Bed,
  "familieværelser": Bed,
  "soveværelse": Bed,

  // Guests
  familie: Users,
  family: Users,
  børnevenlig: Baby,
  familievenlige: Baby,

  // Pets
  kæledyr: PawPrint,
  pets: PawPrint,

  // Accessibility
  handicap: Heart,
  accessible: Heart,

  // Check-in
  "24-åben": KeyRound,
  "døgnåben": KeyRound,
  checkin: KeyRound,

  // Facilities
  pool: Droplet,
  have: Leaf,
  "gårdhave": Leaf,
  garden: Leaf,
  terrasse: Sun,
  rooftop: Sun,
  "rooftop-lounge": Sun,

  // General
  rengøring: Home,
  cleaning: Home,
  cykelparkering: Bike,
  cykel: Bike,
  tv: Monitor,
  aircondition: Wind,
  ac: Wind,
  selskabsstue: Sofa,
  lounge: Sofa,
};

/**
 * Maps an amenity text to an appropriate icon component
 * @param {string} amenityText - The amenity description text
 * @returns {React.ComponentType} - The icon component or a default icon
 */
export function getAmenityIcon(amenityText) {
  const lowerText = amenityText.toLowerCase();

  // Try exact matches first
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (lowerText.includes(key)) {
      return icon;
    }
  }

  // Fallback to a generic icon
  return Sofa;
}

/**
 * Extracts a short label from the amenity text for display
 * @param {string} amenityText - The full amenity description
 * @returns {string} - A shorter display label
 */
export function getAmenityLabel(amenityText) {
  // Extract the first meaningful part before certain delimiters
  const labelMatch = amenityText.match(/^([^-–]*?)(?:\s*[-–]|$)/);
  const label = labelMatch ? labelMatch[1].trim() : amenityText;

  // Truncate long labels
  return label.length > 30 ? label.substring(0, 27) + "..." : label;
}
