/*
  Warnings:

  - Added the required column `serialNumber` to the `evtol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evtol" ADD COLUMN     "serialNumber" TEXT NOT NULL;
