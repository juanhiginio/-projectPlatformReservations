import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    request: true,
  },
  email: {
    type: String,
    request: true,
  },

  password: {
    type: String,
    request: true,
  },

  phone: {
    type: Number,
    request: true,
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
