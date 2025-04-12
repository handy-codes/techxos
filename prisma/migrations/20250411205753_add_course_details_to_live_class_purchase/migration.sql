/*
  Warnings:

  - You are about to drop the column `purchaseDate` on the `LiveClassPurchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LiveClassPurchase` DROP COLUMN `purchaseDate`,
    MODIFY `studentName` VARCHAR(191) NULL,
    MODIFY `studentEmail` VARCHAR(191) NULL,
    MODIFY `courseName` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `LiveClassPurchase_isActive_idx` ON `LiveClassPurchase`(`isActive`);

-- CreateIndex
CREATE INDEX `LiveClassPurchase_startDate_idx` ON `LiveClassPurchase`(`startDate`);

-- CreateIndex
CREATE INDEX `LiveClassPurchase_endDate_idx` ON `LiveClassPurchase`(`endDate`);
