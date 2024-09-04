
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
});

const User = mongoose.model("User", userSchema);
export default User;
