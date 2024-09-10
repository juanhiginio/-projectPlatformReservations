import mongoose from "mongoose";

const businessSchema = mongoose.Schema(
  {
    name: {
      type: String,
      request: true,
    },
    address: {
      type: String,
      request: true,
    },
    phone: {
      type: String,
      request: true,
    },
    email: {
      type: String,
      request: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const business = mongoose.model("business", businessSchema);
export default business;
