import TypeUser from "../models/TypeUser.js";
import express from "express";
import { expressjwt } from "express-jwt";
import reservationController from "../controllers/reservationController.js";

const router = express.Router();

router.get("/api/reservation", reservationController.getAll);
router.get("/api/reservation/:id", reservationController.getById);
router.post("/api/reservation", expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }),
function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json("Para hacer una reservación debes estar registrado");
    } else {
      next(err);
    }
  },
   reservationController.create);
router.patch("/api/reservation/:id" , expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }), reservationController.update);
router.delete("/api/reservation/:id" , expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }), reservationController.destroy);

export default router;