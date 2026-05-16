-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "shootingDate" TEXT;
