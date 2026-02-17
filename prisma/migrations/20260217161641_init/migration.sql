-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "centerLat" REAL,
    "centerLng" REAL,
    "radiusMeters" INTEGER,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SourcePost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "authorHandle" TEXT,
    "postedAt" DATETIME NOT NULL,
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" REAL,
    "lng" REAL,
    "mediaType" TEXT NOT NULL,
    "text" TEXT,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "SourcePost_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IngestRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "itemsInserted" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "IngestRun_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "SourcePost_eventId_idx" ON "SourcePost"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "SourcePost_platform_platformPostId_key" ON "SourcePost"("platform", "platformPostId");
