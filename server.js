import express from "express";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js"
import typeUserRoutes from "./routes/typeUserRoutes.js"

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

//rutas
app.use(userRoutes);
app.use(typeUserRoutes);


app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});