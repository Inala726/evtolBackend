/**
 * @swagger
 * /evtol/v1/medications/register-med:
 *   post:
 *     tags:
 *       - Medications
 *     summary: Register a new medication
 *     description: Add a new medication to the inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - weight
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aspirin
 *               code:
 *                 type: string
 *                 example: ASP-001
 *                 description: Unique medication code
 *               weight:
 *                 type: number
 *                 example: 0.5
 *                 description: Weight per unit in kg
 *               quantity:
 *                 type: integer
 *                 example: 100
 *                 description: Initial quantity in stock
 *               image:
 *                 type: string
 *                 nullable: true
 *                 description: Image URL of the medication
 *     responses:
 *       201:
 *         description: Medication registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       409:
 *         description: Medication code already exists
 *
 * /evtol/v1/medications:
 *   get:
 *     tags:
 *       - Medications
 *     summary: Get all medications (paginated)
 *     description: Retrieve all medications in inventory with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: List of medications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMedications'
 *
 * /evtol/v1/medications/getMed/{id}:
 *   get:
 *     tags:
 *       - Medications
 *     summary: Get a specific medication by ID
 *     description: Retrieve detailed information about a specific medication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medication ID
 *     responses:
 *       200:
 *         description: Medication found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       404:
 *         description: Medication not found
 */

import express from "express"
import { MedicationController } from "../controllers/medication.controller";
const medicationController = new MedicationController()
const medRoutes =  express.Router()

medRoutes.post("/register-med", medicationController.registerMedicine);
medRoutes.get("/", medicationController.getAllMedications);
medRoutes.get("/getMed/:id", medicationController.getMedicationById)

export default medRoutes