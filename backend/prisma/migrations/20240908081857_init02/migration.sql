/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_user_id_fkey";

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "user" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";
