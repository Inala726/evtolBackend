// import { eVTOL } from "@prisma/client";
// import { RegistereVTOLDto } from "../../dtos/evtol.dto";
// import { evtolServices } from "../evtol.services";
// import { db } from "../../config/db";
// import { CustomError } from "../../utils/customError.utils";
// import { StatusCodes } from "http-status-codes";
// import { generateSerialNumber } from "../../utils/generateSerialnumber.utils";

// export class eVTOLServicesImplementation implements evtolServices {
//   async getAllEvtols(): Promise<eVTOL[]> {
//     return db.eVTOL.findMany();
//   }

//   async loadEVTOL(id: number): Promise<string> {
//     const evtol = await db.eVTOL.findUnique({
//       where: { id },
//     });
//     if (!evtol) {
//       throw new CustomError(StatusCodes.NOT_FOUND, "eVTOL not found");
//     }

//     if (evtol.battery < 25) {
//       throw new CustomError(
//         StatusCodes.NOT_ACCEPTABLE,
//         "Battery too low for loading"
//       );
//     }

//     // 3. Calculate the total weight of medications already loaded.
//     const totalLoadedWeight = await db.medication.aggregate({
//       where: { evtolId: id },
//       _sum: { weight: true },
//     });
//     const totalWeight = totalLoadedWeight._sum.weight || 0;
//     if (totalWeight > evtol.weightLimit) {
//       throw new CustomError(StatusCodes.BAD_REQUEST, "eVTOL overloaded!");
//     }

//     // 4. Update the eVTOL state to "LOADING" to indicate that the loading process is in progress.
//     await db.eVTOL.update({
//       where: { id },
//       data: { state: "LOADING" },
//     });

//     // (Optional) Simulate a loading process if needed.
//     // For example, you might have some asynchronous task here.
//     // await simulateLoadingProcess();

//     // 5. After loading completes, update the eVTOL state to "LOADED".
//     await db.eVTOL.update({
//       where: { id },
//       data: { state: "LOADED" },
//     });

//     return "eVTOL is loaded and ready for delivery!";
//   }

//   async registereVTOL(data: RegistereVTOLDto): Promise<eVTOL> {
//     const serialNumber = generateSerialNumber();

//     const evtol = await db.eVTOL.create({
//       data: {
//         serialNumber,
//         model: data.model,
//         battery: data.battery,
//       },
//     });
//     return evtol;
//   }
// }

import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import { State, eVTOL, Medication } from "@prisma/client";
import { evtolServices } from "../evtol.services";
import { RegistereVTOLDto } from "../../dtos/evtol.dto";
import { LoadEVTOLDto } from "../../dtos/loadEvtol.dto";
import { generateSerialNumber } from "../../utils/generateSerialnumber.utils";

export class eVTOLServicesImplementation implements evtolServices {
  async getAllEvtols(): Promise<eVTOL[]> {
    return db.eVTOL.findMany();
  }

  async getAvailableEvtols(): Promise<eVTOL[]> {
    return db.eVTOL.findMany({
      where: { state: State.IDLE, battery: { gte: 25 } },
    });
  }

  async registereVTOL(data: RegistereVTOLDto): Promise<eVTOL> {
    const serialNumber = generateSerialNumber();
    try {
      return await db.eVTOL.create({
        data: {
          serialNumber,
          model: data.model,
          battery: data.battery,
          weightLimit: data.weightLimit,
          image: data.image,
        },
      });
    } catch (err: any) {
      if (err.code === "P2002" && err.meta?.target?.includes("serialNumber")) {
        throw new CustomError(
          StatusCodes.CONFLICT,
          "Serial number already exists"
        );
      }
      throw err;
    }
  }

  async loadEVTOL(id: number, dto: LoadEVTOLDto): Promise<eVTOL & { loads: { medication: Medication; quantity: number }[] }> {
    return db.$transaction(async (tx) => {
      const evtol = await tx.eVTOL.findUnique({ where: { id } });
      if (!evtol) throw new CustomError(StatusCodes.NOT_FOUND, "eVTOL not found");
      if (evtol.battery < 25)
        throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Battery too low");

      const existingLoads = await tx.eVTOLLoad.findMany({
        where: { evtolId: id },
        include: { medication: true },
      });
      const currentWeight = existingLoads.reduce(
        (sum, l) => sum + l.medication.weight * l.quantity,
        0
      );

      const meds = await tx.medication.findMany({
        where: { id: { in: dto.items.map((i) => i.medicationId) } },
      });
      const newWeight = dto.items.reduce((sum, it) => {
        const med = meds.find((m) => m.id === it.medicationId)!;
        return sum + med.weight * it.quantity;
      }, 0);

      if (currentWeight + newWeight > evtol.weightLimit) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "Over weight limit");
      }

      await tx.eVTOL.update({
        where: { id },
        data: { state: State.LOADING },
      });

      await tx.eVTOLLoad.createMany({
        data: dto.items.map((it) => ({
          evtolId: id,
          medicationId: it.medicationId,
          quantity: it.quantity,
        })),
      });

      const updated = await tx.eVTOL.update({
        where: { id },
        data: { state: State.LOADED },
        include: { loads: { include: { medication: true } } },
      });
      return updated;
    });
  }

  async getLoadedMedications(evtolId: number) {
    return db.eVTOLLoad.findMany({
      where: { evtolId },
      include: { medication: true },
    }).then((loads) =>
      loads.map((l) => ({ medication: l.medication, quantity: l.quantity }))
    );
  }

  async getBatteryLevel(evtolId: number) {
    const e = await db.eVTOL.findUnique({
      where: { id: evtolId },
      select: { battery: true },
    });
    if (!e) throw new CustomError(StatusCodes.NOT_FOUND, "eVTOL not found");
    return e.battery;
  }
}
