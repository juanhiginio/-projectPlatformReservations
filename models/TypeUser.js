
import mongoose from "mongoose";

const typeUserSchema = mongoose.Schema({
  type: {
    type: String,
    request: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

const TypeUser = mongoose.model("TypeUser", typeUserSchema);
export default TypeUser;