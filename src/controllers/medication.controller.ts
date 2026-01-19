import { Request, Response, NextFunction } from "express";
import { MedicationImpl } from "../service/impl/medication.impl";
import { RegisterMedicineDTO } from "../dtos/medications.dto";
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from "../dtos/pagination.dto";

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
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.service.getAllMedications(
        pagination.getSkip(),
        pagination.limit
      );
      const response = new PaginatedResponseDto(
        data,
        pagination.page,
        pagination.limit,
        total
      );
      res.status(200).json(response);
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