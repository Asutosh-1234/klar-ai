-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gmailId" TEXT NOT NULL,
    "subject" TEXT,
    "sender" TEXT,
    "snippet" TEXT,
    "body" TEXT,
    "priority" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3),
    "embedding" vector(768),

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_gmailId_key" ON "Email"("gmailId");

-- CreateIndex
CREATE INDEX "Email_userId_idx" ON "Email"("userId");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
