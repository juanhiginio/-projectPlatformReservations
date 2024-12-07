import mongoose from "mongoose";

const mongouri = process.env.DB_URI;

async function connectDB() {
    try {
        const connection = await mongoose.connect(
            mongouri
        );
        console.log("Se ha establecido conexión con la Base de Datos");
    } catch (err) {
        console.log(`Ups!, ha ocurrido un error -> ${err}`);
        process.exit(1);
    }
};

export default connectDB;