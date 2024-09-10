import Service from "../models/Service.js";
import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/api/services", serviceController.getAll);
router.get("/api/services/:id", serviceController.getById);
router.post("/api/services", serviceController.create);
router.patch("/api/services/:id", serviceController.update);
router.delete("/api/services/:id", serviceController.destroy);

export default router;