import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del Usuario es requerido"],
  },
  email: {
    type: String,
    required: [true, "El email del Usuario es requerido"],
  },

  password: {
    type: String,
    required: [true, "La Contraseña del Usuario es requerida"],
  },

  phone: {
    type: Number,
    required: [true, "El telefono del Usuario es requerido"],
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {

  const passwordHash = await bcrypt.hash(this.password, 10);

  this.password = passwordHash;

  next();
  
});

const User = mongoose.model("User", userSchema);
export default User;
