-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WebsiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'settings',
    "hotelName" TEXT NOT NULL DEFAULT 'The Grand Azure',
    "tagline" TEXT NOT NULL DEFAULT 'A peaceful retreat by the coast',
    "heroTitle" TEXT NOT NULL DEFAULT 'Discover Your Perfect Stay',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Experience timeless elegance, breathtaking views and impeccable hospitality at our award-winning hotel and resort.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'A Hotel Crafted for Unforgettable Moments',
    "aboutText" TEXT NOT NULL DEFAULT 'Nestled along the pristine coastline, The Grand Azure offers a sanctuary of comfort and sophistication. From sunrise over the ocean to candlelit evenings, every detail is designed to make your stay extraordinary.',
    "address" TEXT NOT NULL DEFAULT '12 Oceanview Boulevard, Coastal Bay',
    "phone" TEXT NOT NULL DEFAULT '+1 (555) 010-2030',
    "email" TEXT NOT NULL DEFAULT 'stay@grandaazure.com',
    "mapsUrl" TEXT NOT NULL DEFAULT 'https://maps.google.com',
    "notificationEmail" TEXT NOT NULL DEFAULT 'admin@grandaazure.com',
    "autoConfirm" BOOLEAN NOT NULL DEFAULT true,
    "socialFacebook" TEXT NOT NULL DEFAULT '',
    "socialInstagram" TEXT NOT NULL DEFAULT '',
    "socialTwitter" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "RoomCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "pricePerNight" REAL NOT NULL,
    "weekendRate" REAL,
    "maxAdults" INTEGER NOT NULL DEFAULT 2,
    "maxChildren" INTEGER NOT NULL DEFAULT 0,
    "maxOccupancy" INTEGER NOT NULL DEFAULT 2,
    "bedType" TEXT NOT NULL DEFAULT '1 Queen Bed',
    "roomSizeSqm" REAL,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoomImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL DEFAULT '',
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "RoomImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RoomCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PhysicalRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhysicalRoom_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RoomCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'star',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'FACILITIES',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "review" TEXT NOT NULL,
    "guestPhoto" TEXT NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" TEXT NOT NULL DEFAULT 'PAY_AT_HOTEL',
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "roomsCount" INTEGER NOT NULL DEFAULT 1,
    "totalAmount" REAL NOT NULL DEFAULT 0,
    "specialRequests" TEXT NOT NULL DEFAULT '',
    "internalNotes" TEXT NOT NULL DEFAULT '',
    "guestFirstName" TEXT NOT NULL,
    "guestLastName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL DEFAULT '',
    "guestCountry" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReservationRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "physicalRoomId" TEXT,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "nights" INTEGER NOT NULL,
    "lineTotal" REAL NOT NULL,
    CONSTRAINT "ReservationRoom_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReservationRoom_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RoomCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReservationRoom_physicalRoomId_fkey" FOREIGN KEY ("physicalRoomId") REFERENCES "PhysicalRoom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoomCategory_slug_key" ON "RoomCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalRoom_number_key" ON "PhysicalRoom"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reference_key" ON "Reservation"("reference");
