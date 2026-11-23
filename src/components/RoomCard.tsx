import Link from "next/link";
import { formatMoney, cn } from "@/lib/utils";

type Props = {
  category: {
    slug: string;
    name: string;
    shortDesc: string;
    pricePerNight: number;
    maxOccupancy: number;
    bedType: string;
    roomSizeSqm: number | null;
    images: { url: string; isMain: boolean }[];
  };
  available?: number | null;
};

export function RoomCard({ category, available }: Props) {
  const main = category.images.find((i) => i.isMain) ?? category.images[0];
  const soldOut = available !== undefined && available !== null && available <= 0;
  return (
    <div className={cn("bg-white overflow-hidden shadow-sm card-hover border border-mist/60 flex flex-col", soldOut && "opacity-60")}>
      <Link href={`/rooms/${category.slug}`} className="relative block img-zoom aspect-[4/3] overflow-hidden bg-mist rounded-t-2xl">
        {main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main.url} alt={category.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bluegrey to-bluegrey-dark" />
        )}
        {soldOut && (
          <span className="absolute top-3 right-3 bg-ink/80 text-white text-xs px-3 py-1 rounded-full">Sold out</span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl">{category.name}</h3>
        <p className="text-sm text-ink-soft mt-1 line-clamp-2">{category.shortDesc}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-ink-soft">
          <span>Up to {category.maxOccupancy} guests</span>
          <span>{category.bedType}</span>
          {category.roomSizeSqm && <span>{category.roomSizeSqm} m²</span>}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-sm">
            <span className="font-display text-xl text-peach-dark">{formatMoney(category.pricePerNight)}</span>
            <span className="text-ink-soft"> / night</span>
          </p>
          <div className="flex gap-2">
            <Link href={`/rooms/${category.slug}`} className="text-xs border border-ink/20 hover:border-peach-dark hover:text-peach-dark px-3 py-2 rounded-full transition-colors">
              Details
            </Link>
            {soldOut ? (
              <span className="text-xs bg-mist text-ink-soft px-3 py-2 rounded-full">Unavailable</span>
            ) : (
              <Link href={`/book/${category.slug}`} className="text-xs bg-peach hover:bg-peach-dark text-white px-3 py-2 rounded-full transition-colors">
                Book
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
