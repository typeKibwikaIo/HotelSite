import { prisma } from "./db";
import { nightsBetween } from "./utils";
import type { RoomCategory } from "@prisma/client";

const DAY = 86400000;

// Nights that count as "weekend" for weekendRate pricing (Fri & Sat nights)
function isWeekendNight(d: Date) {
  const day = d.getDay();
  return day === 5 || day === 6;
}

export function priceForNights(category: RoomCategory, checkIn: Date, checkOut: Date) {
  let total = 0;
  const nights = nightsBetween(checkIn, checkOut);
  for (let i = 0; i < nights; i++) {
    const night = new Date(checkIn.getTime() + i * DAY);
    total += category.weekendRate && isWeekendNight(night)
      ? category.weekendRate
      : category.pricePerNight;
  }
  return total;
}

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "COMPLETED", "NO_SHOW"];

// Physical rooms that can be sold: excludes maintenance/blocked
export async function bookableRoomCount(categoryId: string) {
  return prisma.physicalRoom.count({
    where: { categoryId, status: { notIn: ["MAINTENANCE", "BLOCKED"] } },
  });
}

// Quantity already reserved overlapping the date range
export async function reservedQuantity(categoryId: string, checkIn: Date, checkOut: Date) {
  const agg = await prisma.reservationRoom.aggregate({
    _sum: { quantity: true },
    where: {
      categoryId,
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
      reservation: { status: { in: ACTIVE_STATUSES as never } },
    },
  });
  return agg._sum.quantity ?? 0;
}

export async function availableQuantity(categoryId: string, checkIn: Date, checkOut: Date) {
  const [bookable, reserved] = await Promise.all([
    bookableRoomCount(categoryId),
    reservedQuantity(categoryId, checkIn, checkOut),
  ]);
  return bookable - reserved;
}

// Returns map categoryId -> available quantity for the given dates (no dates = full bookable count)
export async function availabilityMap(categoryIds: string[], checkIn?: Date | null, checkOut?: Date | null) {
  const map = new Map<string, number>();
  for (const id of categoryIds) {
    map.set(
      id,
      checkIn && checkOut
        ? await availableQuantity(id, checkIn, checkOut)
        : await bookableRoomCount(id)
    );
  }
  return map;
}

export async function generateReference(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  const exists = await prisma.reservation.findUnique({ where: { reference: `GRZ-${ref}` } });
  return exists ? generateReference() : `GRZ-${ref}`;
}
