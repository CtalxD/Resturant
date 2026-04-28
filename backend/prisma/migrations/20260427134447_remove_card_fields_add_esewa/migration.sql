/*
  Warnings:

  - You are about to drop the column `accountLastFour` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `cardHolder` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `cardLastFour` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `cardType` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "accountLastFour",
DROP COLUMN "bankName",
DROP COLUMN "cardHolder",
DROP COLUMN "cardLastFour",
DROP COLUMN "cardType",
DROP COLUMN "postalCode",
ALTER COLUMN "paymentGateway" SET DEFAULT 'cash';
