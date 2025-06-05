/*
  Warnings:

  - Added the required column `enrolmentCode` to the `SubjectInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectInstance" ADD COLUMN     "enrolmentCode" INTEGER NOT NULL;
