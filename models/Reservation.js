import mongoose from "mongoose";

const reservationSchema = mongoose.Schema({
    dateReservation: {
    type: Date,
    request: true,
  },
  timeReservation: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  priceTotal: {
    type: Number,
    default: null,
  }
}, {
  timestamps: true,
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
