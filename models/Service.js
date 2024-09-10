import { request } from "express";
import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del Servicio es requerido"],
    }, 
    schedule: {
        type: String, 
        required: [true, "El cronograma del Servicio es requerido"],
    },
    serviceTime: {
        type: String, // 5 horas
        required: [true, "El tiempo del Servicio es requerido"],
    },
    businessDays: {
        type: String, // Lunes - Viernes
        required: [true, "Los días del Servicio son requeridos"],
    },
    address: {
        type: String,
        required: [true, "La dirección donde se brinda el Servicio es requerida"],
    },
    price: {
        type: Number,
        required: [true, "El precio del Servicio es requerido"],
    }, 
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;