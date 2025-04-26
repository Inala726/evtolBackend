import express from "express"
import { MedicationController } from "../controllers/medication.controller";
const medicationController = new MedicationController()
const medRoutes =  express.Router()

medRoutes.post("/register-med", medicationController.registerMedicine);
medRoutes.get("/", medicationController.getAllMedications);
medRoutes.get("/getMed/:id", medicationController.getMedicationById)

export default medRoutes