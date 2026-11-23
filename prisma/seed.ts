import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

async function main() {
  await prisma.websiteSetting.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  await prisma.adminUser.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      name: "Hotel Administrator",
      role: "SUPER_ADMIN",
      passwordHash: hashPassword("admin123"),
    },
  });

  const roomData = [
    {
      slug: "standard-room",
      name: "Standard Room",
      shortDesc: "A cozy retreat with garden views and everything you need for a comfortable stay.",
      description:
        "Our Standard Rooms offer warm, contemporary comfort with a queen bed, rainfall shower and a private balcony overlooking the hotel gardens. Perfect for solo travellers and couples seeking a peaceful escape.",
      pricePerNight: 145,
      weekendRate: 165,
      maxAdults: 2,
      maxChildren: 1,
      maxOccupancy: 3,
      bedType: "1 Queen Bed",
      roomSizeSqm: 28,
      bathrooms: 1,
      amenities: ["air-conditioning", "wifi", "tv", "shower", "coffee", "wardrobe", "balcony"],
      featured: true,
      images: [
        { url: IMG("photo-1631049307264-da0ec9d70304"), isMain: true, caption: "Standard Room" },
        { url: IMG("photo-1590490360182-c33d57733427"), caption: "Bedroom detail" },
        { url: IMG("photo-1584622650111-993a426fbf0a"), caption: "Bathroom" },
      ],
      rooms: ["101", "102", "103"],
    },
    {
      slug: "deluxe-room",
      name: "Deluxe Room",
      shortDesc: "Elevated comfort with ocean views, a king bed and premium amenities.",
      description:
        "Deluxe Rooms feature a king-sized bed, a spacious seating area and floor-to-ceiling windows framing panoramic ocean views. Enjoy a deep soaking tub, espresso machine and nightly turndown service.",
      pricePerNight: 240,
      weekendRate: 275,
      maxAdults: 2,
      maxChildren: 2,
      maxOccupancy: 4,
      bedType: "1 King Bed",
      roomSizeSqm: 38,
      bathrooms: 1,
      amenities: ["air-conditioning", "wifi", "tv", "minibar", "bathtub", "coffee", "desk", "ocean_view", "room_service"],
      featured: true,
      images: [
        { url: IMG("photo-1611892440504-42a792e24d32"), isMain: true, caption: "Deluxe Room" },
        { url: IMG("photo-1591088398332-8a779197be5c"), caption: "Ocean view" },
        { url: IMG("photo-1566665797739-1674de7a421a"), caption: "Bathroom" },
      ],
      rooms: ["201", "202", "203", "204", "205"],
    },
    {
      slug: "family-suite",
      name: "Family Suite",
      shortDesc: "Two connecting bedrooms designed for families and longer stays.",
      description:
        "The Family Suite offers a generous layout with a master bedroom, a second bedroom with twin beds, and a living area. Perfect for families who want space, privacy and convenience.",
      pricePerNight: 380,
      weekendRate: 430,
      maxAdults: 4,
      maxChildren: 2,
      maxOccupancy: 6,
      bedType: "1 King + 2 Twins",
      roomSizeSqm: 58,
      bathrooms: 2,
      amenities: ["air-conditioning", "wifi", "tv", "minibar", "coffee", "desk", "balcony", "room_service", "ocean_view"],
      featured: false,
      images: [
        { url: IMG("photo-1595576508898-0ad5c879a061"), isMain: true, caption: "Family Suite" },
        { url: IMG("photo-1618773928121-c32242e63f39"), caption: "Living area" },
      ],
      rooms: ["301", "302"],
    },
    {
      slug: "executive-suite",
      name: "Executive Suite",
      shortDesc: "A luxurious suite with panoramic views, a private terrace and butler service.",
      description:
        "The Executive Suite is the pinnacle of hotel living: a king bed, separate lounge, private terrace with ocean views, and dedicated butler service. Includes complimentary breakfast and airport transfers.",
      pricePerNight: 560,
      weekendRate: 640,
      maxAdults: 2,
      maxChildren: 1,
      maxOccupancy: 3,
      bedType: "1 King Bed",
      roomSizeSqm: 72,
      bathrooms: 2,
      amenities: ["air-conditioning", "wifi", "tv", "minibar", "safe", "bathtub", "coffee", "desk", "balcony", "ocean_view", "room_service", "breakfast"],
      featured: true,
      images: [
        { url: IMG("photo-1596394516093-501ba68a0ba6"), isMain: true, caption: "Executive Suite" },
        { url: IMG("photo-1611892440504-42a792e24d32"), caption: "Terrace view" },
      ],
      rooms: ["401"],
    },
  ];

  for (const r of roomData) {
    const { rooms, images, ...data } = r;
    const cat = await prisma.roomCategory.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        ...data,
        amenities: JSON.stringify(data.amenities),
        images: { create: images.map((im, i) => ({ ...im, order: i })) },
      },
      include: { images: true },
    });
    for (const num of rooms) {
      await prisma.physicalRoom.upsert({
        where: { number: num },
        update: { categoryId: cat.id },
        create: { number: num, categoryId: cat.id },
      });
    }
  }

  const facilities = [
    { title: "Infinity Pool", description: "A stunning oceanfront infinity pool open from sunrise to sunset.", icon: "pool", imageUrl: IMG("photo-1571896349842-33c89424de2d") },
    { title: "Azure Restaurant", description: "Fine dining with locally sourced cuisine and panoramic sea views.", icon: "restaurant", imageUrl: IMG("photo-1517248135467-4c7edcad34c4") },
    { title: "Sunset Bar", description: "Craft cocktails and live music as the sun dips below the horizon.", icon: "bar", imageUrl: IMG("photo-1470337458703-46ad1756a187") },
    { title: "Serenity Spa", description: "Rejuvenating treatments, sauna and couples' massage therapies.", icon: "spa", imageUrl: IMG("photo-1540555700478-4be289fbecef") },
    { title: "Fitness Centre", description: "State-of-the-art equipment with personal training available.", icon: "fitness", imageUrl: IMG("photo-1534438327276-14e5300c3a48") },
    { title: "Grand Ballroom", description: "Elegant event space for weddings, conferences and celebrations.", icon: "events", imageUrl: IMG("photo-1519167758481-83f550bb49b3") },
  ];
  for (let i = 0; i < facilities.length; i++) {
    const f = facilities[i];
    const existing = await prisma.facility.findFirst({ where: { title: f.title } });
    if (!existing) await prisma.facility.create({ data: { ...f, order: i } });
  }

  const gallery = [
    { url: IMG("photo-1566073771259-6a8506099945"), caption: "Hotel Exterior", category: "EXTERIOR" as const },
    { url: IMG("photo-1582719508461-905c673771fd"), caption: "Lobby", category: "FACILITIES" as const },
    { url: IMG("photo-1571003123894-1f0594d2b5d9"), caption: "Deluxe Room", category: "ROOMS" as const },
    { url: IMG("photo-1596394516093-501ba68a0ba6"), caption: "Executive Suite", category: "SUITES" as const },
    { url: IMG("photo-1540541338287-41700207dee6"), caption: "Pool Deck", category: "POOL" as const },
    { url: IMG("photo-1517248135467-4c7edcad34c4"), caption: "Restaurant", category: "RESTAURANT" as const },
    { url: IMG("photo-1469371670807-013ccf25f16a"), caption: "Coastline", category: "SURROUNDINGS" as const },
    { url: IMG("photo-1519167758481-83f550bb49b3"), caption: "Grand Ballroom", category: "EVENTS" as const },
  ];
  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i];
    const existing = await prisma.galleryImage.findFirst({ where: { url: g.url } });
    if (!existing) await prisma.galleryImage.create({ data: { ...g, order: i, featured: i < 4 } });
  }

  const testimonials = [
    { guestName: "Sarah Mitchell", rating: 5, review: "An absolutely stunning property. The ocean views from our suite were breathtaking and the service was impeccable from check-in to checkout.", date: new Date("2026-08-14") },
    { guestName: "James Okafor", rating: 5, review: "The infinity pool at sunset is something I'll never forget. Staff went above and beyond to make our anniversary special.", date: new Date("2026-07-02") },
    { guestName: "Elena Rossi", rating: 4, review: "Beautiful rooms and delicious food at Azure Restaurant. The spa treatments were world-class. Will definitely return.", date: new Date("2026-06-21") },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { guestName: t.guestName } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }
}

main().finally(() => prisma.$disconnect());
