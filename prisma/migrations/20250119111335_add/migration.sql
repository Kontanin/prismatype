-- AlterTable
ALTER TABLE "Blob" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isActive" SET DEFAULT true;
