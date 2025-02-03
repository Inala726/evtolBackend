/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `evtol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "evtol_serialNumber_key" ON "evtol"("serialNumber");
