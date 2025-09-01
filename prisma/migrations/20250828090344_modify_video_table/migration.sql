-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "privacy" TEXT NOT NULL DEFAULT 'PUBLIC',
    "originalFilePath" TEXT NOT NULL,
    "hlsManifestPath" TEXT,
    "thumbnailPath" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "file_size" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "campaignStartDate" DATETIME NOT NULL,
    "campaignEndDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("campaignEndDate", "campaignStartDate", "createdAt", "description", "errorMessage", "hlsManifestPath", "id", "originalFilePath", "progressPercent", "status", "thumbnailPath", "title", "updatedAt", "userId") SELECT "campaignEndDate", "campaignStartDate", "createdAt", "description", "errorMessage", "hlsManifestPath", "id", "originalFilePath", "progressPercent", "status", "thumbnailPath", "title", "updatedAt", "userId" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE INDEX "Video_userId_idx" ON "Video"("userId");
CREATE INDEX "Video_status_idx" ON "Video"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
