import User from "../models/User.js";
import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/api/user", userController.getAll);
router.get("/api/user/:id", userController.getById);
router.post("/api/user", userController.create);
router.patch("/api/user/:id", userController.update);
router.delete("/api/user/:id", userController.destroy);

export default router;
