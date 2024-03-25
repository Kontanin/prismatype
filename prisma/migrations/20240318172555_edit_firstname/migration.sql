/*
  Warnings:

  - You are about to drop the column `fristname` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "fristname",
ADD COLUMN     "firstname" TEXT NOT NULL;
