import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true,
  },

  qrCode: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "used", "cancelled"],
    default: "active",
  },
}, {
  timestamps: true,
});

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;