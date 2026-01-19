/**
 * @swagger
 * /evtol/v1/device/registerDevice:
 *   post:
 *     tags:
 *       - EVTOLs
 *     summary: Register a new drone (eVTOL)
 *     description: Register a new autonomous drone with specifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - battery
 *               - weightLimit
 *             properties:
 *               model:
 *                 type: string
 *                 enum: [LIGHTWEIGHT, MIDDLEWEIGHT, CRUISERWEIGHT, HEAVYWEIGHT]
 *                 description: Drone model type
 *               battery:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Initial battery percentage
 *               weightLimit:
 *                 type: number
 *                 description: Maximum payload weight in kg
 *               image:
 *                 type: string
 *                 nullable: true
 *                 description: Image URL of the drone
 *     responses:
 *       201:
 *         description: Drone registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EVTOL'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Serial number already exists
 *
 * /evtol/v1/device:
 *   get:
 *     tags:
 *       - EVTOLs
 *     summary: Get all drones (paginated)
 *     description: Retrieve all registered drones with pagination support
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
 *         description: List of drones retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEVTOLs'
 *
 * /evtol/v1/device/available:
 *   get:
 *     tags:
 *       - EVTOLs
 *     summary: Get available drones (paginated)
 *     description: Retrieve available drones (IDLE state with battery >= 25%) with pagination support
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
 *         description: List of available drones retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEVTOLs'
 *
 * /evtol/v1/device/loadDevice/{id}:
 *   post:
 *     tags:
 *       - EVTOLs
 *     summary: Load medications onto a drone
 *     description: Load medications onto a specific drone for delivery
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drone ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicationId
 *                     - quantity
 *                   properties:
 *                     medicationId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Medications loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 evtol:
 *                   $ref: '#/components/schemas/EVTOL'
 *                 loads:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Cannot load drone (weight limit exceeded, battery low, etc.)
 *       404:
 *         description: Drone or medication not found
 */

import express from "express"
import { EVTOLController } from "../controllers/evtol.controller"
const evtolController = new EVTOLController()
const evtolRoutes =  express.Router()

evtolRoutes.post("/registerDevice", evtolController.registereVTOL);
evtolRoutes.get("/", evtolController.getAllEvtols);
evtolRoutes.get("/available", evtolController.getAvailableEvtols);
evtolRoutes.post("/loadDevice/:id", evtolController.loadEVTOL)

export default evtolRoutes