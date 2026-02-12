/*
  Warnings:

  - You are about to drop the column `count` on the `UserBerries` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserBerries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "countCash" INTEGER NOT NULL DEFAULT 0,
    "countBank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UserBerries" ("createdAt", "guildId", "id", "updatedAt", "userId") SELECT "createdAt", "guildId", "id", "updatedAt", "userId" FROM "UserBerries";
DROP TABLE "UserBerries";
ALTER TABLE "new_UserBerries" RENAME TO "UserBerries";
CREATE INDEX "UserBerries_guildId_idx" ON "UserBerries"("guildId");
CREATE UNIQUE INDEX "UserBerries_userId_guildId_key" ON "UserBerries"("userId", "guildId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
