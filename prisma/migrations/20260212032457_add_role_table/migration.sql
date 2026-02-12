-- CreateTable
CREATE TABLE "UserBerries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "UserBerries_guildId_idx" ON "UserBerries"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBerries_userId_guildId_key" ON "UserBerries"("userId", "guildId");

-- CreateIndex
CREATE INDEX "Role_guildId_idx" ON "Role"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleId_guildId_key" ON "Role"("roleId", "guildId");
