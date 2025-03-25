import { Medication } from "@prisma/client";
import { RegisterMedicineDTO } from "../dtos/medications.dto";

export interface medicationServices {
  registerMedicine(data: RegisterMedicineDTO): Promise<Medication>;
  getAllMedications(): Promise<Medication[]>;
  getMedicationById(id: number): Promise<Medication | null>;
}
