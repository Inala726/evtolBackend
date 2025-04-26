/*
  Warnings:

  - You are about to drop the column `evtolId` on the `medications` table. All the data in the column will be lost.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_evtolId_fkey";

-- AlterTable
ALTER TABLE "evtol" ALTER COLUMN "weightLimit" DROP DEFAULT;

-- AlterTable
ALTER TABLE "medications" DROP COLUMN "evtolId";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "otpExpiry" DROP DEFAULT;

-- DropTable
DROP TABLE "OrderItems";

-- CreateTable
CREATE TABLE "evtol_loads" (
    "id" SERIAL NOT NULL,
    "evtolId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "loadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evtol_loads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battery_logs" (
    "id" SERIAL NOT NULL,
    "evtolId" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battery_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatches" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "evtolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dispatches_orderId_key" ON "dispatches"("orderId");

-- AddForeignKey
ALTER TABLE "evtol_loads" ADD CONSTRAINT "evtol_loads_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "evtol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evtol_loads" ADD CONSTRAINT "evtol_loads_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battery_logs" ADD CONSTRAINT "battery_logs_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "evtol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "evtol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
