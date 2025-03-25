-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_evtolId_fkey";

-- AlterTable
ALTER TABLE "medications" ALTER COLUMN "evtolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "evtol"("id") ON DELETE SET NULL ON UPDATE CASCADE;
