/*
  Warnings:

  - You are about to drop the column `name` on the `Requirement` table. All the data in the column will be lost.
  - Added the required column `requirementNumber` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "name",
ADD COLUMN     "requirementNumber" INTEGER NOT NULL;
