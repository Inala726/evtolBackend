import { Request, Response, NextFunction } from "express";
import { eVTOLServicesImplementation } from "../service/impl/evtol.impl";
import { RegistereVTOLDto } from "../dtos/evtol.dto";
import { LoadEVTOLDto } from "../dtos/loadEvtol.dto";
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from "../dtos/pagination.dto";

export class EVTOLController {
  private service = new eVTOLServicesImplementation();

  // 1. Register a new EVTOL
  public registereVTOL = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = req.body as RegistereVTOLDto;
      const created = await this.service.registereVTOL(dto);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  // 2. List ALL EVTOLs
  public getAllEvtols = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.service.getAllEvtols(
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

  // 3. List only AVAILABLE EVTOLs (IDLE & battery ≥25%)
  public getAvailableEvtols = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.service.getAvailableEvtols(
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

  // 4. Load medications onto an EVTOL
  public loadEVTOL = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const dto = req.body as LoadEVTOLDto;
      const updated = await this.service.loadEVTOL(id, dto);

      // Optionally flatten loads for response:
      const loads = updated.loads.map(({ medication, quantity }) => ({
        ...medication,
        quantity,
      }));

      res.status(200).json({
        evtol: {
          id: updated.id,
          serialNumber: updated.serialNumber,
          model: updated.model,
          state: updated.state,
          battery: updated.battery,
          weightLimit: updated.weightLimit,
          image: updated.image,
        },
        loads,
      });
    } catch (err) {
      next(err);
    }
  };

  // 5. Get the current load manifest for one EVTOL
  public getLoadedMedications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const loads = await this.service.getLoadedMedications(id);
      res.status(200).json(loads);
    } catch (err) {
      next(err);
    }
  };

  // 6. Get battery level for one EVTOL
  public getBatteryLevel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const battery = await this.service.getBatteryLevel(id);
      res.status(200).json({ battery });
    } catch (err) {
      next(err);
    }
  };
}
