export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function nightsBetween(checkIn: Date, checkOut: Date) {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);
}

export function parseDateParam(v: string | undefined | null): Date | null {
  if (!v) return null;
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export const AMENITY_LABELS: Record<string, string> = {
  "air-conditioning": "Air Conditioning",
  wifi: "Wi-Fi",
  tv: "Television",
  minibar: "Mini Bar",
  safe: "In-room Safe",
  balcony: "Balcony",
  bathtub: "Bathtub",
  shower: "Shower",
  coffee: "Coffee & Tea",
  desk: "Work Desk",
  wardrobe: "Wardrobe",
  ocean_view: "Ocean View",
  room_service: "Room Service",
  breakfast: "Breakfast Included",
};
