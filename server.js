import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import typeUserRoutes from "./routes/typeUserRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// Todo lo que haya en la carpeta public, 
app.use(express.static("public"));

if (process.env.NODE_ENV !== "test") {

  connectDB();

  const uploadDir = path.join(__dirname||"", 'public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
};

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});

}

//rutas
app.use(authRoutes);
app.use(userRoutes);
app.use(typeUserRoutes);
app.use(businessRoutes);
app.use(reservationRoutes);
app.use(serviceRoutes);

export default app;