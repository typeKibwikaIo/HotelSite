"use server";

import { prisma } from "@/lib/db";
import { availableQuantity, generateReference, priceForNights } from "@/lib/availability";
import { nightsBetween, parseDateParam } from "@/lib/utils";
import { redirect } from "next/navigation";

export type BookingState = { error?: string } | null;

export async function createReservation(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const slug = String(formData.get("slug") || "");
  const checkIn = parseDateParam(String(formData.get("checkIn") || ""));
  const checkOut = parseDateParam(String(formData.get("checkOut") || ""));
  const adults = parseInt(String(formData.get("adults") || "1"), 10);
  const children = parseInt(String(formData.get("children") || "0"), 10);
  const rooms = parseInt(String(formData.get("rooms") || "1"), 10);
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const specialRequests = String(formData.get("specialRequests") || "").trim();

  if (!checkIn || !checkOut || checkOut <= checkIn) return { error: "Please choose valid check-in and check-out dates." };
  if (!firstName || !lastName || !email) return { error: "Please provide your name and email address." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (rooms < 1 || adults < 1) return { error: "Invalid number of rooms or guests." };

  const category = await prisma.roomCategory.findUnique({ where: { slug } });
  if (!category || !category.published) return { error: "This room type is no longer available." };

  if (adults > category.maxAdults * rooms || children > category.maxChildren * rooms) {
    return { error: `This room accommodates up to ${category.maxAdults} adults and ${category.maxChildren} children per room.` };
  }

  const available = await availableQuantity(category.id, checkIn, checkOut);
  if (available < rooms) {
    return { error: `Only ${Math.max(available, 0)} room(s) of this type are available for the selected dates.` };
  }

  const nights = nightsBetween(checkIn, checkOut);
  const stayTotalPerRoom = priceForNights(category, checkIn, checkOut);
  const totalAmount = stayTotalPerRoom * rooms;

  const settings = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });
  const reference = await generateReference();

  const reservation = await prisma.reservation.create({
    data: {
      reference,
      status: settings?.autoConfirm ? "CONFIRMED" : "PENDING",
      checkIn,
      checkOut,
      adults,
      children,
      roomsCount: rooms,
      totalAmount,
      specialRequests,
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: email,
      guestPhone: phone,
      guestCountry: country,
      rooms: {
        create: {
          categoryId: category.id,
          checkIn,
          checkOut,
          pricePerNight: stayTotalPerRoom / nights,
          quantity: rooms,
          nights,
          lineTotal: totalAmount,
        },
      },
    },
  });

  redirect(`/booking/confirmation/${reservation.reference}`);
}
