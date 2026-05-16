-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'ONGOING', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "fairName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "entranceFee" INTEGER NOT NULL DEFAULT 0,
    "place" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "notice" TEXT,
    "eventNotes" TEXT,
    "thumbnail" TEXT,
    "visitorCount" INTEGER NOT NULL DEFAULT 0,
    "isExposed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
