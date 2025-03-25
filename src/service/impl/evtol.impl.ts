import { eVTOL } from "@prisma/client";
import { RegistereVTOLDto } from "../../dtos/evtol.dto";
import { evtolServices } from "../evtol.services";
import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import { generateSerialNumber } from "../../utils/generateSerialnumber.utils";

export class eVTOLServicesImplementation implements evtolServices {
  async getAllEvtols(): Promise<eVTOL[]> {
    return db.eVTOL.findMany();
  }
  
  async loadEVTOL(id: number): Promise<string | null> {
    const evtol = await db.eVTOL.findUnique({
      where: { id: id },
    });

    if (!evtol) {
      throw new CustomError(StatusCodes.NOT_FOUND, "evtol not found");
    }

    if (evtol.battery < 25) {
      throw new CustomError(
        StatusCodes.NOT_ACCEPTABLE,
        "battery too low for loading"
      );
    }

    const totalLoadedWeight = await db.medication.aggregate({
      where: { evtolId: id },
      _sum: { weight: true },
    });

    const totalWeight = totalLoadedWeight._sum.weight || 0;

    if (totalWeight > evtol.weightLimit) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "eVTOL overloaded!");
    }

    return "eVTOL is ready for loading!";
  }

  async registereVTOL(data: RegistereVTOLDto): Promise<eVTOL> {
    const iseVTOL = await db.eVTOL.findFirst({
      where: {
        serialNumber: data.serialNumber,
      },
    });
    if (iseVTOL) {
      throw new CustomError(
        StatusCodes.CONFLICT,
        "evtol device already exists"
      );
    }
    const serialNumber = generateSerialNumber();
    const evtol = await db.eVTOL.create({
      data: {
        serialNumber: serialNumber,
        model: data.model,
        battery: data.battery,
      },
    });
    return evtol;
  }
}
