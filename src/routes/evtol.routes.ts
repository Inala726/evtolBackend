import express from "express"
import { EVTOLController } from "../controllers/evtol.controller"
const evtolController = new EVTOLController()
const evtolRoutes =  express.Router()

evtolRoutes.post("/registerDevice", evtolController.registereVTOL);
evtolRoutes.get("/", evtolController.getAllEvtols);
evtolRoutes.post("/loadDevice/:id", evtolController.loadEVTOL)

export default evtolRoutes