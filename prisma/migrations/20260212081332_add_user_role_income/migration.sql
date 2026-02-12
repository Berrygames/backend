-- CreateTable
CREATE TABLE "UserRoleIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleDbId" TEXT NOT NULL,
    "lastClaimed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRoleIncome_roleDbId_fkey" FOREIGN KEY ("roleDbId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserRoleIncome_guildId_idx" ON "UserRoleIncome"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleIncome_userId_guildId_roleDbId_key" ON "UserRoleIncome"("userId", "guildId", "roleDbId");
