/*
  Warnings:

  - A unique constraint covering the columns `[UserId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_UserId_key" ON "Conversation"("UserId");
