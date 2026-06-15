import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  attendeeName: {
    type: String,
    required: true,
  },
  attendeeEmail: {
    type: String,
    required: true,
  },
  ticketsBooked: {
    type: Number,
    default: 1,
  },
  checkInStatus: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "confirmed",
  },
}, { timestamps: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;