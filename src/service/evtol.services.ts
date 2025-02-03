import { eVTOL } from "@prisma/client";
import { RegistereVTOLDto } from "../dtos/evtol.dto";

export interface evtolServices {
    registereVTOL(data:RegistereVTOLDto):Promise<eVTOL>
    loadEVTOL(id:number):Promise<string|null>
    getAllEvtols():Promise<eVTOL[]>
}
