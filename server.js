import express from "express";
import connectDB from "./config/database.js";

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});