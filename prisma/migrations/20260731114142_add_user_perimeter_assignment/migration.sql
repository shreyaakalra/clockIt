-- AlterTable
ALTER TABLE "User" ADD COLUMN     "perimeterId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_perimeterId_fkey" FOREIGN KEY ("perimeterId") REFERENCES "Perimeter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
