import mongoose from "mongoose";

const businessSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del Negocio es requerido"],
    },
    address: {
      type: String,
      required: [true, "La dirección del Negocio es requerido"],
    },
    phone: {
      type: String,
      required: [true, "El Telefono del Negocio es requerido"],
    },
    email: {
      type: String,
      required: [true, "El email del Negocio es requerido"],
    },
    businessLogo: {
      type: String,
      required: [true, "El logo del Negocio es requerido"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    userBusiness: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

const business = mongoose.model("business", businessSchema);
export default business;
