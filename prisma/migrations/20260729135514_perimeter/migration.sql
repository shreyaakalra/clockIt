/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `radius` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Shift` table. All the data in the column will be lost.
  - Added the required column `perimeterId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_orgId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "createdAt",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "radius";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "orgId",
ADD COLUMN     "perimeterId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Perimeter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" INTEGER NOT NULL,

    CONSTRAINT "Perimeter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perimeter_name_orgId_key" ON "Perimeter"("name", "orgId");

-- AddForeignKey
ALTER TABLE "Perimeter" ADD CONSTRAINT "Perimeter_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_perimeterId_fkey" FOREIGN KEY ("perimeterId") REFERENCES "Perimeter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
