/*
  Warnings:

  - You are about to drop the column `user` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "user",
ALTER COLUMN "user_id" SET DATA TYPE TEXT;
