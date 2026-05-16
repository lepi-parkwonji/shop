-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "oauthProvider" TEXT NOT NULL DEFAULT 'KAKAO',
    "oauthId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_oauthId_key" ON "Customer"("oauthId");
