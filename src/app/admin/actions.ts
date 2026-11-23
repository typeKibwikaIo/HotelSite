"use server";

import { prisma } from "@/lib/db";
import { requireAdmin, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ---------- Auth ----------

export async function adminLogin(_prev: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }
  await createSession(user.id);
  redirect("/admin");
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Room categories ----------

export async function saveRoomCategory(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Name is required." };
  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  const price = parseFloat(String(formData.get("pricePerNight") || "0"));
  if (!(price > 0)) return { error: "Price per night must be greater than 0." };

  const data = {
    name,
    slug,
    shortDesc: String(formData.get("shortDesc") || ""),
    description: String(formData.get("description") || ""),
    pricePerNight: price,
    weekendRate: formData.get("weekendRate") ? parseFloat(String(formData.get("weekendRate"))) : null,
    maxAdults: parseInt(String(formData.get("maxAdults") || "2"), 10),
    maxChildren: parseInt(String(formData.get("maxChildren") || "0"), 10),
    maxOccupancy: parseInt(String(formData.get("maxOccupancy") || "2"), 10),
    bedType: String(formData.get("bedType") || "1 Queen Bed"),
    roomSizeSqm: formData.get("roomSizeSqm") ? parseFloat(String(formData.get("roomSizeSqm"))) : null,
    bathrooms: parseInt(String(formData.get("bathrooms") || "1"), 10),
    amenities: JSON.stringify(String(formData.get("amenities") || "").split(",").map((s) => s.trim()).filter(Boolean)),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };

  try {
    if (id) {
      await prisma.roomCategory.update({ where: { id }, data });
    } else {
      await prisma.roomCategory.create({ data });
    }
  } catch {
    return { error: "A room with this slug already exists." };
  }
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect("/admin/rooms");
}

export async function deleteRoomCategory(id: string) {
  await requireAdmin();
  const count = await prisma.reservationRoom.count({ where: { categoryId: id } });
  if (count > 0) {
    await prisma.roomCategory.update({ where: { id }, data: { published: false } });
    revalidatePath("/admin/rooms");
    return;
  }
  await prisma.roomCategory.delete({ where: { id } });
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
}

// ---------- Room images ----------

export async function addRoomImage(categoryId: string, formData: FormData) {
  await requireAdmin();
  const url = String(formData.get("url") || "").trim();
  if (!url) return;
  const max = await prisma.roomImage.aggregate({ _max: { order: true }, where: { categoryId } });
  const isFirst = (await prisma.roomImage.count({ where: { categoryId } })) === 0;
  await prisma.roomImage.create({
    data: { categoryId, url, caption: String(formData.get("caption") || ""), order: (max._max.order ?? -1) + 1, isMain: isFirst },
  });
  revalidatePath(`/admin/rooms/${categoryId}`);
  revalidatePath("/rooms");
}

export async function deleteRoomImage(imageId: string, categoryId: string) {
  await requireAdmin();
  await prisma.roomImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/rooms/${categoryId}`);
}

export async function setMainImage(imageId: string, categoryId: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.roomImage.updateMany({ where: { categoryId }, data: { isMain: false } }),
    prisma.roomImage.update({ where: { id: imageId }, data: { isMain: true } }),
  ]);
  revalidatePath(`/admin/rooms/${categoryId}`);
  revalidatePath("/rooms");
}

// ---------- Physical rooms ----------

export async function addPhysicalRoom(categoryId: string, formData: FormData) {
  await requireAdmin();
  const number = String(formData.get("number") || "").trim();
  if (!number) return;
  await prisma.physicalRoom.create({
    data: { number, categoryId, notes: String(formData.get("notes") || "") },
  });
  revalidatePath(`/admin/rooms/${categoryId}`);
}

export async function updatePhysicalRoomStatus(roomId: string, categoryId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") || "AVAILABLE");
  await prisma.physicalRoom.update({ where: { id: roomId }, data: { status: status as never } });
  revalidatePath(`/admin/rooms/${categoryId}`);
}

export async function deletePhysicalRoom(roomId: string, categoryId: string) {
  await requireAdmin();
  await prisma.physicalRoom.delete({ where: { id: roomId } });
  revalidatePath(`/admin/rooms/${categoryId}`);
}

// ---------- Reservations ----------

export async function updateReservationStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") || "PENDING");
  await prisma.reservation.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/rooms");
}

export async function updatePaymentStatus(id: string, formData: FormData) {
  await requireAdmin();
  const paymentStatus = String(formData.get("paymentStatus") || "UNPAID");
  await prisma.reservation.update({ where: { id }, data: { paymentStatus: paymentStatus as never } });
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
}

export async function updateReservationNotes(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.reservation.update({
    where: { id },
    data: { internalNotes: String(formData.get("internalNotes") || "") },
  });
  revalidatePath(`/admin/reservations/${id}`);
}

// ---------- Settings ----------

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const str = (k: string) => String(formData.get(k) || "");
  await prisma.websiteSetting.upsert({
    where: { id: "settings" },
    update: {
      hotelName: str("hotelName"),
      tagline: str("tagline"),
      heroTitle: str("heroTitle"),
      heroSubtitle: str("heroSubtitle"),
      aboutTitle: str("aboutTitle"),
      aboutText: str("aboutText"),
      address: str("address"),
      phone: str("phone"),
      email: str("email"),
      mapsUrl: str("mapsUrl"),
      notificationEmail: str("notificationEmail"),
      autoConfirm: formData.get("autoConfirm") === "on",
      socialFacebook: str("socialFacebook"),
      socialInstagram: str("socialInstagram"),
      socialTwitter: str("socialTwitter"),
    },
    create: { id: "settings" },
  });
  revalidatePath("/");
  redirect("/admin/content/settings?saved=1");
}

// ---------- Facilities ----------

export async function saveFacility(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title is required." };
  const data = {
    title,
    description: String(formData.get("description") || ""),
    icon: String(formData.get("icon") || "star"),
    imageUrl: String(formData.get("imageUrl") || ""),
    published: formData.get("published") === "on",
    order: parseInt(String(formData.get("order") || "0"), 10),
  };
  if (id) await prisma.facility.update({ where: { id }, data });
  else await prisma.facility.create({ data });
  revalidatePath("/admin/content/facilities");
  revalidatePath("/facilities");
  redirect("/admin/content/facilities");
}

export async function deleteFacility(id: string) {
  await requireAdmin();
  await prisma.facility.delete({ where: { id } });
  revalidatePath("/admin/content/facilities");
}

// ---------- Gallery ----------

export async function saveGalleryImage(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const url = String(formData.get("url") || "").trim();
  if (!url) return { error: "Image URL is required." };
  const data = {
    url,
    caption: String(formData.get("caption") || ""),
    category: (String(formData.get("category") || "FACILITIES") || "FACILITIES") as never,
    featured: formData.get("featured") === "on",
    order: parseInt(String(formData.get("order") || "0"), 10),
  };
  if (id) await prisma.galleryImage.update({ where: { id }, data });
  else await prisma.galleryImage.create({ data });
  revalidatePath("/admin/content/gallery");
  revalidatePath("/gallery");
  redirect("/admin/content/gallery");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/content/gallery");
}

// ---------- Testimonials ----------

export async function saveTestimonial(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const guestName = String(formData.get("guestName") || "").trim();
  const review = String(formData.get("review") || "").trim();
  if (!guestName || !review) return { error: "Guest name and review are required." };
  const data = {
    guestName,
    review,
    rating: Math.min(5, Math.max(1, parseInt(String(formData.get("rating") || "5"), 10))),
    guestPhoto: String(formData.get("guestPhoto") || ""),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/reviews");
  redirect("/admin/content/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/content/testimonials");
}
