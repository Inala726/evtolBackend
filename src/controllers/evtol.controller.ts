import { Request, Response, NextFunction } from "express";
import { eVTOLServicesImplementation } from "../service/impl/evtol.impl";
import { RegistereVTOLDto } from "../dtos/evtol.dto";

export class EVTOLController {
  private evtolService: eVTOLServicesImplementation;

  constructor() {
    this.evtolService = new eVTOLServicesImplementation();
  }

  public getAllEvtols = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const evtols = await this.evtolService.getAllEvtols();
      res.status(200).json(evtols);
    } catch (error) {
      next(error);
    }
  };

  public loadEVTOL = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const message = await this.evtolService.loadEVTOL(id);
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };

  public registereVTOL = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as RegistereVTOLDto;
      const evtol = await this.evtolService.registereVTOL(data);
      res.status(201).json(evtol);
    } catch (error) {
      next(error);
    }
  };
}
