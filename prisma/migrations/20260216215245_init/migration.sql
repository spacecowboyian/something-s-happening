-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceId" TEXT,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "author" TEXT,
    "authorUrl" TEXT,
    "timestamp" DATETIME NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Event_status_startTime_idx" ON "Event"("status", "startTime");

-- CreateIndex
CREATE INDEX "Event_startTime_endTime_idx" ON "Event"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "Media_eventId_timestamp_idx" ON "Media"("eventId", "timestamp");

-- CreateIndex
CREATE INDEX "Media_source_sourceId_idx" ON "Media"("source", "sourceId");

-- CreateIndex
CREATE INDEX "Media_timestamp_idx" ON "Media"("timestamp");
