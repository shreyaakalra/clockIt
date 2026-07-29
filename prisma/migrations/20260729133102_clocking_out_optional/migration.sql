/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "clockOutTime" DROP NOT NULL,
ALTER COLUMN "clockOutLatitude" DROP NOT NULL,
ALTER COLUMN "clockOutLongitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";
