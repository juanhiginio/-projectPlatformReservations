import express from "express";
import businessControllers from "../controllers/businessController.js";

import upload from "../config/multerConfig.js";

import { expressjwt } from "express-jwt";

const router = express.Router();

router.get("/api/business", businessControllers.getAll);
router.get("/api/business/:id", businessControllers.getById);
router.post("/api/business", expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }) ,
function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json("Para realizar esta acción debes estar registrado en el sistema");
    } else {
      next(err);
    }
  },
  upload.single("businessLogo"), businessControllers.create);
router.patch("/api/business/:id", expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }) ,
function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json("Para realizar esta acción debes estar registrado en el sistema");
    } else {
      next(err);
    }
  },
  upload.single("businessLogo"), businessControllers.update);
router.delete("/api/business/:id", expressjwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ["HS256"] }),
 function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json("Para realizar esta acción debes estar registrado en el sistema");
    } else {
      next(err);
    }
  }
  ,
  businessControllers.destroy);

export default router;
