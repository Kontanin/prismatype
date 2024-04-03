/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `Blob` table. All the data in the column will be lost.
  - Added the required column `User_id` to the `Blob` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blob" DROP CONSTRAINT "Blob_userUser_id_fkey";

-- AlterTable
ALTER TABLE "Blob" DROP COLUMN "userUser_id",
ADD COLUMN     "User_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Blob" ADD CONSTRAINT "Blob_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
