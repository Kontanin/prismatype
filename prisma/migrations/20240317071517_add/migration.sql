/*
  Warnings:

  - Added the required column `username` to the `Blob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blob" ADD COLUMN     "username" TEXT NOT NULL;
