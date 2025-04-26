import { Request, Response, NextFunction } from "express";
import { MedicationImpl } from "../service/impl/medication.impl";
import { RegisterMedicineDTO } from "../dtos/medications.dto";

export class MedicationController {
  private medicationService: MedicationImpl;

  constructor() {
    this.medicationService = new MedicationImpl();
  }

  public registerMedicine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as RegisterMedicineDTO;
      const medicine = await this.medicationService.registerMedicine(data);
      res.status(201).json(medicine);
    } catch (error) {
      next(error);
    }
  };

  public getAllMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicines = await this.medicationService.getAllMedications();
      res.status(200).json(medicines);
    } catch (error) {
      next(error);
    }
  };

  public getMedicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const medicine = await this.medicationService.getMedicationById(id);
      res.status(200).json(medicine);
    } catch (error) {
      next(error);
    }
  };
}
