/*
  Warnings:

  - Added the required column `createdById` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requirement" ADD COLUMN     "createdById" TEXT NOT NULL;
