import User from "../models/User.js";
import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/api/users", userController.getAll);
router.get("/api/users/:id", userController.getById);
router.post("/api/users", userController.create);
router.patch("/api/users/:id", userController.update);
router.delete("/api/users/:id", userController.destroy);

export default router;
