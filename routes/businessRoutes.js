import express from "express";
import businessControllers from "../controllers/businessController.js";

import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/api/business", businessControllers.getAll);
router.get("/api/business/:id", businessControllers.getById);
router.post("/api/business", upload.single("businessLogo"), businessControllers.create);
router.patch("/api/business/:id", upload.single("businessLogo"), businessControllers.update);
router.delete("/api/business/:id", businessControllers.destroy);

export default router;
