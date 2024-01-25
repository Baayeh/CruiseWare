/*
  Warnings:

  - Added the required column `businessID` to the `BusinessHours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BusinessHours` ADD COLUMN `businessID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `BusinessHours` ADD CONSTRAINT `BusinessHours_businessID_fkey` FOREIGN KEY (`businessID`) REFERENCES `Business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
