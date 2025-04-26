// import { eVTOL } from "@prisma/client";
// import { RegistereVTOLDto } from "../dtos/evtol.dto";

// export interface evtolServices {
//     registereVTOL(data:RegistereVTOLDto):Promise<eVTOL>
//     loadEVTOL(id:number):Promise<string|null>
//     getAllEvtols():Promise<eVTOL[]>
// }

import { eVTOL, Medication } from "@prisma/client";
import { RegistereVTOLDto } from "../dtos/evtol.dto";
import { LoadEVTOLDto } from "../dtos/loadEvtol.dto";

export interface evtolServices {
  registereVTOL(data: RegistereVTOLDto): Promise<eVTOL>;
  getAllEvtols(): Promise<eVTOL[]>;
  getAvailableEvtols(): Promise<eVTOL[]>;
  loadEVTOL(
    id: number,
    dto: LoadEVTOLDto
  ): Promise<eVTOL & { loads: { medication: Medication; quantity: number }[] }>;
  getLoadedMedications(
    evtolId: number
  ): Promise<{ medication: Medication; quantity: number }[]>;
  getBatteryLevel(evtolId: number): Promise<number>;
}
