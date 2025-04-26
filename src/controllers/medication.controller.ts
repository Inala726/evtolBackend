import { Request, Response, NextFunction } from "express";
import { MedicationImpl } from "../service/impl/medication.impl";
import { RegisterMedicineDTO } from "../dtos/medications.dto";

export class MedicationController {
  private service = new MedicationImpl();

  // 1. Register a new Medication
  public registerMedicine = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = req.body as RegisterMedicineDTO;
      const med = await this.service.registerMedicine(dto);
      res.status(201).json(med);
    } catch (err) {
      next(err);
    }
  };

  // 2. List all Medications
  public getAllMedications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const list = await this.service.getAllMedications();
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  };

  // 3. Get one Medication by ID
  public getMedicationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const med = await this.service.getMedicationById(id);
      res.status(200).json(med);
    } catch (err) {
      next(err);
    }
  };
}