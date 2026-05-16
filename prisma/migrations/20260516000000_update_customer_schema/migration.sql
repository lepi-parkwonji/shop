-- Rename oauthProvider to provider
ALTER TABLE "Customer" RENAME COLUMN "oauthProvider" TO "provider";

-- Change provider default from 'KAKAO' to 'LOCAL'
ALTER TABLE "Customer" ALTER COLUMN "provider" SET DEFAULT 'LOCAL';

-- Make oauthId nullable
ALTER TABLE "Customer" ALTER COLUMN "oauthId" DROP NOT NULL;

-- Add password column
ALTER TABLE "Customer" ADD COLUMN "password" TEXT;

-- Add unique constraint on email
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
