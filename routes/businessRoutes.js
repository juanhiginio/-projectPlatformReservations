import express from "express";
import businessControllers from "../controllers/businessController.js";


const router = express.Router();

router.get("/api/business", businessControllers.getAll);
router.get("/api/business/:id", businessControllers.getById);
router.post("/api/business", businessControllers.create);
router.patch("/api/business/:id", businessControllers.update);
router.delete("/api/business/:id", businessControllers.destroy);

export default router;
