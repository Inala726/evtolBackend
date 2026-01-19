import { Medication } from "@prisma/client";
import { RegisterMedicineDTO } from "../../dtos/medications.dto";
import { medicationServices } from "../medications.services";
import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { StatusCodes } from "http-status-codes";

export class MedicationImpl implements medicationServices {
  async registerMedicine(data: RegisterMedicineDTO): Promise<Medication> {
    const isDrug = await db.medication.findFirst({
      where: { code: data.code },
    });

    if (isDrug) {
      throw new CustomError(
        StatusCodes.CONFLICT,
        "This drug already exists in the database"
      );
    }
    const medicine = await db.medication.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        code: data.code,
        weight: data.weight,
      },
    });
    return medicine;
  }

  async getAllMedications(skip?: number, take?: number): Promise<{ data: Medication[]; total: number }> {
    const [medications, total] = await Promise.all([
      db.medication.findMany({
        skip: skip || 0,
        take: take || 10,
        orderBy: { id: "desc" },
      }),
      db.medication.count(),
    ]);
    return { data: medications, total };
  }

  async getMedicationById(id: number): Promise<Medication | null> {
    const medication = await db.medication.findUnique({
      where: { id },
    });
    if (!medication) {
      throw new CustomError(404, "Medication not found");
    }
    return medication;
  }
}
