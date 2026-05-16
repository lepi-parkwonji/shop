-- CreateEnum
CREATE TYPE "ExhibitorStatus" AS ENUM ('PENDING', 'WAITING_PAYMENT', 'APPROVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BoothType" AS ENUM ('SPACE_ONLY', 'SHELL_SCHEME', 'PREMIUM');

-- CreateTable
CREATE TABLE "Exhibitor" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "businessRegNumber" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "boothType" "BoothType" NOT NULL DEFAULT 'SPACE_ONLY',
    "boothCount" INTEGER NOT NULL DEFAULT 1,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalFee" INTEGER NOT NULL DEFAULT 0,
    "status" "ExhibitorStatus" NOT NULL DEFAULT 'PENDING',
    "boothNumber" TEXT,
    "adminMemo" TEXT,
    "isExposed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Exhibitor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exhibitor" ADD CONSTRAINT "Exhibitor_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
