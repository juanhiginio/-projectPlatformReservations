import express from "express";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import typeUserRoutes from "./routes/typeUserRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

//rutas
app.use(userRoutes);
app.use(typeUserRoutes);
app.use(businessRoutes);
app.use(reservationRoutes);
app.use(serviceRoutes);


app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
