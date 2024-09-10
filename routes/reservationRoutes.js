import TypeUser from "../models/TypeUser.js";
import express from "express";
import reservationController from "../controllers/reservationController.js";

const router = express.Router();

router.get("/api/reservation", reservationController.getAll);
router.get("/api/reservation/:id", reservationController.getById);
router.post("/api/reservation", reservationController.create);
router.patch("/api/reservation/:id", reservationController.update);
router.delete("/api/reservation/:id", reservationController.destroy);

export default router;